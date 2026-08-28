import type { Level, MemoryEntry, Skill, TwinProfile } from "./twin-types";

export const LEVELS: Level[] = ["Beginner", "Intermediate", "Advanced"];

export const levelPercent: Record<Level, number> = {
  Beginner: 30,
  Intermediate: 60,
  Advanced: 85,
};

export function percentToLevel(percent: number): Level {
  if (percent >= 75) return "Advanced";
  if (percent >= 50) return "Intermediate";
  return "Beginner";
}

export type RoleSkill = {
  name: string;
  required: number;
  weight: number;
  time: string;
  action: string;
};

export type RoleSpec = {
  role: string;
  blurb: string;
  skills: RoleSkill[];
  signatureProjects: string[];
  keywords: string[];
};

export const ROLES: RoleSpec[] = [
  {
    role: "AI Engineer",
    blurb: "Builds and ships intelligent systems end to end — models, APIs and deployment.",
    skills: [
      { name: "Python", required: 85, weight: 3, time: "2 weeks", action: "Solve 30 Python data-structure problems" },
      { name: "Machine Learning", required: 80, weight: 3, time: "3 weeks", action: "Re-implement 3 classic ML algorithms from scratch" },
      { name: "Deep Learning", required: 80, weight: 3, time: "4 weeks", action: "Train a CNN and a transformer on real datasets" },
      { name: "PyTorch", required: 70, weight: 2, time: "2 weeks", action: "Rewrite one Keras project in PyTorch" },
      { name: "Model Deployment", required: 65, weight: 2, time: "2 weeks", action: "Serve a model with FastAPI + Docker" },
      { name: "MLOps", required: 55, weight: 1, time: "2 weeks", action: "Add experiment tracking and CI to one project" },
      { name: "SQL", required: 60, weight: 1, time: "1 week", action: "Practice window functions and joins" },
      { name: "Git", required: 65, weight: 1, time: "3 days", action: "Adopt branch + PR workflow on your repos" },
    ],
    signatureProjects: [
      "CNN-based computer vision app with a deployed inference API",
      "Retrieval-augmented assistant over your own documents",
    ],
    keywords: ["ai", "ml", "deep learning", "cnn", "model", "neural", "llm", "nlp"],
  },
  {
    role: "ML Engineer",
    blurb: "Turns models into reliable production pipelines and services.",
    skills: [
      { name: "Python", required: 85, weight: 3, time: "2 weeks", action: "Write clean, typed, tested Python modules" },
      { name: "Machine Learning", required: 85, weight: 3, time: "3 weeks", action: "Master feature engineering and evaluation" },
      { name: "MLOps", required: 75, weight: 3, time: "3 weeks", action: "Build a train → track → deploy pipeline" },
      { name: "Model Deployment", required: 75, weight: 2, time: "2 weeks", action: "Ship a model behind a REST endpoint" },
      { name: "Deep Learning", required: 65, weight: 2, time: "3 weeks", action: "Fine-tune one pretrained model" },
      { name: "SQL", required: 70, weight: 2, time: "1 week", action: "Build an analytical query set on a real dataset" },
      { name: "Docker", required: 65, weight: 2, time: "1 week", action: "Containerise one existing project" },
      { name: "Git", required: 70, weight: 1, time: "3 days", action: "Automate tests with GitHub Actions" },
    ],
    signatureProjects: ["End-to-end ML pipeline with monitoring", "Batch + realtime scoring service"],
    keywords: ["pipeline", "ml", "deploy", "mlops", "docker"],
  },
  {
    role: "Data Scientist",
    blurb: "Answers business questions with statistics, experimentation and modelling.",
    skills: [
      { name: "Python", required: 80, weight: 3, time: "2 weeks", action: "Master pandas + numpy idioms" },
      { name: "Statistics", required: 80, weight: 3, time: "3 weeks", action: "Study inference, distributions, hypothesis testing" },
      { name: "Machine Learning", required: 75, weight: 3, time: "3 weeks", action: "Run a full modelling case study with validation" },
      { name: "SQL", required: 80, weight: 3, time: "2 weeks", action: "Practice CTEs, window functions, cohort queries" },
      { name: "Experimentation", required: 65, weight: 2, time: "2 weeks", action: "Design and analyse an A/B test" },
      { name: "Power BI", required: 60, weight: 1, time: "1 week", action: "Build an executive dashboard" },
      { name: "Deep Learning", required: 45, weight: 1, time: "2 weeks", action: "Understand when deep models beat classical ones" },
    ],
    signatureProjects: ["Business case study with measurable impact", "Forecasting model with confidence intervals"],
    keywords: ["data", "analysis", "predictor", "forecast", "statistics"],
  },
  {
    role: "Data Analyst",
    blurb: "Transforms raw data into decisions through queries, dashboards and stories.",
    skills: [
      { name: "SQL", required: 85, weight: 3, time: "2 weeks", action: "Solve 50 SQL interview questions" },
      { name: "Power BI", required: 75, weight: 3, time: "2 weeks", action: "Build 3 dashboards with DAX measures" },
      { name: "Excel", required: 70, weight: 2, time: "1 week", action: "Master pivot tables and lookups" },
      { name: "Python", required: 65, weight: 2, time: "2 weeks", action: "Automate a reporting workflow with pandas" },
      { name: "Statistics", required: 60, weight: 2, time: "2 weeks", action: "Learn descriptive stats and significance" },
      { name: "Storytelling", required: 60, weight: 1, time: "1 week", action: "Present one insight deck to peers" },
    ],
    signatureProjects: ["KPI dashboard on a public dataset", "Cohort retention analysis"],
    keywords: ["dashboard", "report", "analysis", "sql", "bi"],
  },
  {
    role: "Full Stack Developer",
    blurb: "Builds complete products — interfaces, APIs and data layers.",
    skills: [
      { name: "JavaScript", required: 85, weight: 3, time: "2 weeks", action: "Master async, modules and the DOM" },
      { name: "React", required: 80, weight: 3, time: "3 weeks", action: "Build a stateful app with routing and forms" },
      { name: "Node.js", required: 75, weight: 3, time: "2 weeks", action: "Write a REST API with auth" },
      { name: "SQL", required: 70, weight: 2, time: "2 weeks", action: "Model relational schemas and indexes" },
      { name: "HTML/CSS", required: 75, weight: 2, time: "1 week", action: "Rebuild a premium landing page pixel-perfect" },
      { name: "API Integration", required: 70, weight: 2, time: "1 week", action: "Integrate a third-party API with error handling" },
      { name: "Git", required: 70, weight: 1, time: "3 days", action: "Ship via pull requests" },
    ],
    signatureProjects: ["Full-stack product with auth and payments", "Realtime collaborative app"],
    keywords: ["web", "app", "frontend", "api", "portal"],
  },
  {
    role: "Computer Vision Engineer",
    blurb: "Teaches machines to see — detection, segmentation and visual pipelines.",
    skills: [
      { name: "Python", required: 85, weight: 3, time: "2 weeks", action: "Sharpen numpy array manipulation" },
      { name: "Deep Learning", required: 85, weight: 3, time: "4 weeks", action: "Train CNNs from scratch and fine-tune ResNets" },
      { name: "OpenCV", required: 75, weight: 3, time: "2 weeks", action: "Build a classical vision preprocessing pipeline" },
      { name: "PyTorch", required: 75, weight: 2, time: "2 weeks", action: "Write custom datasets and training loops" },
      { name: "Model Deployment", required: 60, weight: 2, time: "2 weeks", action: "Run inference on video in realtime" },
      { name: "Machine Learning", required: 70, weight: 2, time: "2 weeks", action: "Master evaluation metrics for vision tasks" },
    ],
    signatureProjects: ["Realtime object detection app", "Medical image classifier with explainability"],
    keywords: ["vision", "image", "cnn", "detection", "opencv"],
  },
  {
    role: "NLP Engineer",
    blurb: "Builds systems that understand and generate language.",
    skills: [
      { name: "Python", required: 85, weight: 3, time: "2 weeks", action: "Practice text processing pipelines" },
      { name: "Deep Learning", required: 80, weight: 3, time: "4 weeks", action: "Study transformers and attention deeply" },
      { name: "NLP", required: 80, weight: 3, time: "3 weeks", action: "Fine-tune a transformer for classification" },
      { name: "PyTorch", required: 70, weight: 2, time: "2 weeks", action: "Implement a tokenizer + training loop" },
      { name: "Model Deployment", required: 60, weight: 2, time: "2 weeks", action: "Serve an LLM feature behind an API" },
      { name: "SQL", required: 55, weight: 1, time: "1 week", action: "Query text datasets efficiently" },
    ],
    signatureProjects: ["RAG assistant with evaluation harness", "Multilingual sentiment engine"],
    keywords: ["nlp", "text", "language", "chat", "llm"],
  },
];

