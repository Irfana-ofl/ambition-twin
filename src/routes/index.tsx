import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, BrainCircuit, Compass, Gauge, Layers, Play, Sparkles } from "lucide-react";

import { GlassCard, Pill } from "@/components/twin/glass";
import { useTwin } from "@/lib/twin-store";
import { FloatingLabel, TwinOrb } from "@/components/twin/twin-orb";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TwinAI — Meet Your Digital Twin" },
      {
        name: "description",
        content:
          "An AI that understands where you are, where you want to go, and what you should do next. Build your personal AI digital twin for your career.",
      },
      { property: "og:title", content: "TwinAI — Meet Your Digital Twin" },
      {
        property: "og:description",
        content:
          "Skill intelligence, gap analysis, personalized roadmaps and future career simulation — powered by your own AI digital twin.",
      },
    ],
  }),
  component: Landing,
});

const JOURNEY = [
  { title: "Know Yourself", body: "Your twin absorbs your education, skills, projects and goals." },
  { title: "Understand Your Gap", body: "It compares you against real target-role requirements." },
  { title: "Build Your Path", body: "A roadmap and 30-day plan sized to your daily study hours." },
  { title: "Track Your Growth", body: "Every completed task recalculates your readiness." },
  { title: "Simulate Your Future", body: "See which career paths you're closest to, and why." },
];

const FEATURES = [
  { icon: BrainCircuit, title: "AI Memory", body: "Your twin remembers your skills, goals, progress and past decisions." },
  { icon: Layers, title: "Decision Engine", body: "Profile + memory + goal + gaps → one prioritised recommendation." },
  { icon: Gauge, title: "Career Readiness", body: "A weighted score across skills, projects, experience and consistency." },
  { icon: Compass, title: "Future Simulation", body: "Compare readiness across AI, data and full-stack career paths." },
];

function Landing() {
  const { acknowledgeDemo } = useTwin();
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden />
      {[
        "left-[8%] top-[18%]",
        "left-[22%] top-[62%]",
        "right-[12%] top-[28%]",
        "right-[26%] top-[72%]",
        "left-[46%] top-[10%]",
      ].map((pos, i) => (
        <span
          key={pos}
          className={`pointer-events-none absolute h-1.5 w-1.5 rounded-full bg-primary/50 ${pos}`}
          style={{ animation: `float ${7 + i}s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }}
          aria-hidden
        />
      ))}

      <header className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/12">
            <Sparkles className="h-4 w-4 text-primary" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            Twin<span className="text-gradient">AI</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard"
            onClick={acknowledgeDemo}
            className="rounded-xl px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
          >
            Explore Demo
          </Link>
          <Link
            to="/onboarding"
            className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Get started
          </Link>
        </div>
      </header>

      <section className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-5 pb-16 pt-8 lg:grid-cols-[1.05fr_1fr] lg:pt-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-7"
        >
          <Pill tone="primary">
            <Sparkles className="h-3 w-3" /> Personal AI career intelligence
          </Pill>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Meet Your <span className="text-gradient">Digital Twin.</span>
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            An AI that understands where you are, where you want to go, and what you should do next — grounded in your real
            skills, projects and goals instead of generic advice.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/onboarding"
              className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-glow transition-transform hover:-translate-y-0.5"
            >
              Create My Digital Twin
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/dashboard"
              onClick={acknowledgeDemo}
              className="glass glass-lift inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold text-foreground"
            >
              <Play className="h-4 w-4 text-primary" /> Explore Demo
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-3 pt-2 text-sm text-muted-foreground">
            <span>
              <strong className="font-display text-foreground">7</strong> target roles modelled
            </span>
            <span>
              <strong className="font-display text-foreground">30-day</strong> personalised plans
            </span>
            <span>
              <strong className="font-display text-foreground">Live</strong> readiness scoring
            </span>
          </div>
        </motion.div>

        <div className="relative mx-auto flex h-[440px] w-full max-w-[520px] items-center justify-center">
          <TwinOrb size={280} initials="AJ" />
          <FloatingLabel label="Skill Intelligence" className="left-0 top-8" delay={0.1} />
          <FloatingLabel label="Career Readiness" className="right-0 top-20" delay={0.4} />
          <FloatingLabel label="Personal Roadmap" className="left-2 bottom-16" delay={0.7} />
          <FloatingLabel label="AI Memory" className="right-4 bottom-24" delay={1} />
          <FloatingLabel label="Future Simulation" className="left-1/2 -translate-x-1/2 bottom-2" delay={1.3} />
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-5 pb-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.24em] text-primary">Your journey</p>
        <h2 className="mt-3 text-center font-display text-3xl font-semibold md:text-4xl">
          Five moves from student to hireable
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-3 lg:grid-cols-5">
          {JOURNEY.map((step, i) => (
            <GlassCard key={step.title} delay={i * 0.07} className="p-5">
              <span className="font-display text-xs font-semibold text-primary">0{i + 1}</span>
              <h3 className="mt-2 text-base font-semibold">{step.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      <section className="relative mx-auto w-full max-w-6xl px-5 pb-24">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ icon: Icon, title, body }, i) => (
            <GlassCard key={title} delay={i * 0.07}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/12">
                <Icon className="h-5 w-5 text-primary" />
              </span>
              <h3 className="mt-4 text-base font-semibold">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </GlassCard>
          ))}
        </div>
        <GlassCard className="mt-8 flex flex-col items-center gap-5 p-10 text-center">
          <h2 className="font-display text-3xl font-semibold">Your future is being built one decision at a time.</h2>
          <p className="max-w-xl text-sm text-muted-foreground">
            TwinAI is a recommendation and simulation system for career planning — not a guarantee of employment.
          </p>
          <Link
            to="/onboarding"
            className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Create My Digital Twin <ArrowRight className="h-4 w-4" />
          </Link>
        </GlassCard>
      </section>
    </div>
  );
}
