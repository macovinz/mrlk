// src/pages/Podcast.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import BackgroundVideoStack from "@/components/BackgroundVideoStack";
import { GENTLERAIN_BG } from "@/constants/gentlerain";

type Episode = {
  id: string;
  title: string;
  date: string;
  duration: string;
  description: string;
  cover: string;
  audio: string;
  tags?: string[];
};

const EPISODES: Episode[] = [
  {
    id: "ep-07",
    title: "The Gentle Start",
    date: "2025-01-10",
    duration: "23:18",
    description:
      "A soft hello: vision, why audio-first, and how we’ll keep it cozy and private-friendly.",
    cover:
      "https://images.unsplash.com/photo-1525672261690-0b27a2071ac0?q=80&w=1200&auto=format&fit=crop",
    audio: "https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav",
    tags: ["intro", "vision"],
  },
  {
    id: "ep-06",
    title: "Kitchen Notes: Memory Flavors",
    date: "2024-12-18",
    duration: "18:55",
    description:
      "On recipes that feel like home, the joy of feeding friends, and three pantry staples.",
    cover:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?q=80&w=1200&auto=format&fit=crop",
    audio: "https://www2.cs.uic.edu/~i101/SoundFiles/PinkPanther30.wav",
    tags: ["cooking", "stories"],
  },
  {
    id: "ep-05",
    title: "Sunsets I Remember",
    date: "2024-12-01",
    duration: "29:07",
    description:
      "A meander through seaside evenings, gratitude lists, and calm breathing.",
    cover:
      "https://images.unsplash.com/photo-1501973801540-537f08ccae7b?q=80&w=1200&auto=format&fit=crop",
    audio: "https://www2.cs.uic.edu/~i101/SoundFiles/ImperialMarch60.wav",
    tags: ["sunset", "reflection"],
  },
  {
    id: "ep-04",
    title: "Playful Practice",
    date: "2024-11-15",
    duration: "16:42",
    description:
      "Tiny challenges, low-pressure creativity, and keeping the spark fun.",
    cover:
      "https://images.unsplash.com/photo-1480497490787-505ec076689f?q=80&w=1200&auto=format&fit=crop",
    audio: "https://www2.cs.uic.edu/~i101/SoundFiles/Trumpet24.wav",
    tags: ["growth", "habits"],
  },
];

function useAudio(src?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!src) return;
    // tear down any existing audio
    audioRef.current?.pause();

    const el = new Audio(src);
    el.preload = "metadata";
    el.onended = () => setPlaying(false);
    el.onpause = () => setPlaying(false);
    audioRef.current = el;

    return () => {
      el.pause();
      el.src = "";
    };
  }, [src]);

  const toggle = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      try {
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      el.pause();
      setPlaying(false);
    }
  };

  return { playing, toggle };
}

export default function PodcastPage() {
  useEffect(() => {
    document.title = "Podcast — Stories at Sunset";
  }, []);

  const featured = EPISODES[0];
  const recent = useMemo(() => EPISODES.slice(1), []);
  const { playing, toggle } = useAudio(featured.audio);

  const dateFmt = (d: string) =>
    new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });

  return (
    <main className="relative min-h-screen text-white">
      {/* gentle animated background */}
      <BackgroundVideoStack src={GENTLERAIN_BG} tintGradient="from-slate-900/10 via-slate-900/25 to-slate-950/45" />

      {/* content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-28 pb-20">
        {/* Hero */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10 text-center"
        >
          <p className="text-sm font-semibold tracking-widest text-white/85">PODCAST</p>
          <h1 className="mt-2 font-heading text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight">
            Stories at Sunset — The Podcast
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-white/90 font-body text-lg sm:text-xl">
            A gentle, audio-first space for notes, recipes, and reflections. Cozy vibes. Low pressure. Just your voice.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a className="giovanni-btn" href="#subscribe">Subscribe</a>
            <a className="ghost-btn" href="#rss">RSS</a>
          </div>
        </motion.header>

        {/* Featured */}
        <section className="relative mb-14 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative">
              <img
                src={featured.cover}
                alt=""
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
            </div>

            <div className="flex flex-col justify-center p-6 sm:p-8">
              <span className="mb-1 text-xs uppercase tracking-widest text-white/70">Featured Episode</span>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl leading-tight">
                {featured.title}
              </h2>
              <p className="mt-2 text-white/85">{featured.description}</p>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-white/80">
                <span>{dateFmt(featured.date)}</span>
                <span aria-hidden>•</span>
                <span>{featured.duration}</span>
                {featured.tags?.length ? (
                  <>
                    <span aria-hidden>•</span>
                    <div className="flex flex-wrap gap-2">
                      {featured.tags.map((t) => (
                        <span key={t} className="rounded-full border border-white/20 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  </>
                ) : null}
              </div>

              <div className="mt-5 flex items-center gap-3">
                <button
                  onClick={toggle}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30"
                  aria-label={playing ? "Pause" : "Play"}
                >
                  {playing ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <rect x="6" y="5" width="4" height="14" rx="1.2" />
                      <rect x="14" y="5" width="4" height="14" rx="1.2" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8 5v14l11-7L8 5z" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 overflow-hidden rounded-full border border-white/15 bg-white/10">
                  <div className="h-2 w-1/4 bg-white/70" />
                </div>
                <span className="text-sm tabular-nums text-white/80">{featured.duration}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Recent grid */}
        <section aria-labelledby="episodes-heading">
          <h3 id="episodes-heading" className="sr-only">Episodes</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((ep) => (
              <article
                key={ep.id}
                className="group overflow-hidden rounded-2xl border border-white/10 bg-white/10 backdrop-blur-md"
              >
                <div className="relative">
                  <img
                    src={ep.cover}
                    alt=""
                    className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/25" />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-widest text-white/70">
                    {dateFmt(ep.date)} • {ep.duration}
                  </p>
                  <h4 className="mt-1 font-heading text-xl leading-snug">{ep.title}</h4>
                  <p className="mt-2 line-clamp-2 text-white/85">{ep.description}</p>
                  <div className="mt-4 flex items-center gap-3">
                    <a
                      className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/30"
                      href={`/podcast/${ep.id}`}
                    >
                      Play episode
                    </a>
                    <a
                      className="rounded-full border border-white/40 px-4 py-2 text-sm hover:bg-white/10"
                      href={`/podcast/${ep.id}`}
                    >
                      Show notes
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-3">
            <button className="rounded-full border border-white/20 px-4 py-2 text-sm hover:bg-white/10">
              Newer
            </button>
            <button className="rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-md hover:bg-white/30">
              Older
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
