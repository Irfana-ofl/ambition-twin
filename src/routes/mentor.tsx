import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/twin/app-shell";
import { GlassCard, Pill, SectionHeader, ThinkingIndicator } from "@/components/twin/glass";
import { askTwin } from "@/lib/twin-ai.functions";
import { buildTwinContext, engineAnswer } from "@/lib/twin-engine";
import { useTwin } from "@/lib/twin-store";
import type { ChatMessage, TwinAnswer } from "@/lib/twin-types";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI Mentor — TwinAI" },
      { name: "description", content: "Ask your digital twin anything about your career. Every answer is grounded in your real skills, projects and goals." },
      { property: "og:title", content: "AI Mentor — TwinAI" },
      { property: "og:description", content: "Context-aware career mentoring grounded in your own profile." },
    ],
  }),
  component: MentorPage,
});

const SUGGESTIONS = [
  "What should I learn next?",
  "Am I ready for an AI internship?",
  "Which project should I build next?",
  "How do I close my biggest skill gap?",
];

function MentorPage() {
  const { profile, chat, setChat, addMemory } = useTwin();
  const ask = useServerFn(askTwin);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  const send = async (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setInput("");
    setBusy(true);
    const userMsg: ChatMessage = { id: `u-${Date.now()}`, role: "user", content: q, at: new Date().toISOString() };
    const history = [...chat, userMsg];
    setChat(history);

    let structured: TwinAnswer;
    try {
      const res = await ask({
        data: {
          question: q,
          context: buildTwinContext(profile),
          history: chat.slice(-8).map((m) => ({ role: m.role, content: m.content })),
        },
      });
      if (res.ok) {
        structured = res.answer;
      } else {
        const fb = engineAnswer(profile, q);
        structured = { ...fb, source: "engine" };
        toast.info(
          res.reason === "credits"
            ? "AI credits unavailable — answering from your twin's own reasoning engine."
            : "Live AI unavailable — answering from your twin's own reasoning engine.",
        );
      }
    } catch {
      const fb = engineAnswer(profile, q);
      structured = { ...fb, source: "engine" };
      toast.error("Couldn't reach the AI service — using your twin's local reasoning.");
    }

    setChat([
      ...history,
      {
        id: `t-${Date.now()}`,
        role: "twin",
        content: structured.recommendation,
        at: new Date().toISOString(),
        structured,
      },
    ]);
    addMemory(`Asked the twin: "${q}"`, "conversation");
    setBusy(false);
  };

  return (
    <AppShell>
      <SectionHeader
        eyebrow="Contextual mentor"
        title="Talk to your twin"
        subtitle={`It already knows your ${profile.skills.length} skills, ${profile.projects.length} projects and your goal of becoming a ${profile.targetRole}.`}
      />

      <ReasoningRecap />

      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s)}
            className="rounded-full bg-secondary/70 px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {!chat.length ? (
          <GlassCard>
            <p className="text-sm text-muted-foreground">
              Ask anything — your twin answers with a recommendation, the reasoning behind it, the gap it addresses and concrete next steps.
            </p>
          </GlassCard>
        ) : null}

        {chat.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-3xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground">
                {m.content}
              </div>
            </div>
          ) : (
            <GlassCard key={m.id} lift={false}>
              <div className="flex flex-wrap items-center gap-2">
                <Pill tone="primary">Recommendation</Pill>
                {m.structured ? <Pill tone={m.structured.priority === "High" ? "warning" : "neutral"}>{m.structured.priority} priority</Pill> : null}
                {m.structured ? <Pill tone="cyan">{m.structured.source === "ai" ? "Live AI" : "Twin engine"}</Pill> : null}
              </div>
              <p className="mt-3 text-base font-semibold text-foreground">{m.content}</p>
              {m.structured ? (
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Why this</p>
                    <p className="mt-1 text-foreground">{m.structured.why}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Gap addressed</p>
                    <p className="mt-1 text-foreground">{m.structured.gap}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Do next</p>
                    <ul className="mt-1 space-y-1.5">
                      {m.structured.action.map((a) => (
                        <li key={a} className="flex items-start gap-2 text-foreground">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet" /> {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : null}
            </GlassCard>
          ),
        )}

        {busy ? (
          <GlassCard lift={false}>
            <ThinkingIndicator />
          </GlassCard>
        ) : null}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="glass sticky bottom-4 flex items-center gap-3 rounded-2xl p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask your twin about skills, projects, internships…"
          className="flex-1 bg-transparent px-2 text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:opacity-50"
          aria-label="Send"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </AppShell>
  );
}
