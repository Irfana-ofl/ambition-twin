import { Brain, ChevronDown } from "lucide-react";
import { useState } from "react";

import { GlassCard, Pill } from "./glass";
import {
  computeGaps,
  getRole,
  nextBestActions,
  readinessLabel,
  strongestSkill,
} from "@/lib/twin-engine";
import { useScores, useTwin } from "@/lib/twin-store";
import { cn } from "@/lib/utils";

/**
 * Explains, in plain language, which parts of the twin data produced the
 * current recommendations — so advice never looks like a black box.
 */
export function ReasoningRecap({ delay = 0 }: { delay?: number }) {
  const { profile } = useTwin();
  const scores = useScores();
  const [open, setOpen] = useState(true);

  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile);
  const blocking = gaps.filter((g) => g.deficit > 0).slice(0, 3);
  const actions = nextBestActions(profile).slice(0, 4);
  const deployed = profile.projects.filter((p) => p.deployed).length;

  const signals = [
    {
      label: "Target role",
      value: spec.role,
      note: `Measured against ${spec.skills.length} role-critical skills.`,
    },
    {
      label: "Readiness",
      value: `${scores.readiness}% · ${readinessLabel(scores.readiness)}`,
      note: `Baseline was ${profile.baselineReadiness}% when your twin was created.`,
    },
    {
      label: "Strongest skill",
      value: strongestSkill(profile),
      note: "Used as the anchor for early, low-friction wins.",
    },
    {
      label: "Evidence",
      value: `${profile.projects.length} project${profile.projects.length === 1 ? "" : "s"} · ${deployed} deployed`,
      note: `Experience score ${scores.experience}%, goal clarity ${scores.goals}%.`,
    },
    {
      label: "Capacity",
      value: `${profile.hoursPerDay}h/day · ${profile.timelineMonths} months`,
      note: "Caps how much each roadmap phase can contain.",
    },
    {
      label: "Consistency",
      value: `${scores.consistency}%`,
      note: `${profile.completedTasks.length} roadmap tasks and ${profile.completedDays.length} plan days ticked so far.`,
    },
  ];

  return (
    <GlassCard delay={delay} className="space-y-4">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center gap-3 text-left">
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet/12">
          <Brain className="h-4 w-4 text-violet" />
        </span>
        <span className="flex-1">
          <span className="block font-display text-lg font-semibold text-foreground">Why your twin recommends this</span>
          <span className="block text-xs text-muted-foreground">
            Reasoning recap built from your live profile — not generic advice.
          </span>
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {signals.map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary/60 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-sm font-semibold text-foreground">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.note}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Gaps driving the order</p>
            {blocking.length ? (
              <ul className="mt-2 space-y-2">
                {blocking.map((g, i) => (
                  <li key={g.name} className="flex flex-wrap items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-2.5">
                    <Pill tone={i === 0 ? "warning" : "neutral"}>{i === 0 ? "Largest gap" : `Gap ${i + 1}`}</Pill>
                    <span className="text-sm font-medium text-foreground">{g.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {g.current}% → {g.required}% · {g.importance} weight · est. {g.time}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-success">No open gaps for this role — recommendations shift to proof of work.</p>
            )}
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Chosen next recommendations
            </p>
            <ul className="mt-2 space-y-2">
              {actions.map((a) => (
                <li key={a.id} className="rounded-2xl bg-primary/8 px-4 py-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Pill tone={a.tag === "High Priority" ? "warning" : "primary"}>{a.tag}</Pill>
                    <span className="text-sm font-semibold text-foreground">{a.title}</span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Chosen because {a.why} · {a.time} · {a.impact}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </GlassCard>
  );
}
