import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bot,
  CalendarClock,
  Compass,
  GaugeCircle,
  LayoutDashboard,
  Loader2,
  Menu,
  Route as RouteIcon,
  Settings,
  Sparkles,
  Target,
  TrendingUp,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Pill } from "./glass";
import { useScores, useTwin } from "@/lib/twin-store";
import { cn } from "@/lib/utils";


const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/twin", label: "My Digital Twin", icon: Sparkles },
  { to: "/skills", label: "Skill Intelligence", icon: BarChart3 },
  { to: "/skill-gap", label: "Skill Gap", icon: Target },
  { to: "/roadmap", label: "Roadmap", icon: RouteIcon },
  { to: "/plan", label: "30-Day Plan", icon: CalendarClock },
  { to: "/progress", label: "Progress", icon: TrendingUp },
  { to: "/career", label: "Career Readiness", icon: GaugeCircle },
  { to: "/simulator", label: "Future Simulator", icon: Compass },
  { to: "/mentor", label: "AI Mentor", icon: Bot },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300",
              active
                ? "glass text-primary shadow-glass"
                : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
            )}
          >
            <Icon className={cn("h-4 w-4 shrink-0 transition-transform group-hover:scale-110", active && "text-primary")} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { profile, isDemo } = useTwin();
  const scores = useScores();
  return (
    <div className="flex h-full flex-col gap-6">
      <Link to="/" className="flex items-center gap-2.5" onClick={onNavigate}>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12">
          <Sparkles className="h-4.5 w-4.5 text-primary" />
        </span>
        <span className="font-display text-lg font-semibold tracking-tight">
          Twin<span className="text-gradient">AI</span>
        </span>
      </Link>

      <div className="glass-soft rounded-2xl p-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 font-display text-sm font-semibold text-primary">
            {profile.name.slice(0, 1) || "?"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{profile.name || "New student"}</p>
            <p className="truncate text-xs text-muted-foreground">{profile.targetRole}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>Readiness</span>
          <span className="font-display font-semibold text-primary">{scores.readiness}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-accent/70">
          <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${scores.readiness}%` }} />
        </div>
        {isDemo ? (
          <div className="mt-3">
            <Pill tone="cyan">Demo profile</Pill>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto pr-1">
        <NavList onNavigate={onNavigate} />
      </div>

      <div className="space-y-1 border-t border-border/60 pt-4">
        <Link
          to="/onboarding"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
        >
          <UserRound className="h-4 w-4" /> Profile
        </Link>
        <Link
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground"
        >
          <Settings className="h-4 w-4" /> Settings
        </Link>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { profile } = useTwin();

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none fixed inset-0 grid-bg opacity-60" aria-hidden />

      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[272px] flex-col p-5 lg:flex">
        <div className="glass h-full rounded-3xl p-5">
          <SidebarInner />
        </div>
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="glass absolute left-3 top-3 bottom-3 w-[268px] rounded-3xl p-5"
          >
            <button
              className="absolute right-4 top-4 text-muted-foreground"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarInner onNavigate={() => setOpen(false)} />
          </motion.div>
        </div>
      ) : null}

      <div className="relative lg:pl-[272px]">
        <header className="sticky top-0 z-20 px-4 pt-4 lg:px-8">
          <div className="glass flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary/80 text-foreground lg:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open navigation"
              >
                <Menu className="h-4 w-4" />
              </button>
              <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Know Yourself → Understand Your Gap → Build Your Path → Track Growth → Simulate Your Future</span>
              </div>
              <span className="text-sm font-semibold sm:hidden">TwinAI</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/mentor"
                className="hidden rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 sm:block"
              >
                Talk to your Twin
              </Link>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-violet/15 font-display text-sm font-semibold text-violet">
                {profile.name.slice(0, 1) || "?"}
              </span>
            </div>
          </div>
        </header>

        <main className="relative px-4 py-8 lg:px-8">
          <div className="mx-auto w-full max-w-6xl space-y-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
