import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, SectionHeader } from "@/components/twin/glass";
import { build30DayPlan } from "@/lib/twin-engine";
import { useTwin } from "@/lib/twin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plan")({
  head: () => ({
    meta: [
      { title: "30-Day Action Plan — TwinAI" },
      { name: "description", content: "A day-by-day 30-day plan sized to your available study time, focused on the skills that matter most." },
      { property: "og:title", content: "30-Day Action Plan — TwinAI" },
      { property: "og:description", content: "Day-by-day plan sized to your study time and target role." },
    ],
  }),
  component: PlanPage,
});

const TONE: Record<string, "primary" | "violet" | "cyan" | "success"> = {
  Learn: "primary",
  Practice: "cyan",
  Build: "violet",
  Review: "success",
};

function PlanPage() {
  const { profile, toggleDay, addMemory } = useTwin();
  const plan = build30DayPlan(profile);
  const done = profile.completedDays.length;
  const progress = plan.length ? Math.round((done / plan.length) * 100) : 0;

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Execution"
        title="Your next 30 days"
        subtitle={`Sized to ${Math.round(profile.hoursPerDay * 60)} minutes a day and sequenced around your biggest gaps.`}
      />

      <GlassCard>
        <Meter value={progress} label={`${done} of ${plan.length} days completed`} tone="success" />
      </GlassCard>

      <div className="grid gap-3 md:grid-cols-2">
        {plan.map((d, i) => {
          const complete = profile.completedDays.includes(d.day);
          return (
            <GlassCard key={d.day} delay={Math.min(i * 0.01, 0.2)} className="p-4">
              <button
                onClick={() => {
                  toggleDay(d.day);
                  if (!complete) addMemory(`Completed day ${d.day} of the 30-day plan: ${d.focus}`, "progress");
                }}
                className="flex w-full items-start gap-3 text-left"
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border font-display text-[10px] font-semibold",
                    complete ? "border-success bg-success text-primary-foreground" : "border-border bg-card text-muted-foreground",
                  )}
                >
                  {complete ? <Check className="h-3 w-3" /> : d.day}
                </span>
                <span className="flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">Day {d.day} · {d.focus}</span>
                    <Pill tone={TONE[d.type] ?? "primary"}>{d.type}</Pill>
                    <span className="text-xs text-muted-foreground">{d.minutes} min</span>
                  </span>
                  <span className={cn("mt-1 block text-xs", complete ? "text-muted-foreground line-through" : "text-muted-foreground")}>
                    {d.task}
                  </span>
                </span>
              </button>
            </GlassCard>
          );
        })}
      </div>
    </AppShell>
  );
}
