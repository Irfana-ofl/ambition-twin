import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Meter, Pill, SectionHeader } from "@/components/twin/glass";
import { TwinOrb } from "@/components/twin/twin-orb";
import { deriveMemories } from "@/lib/twin-engine";
import { useScores, useTwin } from "@/lib/twin-store";

export const Route = createFileRoute("/twin")({
  head: () => ({
    meta: [
      { title: "My Digital Twin — TwinAI" },
      { name: "description", content: "A living visualisation of your identity: education, skills, projects, goals and everything your twin remembers." },
      { property: "og:title", content: "My Digital Twin — TwinAI" },
      { property: "og:description", content: "See what your AI twin knows and remembers about you." },
    ],
  }),
  component: TwinPage,
});

function TwinPage() {
  const { profile } = useTwin();
  const scores = useScores();
  const memories = [...deriveMemories(profile), ...profile.memories].slice(-14).reverse();

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Identity layer"
        title="Your digital twin"
        subtitle="This is the model of you that powers every recommendation — grounded in your real profile, not generic advice."
      />

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <GlassCard className="flex flex-col items-center gap-5 text-center">
          <TwinOrb size={200} initials={profile.name.slice(0, 2).toUpperCase() || "AI"} />
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">{profile.name || "Unnamed twin"}</h2>
            <p className="text-sm text-muted-foreground">
              {profile.degree} {profile.department ? `· ${profile.department}` : ""}
            </p>
            <p className="text-xs text-muted-foreground">
              {profile.year} {profile.college ? `· ${profile.college}` : ""}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Pill tone="primary">{profile.targetRole}</Pill>
            <Pill tone="cyan">{profile.timelineMonths} months</Pill>
            <Pill tone="violet">{scores.readiness}% ready</Pill>
          </div>
        </GlassCard>

        <div className="space-y-5">
          <GlassCard delay={0.05}>
            <h3 className="font-display text-lg font-semibold text-foreground">Skill signals</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {profile.skills.map((s) => (
                <Meter key={s.name} value={s.percent} label={s.name} hint={s.level} />
              ))}
              {!profile.skills.length ? <p className="text-sm text-muted-foreground">No skills captured yet.</p> : null}
            </div>
          </GlassCard>

          <div className="grid gap-5 md:grid-cols-2">
            <GlassCard delay={0.1}>
              <h3 className="font-display text-lg font-semibold text-foreground">Projects</h3>
              <ul className="mt-4 space-y-3">
                {profile.projects.map((p) => (
                  <li key={p.id} className="rounded-2xl bg-secondary/60 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-foreground">{p.title}</span>
                      {p.deployed ? <Pill tone="success">Deployed</Pill> : <Pill>Local</Pill>}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                    <p className="mt-2 text-xs font-medium text-primary">{p.tech}</p>
                  </li>
                ))}
                {!profile.projects.length ? <li className="text-sm text-muted-foreground">No projects yet.</li> : null}
              </ul>
            </GlassCard>

            <GlassCard delay={0.15}>
              <h3 className="font-display text-lg font-semibold text-foreground">Experience & goals</h3>
              <div className="mt-4 space-y-4 text-sm">
                <Group title="Internships" items={profile.experience.internships} />
                <Group title="Certifications" items={profile.experience.certifications} />
                <Group title="Achievements" items={profile.experience.achievements} />
                <Group title="Interests" items={profile.interests} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Goals</p>
                  <p className="mt-1 text-sm text-foreground">Short term: {profile.shortTermGoal || "—"}</p>
                  <p className="text-sm text-foreground">Long term: {profile.longTermGoal || "—"}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          <GlassCard delay={0.2}>
            <h3 className="font-display text-lg font-semibold text-foreground">AI memory</h3>
            <p className="text-xs text-muted-foreground">What your twin remembers and reuses in every conversation.</p>
            <ul className="mt-4 space-y-2">
              {memories.map((m) => (
                <li key={m.id} className="flex items-start gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
                  <Pill tone="violet">{m.tag}</Pill>
                  <span className="text-sm text-foreground">{m.text}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </AppShell>
  );
}

function Group({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{title}</p>
      {items.length ? (
        <ul className="mt-1 space-y-1">
          {items.map((i) => (
            <li key={i} className="text-sm text-foreground">
              • {i}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-1 text-sm text-muted-foreground">—</p>
      )}
    </div>
  );
}
