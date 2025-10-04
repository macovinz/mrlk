// src/components/MissyFeelingsPage.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves, Zap, CloudRain, CloudFog, SquareSlash, CircleSlash,
  Flag, Feather, Sparkles, Sun, X, HelpCircle
} from "lucide-react";
import { HAIKUS } from "@/data/missyHaikus";
import type { MoodKey } from "@/data/missyHaikus";
import HaikuModal from "@/components/HaikuModal";
import BreatheOverlay, { type PatternKey } from "@/components/BreatheOverlay";

/* ----------------------------- utilities ----------------------------- */
const pickRandom = (arr: string[], not?: string) => {
  if (!arr.length) return "";
  if (arr.length === 1) return arr[0];
  let choice = arr[Math.floor(Math.random() * arr.length)];
  if (not && arr.length > 1) {
    let guard = 0;
    while (choice === not && guard++ < 6) {
      choice = arr[Math.floor(Math.random() * arr.length)];
    }
  }
  return choice;
};

const moodFromQuery = (): MoodKey | null => {
  try {
    const params = new URLSearchParams(window.location.search);
    const q = (params.get("mood") || "").trim();
    return q as MoodKey;
  } catch {
    return null;
  }
};

// Word-by-word, letter-by-letter reveal
function WordsReveal({
  text,
  className = "",
  wordDelay = 0.14,   // gap between words
  letterDelay = 0.035 // gap between letters in a word
}: {
  text: string;
  className?: string;
  wordDelay?: number;
  letterDelay?: number;
}) {
  const words = text.split(" ");
  return (
    <span className={className} aria-label={text}>
      {words.map((word, wi) => (
        <motion.span
          key={`w-${wi}-${word}`}
          className="inline-block align-baseline"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: wi * wordDelay, ease: [0.2, 0.65, 0.3, 1] }}
          style={{ marginRight: "0.25ch" }}
        >
          {/* letters inside each word */}
          {word.split("").map((ch, li) => (
            <motion.span
              key={`w-${wi}-l-${li}`}
              className="inline-block will-change-transform"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.22,
                delay: wi * wordDelay + li * letterDelay,
                ease: [0.2, 0.65, 0.3, 1]
              }}
            >
              {ch}
            </motion.span>
          ))}
        </motion.span>
      ))}
    </span>
  );
}


/* --------------------------------- page --------------------------------- */
type MoodOption = { key: MoodKey | "unknown"; label: string; Icon: React.ElementType; };

const MOODS: MoodOption[] = [
  { key: "unknown", label: "I don’t know.", Icon: HelpCircle },
  { key: "overwhelmed", label: "Overwhelmed", Icon: Waves },
  { key: "stressed", label: "Stressed", Icon: Zap },
  { key: "sad", label: "Sad", Icon: CloudRain },
  { key: "miserable", label: "Miserable", Icon: CloudFog },
  { key: "frustrated", label: "Frustrated", Icon: SquareSlash },
  { key: "stuck", label: "Stuck", Icon: CircleSlash },
  { key: "wantToQuit", label: "Want to Quit", Icon: Flag },
  { key: "unappreciated", label: "Unappreciated", Icon: Feather },
  { key: "lowEsteem", label: "Low Self-Esteem", Icon: Sparkles },
  { key: "okay", label: "A Bit Okay", Icon: Sun },
  
];

export default function MissyFeelingsPage() {
  const [selected, setSelected] = useState<MoodKey | "unknown" | null>(null);
  const [haiku, setHaiku] = useState<string>("");
  const [showHaiku, setShowHaiku] = useState(false);
  const [showBreathing, setShowBreathing] = useState(false);
  const [patternKey, setPatternKey] = useState<PatternKey>("calm44");

  useEffect(() => { document.title = "Listen to your body — Stories at Sunset"; }, []);

  useEffect(() => {
    const qMood = moodFromQuery();
    const stored = (localStorage.getItem("missy:lastMood") || "") as MoodKey;
    const initial = (qMood || stored) as MoodKey | null;
    if (initial && HAIKUS[initial]) setSelected(initial);
  }, []);

  const onPickMood = (mood: MoodKey | "unknown") => {
    setSelected(mood);
    if (mood === "unknown") {
      setShowBreathing(true);
      setShowHaiku(false);
      return;
    }
    const next = pickRandom(HAIKUS[mood], haiku);
    setHaiku(next);
    setShowHaiku(true);
    try {
      localStorage.setItem("missy:lastMood", mood);
      const url = new URL(window.location.href);
      url.searchParams.set("mood", mood);
      window.history.replaceState({}, "", url);
    } catch {}
  };

  const headline = "How are you feeling, Missy?";

  return (
    <section
      className="relative min-h-screen pt-10"
      style={{
        /* evening gradient */
        background: "linear-gradient(to bottom, #0b1d3a 0%, #173a6d 25%, #a0627a 50%, #ff784e 75%, #2c0a00 100%)",
      }}
    >
      {/* top nav row */}
<header className="relative z-10 text-white pt-10">
  <div className="mx-auto flex max-w-6xl items-end justify-between px-6 pt-5 md:pt-8">
    <p className="text-xs md:text-sm font-semibold tracking-wide">
      Just checking in, Cabbage.
    </p>
    <a href="/gift" className="btn btn-outline btn-sm inline-flex items-center gap-2">
      <span>Quit</span>
      <X className="h-3.5 w-3.5" />
    </a>
  </div>
</header>


      {/* main content */}
      <main className="relative mx-auto max-w-6xl px-6 pt-28 md:pt-32 pb-20 md:pb-28 text-white">
        <h1 className="text-pretty text-5xl md:text-7xl font-display font-semibold tracking-tight">
          <WordsReveal text={headline} />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-3 max-w-4xl text-base md:text-1xl text-white/90"
        >
          I know how valuable your time is but let's do a "quickie", gentle check-in. Choose what fits right now.
        </motion.p>

        {/* Mood grid — icon-only buttons with tiny labels */}
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {MOODS.map((m) => {
            const active = selected === m.key;
            return (
              <div key={m.key} className="flex flex-col items-center">
                <button
                  className={[
                    "grid place-items-center h-16 w-16 rounded-2xl border backdrop-blur-md transition",
                    active
                      ? "border-white/60 bg-white/20 ring-2 ring-white/70"
                      : "border-white/25 bg-white/10 hover:bg-white/15"
                  ].join(" ")}
                  aria-pressed={active}
                  aria-label={m.label}
                  title={m.label}
                  onClick={() => onPickMood(m.key)}
                >
                  <m.Icon className="h-7 w-7 text-white" aria-hidden />
                </button>
                <span className="mt-2 text-xs text-white/85 text-center leading-4">{m.label}</span>
              </div>
            );
          })}
        </div>
      </main>

      {/* Haiku Modal */}
      <AnimatePresence>
        {showHaiku && haiku && selected && selected !== "unknown" && (
          <HaikuModal
            haiku={haiku}
            onAnother={() => selected && setHaiku(pickRandom(HAIKUS[selected], haiku))}
            onCopy={async () => { try { await navigator.clipboard.writeText(haiku); } catch {} }}
            onClose={() => setShowHaiku(false)}
          />
        )}
      </AnimatePresence>

      {/* Breathing overlay */}
      <AnimatePresence>
        {showBreathing && (
          <BreatheOverlay
            patternKey={patternKey}
            onPattern={(k) => setPatternKey(k)}
            onClose={() => setShowBreathing(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
