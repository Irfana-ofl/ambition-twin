import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { askGateway } from "./twin-ai.server";

const AskSchema = z.object({
  question: z.string().min(1).max(2000),
  context: z.string().min(1).max(12000),
  history: z
    .array(z.object({ role: z.enum(["user", "twin"]), content: z.string().max(4000) }))
    .max(12)
    .default([]),
});

export const askTwin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AskSchema.parse(input))
  .handler(async ({ data }) => {
    try {
      const answer = await askGateway(data);
      if (!answer) return { ok: false as const, reason: "unavailable" as const };
      return { ok: true as const, answer };
    } catch (error) {
      const status = (error as { status?: number }).status;
      console.error("askTwin failed", error);
      return {
        ok: false as const,
        reason: status === 402 ? ("credits" as const) : status === 429 ? ("rate_limit" as const) : ("error" as const),
      };
    }
  });
