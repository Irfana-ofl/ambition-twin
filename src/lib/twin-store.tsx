import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { DEMO_PROFILE } from "./twin-demo";
import { computeScores } from "./twin-engine";
import { isProfileComplete, twinStorage } from "./twin-storage";
import type { ChatMessage, MemoryEntry, ProfileVersion, SaveState, TwinProfile } from "./twin-types";

type Store = {
  profile: TwinProfile;
  hydrated: boolean;
  isDemo: boolean;
  /** True once the user chose to explore with the demo twin. */
  demoAcknowledged: boolean;
  chat: ChatMessage[];
  /** Autosave lifecycle so the UI can show a "saved" indicator. */
  saveState: SaveState;
  lastSavedAt: string | null;
  versions: ProfileVersion[];
  setProfile: (p: TwinProfile, label?: string) => void;
  update: (patch: Partial<TwinProfile>, label?: string) => void;
  toggleTask: (id: string, label?: string) => void;
  toggleDay: (day: number, label?: string) => void;
  addMemory: (text: string, tag: MemoryEntry["tag"]) => void;
  setChat: (messages: ChatMessage[]) => void;
  acknowledgeDemo: () => void;
  resetToDemo: () => void;
  revertTo: (versionId: string) => void;
  clearVersions: () => void;
  importProfile: (profile: TwinProfile, chat?: ChatMessage[]) => void;
};

const TwinContext = createContext<Store | null>(null);

export function TwinProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<TwinProfile>(DEMO_PROFILE);
  const [chat, setChatState] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [demoAcknowledged, setDemoAcknowledged] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [versions, setVersions] = useState<ProfileVersion[]>([]);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  /** Profile snapshot taken before the current burst of edits — the revert target. */
  const pendingBefore = useRef<TwinProfile | null>(null);
  const pendingLabel = useRef<string>("Profile updated");

  useEffect(() => {
    const stored = twinStorage.loadProfile();
    if (isProfileComplete(stored)) {
      setProfileState(stored);
      setIsDemo(false);
    }
    setChatState(twinStorage.loadChat());
    setDemoAcknowledged(twinStorage.loadDemoAck());
    setVersions(twinStorage.loadVersions());
    setHydrated(true);
  }, []);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  /**
   * Every profile mutation goes through here. Updates are functional so two
   * calls in the same event handler (e.g. toggle a task + write a memory) can't
   * overwrite each other with a stale snapshot. The write itself is debounced
   * and drives the visible autosave indicator, and the pre-edit profile is
   * captured as a version so the change can be reverted.
   */
  const persist = (updater: (prev: TwinProfile) => TwinProfile, label = "Profile updated") => {
    if (!pendingBefore.current) pendingBefore.current = profile;
    pendingLabel.current = label;
    setIsDemo(false);
    setSaveState("saving");

    let next: TwinProfile = profile;
    setProfileState((prev) => {
      next = updater(prev);
      return next;
    });

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      twinStorage.saveProfile(next);
      const before = pendingBefore.current;
      pendingBefore.current = null;
      if (before && JSON.stringify(before) !== JSON.stringify(next)) {
        const version: ProfileVersion = {
          id: `v-${Date.now()}`,
          at: new Date().toISOString(),
          label: pendingLabel.current,
          profile: before,
        };
        setVersions((prev) => {
          const list = [...prev, version].slice(-12);
          twinStorage.saveVersions(list);
          return list;
        });
      }
      setLastSavedAt(new Date().toISOString());
      setSaveState("saved");
    }, 600);
  };

  const value = useMemo<Store>(
    () => ({
      profile,
      hydrated,
      isDemo,
      demoAcknowledged,
      chat,
      saveState,
      lastSavedAt,
      versions,
      setProfile: (p, label = "Twin rebuilt from onboarding") => persist(() => p, label),
      update: (patch, label = "Settings updated") => persist((prev) => ({ ...prev, ...patch }), label),
      toggleTask: (id, label = "Roadmap task toggled") =>
        persist(
          (prev) => ({
            ...prev,
            completedTasks: prev.completedTasks.includes(id)
              ? prev.completedTasks.filter((t) => t !== id)
              : [...prev.completedTasks, id],
          }),
          label,
        ),
      toggleDay: (day, label = "30-day plan updated") =>
        persist(
          (prev) => ({
            ...prev,
            completedDays: prev.completedDays.includes(day)
              ? prev.completedDays.filter((d) => d !== day)
              : [...prev.completedDays, day],
          }),
          label,
        ),
      addMemory: (text, tag) =>
        persist(
          (prev) => ({
            ...prev,
            memories: [
              ...prev.memories,
              { id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, tag, at: new Date().toISOString() },
            ].slice(-60),
          }),
          "Memory added",
        ),
      setChat: (messages) => {
        setChatState(messages);
        twinStorage.saveChat(messages);
      },
      acknowledgeDemo: () => {
        setDemoAcknowledged(true);
        twinStorage.saveDemoAck(true);
      },
      resetToDemo: () => {
        if (timer.current) clearTimeout(timer.current);
        pendingBefore.current = null;
        twinStorage.clearProfile();
        twinStorage.clearChat();
        setChatState([]);
        setProfileState(DEMO_PROFILE);
        setIsDemo(true);
        setSaveState("idle");
        setDemoAcknowledged(true);
        twinStorage.saveDemoAck(true);
      },
      revertTo: (versionId) => {
        const target = versions.find((v) => v.id === versionId);
        if (!target) return;
        if (timer.current) clearTimeout(timer.current);
        pendingBefore.current = null;
        setProfileState(target.profile);
        setIsDemo(false);
        twinStorage.saveProfile(target.profile);
        setVersions((prev) => {
          const list = prev.filter((v) => v.id !== versionId);
          twinStorage.saveVersions(list);
          return list;
        });
        setLastSavedAt(new Date().toISOString());
        setSaveState("saved");
      },
      clearVersions: () => {
        twinStorage.clearVersions();
        setVersions([]);
      },
      importProfile: (imported, importedChat) => {
        if (timer.current) clearTimeout(timer.current);
        pendingBefore.current = null;
        setProfileState(imported);
        setIsDemo(false);
        twinStorage.saveProfile(imported);
        if (importedChat) {
          setChatState(importedChat);
          twinStorage.saveChat(importedChat);
        }
        setLastSavedAt(new Date().toISOString());
        setSaveState("saved");
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, chat, hydrated, isDemo, demoAcknowledged, saveState, lastSavedAt, versions],
  );

  return <TwinContext.Provider value={value}>{children}</TwinContext.Provider>;
}

export function useTwin() {
  const ctx = useContext(TwinContext);
  if (!ctx) throw new Error("useTwin must be used inside TwinProvider");
  return ctx;
}

export function useScores() {
  const { profile } = useTwin();
  return useMemo(() => computeScores(profile), [profile]);
}

export function emptyProfile(): TwinProfile {
  return {
    name: "",
    degree: "",
    department: "",
    year: "",
    college: "",
    skills: [],
    projects: [],
    experience: { internships: [], certifications: [], achievements: [] },
    interests: [],
    targetRole: "AI Engineer",
    timelineMonths: 6,
    hoursPerDay: 2,
    shortTermGoal: "",
    longTermGoal: "",
    createdAt: new Date().toISOString(),
    baselineSkills: {},
    baselineReadiness: 0,
    completedTasks: [],
    completedDays: [],
    memories: [],
  };
}