export function getRole(role: string): RoleSpec {
  return ROLES.find((r) => r.role.toLowerCase() === role.toLowerCase()) ?? ROLES[0]!;
}

export function skillPercent(profile: TwinProfile, name: string): number {
  const found = profile.skills.find((s) => s.name.toLowerCase() === name.toLowerCase());
  return found ? found.percent : 0;
}

export type Gap = {
  name: string;
  current: number;
  required: number;
  deficit: number;
  importance: "Critical" | "High" | "Medium";
  time: string;
  action: string;
};

export function computeGaps(profile: TwinProfile, roleName = profile.targetRole): Gap[] {
  const spec = getRole(roleName);
  return spec.skills
    .map((rs) => {
      const current = skillPercent(profile, rs.name);
      const deficit = Math.max(0, rs.required - current);
      return {
        name: rs.name,
        current,
        required: rs.required,
        deficit,
        importance: rs.weight >= 3 ? ("Critical" as const) : rs.weight === 2 ? ("High" as const) : ("Medium" as const),
        time: rs.time,
        action: rs.action,
      };
    })
    .sort((a, b) => b.deficit * (b.importance === "Critical" ? 3 : b.importance === "High" ? 2 : 1) - a.deficit * (a.importance === "Critical" ? 3 : a.importance === "High" ? 2 : 1));
}

