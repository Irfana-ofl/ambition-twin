import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, ScoreRing, SectionHeader } from "@/components/twin/glass";
import { computeGaps, getRole, readinessLabel, roleReadiness, ROLES } from "@/lib/twin-engine";
import { useScores, useTwin } from "@/lib/twin-store";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career Readiness — TwinAI" },
      { name: "description", content: "A transparent breakdown of your career readiness score across skills, projects, experience, goals and consistency." },
      { property: "og:title", content: "Career Readiness — TwinAI" },
      { property: "og:description", content: "Transparent readiness scoring across skills, projects, experience and consistency." },
    ],
  }),
  component: CareerPage,
});

function CareerPage() {
  const { profile } = useTwin();
  const scores = useScores();
  const spec = getRole(profile.targetRole);
  const blockers = computeGaps(profile).filter((g) => g.deficit > 0).slice(0, 3);
  const ranked = ROLES.map((r) => ({ role: r.role, score: roleReadiness(profile, r.role) })).sort((a, b) => b.score - a.score);

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Readiness"
        title="How employable are you right now?"
        subtitle={`Scored against the ${spec.role} bar. Nothing here is a guarantee — it's a transparent, weighted signal you can move.`}
      />

      <div className="grid gap-5 lg:grid-cols-[300px_1fr]">
        <GlassCard className="flex flex-col items-center gap-4">
          <ScoreRing value={scores.readiness} label={spec.role} caption={readinessLabel(scores.readiness)} size={150} />
          <Pill tone="primary">Target in {profile.timelineMonths} months</Pill>
        </GlassCard>
        <GlassCard delay={0.05}>
          <h2 className="font-display text-lg font-semibold text-foreground">Score breakdown</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Meter value={scores.skills} label="Skills (40%)" tone="primary" />
            <Meter value={scores.projects} label="Projects (25%)" tone="violet" />
            <Meter value={scores.experience} label="Experience (15%)" tone="cyan" />
            <Meter value={scores.goals} label="Goal clarity (10%)" tone="success" />
            <Meter value={scores.consistency} label="Consistency (10%)" tone="success" />
          </div>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard delay={0.05}>
          <h2 className="font-display text-lg font-semibold text-foreground">What's holding the score back</h2>
          <ul className="mt-4 space-y-3">
            {blockers.map((g) => (
              <li key={g.name} className="rounded-2xl bg-secondary/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{g.name}</span>
                  <Pill tone="warning">-{g.deficit}%</Pill>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{g.action}</p>
              </li>
            ))}
            {!blockers.length ? <li className="text-sm text-muted-foreground">Nothing critical left — focus on interviews.</li> : null}
          </ul>
          <Link to="/skill-gap" className="mt-4 inline-block text-sm font-semibold text-primary">
            Open gap analysis →
          </Link>
        </GlassCard>

        <GlassCard delay={0.1}>
          <h2 className="font-display text-lg font-semibold text-foreground">Readiness across roles</h2>
          <div className="mt-4 space-y-3">
            {ranked.map((r) => (
              <Meter key={r.role} value={r.score} label={r.role} tone={r.role === spec.role ? "primary" : "violet"} />
            ))}
          </div>
          <Link to="/simulator" className="mt-4 inline-block text-sm font-semibold text-primary">
            Simulate these futures →
          </Link>
        </GlassCard>
      </div>
    </AppShell>
  );
}
