// src/components/GentleScroller.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Slide = {
  title: string;
  desc: string;
  gradient?: string;      // optional now (slide 1 uses a custom bg)
  image?: string;
  video?: string;
  portraitSide?: "left" | "right" | "none";
  heroFlipBg?: boolean;   // NEW: when true, use flipped hero gradient
};

const SLIDES: Slide[] = [
  {
    title: "To the one who made me experience ‘Bliss’",
    desc:
      "Happy birthday, baby. I’m grateful for your existence and the time and attention you share with me. Like sunsets, you are endlessly beautiful — every day, a new shade. This site is for you.",
    // keep gradient fallback (not used for slide 1 visual)
    gradient: "from-[#FFE0B3] via-[#F39C77] to-[#7A6BB3]",
    image: "/wp-content/uploads/2025/09/missy.webp",
    video: "/wp-content/uploads/2025/09/blob_gradient_with_alpha_22_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "A multi-talented force",
    desc:
      "You are an artist of many forms: in kitchens where recipes become memories, in communities where your words inspire, and in moments where your laughter becomes music. What I love most is not the applause, but the joy you bring to others. Letting me see those hidden, tender sides of you is already a gift — like the secret glow of the horizon after the sun has dipped below it, a rare and intimate radiance that feels like more than I deserve",
    gradient: "from-[#FFD1A3] via-[#F08A5D] to-[#5457A6]",
    image: "/wp-content/uploads/2025/09/silhouette2.webp",
    video: "/wp-content/uploads/2025/09/blob_gradient_with_alpha_22_VP9.webm",
    portraitSide: "left",
  },
  {
    title: "Heart of Family",
    desc:
      "Your love for family is like the setting sun: steady, anchoring, and endlessly giving. You carry loyalty not as duty, but as devotion. In your care, people feel safe. In your presence, people feel at home. That is a rare gift, and it is why I see you not only as beautiful, but as someone who embodies what it means to be a queen. You don’t need a crown for that — only your pineapple bun, your smile, and the grace that is already yours.",
    gradient: "from-[#FFC8A5] via-[#E46E59] to-[#4C5CAB]",
    image: "/wp-content/uploads/2025/09/sillouette5.webp",
    video: "/wp-content/uploads/2025/09/blob_gradient_with_alpha_22_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "Rediscovered Light",
    desc:
      "Since 2021, a part of me never stopped remembering you. This year, after searching, I found you again — and from that first moment of reconnection, I felt bliss return. Being with you is like watching the sky shift from gold to deep indigo: grounding, breathtaking, and impossible to turn away from. I carry gratitude for every moment, and I will never stop treasuring the gift of your presence.",
    gradient: "from-[#FFBE88] via-[#E36D5B] to-[#6B4B8B]",
    image: "/wp-content/uploads/2025/09/silhouette1.webp",
    video: "/wp-content/uploads/2025/09/blob_gradient_with_alpha_22_VP9.webm",
    portraitSide: "left",
  },
  {
    title: "A Gentle Promise",
    desc:
      "To me, you are a queen. Not because of titles or thrones, but because of how you carry your heart: generous, resilient, and true. Even your simplest gestures — a late-night call, a quiet word, or letting me glimpse the real you — feel like treasures. My promise is simple: I will honor you, with or without labels, with or without crowns, because you are already the most radiant part of every horizon.",
    gradient: "from-[#FBF4D7] via-[#F9C49A] to-[#8C6EC4]",
    image: "/wp-content/uploads/2025/09/missy.webp",
    video: "/wp-content/uploads/2025/09/blob_gradient_with_alpha_22_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "A home for your voice",
    desc:
      "This can grow into your blog and podcast hub — publish what you love, in your own rhythm.",
    gradient: "from-[#FFF0DC] via-[#FFC6A1] to-[#7B6AC2]",
    image: "/wp-content/uploads/2025/09/silhouette1.webp",
    video: "/wp-content/uploads/2025/09/blob_gradient_with_alpha_22_VP9.webm",
    portraitSide: "none",
  },
];

const FLIPPED_HERO_BG =
  "radial-gradient(120% 110% at 50% -10%, #ef6a2f 0%, #ff934d 25%, #ffd2a8 45%, #cfcbe2 70%, #8ea1c7 100%)";

