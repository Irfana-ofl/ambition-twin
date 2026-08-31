import { createFileRoute, Link } from "@tanstack/react-router";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Pill, SectionHeader } from "@/components/twin/glass";
import { ROLES } from "@/lib/twin-engine";
import { useTwin } from "@/lib/twin-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — TwinAI" },
      { name: "description", content: "Tune your target role, timeline and daily study capacity, or reset your twin to the demo profile." },
      { property: "og:title", content: "Settings — TwinAI" },
      { property: "og:description", content: "Tune your target role, timeline and study capacity." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { profile, update, resetToDemo, isDemo, setChat, versions, revertTo, clearVersions } = useTwin();

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Preferences"
        title="Tune your twin"
        subtitle="Change these and every score, roadmap and plan recalculates instantly."
      />

      <GlassCard className="space-y-5">
        <div>
          <p className="mb-2 text-sm font-medium text-foreground">Target role</p>
          <div className="flex flex-wrap gap-2">
            {ROLES.map((r) => (
              <button
                key={r.role}
                onClick={() => {
                  update({ targetRole: r.role });
                  toast.success(`Target role set to ${r.role}`);
                }}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors",
                  profile.targetRole === r.role ? "bg-primary text-primary-foreground" : "bg-secondary/70 text-muted-foreground hover:text-foreground",
                )}
              >
                {r.role}
              </button>
            ))}
          </div>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Timeline: {profile.timelineMonths} months</span>
          <input
            type="range"
            min={3}
            max={24}
            value={profile.timelineMonths}
            onChange={(e) => update({ timelineMonths: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-foreground">Daily study time: {profile.hoursPerDay}h</span>
          <input
            type="range"
            min={1}
            max={8}
            value={profile.hoursPerDay}
            onChange={(e) => update({ hoursPerDay: Number(e.target.value) })}
            className="w-full accent-primary"
          />
        </label>
      </GlassCard>

      <GlassCard delay={0.05} className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="font-display text-lg font-semibold text-foreground">Profile data</h2>
          {isDemo ? <Pill tone="cyan">Demo profile</Pill> : <Pill tone="success">Your profile</Pill>}
        </div>
        <p className="text-sm text-muted-foreground">
          Your twin is stored locally on this device. Rebuild it any time, or reset back to the Alex Johnson demo profile for presentations.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link to="/onboarding" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Edit my twin
          </Link>
          <button
            onClick={() => {
              resetToDemo();
              toast.success("Reset to the demo profile.");
            }}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
          >
            Reset to demo profile
          </button>
          <button
            onClick={() => {
              setChat([]);
              toast.success("Conversation cleared.");
            }}
            className="rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground"
          >
            Clear conversation
          </button>
        </div>
      </GlassCard>

      <GlassCard delay={0.1} className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground">Version history</h2>
            <p className="text-sm text-muted-foreground">
              Every change autosaves. The last {versions.length ? versions.length : "few"} snapshots are kept so you can roll back.
            </p>
          </div>
          {versions.length ? (
            <button
              onClick={() => {
                clearVersions();
                toast.success("Version history cleared.");
              }}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs font-semibold text-muted-foreground"
            >
              Clear history
            </button>
          ) : null}
        </div>

        {versions.length ? (
          <ul className="space-y-2">
            {[...versions].reverse().map((v) => (
              <li key={v.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-secondary/60 px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-foreground">{v.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(v.at).toLocaleString()} · {v.profile.skills.length} skills · {v.profile.projects.length} projects
                  </p>
                </div>
                <button
                  onClick={() => {
                    revertTo(v.id);
                    toast.success(`Reverted: ${v.label}`);
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Revert
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No snapshots yet — make a change and it will appear here.</p>
        )}
      </GlassCard>
    </AppShell>
  );
}
