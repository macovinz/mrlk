import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

// Keep your existing type; example:
export type PatternKey = "calm44" | "box4444" | "relax478" | "slow55";

const PATTERNS: Record<
  PatternKey,
  | { label: "Calm 4–4"; inhale: number; exhale: number }
  | { label: "Box 4–4–4–4"; inhale: number; hold1: number; exhale: number; hold2: number }
  | { label: "Relax 4–7–8"; inhale: number; hold1: number; exhale: number }
  | { label: "Slow 5–5"; inhale: number; exhale: number }
> = {
  calm44: { label: "Calm 4–4", inhale: 4, exhale: 4 },
  box4444: { label: "Box 4–4–4–4", inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  relax478: { label: "Relax 4–7–8", inhale: 4, hold1: 7, exhale: 8 },
  slow55: { label: "Slow 5–5", inhale: 5, exhale: 5 },
};

function secondsTotal(k: PatternKey) {
  const p = PATTERNS[k] as any;
  return (p.inhale ?? 0) + (p.hold1 ?? 0) + (p.exhale ?? 0) + (p.hold2 ?? 0);
}

export default function BreatheOverlay({
  patternKey,
  onPattern,
  onClose,
}: {
  patternKey: PatternKey;
  onPattern: (k: PatternKey) => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale");
  const [tick, setTick] = useState(0);

  // Determine current phase durations
  const phases = useMemo(() => {
    const p = PATTERNS[patternKey] as any;
    const arr: Array<{ key: "inhale" | "hold1" | "exhale" | "hold2"; seconds: number }> = [];
    if (p.inhale) arr.push({ key: "inhale", seconds: p.inhale });
    if (p.hold1) arr.push({ key: "hold1", seconds: p.hold1 });
    if (p.exhale) arr.push({ key: "exhale", seconds: p.exhale });
    if (p.hold2) arr.push({ key: "hold2", seconds: p.hold2 });
    return arr;
  }, [patternKey]);

  // Loop timer that drives phase changes
  useEffect(() => {
    setPhase("inhale");
    setTick(0);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [patternKey]);

  useEffect(() => {
    if (!phases.length) return;
    let remaining = tick;
    for (let i = 0; i < phases.length; i++) {
      const seg = phases[i];
      if (remaining < seg.seconds) {
        setPhase(seg.key);
        return;
      }
      remaining -= seg.seconds;
    }
    // restart cycle
    setTick(0);
    setPhase(phases[0].key);
  }, [tick, phases]);

  // SUN ANIMATION
  // Scale target by phase (smooth loop)

  // Rays rotate continuously for a calm loop; speed subtly varies with pattern total
  const total = secondsTotal(patternKey);
  const rayRotationDuration = Math.max(12, total * 2); // slower for longer patterns

  // Phase label display
  const label =
    phase === "inhale" ? "Inhale" :
    phase === "exhale" ? "Exhale" :
    "Hold";

  // Medical/benefit copy per pattern (brief + kind)
  const benefitCopy = useMemo(() => {
    switch (patternKey) {
      case "calm44":
        return "Steady 4–4 breathing can calm the autonomic nervous system, easing heart rate and tension.";
      case "box4444":
        return "Box breathing balances inhale, hold, exhale, helping focus and downshift stress responses.";
      case "relax478":
        return "The 4–7–8 rhythm lengthens exhale to activate the parasympathetic system and promote relaxation.";
      case "slow55":
        return "Slow, even breaths improve CO₂ tolerance and can reduce anxiety sensations in the body.";
      default:
        return "";
    }
  }, [patternKey]);

  return (
    <motion.div
      className="fixed inset-0 z-[90] grid place-items-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* dim backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* panel, width auto (content-based) */}
      <motion.div
        role="dialog"
        aria-modal="true"
        className="relative z-10 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-6 sm:px-8 sm:py-7 shadow-[0_20px_80px_rgba(0,0,0,.35)]"
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
      >
        {/* Heading */}
        <h2 className="text-center text-2xl sm:text-3xl font-display font-semibold text-white">
          Breathe, baby.
        </h2>

        {/* Pattern chooser */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {(
            [
              { k: "calm44", label: "Calm 4–4" },
              { k: "box4444", label: "Box 4–4–4–4" },
              { k: "relax478", label: "Relax 4–7–8" },
              { k: "slow55", label: "Slow 5–5" },
            ] as const
          ).map((opt) => (
            <button
              key={opt.k}
              onClick={() => onPattern(opt.k as PatternKey)}
              className={[
                "rounded-full px-3.5 py-1.5 text-sm font-semibold transition backdrop-blur-md border",
                patternKey === opt.k ? "bg-white/25 border-white/60 text-white" : "bg-white/10 border-white/30 text-white/90 hover:bg-white/15"
              ].join(" ")}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Sun orb */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative">
            {/* rays */}
            <motion.div
              aria-hidden
              className="absolute inset-0"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: rayRotationDuration }}
              style={{ filter: "blur(0.5px)" }}
            >
              <div
                className="h-40 w-40 rounded-full"
                style={{
                  // subtle radiant rays using a conic gradient mask
                  background:
                    "conic-gradient(from 0deg, rgba(255,215,170,.22), rgba(255,215,170,0) 30deg, rgba(255,215,170,.22) 60deg, rgba(255,215,170,0) 90deg, rgba(255,215,170,.22) 120deg, rgba(255,215,170,0) 150deg, rgba(255,215,170,.22) 180deg, rgba(255,215,170,0) 210deg, rgba(255,215,170,.22) 240deg, rgba(255,215,170,0) 270deg, rgba(255,215,170,.22) 300deg, rgba(255,215,170,0) 330deg, rgba(255,215,170,.22) 360deg)",
                  maskImage:
                    "radial-gradient(circle at 50% 50%, black 60%, transparent 62%)",
                }}
              />
            </motion.div>

            {/* sun core */}
            <motion.div
  className="grid place-items-center h-40 w-40 rounded-full"
  animate={{ scale: [0.9, 1.1, 0.9] }} // smooth inhale → exhale → inhale loop
  transition={{
    duration: secondsTotal(patternKey),  // full cycle = pattern length
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{
    background:
      "radial-gradient(circle at 50% 45%, rgba(255,236,200,.95), rgba(255,205,140,.85) 45%, rgba(255,142,96,.65) 67%, rgba(244,112,74,.45) 78%, rgba(255,116,78,.22) 90%)",
    boxShadow:
      "0 30px 90px rgba(255,156,100,.45), 0 0 40px rgba(255,196,140,.35) inset",
    border: "1px solid rgba(255,255,255,.25)",
  }}
/>

          </div>

          {/* phase label */}
          <p className="mt-5 text-center text-base sm:text-lg text-white/95">
            {label}…
          </p>
        </div>

        {/* Benefit copy */}
        <p className="mt-5 max-w-md text-center text-sm text-white/85">
          {benefitCopy}
        </p>

        {/* actions */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="btn btn-outline"
          >
            Back to the question
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
