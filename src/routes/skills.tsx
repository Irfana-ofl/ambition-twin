import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, SectionHeader } from "@/components/twin/glass";
import { computeGaps, getRole, percentToLevel } from "@/lib/twin-engine";
import { useScores, useTwin } from "@/lib/twin-store";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skill Intelligence — TwinAI" },
      { name: "description", content: "Understand your strengths, emerging skills and role-relevant coverage with AI-driven skill intelligence." },
      { property: "og:title", content: "Skill Intelligence — TwinAI" },
      { property: "og:description", content: "Strengths, emerging skills and role-relevant coverage analysis." },
    ],
  }),
  component: SkillsPage,
});

function SkillsPage() {
  const { profile } = useTwin();
  const scores = useScores();
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile);
  const sorted = [...profile.skills].sort((a, b) => b.percent - a.percent);
  const strengths = sorted.filter((s) => s.percent >= 60);
  const emerging = sorted.filter((s) => s.percent < 60);
  const covered = spec.skills.filter((rs) => (profile.skills.find((s) => s.name === rs.name)?.percent ?? 0) > 0).length;

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Skill intelligence"
        title="What you're strong at — and what's still forming"
        subtitle={`Measured against the ${spec.role} skill profile. You currently cover ${covered} of ${spec.skills.length} role-critical skills.`}
      />

      <div className="grid gap-5 md:grid-cols-3">
        <GlassCard>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Skill strength</p>
          <p className="font-display text-3xl font-semibold text-foreground">{scores.skills}%</p>
          <p className="mt-1 text-xs text-muted-foreground">Weighted across all captured skills</p>
        </GlassCard>
        <GlassCard delay={0.05}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Strengths</p>
          <p className="font-display text-3xl font-semibold text-foreground">{strengths.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">At intermediate level or above</p>
        </GlassCard>
        <GlassCard delay={0.1}>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Emerging</p>
          <p className="font-display text-3xl font-semibold text-foreground">{emerging.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">Need deliberate practice</p>
        </GlassCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <GlassCard delay={0.05}>
          <h2 className="font-display text-lg font-semibold text-foreground">Your skill map</h2>
          <div className="mt-4 space-y-4">
            {sorted.map((s) => (
              <Meter
                key={s.name}
                value={s.percent}
                label={s.name}
                hint={`${percentToLevel(s.percent)} · baseline ${profile.baselineSkills[s.name] ?? s.percent}%`}
                tone={s.percent >= 70 ? "success" : s.percent >= 45 ? "primary" : "violet"}
              />
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.1}>
          <h2 className="font-display text-lg font-semibold text-foreground">Role requirement coverage</h2>
          <p className="text-xs text-muted-foreground">{spec.blurb}</p>
          <ul className="mt-4 space-y-3">
            {gaps.map((g) => (
              <li key={g.name} className="rounded-2xl bg-secondary/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{g.name}</span>
                  <div className="flex items-center gap-2">
                    <Pill tone={g.deficit > 0 ? "warning" : "success"}>
                      {g.deficit > 0 ? `${g.deficit}% to go` : "Met"}
                    </Pill>
                    <Pill>{g.importance}</Pill>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {g.current}% now · {g.required}% required · est. {g.time}
                </p>
              </li>
            ))}
          </ul>
        </GlassCard>
      </div>
    </AppShell>
  );
}
