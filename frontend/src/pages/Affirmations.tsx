// src/components/MissyFeelingsPage.tsx
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Waves,
  Zap,
  CloudRain,
  CloudFog,
  SquareSlash,
  CircleSlash,
  Flag,
  Feather,
  Sparkles,
  Sun,
  Copy,
  RefreshCw,
  ArrowLeft,
  X,
} from "lucide-react";
import { HAIKUS } from "@/data/missyHaikus";
import type { MoodKey } from "@/data/missyHaikus";

interface MoodOption {
  key: MoodKey;
  label: string;
  Icon: React.ElementType;
}

const MOODS: MoodOption[] = [
  { key: "overwhelmed", label: "Overwhelmed", Icon: Waves },
  { key: "stressed", label: "Stressed", Icon: Zap },
  { key: "sad", label: "Sad", Icon: CloudRain },
  { key: "miserable", label: "Miserable", Icon: CloudFog },
  { key: "frustrated", label: "Frustrated", Icon: SquareSlash },
  { key: "stuck", label: "Stuck", Icon: CircleSlash },
  { key: "wantToQuit", label: "Want to Quit", Icon: Flag },
  { key: "unappreciated", label: "Unappreciated", Icon: Feather },
  { key: "lowEsteem", label: "Low Self‑Esteem", Icon: Sparkles },
  { key: "okay", label: "A Bit Okay", Icon: Sun },
];

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
    const found = MOODS.find(m => m.key.toLowerCase() === q.toLowerCase());
    return found ? found.key : null;
  } catch {
    return null;
  }
};

export default function MissyFeelingsPage() {
  const [selected, setSelected] = useState<MoodKey | null>(null);
  const [haiku, setHaiku] = useState<string>("");

  useEffect(() => {
    const qMood = moodFromQuery();
    const stored = (localStorage.getItem("missy:lastMood") || "") as MoodKey;
    const initial = (qMood || stored) as MoodKey | null;
    if (initial && HAIKUS[initial]) {
      setSelected(initial);
      setHaiku(pickRandom(HAIKUS[initial]));
    }
  }, []);

  const onPickMood = (mood: MoodKey) => {
    setSelected(mood);
    const next = pickRandom(HAIKUS[mood], haiku);
    setHaiku(next);
    try {
      localStorage.setItem("missy:lastMood", mood);
      const url = new URL(window.location.href);
      url.searchParams.set("mood", mood);
      window.history.replaceState({}, "", url);
    } catch {}
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(haiku);
      alert("Haiku copied ✨");
    } catch {}
  };

  const headline = useMemo(() => {
    if (!selected) return "Missy, how are you feeling?";
    const m = MOODS.find(m => m.key === selected);
    return m ? `Feeling ${m.label.toLowerCase()}?` : "How are you feeling?";
  }, [selected]);

  return (
    <section className="relative">
      {/* Header — minimal quiz controls; relies on global bg */}
      <header className="relative z-10 text-hero-blue">
        <div className="max-w-6xl mx-auto px-6 pt-5 md:pt-8 flex items-center justify-between">
          <a href="/" className="inline-flex items-center gap-2 hover:opacity-90">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm md:text-base font-semibold tracking-wide">Back</span>
          </a>
          <span className="hidden md:block text-xs md:text-sm font-semibold tracking-wide">Missy check‑in</span>
          <a href="/" className="btn btn-outline btn-sm inline-flex items-center gap-2">
            <span>Quit</span>
            <X className="w-3.5 h-3.5" />
          </a>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-20 md:pb-28 text-hero-blue">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="mt-10 md:mt-16 text-5xl md:text-7xl font-display font-semibold tracking-tight"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-3 text-lg text-ink md:text-2xl max-w-3xl"
        >
          A quick, gentle check‑in. Choose what fits right now; I’ll answer with a calming haiku.
        </motion.p>

        {/* Mood grid — uses your button system */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {MOODS.map((m) => (
            <button
              key={m.key}
              className={`btn btn-outline ${selected === m.key ? "ring-2 ring-white" : ""}`}
              onClick={() => onPickMood(m.key)}
              aria-pressed={selected === m.key}
              title={m.label}
            >
              <m.Icon className="w-6 h-6 md:w-7 md:h-7 mr-2" aria-hidden />
              <span className="font-semibold tracking-wide">{m.label}</span>
            </button>
          ))}
        </div>

        {/* Haiku reveal */}
        <div className="mt-10 min-h-[9rem]" aria-live="polite" aria-atomic="true">
          <AnimatePresence mode="wait">
            {haiku ? (
              <motion.div
                key={haiku}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="rounded-2xl p-6 md:p-8 border border-white/20"
              >
                <p className="whitespace-pre-line text-xl md:text-2xl leading-relaxed">
                  {haiku}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <button className="btn btn-outline" onClick={() => selected && onPickMood(selected)}>
                    <RefreshCw className="w-4 h-4 mr-2" /> Another
                  </button>
                  <button className="btn btn-outline" onClick={onCopy}>
                    <Copy className="w-4 h-4 mr-2" /> Copy
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.p
                key="prompt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg md:text-xl"
              >
                Pick a feeling above to reveal a poem.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-xs opacity-80">
          Tip: link directly to a mood, e.g. <code className="px-1.5 py-0.5 rounded bg-white/20">?mood=stressed</code>
        </div>
      </main>
    </section>
  );
}
