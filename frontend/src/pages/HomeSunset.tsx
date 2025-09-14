import { useEffect, useMemo } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Fixed video background (sits under all sections)
 */
function BackgroundVideo() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 -z-20 pointer-events-none"
      style={{ contain: "paint" }}
    >
      <video
        className="h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
      >
        <source
          src="frontend/src/assets/blob_gradient_with_alpha_2+2_VP9.webm"
          type="video/webm"
        />
      </video>
      {/* slight vignette to add depth over video */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,.35))]" />
    </div>
  );
}

/**
 * One full-height section
 */
function FullSection({
  id,
  title,
  text,
  silhouette,
  align = "left",
}: {
  id: string;
  title: string;
  text: string;
  silhouette?: string;
  align?: "left" | "right" | "center";
}) {
  return (
    <section
      id={id}
      className="relative isolate min-h-[100svh] w-full"
      style={{
        // gradient is painted from CSS vars below
        background:
          "linear-gradient(135deg, var(--c1), var(--c2), var(--c3))",
      }}
    >
      {/* soft grain */}
      <div className="pointer-events-none absolute inset-0 -z-0 opacity-[0.06]"
           style={{ backgroundImage: "radial-gradient(rgba(255,255,255,.9)_1px,transparent_1px)", backgroundSize: "3px 3px" }} />

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-8 py-20 sm:py-24 lg:py-28">
        <div
          className={`grid items-center gap-10 md:gap-14 ${
            silhouette ? "md:grid-cols-2" : ""
          }`}
        >
          {(silhouette && align === "left") && (
            <div className="flex justify-center md:justify-start">
              <img
                src={silhouette}
                alt=""
                className="w-[68%] max-w-[520px] opacity-90 drop-shadow-xl"
              />
            </div>
          )}

          <div className="max-w-2xl">
            <h2 className="text-[color:#091485] drop-shadow-sm text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              {title}
            </h2>
            <p className="mt-5 text-lg sm:text-xl text-white/95">
              {text}
            </p>
          </div>

          {(silhouette && align === "right") && (
            <div className="flex justify-center md:justify-end">
              <img
                src={silhouette}
                alt=""
                className="w-[68%] max-w-[520px] opacity-90 drop-shadow-xl"
              />
            </div>
          )}
        </div>
      </div>

      {/* top / bottom fades */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/25 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/25 to-transparent" />
    </section>
  );
}

/**
 * MAIN PAGE
 * Scroll progress drives 3 CSS color variables to create a
 * continuous sunset→deep-indigo transition (Gentlerain-like).
 */
export default function HomeSunset() {
  useEffect(() => {
    document.title = "For Missy — Stories at Sunset";
  }, []);

  const { scrollYProgress } = useScroll();

  // waypoints across the page (0..1). Adjust if you add/remove sections.
  const stops = useMemo(
    () => [0, 0.16, 0.32, 0.48, 0.64, 0.8, 1],
    []
  );

  // Palette path (warm sunset > violet dusk > blue night)
  // We interpolate THREE simultaneous tracks for a rich gradient.
  const c1 = useTransform(scrollYProgress, stops, [
    "#FFD8B0", "#FFC89A", "#FFB47F", "#F89B79", "#E58677", "#C27AB5", "#6B7AC6"
  ]);
  const c2 = useTransform(scrollYProgress, stops, [
    "#F8A479", "#F4936F", "#EC7F68", "#E16E66", "#B56FB1", "#7A6BB3", "#4C5CAB"
  ]);
  const c3 = useTransform(scrollYProgress, stops, [
    "#8C6AB7", "#7E68BE", "#6F66C4", "#5D63C8", "#4F61C5", "#3F58B8", "#2C3F84"
  ]);

  return (
    <main className="relative min-h-screen w-full text-white">
      <BackgroundVideo />

      {/* global color vars that all sections read */}
      <motion.div
        aria-hidden
        className="fixed inset-0 -z-10"
        style={
          {
            // @ts-ignore allow css vars
            "--c1": c1,
            "--c2": c2,
            "--c3": c3,
          } as React.CSSProperties
        }
      />

      {/* HERO */}
      <FullSection
        id="hero"
        title="For your birthday — your little universe"
        text="A little home on the web to celebrate your light — your voice, your cooking magic, your games and giggles, and the sunsets you love. No faces needed, just stories. This is my love letter to you — you are the sunset I never want to miss. With you I've known bliss, and I will always value and treasure you."
        silhouette="/assets/silhouette/hero.png"
        align="right"
      />

      {/* S1: Bliss */}
      <FullSection
        id="s-1"
        title="To the one who made me experience ‘Bliss’"
        text="Happy birthday, baby. I’m grateful for your existence and the time and attention you share with me. Like sunsets, you are endlessly beautiful — every day, a new shade. This site is for you."
        silhouette="/assets/silhouette/1.png"
        align="left"
      />

      {/* S2: Talents */}
      <FullSection
        id="s-2"
        title="A multi-talented force"
        text="You’re an artist of many forms: in kitchens where recipes become memories, in communities where your words inspire, and in moments where your laughter becomes music. Letting me see your hidden, tender sides is a rare and intimate radiance — like the afterglow long after the sun dips."
        silhouette="/assets/silhouette/2.png"
        align="right"
      />

      {/* S3: Family */}
      <FullSection
        id="s-3"
        title="Heart of Family"
        text="Your love for family is steady and generous. In your care, people feel safe — at home. That’s why you’re a queen in the ways that matter: not for a crown, but for a pineapple bun, a smile, and the grace that’s already yours."
        silhouette="/assets/silhouette/3.png"
        align="left"
      />

      {/* S4: Rediscovered Light */}
      <FullSection
        id="s-4"
        title="Rediscovered Light"
        text="Since 2021 a part of me never stopped remembering you. This year, after searching, I found you again — and from that first reconnection, bliss returned. Being with you is like the sky easing from gold to indigo — grounding, breathtaking, impossible to look away."
        silhouette="/assets/silhouette/4.png"
        align="right"
      />

      {/* S5: Promise */}
      <FullSection
        id="s-5"
        title="A Gentle Promise"
        text="To me, you are a queen — generous, resilient, true. Even the simplest gestures — a late-night call, a quiet word, letting me glimpse the real you — feel like treasures. I’ll honor you, with or without labels, because you’re the most radiant part of every horizon."
        silhouette="/assets/silhouette/5.png"
        align="left"
      />

      {/* S6: Your way */}
      <FullSection
        id="s-6"
        title="Your light, your way"
        text="We’ll use silhouettes and shapes instead of photos. Your story shines, face unseen — exactly how you like it."
        silhouette="/assets/silhouette/6.png"
        align="right"
      />

      {/* S7: Home for voice */}
      <FullSection
        id="s-7"
        title="A home for your voice"
        text="This can grow into your blog and podcast hub — publish what you love, in your own rhythm. Where do you want to take this? A cozy blog, a podcast space, recipes from your cooking era, or a room for gamers to breathe — this site will move with you."
        silhouette="/assets/silhouette/7.png"
        align="center"
      />

      {/* Footer/CTA */}
      <section
        id="cta"
        className="relative isolate min-h-[70svh]"
        style={{
          background:
            "linear-gradient(135deg, var(--c1), var(--c2), var(--c3))",
        }}
      >
        <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 py-20 text-center">
          <h3 className="text-[color:#091485] text-3xl sm:text-4xl md:text-5xl font-extrabold">
            Where should we take it next?
          </h3>
          <p className="mt-4 text-lg text-white/95">
            Open the Podcast • Visit the Blog • About this Gift
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#podcast" className="rounded-full bg-white/15 px-6 py-2.5 backdrop-blur-md hover:bg-white/25">
              Open the Podcast
            </a>
            <a href="#blog" className="rounded-full border border-white/40 px-6 py-2.5 backdrop-blur-md hover:border-white/70">
              Visit the Blog
            </a>
            <a href="#about" className="rounded-full bg-white/10 px-6 py-2.5 backdrop-blur-md hover:bg-white/20">
              About this Gift
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
