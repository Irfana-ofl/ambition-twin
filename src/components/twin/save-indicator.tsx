import { AnimatePresence, motion } from "framer-motion";
import { Check, Cloud, Loader2 } from "lucide-react";

import { useTwin } from "@/lib/twin-store";

/** Small autosave badge: shows "Saving…" while a write is pending, then "Saved". */
export function SaveIndicator({ className }: { className?: string }) {
  const { saveState, lastSavedAt } = useTwin();

  const time = lastSavedAt
    ? new Date(lastSavedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div className={className} aria-live="polite">
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={saveState}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className="flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1.5 text-xs font-semibold text-muted-foreground"
        >
          {saveState === "saving" ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> Saving…
            </>
          ) : saveState === "saved" ? (
            <>
              <Check className="h-3.5 w-3.5 text-success" />
              <span className="text-success">Saved</span>
              {time ? <span className="hidden sm:inline">· {time}</span> : null}
            </>
          ) : (
            <>
              <Cloud className="h-3.5 w-3.5" /> Autosave on
            </>
          )}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}
