import type { TwinProfile } from "./twin-types";

export type ChecklistItem = {
  id: string;
  label: string;
  hint: string;
  step: number;
  required: boolean;
  done: boolean;
};

/**
 * Single source of truth for "how complete is this twin?". Onboarding renders it
 * as a checklist with next steps; the score is a simple ratio of satisfied items.
 */
export function profileChecklist(profile: TwinProfile, skillCount = profile.skills.length): ChecklistItem[] {
  const exp = profile.experience;
  return [
    {
      id: "name",
      label: "Name and degree",
      hint: "Your twin introduces itself with these.",
      step: 0,
      required: true,
      done: profile.name.trim().length > 1 && profile.degree.trim().length > 1,
    },
    {
      id: "education",
      label: "Year and college",
      hint: "Used to calibrate timelines against your academic stage.",
      step: 0,
      required: false,
      done: profile.year.trim().length > 0 && profile.college.trim().length > 0,
    },
    {
      id: "skills",
      label: "At least 3 skills with levels",
      hint: "Skills drive gap analysis, roadmap and readiness.",
      step: 1,
      required: true,
      done: skillCount >= 3,
    },
    {
      id: "projects",
      label: "At least 1 project",
      hint: "Projects are the proof behind your skills.",
      step: 2,
      required: false,
      done: profile.projects.length > 0,
    },
    {
      id: "experience",
      label: "An internship, certification or achievement",
      hint: "Boosts your experience score and interview narrative.",
      step: 3,
      required: false,
      done: exp.internships.length + exp.certifications.length + exp.achievements.length > 0,
    },
    {
      id: "interests",
      label: "At least 2 interests",
      hint: "Shapes the project ideas your twin suggests.",
      step: 4,
      required: false,
      done: profile.interests.length >= 2,
    },
    {
      id: "goal",
      label: "Short-term goal",
      hint: "Anchors every recommendation to what you want next.",
      step: 5,
      required: true,
      done: profile.shortTermGoal.trim().length > 3,
    },
    {
      id: "longterm",
      label: "Long-term goal",
      hint: "Lets the simulator project further-out paths.",
      step: 5,
      required: false,
      done: profile.longTermGoal.trim().length > 3,
    },
  ];
}

export function completenessScore(items: ChecklistItem[]): number {
  if (!items.length) return 0;
  return Math.round((items.filter((i) => i.done).length / items.length) * 100);
}
