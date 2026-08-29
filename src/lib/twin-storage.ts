import type { ChatMessage, ProfileVersion, TwinProfile, TwinBackup } from "./twin-types";

/**
 * Small storage layer for the twin. Keeps every key + JSON (de)serialisation in
 * one place so the store and route guards agree on what "persisted" means.
 */
const KEYS = {
  profile: "twinai.profile.v1",
  chat: "twinai.chat.v1",
  demoAck: "twinai.demo-ack.v1",
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

export const twinStorage = {
  loadProfile: () => read<TwinProfile | null>(KEYS.profile, null),
  saveProfile: (profile: TwinProfile) => write(KEYS.profile, profile),
  clearProfile: () => remove(KEYS.profile),

  loadChat: () => read<ChatMessage[]>(KEYS.chat, []),
  saveChat: (chat: ChatMessage[]) => write(KEYS.chat, chat.slice(-40)),
  clearChat: () => remove(KEYS.chat),

  loadDemoAck: () => read<boolean>(KEYS.demoAck, false),
  saveDemoAck: (value: boolean) => write(KEYS.demoAck, value),
};
