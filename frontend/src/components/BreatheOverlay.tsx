import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const PATTERNS = {
  calm44:   { label: "Calm 4–4",      inhale: 4,                exhale: 4 },
  box4:     { label: "Box 4–4–4–4",   inhale: 4, hold1: 4,      exhale: 4, hold2: 4 },
  relax478: { label: "Relax 4–7–8",   inhale: 4, hold1: 7,      exhale: 8 },
  slow55:   { label: "Slow 5–5",      inhale: 5,                exhale: 5 },
} as const;

export type PatternKey = keyof typeof PATTERNS;

export default function BreatheOverlay({
  patternKey = "calm44",
  onClose,
  onPattern,
}: {
  patternKey?: PatternKey;
  onClose: () => void;
  onPattern: (k: PatternKey) => void;
}) {
  const p = PATTERNS[patternKey];

  const timeline = useMemo(() => {
    const h1 = ("hold1" in p ? p.hold1 : 0) ?? 0;
    const h2 = ("hold2" in p ? p.hold2 : 0) ?? 0;
    const total = p.inhale + h1 + p.exhale + h2;

    return {
      duration: total,
      times: [0, p.inhale / total, (p.inhale + h1) / total, (p.inhale + h1 + p.exhale) / total, 1],
      scales: [1, 1.18, 1.18, 0.84, 0.84],
    };
  }, [p]);

  return (
    <div className="fixed inset-0 z-[80] grid place-items-center p-6" role="dialog" aria-modal="true">
      <button
        className="absolute inset-0 bg-[radial-gradient(60%_80%_at_50%_10%,rgba(20,24,44,.9),rgba(3,7,18,.95))]"
        onClick={onClose}
        aria-label="Close"
      />
      <div className="relative z-10 w-full max-w-xl text-center text-white">
        <div className="mb-6 flex flex-wrap justify-center gap-2">
          {(Object.keys(PATTERNS) as PatternKey[]).map((k) => (
            <button
              key={k}
              onClick={() => onPattern(k)}
              className={`rounded-full px-4 py-2 text-sm backdrop-blur-md border ${
                k === patternKey ? "bg-white/20 border-white/50" : "bg-white/10 border-white/20 hover:bg-white/15"
              }`}
            >
              {PATTERNS[k].label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mb-6 grid place-items-center">
          <motion.div
            key={patternKey}
            initial={{ scale: 0.84, opacity: 0.9 }}
            animate={{ scale: timeline.scales, opacity: [0.9, 1, 1, 0.9, 0.9] }}
            transition={{ duration: timeline.duration, times: timeline.times, ease: "easeInOut", repeat: Infinity }}
            className="h-44 w-44 rounded-full bg-white/20 shadow-[0_0_60px_rgba(255,255,255,0.18)] backdrop-blur-md"
          />
        </div>

        <p className="text-sm text-white/85">
          Inhale • {"hold1" in p ? "Hold • " : ""}Exhale {"hold2" in p ? "• Hold" : ""}
        </p>

        <button
          onClick={onClose}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/50 px-5 py-2 hover:bg-white/10"
        >
          <ArrowLeft className="h-4 w-4" /> Back to the question
        </button>
      </div>
    </div>
  );
}
