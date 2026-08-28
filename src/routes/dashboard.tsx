import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, ScoreRing, SectionHeader } from "@/components/twin/glass";
import { TwinOrb } from "@/components/twin/twin-orb";
import { computeGaps, nextBestActions, readinessLabel, strongestSkill } from "@/lib/twin-engine";
import { useScores, useTwin } from "@/lib/twin-store";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — TwinAI Digital Twin" },
      { name: "description", content: "Your live career readiness, skill signals, gaps and next best actions in one intelligent view." },
      { property: "og:title", content: "Dashboard — TwinAI Digital Twin" },
      { property: "og:description", content: "Live career readiness, skill signals and AI-recommended next actions." },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const { profile } = useTwin();
  const scores = useScores();
  const gaps = computeGaps(profile).filter((g) => g.deficit > 0).slice(0, 4);
  const actions = nextBestActions(profile).slice(0, 3);

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Command centre"
        title={`Welcome back, ${profile.name.split(" ")[0] || "there"}.`}
        subtitle={`Your twin has analysed ${profile.skills.length} skills, ${profile.projects.length} projects and your ${profile.timelineMonths}-month timeline toward ${profile.targetRole}.`}
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <TwinOrb size={168} initials={profile.name.slice(0, 2).toUpperCase() || "AI"} />
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap gap-2">
                <Pill tone="primary">{profile.targetRole}</Pill>
                <Pill tone="violet">{readinessLabel(scores.readiness)}</Pill>
                <Pill tone="cyan">{profile.hoursPerDay}h / day</Pill>
              </div>
              <p className="text-sm text-muted-foreground">
                Strongest asset: <span className="font-semibold text-foreground">{strongestSkill(profile)}</span>. Your twin is
                prioritising the gaps that move readiness fastest.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <Meter value={scores.skills} label="Skill strength" tone="primary" />
                <Meter value={scores.projects} label="Project strength" tone="violet" />
                <Meter value={scores.experience} label="Experience" tone="cyan" />
                <Meter value={scores.consistency} label="Consistency" tone="success" />
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard delay={0.1} className="flex flex-col items-center justify-center gap-4">
          <ScoreRing value={scores.readiness} label="Career readiness" caption={readinessLabel(scores.readiness)} />
          <Link
            to="/career"
            className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            See the breakdown
          </Link>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard delay={0.05}>
          <h2 className="font-display text-lg font-semibold text-foreground">Top gaps blocking you</h2>
          <ul className="mt-4 space-y-4">
            {gaps.length ? (
              gaps.map((g) => (
                <li key={g.name} className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-foreground">{g.name}</span>
                    <Pill tone={g.importance === "Critical" ? "warning" : "neutral"}>{g.importance}</Pill>
                  </div>
                  <Meter value={g.current} label={`Now ${g.current}% → target ${g.required}%`} hint={g.action} tone="violet" />
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">No critical gaps — shift into interview preparation.</li>
            )}
          </ul>
          <Link to="/skill-gap" className="mt-5 inline-block text-sm font-semibold text-primary">
            Full gap analysis →
          </Link>
        </GlassCard>

        <GlassCard delay={0.1}>
          <h2 className="font-display text-lg font-semibold text-foreground">Next best actions</h2>
          <ul className="mt-4 space-y-4">
            {actions.map((a) => (
              <li key={a.id} className="rounded-2xl bg-secondary/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Pill tone="primary">{a.tag}</Pill>
                  <span className="text-xs text-muted-foreground">{a.time}</span>
                </div>
                <p className="mt-2 text-sm font-semibold text-foreground">{a.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{a.why}</p>
                <p className="mt-2 text-xs font-semibold text-success">{a.impact}</p>
              </li>
            ))}
          </ul>
          <Link to="/roadmap" className="mt-5 inline-block text-sm font-semibold text-primary">
            Open your roadmap →
          </Link>
        </GlassCard>
      </div>
    </AppShell>
  );
}
