import { createFileRoute, Link } from "@tanstack/react-router";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, SectionHeader } from "@/components/twin/glass";
import { computeGaps, getRole } from "@/lib/twin-engine";
import { useTwin } from "@/lib/twin-store";

export const Route = createFileRoute("/skill-gap")({
  head: () => ({
    meta: [
      { title: "Skill Gap Analysis — TwinAI" },
      { name: "description", content: "See exactly which skills stand between you and your target role, ranked by impact with estimated time to close." },
      { property: "og:title", content: "Skill Gap Analysis — TwinAI" },
      { property: "og:description", content: "Impact-ranked skill gaps with time estimates and concrete actions." },
    ],
  }),
  component: SkillGapPage,
});

function SkillGapPage() {
  const { profile } = useTwin();
  const spec = getRole(profile.targetRole);
  const gaps = computeGaps(profile);
  const open = gaps.filter((g) => g.deficit > 0);

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Gap intelligence"
        title={`What stands between you and ${spec.role}`}
        subtitle={`${open.length} open gap${open.length === 1 ? "" : "s"}, ranked by how much each one moves your readiness.`}
      />

      <div className="space-y-4">
        {open.map((g, i) => (
          <GlassCard key={g.name} delay={i * 0.04}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/12 font-display text-sm font-semibold text-primary">
                #{i + 1}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-base font-semibold text-foreground">{g.name}</h2>
                  <Pill tone={g.importance === "Critical" ? "warning" : "primary"}>{g.importance}</Pill>
                  <Pill tone="cyan">est. {g.time}</Pill>
                </div>
                <Meter value={g.current} label={`Current ${g.current}%`} hint={`Required for ${spec.role}: ${g.required}%`} />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">Do this: </span>
                  {g.action}
                </p>
              </div>
            </div>
          </GlassCard>
        ))}
        {!open.length ? (
          <GlassCard>
            <p className="text-sm text-foreground">
              No open gaps for {spec.role}. Move into mock interviews, system design practice and applications.
            </p>
          </GlassCard>
        ) : null}
      </div>

      <GlassCard delay={0.1}>
        <h2 className="font-display text-lg font-semibold text-foreground">Turn gaps into a plan</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your twin already sequenced these gaps into a phased roadmap and a day-by-day 30-day plan.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/roadmap" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            View roadmap
          </Link>
          <Link to="/plan" className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground">
            View 30-day plan
          </Link>
        </div>
      </GlassCard>
    </AppShell>
  );
}