export function roleReadiness(profile: TwinProfile, roleName: string): number {
  const spec = getRole(roleName);
  let got = 0;
  let total = 0;
  for (const rs of spec.skills) {
    const current = Math.min(skillPercent(profile, rs.name), rs.required);
    got += (current / rs.required) * rs.weight;
    total += rs.weight;
  }
  const skillPart = total ? (got / total) * 100 : 0;
  const projectPart = projectStrength(profile, roleName);
  const experiencePart = experienceStrength(profile);
  return clamp(Math.round(skillPart * 0.62 + projectPart * 0.23 + experiencePart * 0.15));
}

export function projectStrength(profile: TwinProfile, roleName = profile.targetRole): number {
  const spec = getRole(roleName);
  const projects = profile.projects;
  if (!projects.length) return 0;
  let score = Math.min(projects.length, 4) * 14;
  for (const p of projects) {
    const text = `${p.title} ${p.description} ${p.tech}`.toLowerCase();
    if (spec.keywords.some((k) => text.includes(k))) score += 7;
    if (p.deployed) score += 8;
  }
  return clamp(Math.round(score));
}

export function experienceStrength(profile: TwinProfile): number {
  const { internships, certifications, achievements } = profile.experience;
  return clamp(internships.length * 26 + certifications.length * 14 + achievements.length * 10);
}

export function skillStrength(profile: TwinProfile): number {
  if (!profile.skills.length) return 0;
  const avg = profile.skills.reduce((a, s) => a + s.percent, 0) / profile.skills.length;
  const breadth = Math.min(profile.skills.length / 8, 1) * 100;
  return clamp(Math.round(avg * 0.75 + breadth * 0.25));
}

export function goalClarity(profile: TwinProfile): number {
  let score = 0;
  if (profile.targetRole) score += 34;
  if (profile.timelineMonths) score += 16;
  if (profile.hoursPerDay) score += 14;
  if (profile.shortTermGoal.trim()) score += 18;
  if (profile.longTermGoal.trim()) score += 18;
  return clamp(score);
}

export function consistency(profile: TwinProfile): number {
  const done = profile.completedTasks.length + profile.completedDays.length;
  return clamp(Math.round(Math.min(done / 18, 1) * 100));
}

