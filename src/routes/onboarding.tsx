import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Circle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { GlassCard, Meter, Pill } from "@/components/twin/glass";
import { TwinOrb } from "@/components/twin/twin-orb";
import { completenessScore, profileChecklist } from "@/lib/twin-completeness";
import { computeScores, LEVELS, makeSkill, ROLES } from "@/lib/twin-engine";
import { INTEREST_LIBRARY, SKILL_LIBRARY } from "@/lib/twin-demo";
import { emptyProfile, useTwin } from "@/lib/twin-store";
import type { Level, Project, TwinProfile } from "@/lib/twin-types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { title: "Create Your Twin — TwinAI Onboarding" },
      { name: "description", content: "Six guided steps to build your AI digital twin: education, skills, projects, achievements, interests and career goals." },
      { property: "og:title", content: "Create Your Twin — TwinAI Onboarding" },
      { property: "og:description", content: "Six guided steps to build your personal AI digital twin." },
    ],
  }),
  component: OnboardingPage,
});

const STEPS = ["Education", "Skills", "Projects", "Achievements", "Interests", "Goals"];

function OnboardingPage() {
  const navigate = useNavigate();
  const { profile: current, setProfile, isDemo } = useTwin();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<TwinProfile>(() => (isDemo ? emptyProfile() : { ...current }));
  const [skillLevels, setSkillLevels] = useState<Record<string, Level>>(() =>
    Object.fromEntries(draft.skills.map((s) => [s.name, s.level])),
  );

  const set = (patch: Partial<TwinProfile>) => setDraft((d) => ({ ...d, ...patch }));

  const checklist = profileChecklist(draft, Object.keys(skillLevels).length);
  const completeness = completenessScore(checklist);
  const missingRequired = checklist.filter((c) => c.required && !c.done);
  const nextSteps = checklist.filter((c) => !c.done).slice(0, 3);

  const toggleSkill = (name: string) => {
    setSkillLevels((prev) => {
      const next = { ...prev };
      if (next[name]) delete next[name];
      else next[name] = "Beginner";
      return next;
    });
  };

  const canContinue = () => {
    if (step === 0) return draft.name.trim().length > 1 && draft.degree.trim().length > 1;
    if (step === 1) return Object.keys(skillLevels).length >= 3;
    if (step === 5) return draft.shortTermGoal.trim().length > 3;
    return true;
  };

  const finish = () => {
    const skills = Object.entries(skillLevels).map(([name, level]) => makeSkill(name, level));
    const base: TwinProfile = {
      ...draft,
      skills,
      baselineSkills: Object.fromEntries(skills.map((s) => [s.name, s.percent])),
      createdAt: new Date().toISOString(),
      memories: [],
      completedTasks: [],
      completedDays: [],
    };
    const finished: TwinProfile = { ...base, baselineReadiness: computeScores(base).readiness };
    setProfile(finished);
    toast.success("Your digital twin is live.");
    void navigate({ to: "/dashboard" });
  };

  return (
    <div className="relative min-h-screen px-4 py-10">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-60" aria-hidden />
      <div className="relative mx-auto w-full max-w-3xl space-y-6">
        <div className="flex flex-col items-center gap-3 text-center">
          <TwinOrb size={110} initials={draft.name.slice(0, 2).toUpperCase() || "AI"} />
          <h1 className="font-display text-3xl font-semibold text-foreground">Build your digital twin</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Six short steps. Everything you enter becomes the memory your twin reasons with.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors",
                i === step ? "bg-primary text-primary-foreground" : i < step ? "bg-success/15 text-success" : "bg-secondary/70 text-muted-foreground",
              )}
            >
              {i < step ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
              {s}
            </span>
          ))}
        </div>

        <GlassCard lift={false} className="space-y-5">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" value={draft.name} onChange={(v) => set({ name: v })} placeholder="Alex Johnson" />
              <Field label="Degree" value={draft.degree} onChange={(v) => set({ degree: v })} placeholder="B.Sc Artificial Intelligence" />
              <Field label="Department" value={draft.department} onChange={(v) => set({ department: v })} placeholder="AI & Machine Learning" />
              <Field label="Year" value={draft.year} onChange={(v) => set({ year: v })} placeholder="3rd Year" />
              <Field label="College" value={draft.college} onChange={(v) => set({ college: v })} placeholder="Your college" className="sm:col-span-2" />
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">Pick at least 3 skills, then set your honest level for each.</p>
              <div className="flex flex-wrap gap-2">
                {SKILL_LIBRARY.map((s) => (
                  <button
                    key={s}
                    onClick={() => toggleSkill(s)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                      skillLevels[s] ? "bg-primary text-primary-foreground" : "bg-secondary/70 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {Object.entries(skillLevels).map(([name, level]) => (
                  <div key={name} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-secondary/60 px-4 py-2.5">
                    <span className="text-sm font-medium text-foreground">{name}</span>
                    <div className="flex gap-1.5">
                      {LEVELS.map((l) => (
                        <button
                          key={l}
                          onClick={() => setSkillLevels((p) => ({ ...p, [name]: l }))}
                          className={cn(
                            "rounded-lg px-2.5 py-1 text-xs font-semibold",
                            level === l ? "bg-violet text-primary-foreground" : "bg-card text-muted-foreground",
                          )}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <ProjectsStep projects={draft.projects} onChange={(projects) => set({ projects })} />
          ) : null}

          {step === 3 ? (
            <div className="space-y-4">
              <ListField
                label="Internships"
                items={draft.experience.internships}
                onChange={(internships) => set({ experience: { ...draft.experience, internships } })}
              />
              <ListField
                label="Certifications"
                items={draft.experience.certifications}
                onChange={(certifications) => set({ experience: { ...draft.experience, certifications } })}
              />
              <ListField
                label="Achievements"
                items={draft.experience.achievements}
                onChange={(achievements) => set({ experience: { ...draft.experience, achievements } })}
              />
            </div>
          ) : null}

          {step === 4 ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">What genuinely interests you? This shapes tone and project suggestions.</p>
              <div className="flex flex-wrap gap-2">
                {INTEREST_LIBRARY.map((i) => {
                  const on = draft.interests.includes(i);
                  return (
                    <button
                      key={i}
                      onClick={() => set({ interests: on ? draft.interests.filter((x) => x !== i) : [...draft.interests, i] })}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        on ? "bg-violet text-primary-foreground" : "bg-secondary/70 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {i}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-sm font-medium text-foreground">Target role</p>
                <div className="flex flex-wrap gap-2">
                  {ROLES.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => set({ targetRole: r.role })}
                      className={cn(
                        "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                        draft.targetRole === r.role ? "bg-primary text-primary-foreground" : "bg-secondary/70 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {r.role}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="Short-term goal" value={draft.shortTermGoal} onChange={(v) => set({ shortTermGoal: v })} placeholder="Land an AI internship in 6 months" />
              <Field label="Long-term goal" value={draft.longTermGoal} onChange={(v) => set({ longTermGoal: v })} placeholder="Become an AI Engineer at a product company" />
              <div className="grid gap-4 sm:grid-cols-2">
                <Range label={`Timeline: ${draft.timelineMonths} months`} min={3} max={24} value={draft.timelineMonths} onChange={(v) => set({ timelineMonths: v })} />
                <Range label={`Study time: ${draft.hoursPerDay}h / day`} min={1} max={8} value={draft.hoursPerDay} onChange={(v) => set({ hoursPerDay: v })} />
              </div>
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-3 border-t border-border/60 pt-5">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
            <Pill tone="cyan">
              Step {step + 1} of {STEPS.length}
            </Pill>
            {step < STEPS.length - 1 ? (
              <button
                onClick={() => canContinue() && setStep((s) => s + 1)}
                disabled={!canContinue()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Continue <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={!canContinue()}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-40"
              >
                Create my twin <Check className="h-4 w-4" />
              </button>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary"
      />
    </label>
  );
}

function Range({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-primary"
      />
    </label>
  );
}

function ListField({ label, items, onChange }: { label: string; items: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              e.preventDefault();
              onChange([...items, text.trim()]);
              setText("");
            }
          }}
          placeholder={`Add ${label.toLowerCase()} and press Enter`}
          className="flex-1 rounded-2xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary"
        />
        <button
          onClick={() => {
            if (text.trim()) {
              onChange([...items, text.trim()]);
              setText("");
            }
          }}
          className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((i) => (
          <button
            key={i}
            onClick={() => onChange(items.filter((x) => x !== i))}
            className="rounded-full bg-secondary/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            {i} ×
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectsStep({ projects, onChange }: { projects: Project[]; onChange: (p: Project[]) => void }) {
  const [form, setForm] = useState({ title: "", description: "", tech: "", deployed: false });
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Add the projects you've actually built — your twin uses them as proof of skill.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Title" value={form.title} onChange={(title) => setForm({ ...form, title })} placeholder="Face Recognition Attendance" />
        <Field label="Tech used" value={form.tech} onChange={(tech) => setForm({ ...form, tech })} placeholder="Python, OpenCV" />
        <Field label="Description" value={form.description} onChange={(description) => setForm({ ...form, description })} placeholder="What it does" className="sm:col-span-2" />
      </div>
      <label className="flex items-center gap-2 text-sm text-foreground">
        <input type="checkbox" checked={form.deployed} onChange={(e) => setForm({ ...form, deployed: e.target.checked })} className="accent-primary" />
        Deployed publicly
      </label>
      <button
        onClick={() => {
          if (!form.title.trim()) return;
          onChange([...projects, { id: `p-${Date.now()}`, ...form }]);
          setForm({ title: "", description: "", tech: "", deployed: false });
        }}
        className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Add project
      </button>
      <ul className="space-y-2">
        {projects.map((p) => (
          <li key={p.id} className="flex items-start justify-between gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{p.title}</p>
              <p className="text-xs text-muted-foreground">{p.tech}</p>
            </div>
            <button onClick={() => onChange(projects.filter((x) => x.id !== p.id))} className="text-xs font-semibold text-muted-foreground">
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
