// src/components/GentleScroller.tsx
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

type Slide = {
  title: string;
  desc: string;
  gradient: string;
  image?: string;
  video?: string;
  portraitSide?: "left" | "right" | "none";
};

const SLIDES: Slide[] = [
  {
    title: "To the one who made me experience ‘Bliss’",
    desc:
      "Happy birthday, baby. I’m grateful for your existence and the time and attention you share with me. Like sunsets, you are endlessly beautiful — every day, a new shade. This site is for you.",
    gradient: "from-[#FFE0B3] via-[#F39C77] to-[#7A6BB3]",
    image: "/src/assets/silhouettes/missy.webp",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_2+2_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "A multi-talented force",
    desc:
      "You’re an artist of many forms: in kitchens where recipes become memories, in communities where your words inspire, and in moments where your laughter becomes music.",
    gradient: "from-[#FFD1A3] via-[#F08A5D] to-[#5457A6]",
    image: "/src/assets/silhouettes/silhouette1.webp",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_2_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "Heart of Family",
    desc:
      "Your love for family is steady and generous. In your care, people feel safe — at home. You’re a queen in the ways that matter most.",
    gradient: "from-[#FFC8A5] via-[#E46E59] to-[#4C5CAB]",
    image: "/src/assets/silhouettes/silhouette1.webp",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_3_VP9.webm",
    portraitSide: "left",
  },
  {
    title: "Rediscovered Light",
    desc:
      "Since 2021 I never stopped remembering you. Finding you again brought bliss back — like watching the sky ease from gold to indigo.",
    gradient: "from-[#FFBE88] via-[#E36D5B] to-[#6B4B8B]",
    image: "/portraits/four.png",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_4_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "A Gentle Promise",
    desc:
      "I’ll honor you, with or without labels, because you’re already the most radiant part of every horizon.",
    gradient: "from-[#FBF4D7] via-[#F9C49A] to-[#8C6EC4]",
    image: "/portraits/five.png",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_5_VP9.webm",
    portraitSide: "left",
  },
  {
    title: "Your light, your way",
    desc:
      "We’ll use silhouettes and shapes instead of photos. Your story shines, face unseen — exactly how you like it.",
    gradient: "from-[#FEE6CF] via-[#F9A875] to-[#6E63B5]",
    image: "/portraits/six.png",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_6_VP9.webm",
    portraitSide: "right",
  },
  {
    title: "A home for your voice",
    desc:
      "This can grow into your blog and podcast hub — publish what you love, in your own rhythm.",
    gradient: "from-[#FFF0DC] via-[#FFC6A1] to-[#7B6AC2]",
    image: "/portraits/seven.png",
    video:
      "https://zajno-storage0.s3.us-west-1.amazonaws.com/dev/Gentel+rain/blob_gradient_with_alpha_7_VP9.webm",
    portraitSide: "none",
  },
];

export default function GentleScroller() {
  const root = useRef<HTMLDivElement>(null);
  const videoWrap = useRef<HTMLDivElement>(null);

  // Smooth scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    });
    let raf = 0;
    const onRaf = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(onRaf);
    };
    raf = requestAnimationFrame(onRaf);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

  // GSAP pin + animations + video fades
  useEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      const container = root.current!;
      const sections = gsap.utils.toArray<HTMLElement>(".vh-section");
      const headings = sections.map((s) => s.querySelector(".vh-title"));
      const paras = sections.map((s) => s.querySelector(".vh-desc"));
      const images = sections.map((s) => s.querySelector(".vh-image"));
      const videos = Array.from(
        (videoWrap.current?.querySelectorAll("video") as NodeListOf<HTMLVideoElement>) ?? []
      );

      gsap.set(headings, { y: 24, opacity: 0 });
      gsap.set(paras, { y: 20, opacity: 0 });
      gsap.set(images, { y: 16, opacity: 0 });

      videos.forEach((v, i) => {
        gsap.set(v, { opacity: i === 0 ? 1 : 0 });
        v.muted = true; v.loop = true; v.playsInline = true;
        v.play().catch(() => void 0);
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: "top top", // pins AFTER hero naturally as component is below hero
          end: () => `+=${window.innerHeight * sections.length}`,
          scrub: true,
          pin: true,
          anticipatePin: 1,
          onRefresh: () => {},
        },
      });

      sections.forEach((section, i) => {
        const h = section.querySelector(".vh-title");
        const p = section.querySelector(".vh-desc");
        const img = section.querySelector(".vh-image");

        const seg = gsap.timeline({
          onStart: () => {
            videos.forEach((v, vi) => {
              gsap.to(v, { opacity: vi === i ? 1 : 0, duration: 0.6, ease: "power1.out" });
              if (vi === i && v.paused) v.play().catch(() => void 0);
            });
          },
        });

        seg
          .to(h, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.05)
          .to(p, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.12)
          .to(img, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }, 0.18)
          .fromTo(
            section.querySelector(".vh-gradient"),
            { yPercent: 6 },
            { yPercent: -6, duration: 0.6, ease: "none" },
            0
          );

        tl.add(seg, i);
      });

      // Fix “stuck on first section” by refreshing after media loads
      const imgs = Array.from(document.images);
      let pending = imgs.length;
      const done = () => { pending--; if (pending <= 0) ScrollTrigger.refresh(); };
      if (pending === 0) ScrollTrigger.refresh();
      imgs.forEach(img => {
        if (img.complete) return;
        img.addEventListener("load", done);
        img.addEventListener("error", done);
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="relative h-screen w-full overflow-hidden">
      {/* BACKGROUND VIDEOS (not in hero) */}
      <div ref={videoWrap} className="pointer-events-none absolute inset-0 -z-20">
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
        {/* subtle darkening for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/10 via-slate-900/25 to-slate-950/45" />
      </div>

      {/* FOREGROUND SECTIONS */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => {
          const side = s.portraitSide ?? (i % 2 === 0 ? "right" : "left");
          return (
            <section key={i} className="vh-section relative grid h-screen w-full place-items-stretch">
              {/* gradient tint */}
              <div className={`vh-gradient pointer-events-none absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-40`} />
              {/* content */}
              <div className="relative mx-auto flex h-full w-full max-w-7xl items-center px-6">
                <div
                  className={`grid w-full grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 ${
                    side === "left" ? "md:[direction:rtl]" : ""
                  }`}
                >
                  {/* image */}
                  <div className="vh-image relative order-2 md:order-none">
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
                    <h3 className="vh-title font-display text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight text-white drop-shadow">
                      {s.title}
                    </h3>
                    <p className="vh-desc mt-4 max-w-xl font-body text-lg sm:text-xl text-white/90">{s.desc}</p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