export type Scores = {
  readiness: number;
  skills: number;
  projects: number;
  goals: number;
  experience: number;
  consistency: number;
};

export function computeScores(profile: TwinProfile): Scores {
  const readinessBase = roleReadiness(profile, profile.targetRole);
  const cons = consistency(profile);
  return {
    readiness: clamp(Math.round(readinessBase * 0.88 + cons * 0.12)),
    skills: skillStrength(profile),
    projects: projectStrength(profile),
    goals: goalClarity(profile),
    experience: experienceStrength(profile),
    consistency: cons,
  };
}

export function readinessLabel(score: number): string {
  if (score >= 85) return "Interview Ready";
  if (score >= 70) return "Almost Ready";
  if (score >= 55) return "Building Momentum";
  if (score >= 40) return "Foundations Forming";
  return "Early Stage";
}

export type RoadmapTask = {
  id: string;
  label: string;
  skill: string;
  outcome: string;
};

export type Phase = {
  id: string;
  title: string;
  subtitle: string;
  weeks: string;
  tasks: RoadmapTask[];
};

export function buildRoadmap(profile: TwinProfile): Phase[] {
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile);
  const critical = gaps.filter((g) => g.deficit > 0);
  const pick = (i: number) => critical[i % Math.max(critical.length, 1)];
  const g0 = pick(0);
  const g1 = pick(1);
  const g2 = pick(2);
  const strongest = [...profile.skills].sort((a, b) => b.percent - a.percent)[0];

  const phases: Phase[] = [
    {
      id: "p1",
      title: "Strengthen Foundations",
      subtitle: `Lock in the fundamentals that everything else for ${spec.role} depends on.`,
      weeks: "Week 1 – 2",
      tasks: [
        { id: "p1t1", label: g0 ? g0.action : "Revise core programming fundamentals", skill: g0?.name ?? "Core", outcome: `${g0?.name ?? "Core"} moves toward ${g0?.required ?? 80}%` },
        { id: "p1t2", label: `Rebuild one ${strongest?.name ?? "existing"} exercise set to a professional standard`, skill: strongest?.name ?? "Core", outcome: "Clean, reviewable code you can show" },
        { id: "p1t3", label: "Publish a structured GitHub profile with pinned repositories", skill: "Git", outcome: "Recruiter-ready public presence" },
      ],
    },
    {
      id: "p2",
      title: `Master ${g0?.name ?? spec.skills[2]!.name}`,
      subtitle: "Close your single largest career-relevant gap with focused depth.",
      weeks: "Week 3 – 5",
      tasks: [
        { id: "p2t1", label: `Complete a structured ${g0?.name ?? spec.skills[2]!.name} course with notes`, skill: g0?.name ?? spec.skills[2]!.name, outcome: "Concept fluency, not tutorial memory" },
        { id: "p2t2", label: g1 ? g1.action : "Deepen the second most relevant skill", skill: g1?.name ?? spec.skills[3]!.name, outcome: `${g1?.name ?? "Skill"} reaches ${g1?.required ?? 70}%` },
        { id: "p2t3", label: "Write one technical explainer post about what you learned", skill: "Communication", outcome: "Proof of understanding" },
      ],
    },
    {
      id: "p3",
      title: "Build Real Projects",
      subtitle: "Convert knowledge into artefacts that survive interview questions.",
      weeks: "Week 6 – 8",
      tasks: [
        { id: "p3t1", label: `Build: ${spec.signatureProjects[0]!}`, skill: g0?.name ?? spec.role, outcome: "Flagship portfolio project" },
        { id: "p3t2", label: `Build: ${spec.signatureProjects[1] ?? spec.signatureProjects[0]!}`, skill: g1?.name ?? spec.role, outcome: "Second differentiated project" },
        { id: "p3t3", label: "Document each project with problem, approach, metrics and trade-offs", skill: "Storytelling", outcome: "Interview-ready narrative" },
      ],
    },
    {
      id: "p4",
      title: "Deployment & Engineering Rigor",
      subtitle: "Ship it. Deployed work is what separates you from other students.",
      weeks: "Week 9 – 10",
      tasks: [
        { id: "p4t1", label: g2 ? g2.action : "Deploy your flagship project publicly", skill: g2?.name ?? "Deployment", outcome: "Live URL in your resume" },
        { id: "p4t2", label: "Add tests, logging and a README with architecture diagram", skill: "Engineering", outcome: "Production instincts visible" },
        { id: "p4t3", label: "Collect feedback from 3 seniors and iterate once", skill: "Feedback loop", outcome: "Validated improvement" },
      ],
    },
    {
      id: "p5",
      title: "Career Preparation",
      subtitle: `Position yourself credibly as an entry-level ${spec.role}.`,
      weeks: "Week 11 – 12",
      tasks: [
        { id: "p5t1", label: `Rewrite your resume around ${spec.role} outcomes and metrics`, skill: "Positioning", outcome: "Targeted one-pager" },
        { id: "p5t2", label: "Run 5 mock interviews covering fundamentals + project deep dives", skill: "Interviewing", outcome: "Fluency under pressure" },
        { id: "p5t3", label: "Apply to 15 roles and 10 referrals with tailored notes", skill: "Outreach", outcome: "Live pipeline" },
      ],
    },
  ];
  return phases;
}

