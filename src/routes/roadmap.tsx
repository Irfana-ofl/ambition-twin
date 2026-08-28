import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, SectionHeader } from "@/components/twin/glass";
import { buildRoadmap, getRole } from "@/lib/twin-engine";
import { useTwin } from "@/lib/twin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Personalized Roadmap — TwinAI" },
      { name: "description", content: "A phased, personalized roadmap generated from your skills, projects and target role — with trackable outcomes." },
      { property: "og:title", content: "Personalized Roadmap — TwinAI" },
      { property: "og:description", content: "Phased roadmap generated from your real profile, with trackable outcomes." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { profile, toggleTask, addMemory } = useTwin();
  const spec = getRole(profile.targetRole);
  const phases = buildRoadmap(profile);
  const all = phases.flatMap((p) => p.tasks);
  const done = all.filter((t) => profile.completedTasks.includes(t.id)).length;
  const progress = all.length ? Math.round((done / all.length) * 100) : 0;

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Your path"
        title={`The route to ${spec.role}`}
        subtitle="Each phase closes a specific gap in the right order. Tick tasks as you finish them — your twin updates its memory and scores."
      />

      <GlassCard>
        <Meter value={progress} label={`Roadmap progress — ${done}/${all.length} tasks`} tone="success" />
      </GlassCard>

      <div className="space-y-5">
        {phases.map((phase, i) => (
          <GlassCard key={phase.id} delay={i * 0.05}>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-violet/12 font-display text-sm font-semibold text-violet">
                {i + 1}
              </span>
              <h2 className="font-display text-lg font-semibold text-foreground">{phase.title}</h2>
              <Pill tone="cyan">{phase.weeks}</Pill>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{phase.subtitle}</p>
            <ul className="mt-4 space-y-2">
              {phase.tasks.map((t) => {
                const complete = profile.completedTasks.includes(t.id);
                return (
                  <li key={t.id}>
                    <button
                      onClick={() => {
                        toggleTask(t.id);
                        if (!complete) addMemory(`Completed roadmap task: ${t.label}`, "progress");
                      }}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-2xl px-4 py-3 text-left transition-colors",
                        complete ? "bg-success/10" : "bg-secondary/60 hover:bg-secondary",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border",
                          complete ? "border-success bg-success text-primary-foreground" : "border-border bg-card",
                        )}
                      >
                        {complete ? <Check className="h-3 w-3" /> : null}
                      </span>
                      <span>
                        <span className={cn("block text-sm font-medium", complete ? "text-muted-foreground line-through" : "text-foreground")}>
                          {t.label}
                        </span>
                        <span className="mt-1 block text-xs text-muted-foreground">
                          {t.skill} · {t.outcome}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </GlassCard>
        ))}
      </div>
    </AppShell>
  );
}
