import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, SectionHeader } from "@/components/twin/glass";
import { readinessLabel, simulatePaths } from "@/lib/twin-engine";
import { useTwin } from "@/lib/twin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/simulator")({
  head: () => ({
    meta: [
      { title: "Future Career Simulator — TwinAI" },
      { name: "description", content: "Simulate where each career path takes you in 3, 6 and 12 months based on your current profile and habits." },
      { property: "og:title", content: "Future Career Simulator — TwinAI" },
      { property: "og:description", content: "Simulate 3, 6 and 12-month futures for each career path." },
    ],
  }),
  component: SimulatorPage,
});

function SimulatorPage() {
  const { profile } = useTwin();
  const paths = simulatePaths(profile);
  const [active, setActive] = useState(0);
  const path = paths[active] ?? paths[0];

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Future simulation"
        title="Where each path takes you"
        subtitle="A projection based on your current skills, projects and study consistency. Directional guidance — not an employment guarantee."
      />

      <div className="flex flex-wrap gap-2">
        {paths.map((p, i) => (
          <button
            key={p.role}
            onClick={() => setActive(i)}
            className={cn(
              "rounded-2xl px-4 py-2 text-sm font-semibold transition-all",
              i === active ? "glass text-primary shadow-glass" : "bg-secondary/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {p.role} · {p.readiness}%
          </button>
        ))}
      </div>

      {path ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <GlassCard>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-display text-xl font-semibold text-foreground">{path.role}</h2>
              <Pill tone="primary">{readinessLabel(path.readiness)}</Pill>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{path.blurb}</p>
            <ol className="mt-6 space-y-5 border-l border-border pl-6">
              {path.timeline.map((t) => (
                <li key={t.at} className="relative">
                  <span className="absolute -left-[31px] top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/15">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </span>
                  <p className="font-display text-sm font-semibold text-primary">{t.at}</p>
                  <p className="mt-1 text-sm text-foreground">{t.state}</p>
                </li>
              ))}
            </ol>
          </GlassCard>

          <div className="space-y-5">
            <GlassCard delay={0.05}>
              <Meter value={path.readiness} label="Current fit for this path" tone="primary" />
            </GlassCard>
            <GlassCard delay={0.1}>
              <h3 className="font-display text-base font-semibold text-foreground">To make this future real</h3>
              <ul className="mt-3 space-y-2">
                {path.improvements.map((s) => (
                  <li key={s} className="flex items-center gap-2 rounded-2xl bg-secondary/60 px-4 py-2.5 text-sm text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-violet" /> {s}
                  </li>
                ))}
                {!path.improvements.length ? (
                  <li className="text-sm text-muted-foreground">You already meet the core bar for this path.</li>
                ) : null}
              </ul>
            </GlassCard>
            <p className="px-2 text-xs text-muted-foreground">
              Simulations are projections from your profile and study consistency, not an employment guarantee.
            </p>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}
