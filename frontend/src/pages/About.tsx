import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";

const Silhouette = ({ className = "w-40 h-40" }: { className?: string }) => (
  <svg viewBox="0 0 128 128" className={className} aria-hidden>
    <defs>
      <linearGradient id="sil-blue" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#2468CE" />
        <stop offset="100%" stopColor="#0B3C5D" />
      </linearGradient>
    </defs>
    <path
      d="M64 10c14 0 26 12 26 26s-12 26-26 26S38 50 38 36 50 10 64 10Zm0 54c23 0 42 19 42 42v12H22v-12c0-23 19-42 42-42Z"
      fill="url(#sil-blue)"
    />
  </svg>
);

const Sun = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  return (
    <motion.div style={{ y, scale }} className="pointer-events-none absolute -top-24 right-6 h-64 w-64 rounded-full">
      <div className="h-full w-full rounded-full bg-gradient-to-br from-[#FFB067] via-[#FF6B5A] to-[#6D5BD0] opacity-70 blur-2xl" />
    </motion.div>
  );
};

const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`relative mx-auto max-w-6xl px-6 md:px-8 ${className}`}>{children}</section>
);

export default function About() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.title = "For Missy — under blue sunsets";

    lenisRef.current = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 2),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <main className="relative min-h-screen scroll-smooth bg-gradient-to-b from-[#091485] via-[#1E3F73] to-[#0a1120] text-blue-50">
      <div className="pointer-events-none fixed inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)", backgroundSize: "3px 3px" }} />

      {/* HERO */}
      <header className="relative overflow-hidden">
        <Sun />
        <Section id="hero" className="pt-28 pb-24 md:pt-36 md:pb-40">
          <div className="grid items-center gap-10 md:grid-cols-[1fr,0.8fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <p className="mb-3 text-sm uppercase tracking-[0.2em] text-blue-200/80">A birthday story</p>
              <h1 className="mb-4 text-pretty text-4xl font-bold leading-tight md:text-6xl">
                For Missy
                <span className="block text-blue-200">under blue sunsets</span>
              </h1>
              <p className="mb-6 max-w-xl text-lg text-blue-100/90">
                We met years ago, drifted apart, and somehow the tides of life carried us back to one another. Since August, it has felt like a rediscovery of something timeless — a bond rooted in kindness, depth, and a spark that never left. This page is my love letter to you: to your light, your gifts, and the way you inspire me to be better every day.
              </p>
              <div className="flex flex-wrap gap-3">
                <a href="#pillars" className="rounded-full bg-blue-500/20 px-5 py-2 text-blue-100 backdrop-blur transition hover:bg-blue-500/30">Start</a>
                <a href="#listen" className="rounded-full border border-blue-300/30 px-5 py-2 text-blue-100 transition hover:border-blue-300/50">Listen</a>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.9, delay: 0.15 }} className="flex flex-wrap items-center justify-center gap-6">
              <Silhouette className="h-24 w-24 rotate-3 md:h-32 md:w-32" />
              <Silhouette className="h-20 w-20 -rotate-6 opacity-80 md:h-28 md:w-28" />
              <Silhouette className="h-24 w-24 translate-x-2 opacity-70 md:h-32 md:w-32" />
            </motion.div>
          </div>
        </Section>
      </header>

      {/* SECTION: Her Strength */}
      <Section id="strength" className="mb-28 md:mb-40">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 text-center text-3xl font-semibold md:text-5xl">
          Strength in Service
        </motion.h2>
        <p className="mx-auto max-w-3xl text-center text-lg text-blue-100/90">
          You carried honor in the United States Air Force, serving in the medical field — a life dedicated to care, precision, and discipline. That strength isn’t only in your record, but in the way you face life’s challenges with resilience and courage.
        </p>
      </Section>

      {/* SECTION: Her Talents */}
      <Section id="talents" className="mb-28 md:mb-40">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 text-center text-3xl font-semibold md:text-5xl">
          A World of Talents
        </motion.h2>
        <p className="mx-auto max-w-3xl text-center text-lg text-blue-100/90">
          From cooking that inspired thousands online, to inspiring voices in communities and gaming spaces — your creativity shines in so many forms. You don’t just create meals or moments; you create joy, connection, and belonging.
        </p>
      </Section>

      {/* SECTION: Family and Care */}
      <Section id="family" className="mb-28 md:mb-40">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 text-center text-3xl font-semibold md:text-5xl">
          Heart of Family
        </motion.h2>
        <p className="mx-auto max-w-3xl text-center text-lg text-blue-100/90">
          At your core, you are family-oriented. The way you care for your loved ones shows me the depth of your loyalty, your devotion, and your love. You remind me what it means to build a life around people, not things.
        </p>
      </Section>

      {/* SECTION: Our Connection */}
      <Section id="connection" className="mb-28 md:mb-40">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 text-center text-3xl font-semibold md:text-5xl">
          Rediscovered Light
        </motion.h2>
        <p className="mx-auto max-w-3xl text-center text-lg text-blue-100/90">
          Since 2021, I carried the memory of you. This year, I searched and found you again — and the moment we reconnected, it felt as if no time had passed. You’ve always been the one whose presence feels like home, like sunset light spilling across the horizon.
        </p>
      </Section>

      {/* SECTION: A Promise */}
      <Section id="promise" className="mb-28 md:mb-40">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="mb-3 text-3xl font-semibold md:text-5xl">A Gentle Promise</h2>
            <p className="text-balance text-lg text-blue-100/90">
              To me, you are a queen — deserving of love, patience, and honor. This space will always reflect that: a place where your story, your light, and your future creations can live. Whatever paths we walk, I carry deep gratitude for you, always.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="rounded-2xl border border-blue-300/20 bg-white/5 p-6">
            <p className="text-blue-100/90">Words for you:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["queen","steadfast","radiant","caring","resilient","sunset-soul"].map((w) => (
                <span key={w} className="rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-100">{w}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </Section>

      {/* LISTEN placeholder */}
      <Section id="listen" className="mb-28 md:mb-40">
        <div className="rounded-2xl border border-blue-300/20 bg-white/5 p-6">
          <div className="aspect-video w-full rounded-xl bg-gradient-to-br from-blue-600/30 via-purple-600/30 to-rose-500/30" />
          <p className="mt-3 text-blue-100/90">Embed a podcast or audio message here in the future. Placeholder only.</p>
        </div>
      </Section>

    
    </main>
  );
}
