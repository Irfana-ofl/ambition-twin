import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { DEMO_PROFILE } from "./twin-demo";
import { computeScores } from "./twin-engine";
import type { ChatMessage, MemoryEntry, TwinProfile } from "./twin-types";

const PROFILE_KEY = "twinai.profile.v1";
const CHAT_KEY = "twinai.chat.v1";

type Store = {
  profile: TwinProfile;
  hydrated: boolean;
  isDemo: boolean;
  chat: ChatMessage[];
  setProfile: (p: TwinProfile) => void;
  update: (patch: Partial<TwinProfile>) => void;
  toggleTask: (id: string) => void;
  toggleDay: (day: number) => void;
  addMemory: (text: string, tag: MemoryEntry["tag"]) => void;
  setChat: (messages: ChatMessage[]) => void;
  resetToDemo: () => void;
};

const TwinContext = createContext<Store | null>(null);

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function TwinProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<TwinProfile>(DEMO_PROFILE);
  const [chat, setChatState] = useState<ChatMessage[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isDemo, setIsDemo] = useState(true);

  useEffect(() => {
    const stored = read<TwinProfile | null>(PROFILE_KEY, null);
    if (stored && stored.name) {
      setProfileState(stored);
      setIsDemo(false);
    }
    setChatState(read<ChatMessage[]>(CHAT_KEY, []));
    setHydrated(true);
  }, []);

  const persist = (p: TwinProfile, demo = false) => {
    setProfileState(p);
    setIsDemo(demo);
    if (!demo) {
      try {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(p));
      } catch {
        /* storage unavailable */
      }
    }
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
