import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function TwinOrb({
  size = 220,
  initials = "AI",
  className,
}: {
  size?: number;
  initials?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative flex items-center justify-center", className)} style={{ width: size, height: size }}>
      <div
        className="absolute inset-0 rounded-full opacity-70 blur-2xl"
        style={{
          background:
            "conic-gradient(from 0deg, oklch(0.585 0.203 277.1 / 0.55), oklch(0.627 0.229 303.5 / 0.5), oklch(0.715 0.135 215.5 / 0.5), oklch(0.585 0.203 277.1 / 0.55))",
        }}
      />
      <motion.div
        className="absolute inset-[6%] rounded-full border border-primary/25"
        animate={{ rotate: 360 }}
        transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-cyan shadow-glow" />
      </motion.div>
      <motion.div
        className="absolute inset-[16%] rounded-full border border-violet/25"
        animate={{ rotate: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <span className="absolute left-0 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-violet" />
      </motion.div>
      <motion.div
        animate={{ scale: [1, 1.05, 1], opacity: [0.92, 1, 0.92] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="glass relative flex items-center justify-center rounded-full"
        style={{ width: size * 0.56, height: size * 0.56 }}
      >
        <div
          className="absolute inset-[10%] rounded-full opacity-80"
          style={{
            background:
              "radial-gradient(circle at 32% 28%, oklch(1 0 0 / 0.95), oklch(0.585 0.203 277.1 / 0.55) 55%, oklch(0.627 0.229 303.5 / 0.65) 100%)",
          }}
        />
        <span className="relative font-display text-xl font-semibold text-primary-foreground drop-shadow">
          {initials}
        </span>
      </motion.div>
    </div>
  );
}

export function FloatingLabel({
  label,
  className,
  delay = 0,
}: {
  label: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay }}
      className={cn("absolute", className)}
    >
      <div
        className="glass rounded-2xl px-4 py-2.5 text-xs font-semibold text-foreground shadow-glass"
        style={{ animation: `float ${8 + delay * 2}s ease-in-out infinite`, animationDelay: `${delay}s` }}
      >
        {label}
      </div>
    </motion.div>
  );
}
