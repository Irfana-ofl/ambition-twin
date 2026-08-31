import type { ChatMessage, ProfileVersion, TwinProfile, TwinBackup } from "./twin-types";

/**
 * Small storage layer for the twin. Keeps every key + JSON (de)serialisation in
 * one place so the store and route guards agree on what "persisted" means.
 */
const KEYS = {
  profile: "twinai.profile.v1",
  chat: "twinai.chat.v1",
  demoAck: "twinai.demo-ack.v1",
  versions: "twinai.versions.v1",
  draft: "twinai.onboarding-draft.v1",
  aiRoadmap: "twinai.ai-roadmap.v1",
} as const;

function available() {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read<T>(key: string, fallback: T): T {
  if (!available()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (!available()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable / quota exceeded */
  }
}

function remove(key: string) {
  if (!available()) return;
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
}

/** A twin is only "complete" once onboarding produced a name and some skills. */
export function isProfileComplete(profile: TwinProfile | null): profile is TwinProfile {
  return !!profile && profile.name.trim().length > 0 && profile.skills.length > 0 && !!profile.targetRole;
}

const MAX_VERSIONS = 12;

export const twinStorage = {
  loadProfile: () => read<TwinProfile | null>(KEYS.profile, null),
  saveProfile: (profile: TwinProfile) => write(KEYS.profile, profile),
  clearProfile: () => remove(KEYS.profile),

  loadChat: () => read<ChatMessage[]>(KEYS.chat, []),
  saveChat: (chat: ChatMessage[]) => write(KEYS.chat, chat.slice(-40)),
  clearChat: () => remove(KEYS.chat),

  loadDemoAck: () => read<boolean>(KEYS.demoAck, false),
  saveDemoAck: (value: boolean) => write(KEYS.demoAck, value),

  loadDraft: <T,>() => read<T | null>(KEYS.draft, null),
  saveDraft: (draft: unknown) => write(KEYS.draft, draft),
  clearDraft: () => remove(KEYS.draft),

  loadAiRoadmap: <T,>() => read<T | null>(KEYS.aiRoadmap, null),
  saveAiRoadmap: (value: unknown) => write(KEYS.aiRoadmap, value),
  clearAiRoadmap: () => remove(KEYS.aiRoadmap),

  loadVersions: () => read<ProfileVersion[]>(KEYS.versions, []),
  saveVersions: (versions: ProfileVersion[]) => write(KEYS.versions, versions.slice(-MAX_VERSIONS)),
  clearVersions: () => remove(KEYS.versions),
};

/** Builds the portable backup object used by export. */
export function buildBackup(profile: TwinProfile, chat: ChatMessage[]): TwinBackup {
  return { app: "twinai", version: 1, exportedAt: new Date().toISOString(), profile, chat };
}

/** Validates an imported file just enough to trust it as a twin profile. */
export function parseBackup(raw: string): TwinBackup | null {
  try {
    const data = JSON.parse(raw) as Partial<TwinBackup> & { name?: string };
    const profile = (data.profile ?? (data as unknown as TwinProfile)) as TwinProfile | undefined;
    if (!profile || typeof profile.name !== "string" || !Array.isArray(profile.skills)) return null;
    return {
      app: "twinai",
      version: 1,
      exportedAt: data.exportedAt ?? new Date().toISOString(),
      profile,
      ...(Array.isArray(data.chat) ? { chat: data.chat } : {}),
    };
  } catch {
    return null;
  }
}