export type PlanDay = {
  day: number;
  focus: string;
  task: string;
  type: "Learn" | "Practice" | "Build" | "Review";
  minutes: number;
};

export function build30DayPlan(profile: TwinProfile): PlanDay[] {
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile).filter((g) => g.deficit > 0);
  const focusPool = (gaps.length ? gaps : computeGaps(profile)).slice(0, 4).map((g) => g.name);
  const minutes = Math.max(30, Math.round(profile.hoursPerDay * 60));
  const days: PlanDay[] = [];
  for (let d = 1; d <= 30; d++) {
    const focus = focusPool[Math.floor((d - 1) / 8) % focusPool.length] ?? spec.skills[0]!.name;
    const cycle = (d - 1) % 4;
    let type: PlanDay["type"] = "Learn";
    let task = "";
    if (d === 30) {
      type = "Review";
      task = `Career evaluation: recompute readiness for ${spec.role}, update your resume and pick the next 30-day mission.`;
    } else if (d % 7 === 0) {
      type = "Review";
      task = `Weekly review — re-test yourself on ${focus}, update your twin's progress and fix the weakest concept.`;
    } else if (cycle === 0) {
      type = "Learn";
      task = `Study ${focus} theory: ${d < 15 ? "core concepts and vocabulary" : "advanced patterns and failure modes"}.`;
    } else if (cycle === 1) {
      type = "Practice";
      task = `Hands-on ${focus} exercises — small, timed, no tutorials open.`;
    } else if (cycle === 2) {
      type = "Build";
      task = `Add one ${focus} feature to your project: ${spec.signatureProjects[d % spec.signatureProjects.length]}.`;
    } else {
      type = "Practice";
      task = `Explain today's ${focus} concept out loud in 3 minutes, then answer 5 interview questions on it.`;
    }
    days.push({ day: d, focus, task, type, minutes });
  }
  return days;
}

export type SimPath = {
  role: string;
  blurb: string;
  readiness: number;
  improvements: string[];
  timeline: { at: string; state: string }[];
};

