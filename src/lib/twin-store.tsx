import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEMO_PROFILE } from "./twin-demo";
import { computeScores } from "./twin-engine";
import { isProfileComplete, twinStorage } from "./twin-storage";
import type { ChatMessage, MemoryEntry, TwinProfile } from "./twin-types";

type Store = {
  profile: TwinProfile;
  hydrated: boolean;
  isDemo: boolean;
  /** True once the user chose to explore with the demo twin. */
  demoAcknowledged: boolean;
  chat: ChatMessage[];
  setProfile: (p: TwinProfile) => void;
  update: (patch: Partial<TwinProfile>) => void;
  toggleTask: (id: string) => void;
  toggleDay: (day: number) => void;
  addMemory: (text: string, tag: MemoryEntry["tag"]) => void;
  setChat: (messages: ChatMessage[]) => void;
  acknowledgeDemo: () => void;
  resetToDemo: () => void;
};

const TwinContext = createContext<Store | null>(null);

export function TwinProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<TwinProfile>(DEMO_PROFILE);
  const [chat, setChatState] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDemo, setIsDemo] = useState(true);
  const [demoAcknowledged, setDemoAcknowledged] = useState(false);

  useEffect(() => {
    const stored = twinStorage.loadProfile();
    if (isProfileComplete(stored)) {
      setProfileState(stored);
      setIsDemo(false);
    }
    setChatState(twinStorage.loadChat());
    setDemoAcknowledged(twinStorage.loadDemoAck());
    setHydrated(true);
  }, []);

  const persist = (p: TwinProfile, demo = false) => {
    setProfileState(p);
    setIsDemo(demo);
    if (!demo) twinStorage.saveProfile(p);
  };


  const value = useMemo<Store>(
    () => ({
      profile,
      hydrated,
      isDemo,
      chat,
      setProfile: (p) => persist(p, false),
      update: (patch) => persist({ ...profile, ...patch }, false),
      toggleTask: (id) => {
        const done = profile.completedTasks.includes(id);
        persist(
          {
            ...profile,
            completedTasks: done ? profile.completedTasks.filter((t) => t !== id) : [...profile.completedTasks, id],
          },
          false,
        );
      },
      toggleDay: (day) => {
        const done = profile.completedDays.includes(day);
        persist(
          {
            ...profile,
            completedDays: done ? profile.completedDays.filter((d) => d !== day) : [...profile.completedDays, day],
          },
          false,
        );
      },
      addMemory: (text, tag) =>
        persist(
          {
            ...profile,
            memories: [
              ...profile.memories,
              { id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, text, tag, at: new Date().toISOString() },
            ].slice(-60),
          },
          false,
        ),
      setChat: (messages) => {
        setChatState(messages);
        try {
          localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-40)));
        } catch {
          /* storage unavailable */
        }
      },
      resetToDemo: () => {
        try {
          localStorage.removeItem(PROFILE_KEY);
          localStorage.removeItem(CHAT_KEY);
        } catch {
          /* storage unavailable */
        }
        setChatState([]);
        setProfileState(DEMO_PROFILE);
        setIsDemo(true);
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [profile, chat, hydrated, isDemo],
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
