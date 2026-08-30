export type Level = "Beginner" | "Intermediate" | "Advanced";

export type Skill = {
  name: string;
  level: Level;
  percent: number;
};

export type Project = {
  id: string;
  title: string;
  description: string;
  tech: string;
  deployed: boolean;
};

export type Experience = {
  internships: string[];
  certifications: string[];
  achievements: string[];
};

export type TwinProfile = {
  name: string;
  degree: string;
  department: string;
  year: string;
  college: string;
  skills: Skill[];
  projects: Project[];
  experience: Experience;
  interests: string[];
  targetRole: string;
  timelineMonths: number;
  hoursPerDay: number;
  shortTermGoal: string;
  longTermGoal: string;
  createdAt: string;
  /** Snapshot of skill percentages when the twin was created — powers growth tracking. */
  baselineSkills: Record<string, number>;
  baselineReadiness: number;
  completedTasks: string[];
  completedDays: number[];
  memories: MemoryEntry[];
};

export type MemoryEntry = {
  id: string;
  text: string;
  tag: "skill" | "project" | "goal" | "behaviour" | "progress" | "conversation";
  at: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "twin";
  content: string;
  at: string;
  structured?: TwinAnswer;
};

/** A point-in-time snapshot of the profile so the user can revert changes. */
export type ProfileVersion = {
  id: string;
  at: string;
  label: string;
  profile: TwinProfile;
};

/** Portable backup written by export / read by import. */
export type TwinBackup = {
  app: "twinai";
  version: 1;
  exportedAt: string;
  profile: TwinProfile;
  chat?: ChatMessage[];
};

export type SaveState = "idle" | "saving" | "saved";

export type TwinAnswer = {
  recommendation: string;
  why: string;
  gap: string;
  action: string[];
  priority: "High" | "Medium" | "Low";
  source: "ai" | "engine";
};
