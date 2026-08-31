import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, ScoreRing, SectionHeader } from "@/components/twin/glass";
import { build30DayPlan, buildRoadmap, deriveMemories, readinessLabel } from "@/lib/twin-engine";
import { useScores, useTwin } from "@/lib/twin-store";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Growth Tracking — TwinAI" },
      { name: "description", content: "Track skill growth against your baseline, roadmap completion and readiness momentum over time." },
      { property: "og:title", content: "Growth Tracking — TwinAI" },
      { property: "og:description", content: "Skill growth vs baseline, roadmap completion and readiness momentum." },
    ],
  }),
  component: ProgressPage,
});

function ProgressPage() {
  const { profile } = useTwin();
  const scores = useScores();
  const plan = build30DayPlan(profile);
  const tasks = buildRoadmap(profile).flatMap((p) => p.tasks);
  const taskPct = tasks.length ? Math.round((profile.completedTasks.length / tasks.length) * 100) : 0;
  const dayPct = plan.length ? Math.round((profile.completedDays.length / plan.length) * 100) : 0;
  const delta = scores.readiness - profile.baselineReadiness;
  const growth = profile.skills.map((s) => ({
    name: s.name,
    now: s.percent,
    base: profile.baselineSkills[s.name] ?? s.percent,
  }));
  const timeline = [...deriveMemories(profile), ...profile.memories].slice(-12).reverse();

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Momentum"
        title="How far you've moved"
        subtitle="Everything here is measured against the baseline your twin captured when it was created."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Link to="/career" className="block focus-visible:outline-none">
          <GlassCard className="flex h-full flex-col items-center justify-center gap-2">
            <ScoreRing value={scores.readiness} label="Readiness now" caption={readinessLabel(scores.readiness)} />
            <span className="text-xs font-semibold text-primary">See readiness breakdown →</span>
          </GlassCard>
        </Link>
        <Link to="/skills" className="block focus-visible:outline-none">
          <GlassCard delay={0.05} className="h-full space-y-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Change since baseline</p>
              <p className="font-display text-3xl font-semibold text-foreground">
                {delta >= 0 ? "+" : ""}
                {delta} pts
              </p>
              <Pill tone={delta >= 0 ? "success" : "warning"}>Baseline {profile.baselineReadiness}%</Pill>
            </div>
            <Meter value={scores.consistency} label="Consistency" tone="success" />
            <span className="block text-xs font-semibold text-primary">Open skill intelligence →</span>
          </GlassCard>
        </Link>
        <GlassCard delay={0.1} className="h-full space-y-4">
          <Link to="/roadmap" className="block">
            <Meter value={taskPct} label={`Roadmap · ${profile.completedTasks.length}/${tasks.length} tasks`} tone="primary" />
            <span className="mt-1 block text-xs font-semibold text-primary">Tick roadmap tasks →</span>
          </Link>
          <Link to="/plan" className="block">
            <Meter value={dayPct} label={`30-day plan · ${profile.completedDays.length}/${plan.length} days`} tone="violet" />
            <span className="mt-1 block text-xs font-semibold text-primary">Open 30-day plan →</span>
          </Link>
        </GlassCard>
      </div>

      <GlassCard delay={0.05}>
        <h2 className="font-display text-lg font-semibold text-foreground">Skill growth vs baseline</h2>
        <div className="mt-5 space-y-4">
          {growth.map((g) => (
            <div key={g.name} className="space-y-1">
              <div className="flex items-baseline justify-between text-sm">
                <span className="font-medium text-foreground">{g.name}</span>
                <span className="text-muted-foreground">
                  {g.base}% → <span className="font-semibold text-foreground">{g.now}%</span>
                  {g.now > g.base ? <span className="ml-2 text-success">+{g.now - g.base}</span> : null}
                </span>
              </div>
              <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-accent/70">
                <div className="absolute inset-y-0 left-0 rounded-full bg-violet/40" style={{ width: `${g.base}%` }} />
                <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${Math.min(g.now, 100)}%`, opacity: 0.85 }} />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard delay={0.1}>
        <h2 className="font-display text-lg font-semibold text-foreground">Activity timeline</h2>
        <ol className="mt-4 space-y-3 border-l border-border pl-5">
          {timeline.map((m) => (
            <li key={m.id} className="relative">
              <span className="absolute -left-[26px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
              <p className="text-sm text-foreground">{m.text}</p>
              <p className="text-xs text-muted-foreground">{new Date(m.at).toLocaleDateString()} · {m.tag}</p>
            </li>
          ))}
        </ol>
      </GlassCard>
    </AppShell>
  );
}
