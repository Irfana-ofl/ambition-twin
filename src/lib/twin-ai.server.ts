import type { TwinAnswer } from "./twin-types";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are "TwinAI", a student's personal AI Digital Twin and career decision engine.

You ALWAYS reason from the structured student context you are given: their skills and levels, projects, experience, interests, target role, engine-computed scores, ranked skill gaps, twin memory and progress.

Hard rules:
- Never give generic motivational advice or generic "learn the basics" answers.
- Always reference the student's actual skills, percentages, projects and gaps by name.
- Always prioritise by career relevance to their target role.
- Be concrete, specific and time-bounded. Prefer numbers, weeks and named projects.
- Simple, warm, professional language. No emojis. No markdown headings.
- You are a recommendation system, not a guarantee of employment.

Reply with ONLY a JSON object, no code fences, using exactly this shape:
{"recommendation": string, "why": string, "gap": string, "action": [string, string, string], "priority": "High" | "Medium" | "Low"}

- recommendation: the clear answer in 1-2 sentences.
- why: reasoning grounded in this specific student's profile (mention their real skills/percentages/projects).
- gap: the missing skills relevant to the question, with current vs required levels; say "No blocking gap for this question." if none.
- action: 2-4 concrete next steps, each doable given their available study hours per day.
- priority: urgency of acting on this now.`;

export type AskArgs = {
  question: string;
  context: string;
  history: { role: "user" | "twin"; content: string }[];
};

export async function askGateway({ question, context, history }: AskArgs): Promise<TwinAnswer | null> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return null;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "system", content: `STUDENT CONTEXT (authoritative — use it):\n${context}` },
    ...history.slice(-6).map((m) => ({
      role: m.role === "twin" ? ("assistant" as const) : ("user" as const),
      content: m.content,
    })),
    { role: "user", content: question },
  ];

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages,
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw Object.assign(new Error(`AI gateway error ${res.status}: ${detail.slice(0, 300)}`), {
      status: res.status,
    });
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const raw = data.choices?.[0]?.message?.content ?? "";
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    const parsed = JSON.parse(cleaned) as Partial<TwinAnswer>;
    if (!parsed.recommendation) return null;
    return {
      recommendation: String(parsed.recommendation),
      why: String(parsed.why ?? ""),
      gap: String(parsed.gap ?? ""),
      action: Array.isArray(parsed.action) ? parsed.action.map(String) : [],
      priority: (parsed.priority === "High" || parsed.priority === "Low" ? parsed.priority : "Medium") as TwinAnswer["priority"],
      source: "ai",
    };
  } catch {
    return null;
  }
}

const ROADMAP_PROMPT = `You are the planning engine of "TwinAI", a student's personal AI digital twin.

You are given a single student's authoritative profile: skills with percentages, projects, experience, interests, target role, timeline, daily study hours and engine-computed skill gaps.

Produce a phased learning roadmap that is specific to THIS student. Hard rules:
- Never generic. Every task must name a real skill, project or gap from their profile.
- Order phases so each one unblocks the next, weighted by career relevance to their target role.
- Fit the total plan inside their stated timeline and daily study hours.
- Between 4 and 5 phases, each with 3 or 4 tasks. No emojis, no markdown.

Reply with ONLY a JSON object, no code fences, exactly:
{"phases":[{"title":string,"subtitle":string,"weeks":string,"tasks":[{"label":string,"skill":string,"outcome":string}]}]}`;

export type AiPhase = {
  id: string;
  title: string;
  subtitle: string;
  weeks: string;
  tasks: { id: string; label: string; skill: string; outcome: string }[];
};

export async function roadmapGateway(context: string): Promise<AiPhase[] | null> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return null;

  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "google/gemini-3.7-flash",
      messages: [
        { role: "system", content: ROADMAP_PROMPT },
        { role: "user", content: `STUDENT PROFILE (authoritative):\n${context}\n\nGenerate the roadmap as JSON.` },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw Object.assign(new Error(`AI gateway error ${res.status}: ${detail.slice(0, 300)}`), { status: res.status });
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = (data.choices?.[0]?.message?.content ?? "").replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    const parsed = JSON.parse(raw) as {
      phases?: { title?: string; subtitle?: string; weeks?: string; tasks?: { label?: string; skill?: string; outcome?: string }[] }[];
    };
    const phases = (parsed.phases ?? [])
      .filter((p) => p.title && Array.isArray(p.tasks) && p.tasks.length)
      .slice(0, 6)
      .map((p, i) => ({
        id: `ai-p${i + 1}`,
        title: String(p.title),
        subtitle: String(p.subtitle ?? ""),
        weeks: String(p.weeks ?? `Phase ${i + 1}`),
        tasks: (p.tasks ?? [])
          .filter((t) => t.label)
          .slice(0, 5)
          .map((t, j) => ({
            id: `ai-p${i + 1}t${j + 1}`,
            label: String(t.label),
            skill: String(t.skill ?? ""),
            outcome: String(t.outcome ?? ""),
          })),
      }))
      .filter((p) => p.tasks.length);
    return phases.length >= 2 ? phases : null;
  } catch {
    return null;
  }
}