export default function GentleScroller() {
  const root = useRef<HTMLDivElement>(null);
  const videoWrap = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!root.current) return;

    const ready = () => {
      const sections = gsap.utils.toArray<HTMLElement>(
        root.current!.querySelectorAll(".vh-section")
      );
      const videos = Array.from(
        (videoWrap.current?.querySelectorAll("video") as NodeListOf<HTMLVideoElement>) ?? []
      );

      gsap.set(sections.map(s => s.querySelector(".vh-title")), { y: 24, opacity: 0 });
      gsap.set(sections.map(s => s.querySelector(".vh-desc")), { y: 18, opacity: 0 });
      gsap.set(sections.map(s => s.querySelector(".vh-image")), { y: 16, opacity: 0 });

      videos.forEach((v, i) => {
        gsap.set(v, { opacity: i === 0 ? 1 : 0 });
        v.muted = true; v.loop = true; v.playsInline = true;
        void v.play().catch(() => {});
      });

      sections.forEach((section, i) => {
        const title = section.querySelector(".vh-title");
        const desc  = section.querySelector(".vh-desc");
        const img   = section.querySelector(".vh-image");
        const grad  = section.querySelector(".vh-gradient");

        // HOISTED fn fixes “Cannot access 'activate' before initialization”
        function activate(idx: number) {
          videos.forEach((v, vi) => {
            gsap.to(v, { opacity: vi === idx ? 1 : 0, duration: 0.6, ease: "power1.out" });
            if (vi === idx && v.paused) void v.play().catch(() => {});
          });
          gsap.to(title, { y: 0, opacity: 1, duration: 0.55, ease: "power2.out" });
          gsap.to(desc,  { y: 0, opacity: 1, duration: 0.5,  ease: "power2.out", delay: 0.08 });
          gsap.to(img,   { y: 0, opacity: 1, duration: 0.5,  ease: "power2.out", delay: 0.14 });
          gsap.fromTo(grad, { yPercent: 6 }, { yPercent: -6, duration: 0.8, ease: "none" });
        }

        ScrollTrigger.create({
          trigger: section,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () => activate(i),
          onEnterBack: () => activate(i),
        });
      });

      ScrollTrigger.refresh();
    };

    const imgs = Array.from(document.images);
    let pending = imgs.filter((im) => !im.complete).length;
    if (pending === 0) ready();
    else {
      const done = () => { if (--pending <= 0) ready(); };
      imgs.forEach((im) => {
        im.addEventListener("load", done, { once: true });
        im.addEventListener("error", done, { once: true });
      });
    }

    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div ref={root} className="relative w-full">
      {/* FIXED BACKGROUND VIDEOS */}
      <div ref={videoWrap} className="pointer-events-none fixed inset-0 -z-20">
        {SLIDES.map((s, i) => (
          <video
            key={i}
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity"
            playsInline
            muted
            loop
          >
            {s.video ? <source src={s.video} type="video/webm" /> : null}
          </video>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/25 to-slate-950/45" />
      </div>

      {/* FULL-VIEW SECTIONS */}
      {SLIDES.map((s, i) => {
        const side = s.portraitSide ?? (i % 2 === 0 ? "right" : "left");
        const isFirst = i === 0 && s.heroFlipBg;

        return (
          <section key={i} className="vh-section relative grid min-h-[100vh] w-full place-items-stretch">
            {/* gradient tint over video */}
            {isFirst ? (
              <div
                className="vh-gradient pointer-events-none absolute inset-0 opacity-45"
                style={{ background: FLIPPED_HERO_BG, mixBlendMode: "multiply" }}
              />
            ) : (
              <div className={`vh-gradient pointer-events-none absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-40`} />
            )}

            {/* content */}
            <div className="relative mx-auto flex min-h-[100vh] w-full max-w-7xl items-center px-6">
              <div
                className={`grid w-full grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 ${
                  side === "left" ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* image */}
                <div className="vh-image relative order-2 md:order-none opacity-0">
                  {s.image && (
                    <div className={`${side === "left" ? "md:[direction:ltr]" : ""}`}>
                      <div className="relative ml-auto aspect-[4/5] w-[82vw] max-w-[520px] sm:w-[68vw] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur">
                        <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                      </div>
                    </div>
                  )}
                </div>

                {/* text */}
                <div className={`flex flex-col justify-center ${side === "left" ? "md:[direction:ltr]" : ""}`}>
                  <h3 className="vh-title font-display text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight text-white drop-shadow opacity-0">
                    {s.title}
                  </h3>
                  <p className="vh-desc mt-4 max-w-xl font-body text-lg sm:text-xl text-white/90 opacity-0">
                    {s.desc}
                  </p>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
