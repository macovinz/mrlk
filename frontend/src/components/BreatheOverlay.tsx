// src/components/BreatheOverlay.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useAnimationControls } from "framer-motion";

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

  // ordered phases for the current pattern
  const phases = useMemo(() => {
    const p = PATTERNS[patternKey] as any;
    const arr: Array<{ key: "inhale" | "hold1" | "exhale" | "hold2"; seconds: number }> = [];
    if (p.inhale) arr.push({ key: "inhale", seconds: p.inhale });
    if (p.hold1) arr.push({ key: "hold1", seconds: p.hold1 });
    if (p.exhale) arr.push({ key: "exhale", seconds: p.exhale });
    if (p.hold2) arr.push({ key: "hold2", seconds: p.hold2 });
    return arr;
  }, [patternKey]);

  // loop timer
  useEffect(() => {
    setPhase("inhale");
    setTick(0);
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [patternKey]);

  // compute phase from tick
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

  /* ---------------- SUN ANIMATION (freeze on holds) ---------------- */

  const core = useAnimationControls();
  const rays = useAnimationControls();

  const SCALE_INHALED = 1.12;
  const SCALE_EXHALED = 0.90;
  const ease = [0.42, 0.0, 0.2, 1] as const; // calm

  // continuous angle so rays never snap when resuming
  const angleRef = useRef(0);
  const rayDegPerSec = 360 / Math.max(12, secondsTotal(patternKey) * 2); // slower for longer patterns

  // drive the core & rays per phase (holds = perfectly still)
  useEffect(() => {
    const p = PATTERNS[patternKey] as any;
    const seconds =
      phase === "inhale" ? p.inhale :
      phase === "exhale" ? p.exhale :
      phase === "hold1" ? (p.hold1 ?? 0) :
      (p.hold2 ?? 0);

    if (phase === "inhale") {
      core.start({ scale: SCALE_INHALED, transition: { duration: seconds, ease } });
      angleRef.current += rayDegPerSec * seconds;
      rays.start({ rotate: angleRef.current, transition: { duration: seconds, ease: "linear" } });
    } else if (phase === "exhale") {
      core.start({ scale: SCALE_EXHALED, transition: { duration: seconds, ease } });
      angleRef.current += rayDegPerSec * seconds;
      rays.start({ rotate: angleRef.current, transition: { duration: seconds, ease: "linear" } });
    } else {
      // HOLD: absolutely still
      core.stop();
      rays.stop();
      const targetScale = phase === "hold1" ? SCALE_INHALED : SCALE_EXHALED;
      core.set({ scale: targetScale });
      rays.set({ rotate: angleRef.current });
    }
  }, [phase, patternKey]); // core/rays are stable refs

  const label = phase === "inhale" ? "Inhale" : phase === "exhale" ? "Exhale" : "Hold";

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
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] grid place-items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        {/* content (size based on content) */}
        <motion.div
          role="dialog"
          aria-modal="true"
          className="relative z-10 rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-6 sm:px-8 sm:py-7 shadow-[0_20px_80px_rgba(0,0,0,.35)]"
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -8, scale: 0.98 }}
        >
          <h2 className="text-center text-2xl sm:text-3xl font-display font-semibold text-white">
            Breathe, baby.
          </h2>

          {/* pattern chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {([
              { k: "calm44", label: "Calm 4–4" },
              { k: "box4444", label: "Box 4–4–4–4" },
              { k: "relax478", label: "Relax 4–7–8" },
              { k: "slow55", label: "Slow 5–5" },
            ] as const).map((opt) => (
              <button
                key={opt.k}
                onClick={() => onPattern(opt.k as PatternKey)}
                className={[
                  "rounded-full px-3.5 py-1.5 text-sm font-semibold transition backdrop-blur-md border",
                  patternKey === opt.k
                    ? "bg-white/25 border-white/60 text-white"
                    : "bg-white/10 border-white/30 text-white/90 hover:bg-white/15",
                ].join(" ")}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* sun */}
          <div className="mt-6 flex flex-col items-center">
            <div className="relative">
              {/* rays */}
              <motion.div
                aria-hidden
                className="absolute inset-0"
                animate={rays}
                initial={{ rotate: 0 }}
                style={{ filter: "blur(0.5px)" }}
              >
                <div
                  className="h-40 w-40 rounded-full"
                  style={{
                    background:
                      "conic-gradient(from 0deg, rgba(255,215,170,.22), rgba(255,215,170,0) 30deg, rgba(255,215,170,.22) 60deg, rgba(255,215,170,0) 90deg, rgba(255,215,170,.22) 120deg, rgba(255,215,170,0) 150deg, rgba(255,215,170,.22) 180deg, rgba(255,215,170,0) 210deg, rgba(255,215,170,.22) 240deg, rgba(255,215,170,0) 270deg, rgba(255,215,170,.22) 300deg, rgba(255,215,170,0) 330deg, rgba(255,215,170,.22) 360deg)",
                    maskImage: "radial-gradient(circle at 50% 50%, black 60%, transparent 62%)",
                  }}
                />
              </motion.div>

              {/* core */}
              <motion.div
                className="grid place-items-center h-40 w-40 rounded-full"
                animate={core}
                initial={{ scale: SCALE_EXHALED }}
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(255,236,200,.95), rgba(255,205,140,.85) 45%, rgba(255,142,96,.65) 67%, rgba(244,112,74,.45) 78%, rgba(255,116,78,.22) 90%)",
                  boxShadow: "0 30px 90px rgba(255,156,100,.45), 0 0 40px rgba(255,196,140,.35) inset",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              />
            </div>

            <p className="mt-5 text-center text-base sm:text-lg text-white/95">{label}…</p>
          </div>

          <p className="mt-5 max-w-md text-center text-sm text-white/85">{benefitCopy}</p>

          <div className="mt-6 flex justify-center">
            <button onClick={onClose} className="btn btn-outline">
              Back to the question
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