export function simulatePaths(profile: TwinProfile): SimPath[] {
  const primary = getRole(profile.targetRole);
  const others = ROLES.filter((r) => r.role !== primary.role)
    .map((r) => ({ r, score: roleReadiness(profile, r.role) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((x) => x.r);
  return [primary, ...others].map((spec) => {
    const readiness = roleReadiness(profile, spec.role);
    const improvements = computeGaps(profile, spec.role)
      .filter((g) => g.deficit > 0)
      .slice(0, 4)
      .map((g) => g.name);
    return {
      role: spec.role,
      blurb: spec.blurb,
      readiness,
      improvements,
      timeline: [
        { at: "Now", state: `${readiness}% ready — ${readinessLabel(readiness)}. Strongest asset: ${strongestSkill(profile)}.` },
        { at: "3 months", state: `${improvements[0] ?? "Core skills"} at working level, one ${spec.role} project shipped.` },
        { at: "6 months", state: `${improvements.slice(0, 2).join(" + ") || "Advanced skills"} closed, deployed portfolio, internship-competitive.` },
        { at: "1 year", state: `Credible entry-level ${spec.role} profile with 3 defensible projects and interview fluency.` },
      ],
    };
  });
}

export function strongestSkill(profile: TwinProfile): string {
  const s = [...profile.skills].sort((a, b) => b.percent - a.percent)[0];
  return s ? `${s.name} (${s.percent}%)` : "your curiosity";
}

export type Action = {
  id: string;
  tag: "High Priority" | "Recommended" | "Career Boost" | "Skill Upgrade";
  title: string;
  why: string;
  time: string;
  impact: string;
};

export function nextBestActions(profile: TwinProfile): Action[] {
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile).filter((g) => g.deficit > 0);
  const g0 = gaps[0];
  const g1 = gaps[1];
  const g2 = gaps[2];
  const undeployed = profile.projects.find((p) => !p.deployed);
  const actions: Action[] = [];
  if (g0)
    actions.push({
      id: "a1",
      tag: "High Priority",
      title: `Close your ${g0.name} gap (${g0.current}% → ${g0.required}%)`,
      why: `${g0.name} is a ${g0.importance.toLowerCase()}-weight requirement for ${spec.role} and is currently your largest deficit.`,
      time: g0.time,
      impact: `+${Math.min(12, Math.round(g0.deficit / 4))} career readiness`,
    });
  actions.push({
    id: "a2",
    tag: "Recommended",
    title: `Build: ${spec.signatureProjects[0]!}`,
    why: `You have ${profile.projects.length} project${profile.projects.length === 1 ? "" : "s"}; this one directly demonstrates ${g0?.name ?? spec.skills[0]!.name} to a ${spec.role} interviewer.`,
    time: "2 weeks",
    impact: "+8 project strength",
  });
  actions.push({
    id: "a3",
    tag: "Career Boost",
    title: undeployed ? `Deploy "${undeployed.title}" publicly` : "Add metrics and a live demo to your flagship project",
    why: "Deployed, measurable work is the fastest credibility signal for a student profile.",
    time: "3 days",
    impact: "+6 readiness",
  });
  if (g1 || g2)
    actions.push({
      id: "a4",
      tag: "Skill Upgrade",
      title: (g1 ?? g2)!.action,
      why: `Second-order gap for ${spec.role}; unlocks the work you'll do in phase 3 of your roadmap.`,
      time: (g1 ?? g2)!.time,
      impact: "+5 skill strength",
    });
  return actions;
}

export function deriveMemories(profile: TwinProfile): MemoryEntry[] {
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile).filter((g) => g.deficit > 0);
  const derived: MemoryEntry[] = [];
  const push = (text: string, tag: MemoryEntry["tag"]) =>
    derived.push({ id: `d-${tag}-${derived.length}`, text, tag, at: profile.createdAt });

  for (const s of profile.skills) {
    const base = profile.baselineSkills[s.name];
    if (base != null && s.percent > base) {
      push(
        `Your ${s.name} skill improved from ${percentToLevel(base)} (${base}%) → ${percentToLevel(s.percent)} (${s.percent}%).`,
        "skill",
      );
    }
  }
  if (profile.projects.length)
    push(
      `You completed ${profile.projects.length} project${profile.projects.length === 1 ? "" : "s"}, including "${profile.projects[0]!.title}".`,
      "project",
    );
  push(`Your target role is ${spec.role} with a ${profile.timelineMonths}-month timeline.`, "goal");
  push(`You can commit ${profile.hoursPerDay}h/day, so plans are sized to ${Math.round(profile.hoursPerDay * 60)} minutes per session.`, "behaviour");
  if (profile.projects.length >= 2) push("You learn best by building — project-based learning is your dominant pattern.", "behaviour");
  const strong = [...profile.skills].sort((a, b) => b.percent - a.percent)[0];
  if (strong) push(`${strong.name} is currently your strongest career-relevant strength.`, "skill");
  if (gaps[0]) push(`${gaps[0].name} is your weakest area relative to ${spec.role} requirements.`, "skill");
  if (profile.completedTasks.length)
    push(`You have completed ${profile.completedTasks.length} roadmap task${profile.completedTasks.length === 1 ? "" : "s"}.`, "progress");
  if (profile.completedDays.length)
    push(`You are ${profile.completedDays.length} day${profile.completedDays.length === 1 ? "" : "s"} into your 30-day plan.`, "progress");
  if (profile.interests.length) push(`You are most interested in ${profile.interests.slice(0, 3).join(", ")}.`, "goal");
  return [...profile.memories, ...derived].slice(-40).reverse();
}

export function buildTwinContext(profile: TwinProfile): string {
  const scores = computeScores(profile);
  const gaps = computeGaps(profile);
  const spec = getRole(profile.targetRole);
  const mem = deriveMemories(profile).slice(0, 12).map((m) => `- ${m.text}`).join("\n");
  return [
    `STUDENT PROFILE`,
    `Name: ${profile.name}`,
    `Education: ${profile.degree}, ${profile.department}, ${profile.year} at ${profile.college}`,
    `Skills: ${profile.skills.map((s) => `${s.name} ${s.level} (${s.percent}%)`).join(", ") || "none recorded"}`,
    `Projects: ${profile.projects.map((p) => `${p.title} [${p.tech}]${p.deployed ? " (deployed)" : ""}`).join("; ") || "none"}`,
    `Internships: ${profile.experience.internships.join("; ") || "none"}`,
    `Certifications: ${profile.experience.certifications.join("; ") || "none"}`,
    `Achievements: ${profile.experience.achievements.join("; ") || "none"}`,
    `Interests: ${profile.interests.join(", ") || "none"}`,
    ``,
    `GOAL`,
    `Target role: ${profile.targetRole} — ${spec.blurb}`,
    `Timeline: ${profile.timelineMonths} months. Study capacity: ${profile.hoursPerDay}h/day.`,
    `Short-term goal: ${profile.shortTermGoal || "unspecified"}`,
    `Long-term goal: ${profile.longTermGoal || "unspecified"}`,
    ``,
    `ENGINE SCORES (0-100)`,
    `Career readiness ${scores.readiness} (${readinessLabel(scores.readiness)}), skill strength ${scores.skills}, project strength ${scores.projects}, goal clarity ${scores.goals}, experience ${scores.experience}, consistency ${scores.consistency}`,
    ``,
    `RANKED SKILL GAPS FOR ${spec.role.toUpperCase()}`,
    ...gaps.map((g) => `- ${g.name}: current ${g.current}% vs required ${g.required}% (${g.importance}, ~${g.time}) → ${g.action}`),
    ``,
    `TWIN MEMORY`,
    mem || "- no memories yet",
    ``,
    `PROGRESS`,
    `Roadmap tasks completed: ${profile.completedTasks.length}. 30-day plan days completed: ${profile.completedDays.length}.`,
  ].join("\n");
}

/** Deterministic fallback answer used when the AI gateway is unavailable. */
export function engineAnswer(profile: TwinProfile, question: string) {
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile).filter((g) => g.deficit > 0);
  const top = gaps[0];
  const scores = computeScores(profile);
  return {
    recommendation: top
      ? `Focus on ${top.name} next — it is the highest-impact move toward ${spec.role}.`
      : `You have covered the core ${spec.role} requirements. Shift to interview preparation and applications.`,
    why: `Your readiness is ${scores.readiness}% (${readinessLabel(scores.readiness)}). ${strongestSkill(profile)} is already working for you, and ${top ? `${top.name} sits at ${top.current}% against a required ${top.required}%` : "your remaining gaps are minor"}.`,
    gap: gaps.length ? gaps.slice(0, 3).map((g) => `${g.name} (${g.current}% → ${g.required}%)`).join(", ") : "No critical gaps remaining.",
    action: [
      top ? top.action : "Run 5 mock interviews this week",
      `Build: ${spec.signatureProjects[0]!}`,
      `Study ${Math.round(profile.hoursPerDay * 60)} minutes per day and mark progress in your 30-day plan`,
    ],
    priority: (top && top.importance === "Critical" ? "High" : "Medium") as "High" | "Medium",
    source: "engine" as const,
    question,
  };
}

export function clamp(n: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(n)));
}

export function makeSkill(name: string, level: Level, percent?: number): Skill {
  return { name, level, percent: percent ?? levelPercent[level] };
}
