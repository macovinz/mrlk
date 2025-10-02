// src/components/GentleScroller.tsx
import { useEffect } from "react";

type Slide = {
  title: string;
  desc: string;
  image?: string;
  portraitSide?: "left" | "right" | "none";
};

const SLIDES: Slide[] = [
  {
    title: "To the one who made me experience ‘Bliss’",
    desc:
      "Happy birthday, baby. I’m grateful for your existence and the time and attention you share with me. Like sunsets, you are endlessly beautiful — every day, a new shade. This site is for you.",
    image: "/wp-content/uploads/2025/09/missy.webp",
    portraitSide: "right",
  },
  {
    title: "A multi-talented force",
    desc:
      "You are an artist of many forms: in kitchens where recipes become memories, in communities where your words inspire, and in moments where your laughter becomes music. What I love most is not the applause, but the joy you bring to others…",
    image: "/wp-content/uploads/2025/09/silhouette2.webp",
    portraitSide: "left",
  },
  {
    title: "Heart of Family",
    desc:
      "Your love for family is like the setting sun: steady, anchoring, and endlessly giving…",
    image: "/wp-content/uploads/2025/09/sillouette5.webp",
    portraitSide: "right",
  },
  {
    title: "Rediscovered Light",
    desc:
      "Since 2021, a part of me never stopped remembering you. Finding you again brought bliss back — like watching the sky ease from gold to indigo.",
    image: "/wp-content/uploads/2025/09/silhouette1.webp",
    portraitSide: "left",
  },
  {
    title: "A Gentle Promise",
    desc:
      "I’ll honor you, with or without labels, because you’re already the most radiant part of every horizon.",
    image: "/wp-content/uploads/2025/09/missy.webp",
    portraitSide: "right",
  },
  {
    title: "A home for your voice",
    desc:
      "This can grow into your blog and podcast hub — publish what you love, in your own rhythm.",
    image: "/wp-content/uploads/2025/09/silhouette1.webp",
    portraitSide: "left",
  },
];

/** Split a string into word spans with built-in staggered transitions */
function Words({ text, baseDelay = 0, step = 35 }: { text: string; baseDelay?: number; step?: number }) {
  // keep spacing (including em dashes, ellipses, etc.)
  const parts = text.split(/(\s+)/);
  return (
    <span data-words>
      {parts.map((p, i) => {
        const isSpace = /^\s+$/.test(p);
        const delayMs = baseDelay + i * step;
        return (
          <span
            key={i}
            aria-hidden={false}
            className={isSpace ? "" : "inline-block will-change-transform"}
            style={
              isSpace
                ? { whiteSpace: "pre" }
                : {
                    opacity: 0,
                    transform: "translateY(8px)",
                    transition: `opacity .55s cubic-bezier(.2,.65,.3,1) ${delayMs}ms, transform .55s cubic-bezier(.2,.65,.3,1) ${delayMs}ms`,
                  }
            }
          >
            {p}
          </span>
        );
      })}
    </span>
  );
}

export default function GentleScroller() {
  // Make words + images animate when they enter the viewport
  useEffect(() => {
    const wordParents = Array.from(document.querySelectorAll<HTMLElement>("[data-words]"));
    const floatEls = Array.from(document.querySelectorAll<HTMLElement>("[data-float]"));

    // set initial state for float elements (images/cards)
    floatEls.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(16px) scale(0.98)";
      el.style.transition = "opacity .6s cubic-bezier(.2,.65,.3,1), transform .6s cubic-bezier(.2,.65,.3,1)";
      el.style.willChange = "transform,opacity";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;

          const target = e.target as HTMLElement;

          // Words: reveal each span using its own delay
          if (target.matches("[data-words]")) {
            const spans = Array.from(target.querySelectorAll<HTMLElement>("span"));
            spans.forEach((s) => {
              if (s.style && s.style.transition) {
                s.style.opacity = "1";
                s.style.transform = "translateY(0)";
              }
            });
            io.unobserve(target);
          }

          // Float blocks (images/cards)
          if (target.matches("[data-float]")) {
            target.style.opacity = "1";
            target.style.transform = "translateY(0) scale(1)";
            io.unobserve(target);
          }
        });
      },
      { threshold: 0.2 }
    );

    wordParents.forEach((p) => io.observe(p));
    floatEls.forEach((f) => io.observe(f));

    return () => io.disconnect();
  }, []);

  return (
    <div className="relative z-10">
      {SLIDES.map((s, i) => {
        const side = s.portraitSide ?? (i % 2 === 0 ? "right" : "left");
        return (
          <section key={i} className="relative grid min-h-[92vh] place-items-stretch py-10">
            {/* Let the global animated background show through (no per-section tints) */}
            <div className="relative mx-auto flex w-full max-w-7xl items-center px-6">
              <div
                className={`grid w-full grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 ${
                  side === "left" ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* image */}
                <div className="relative order-2 md:order-none">
                  {s.image && (
                    <div className={`${side === "left" ? "md:[direction:ltr]" : ""}`}>
                      <div
                        className="relative ml-auto aspect-[4/5] w-full max-w-[560px] sm:max-w-[520px] overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 backdrop-blur"
                        data-float
                      >
                        <img
                          src={s.image}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                          sizes="(max-width: 640px) 82vw, (max-width: 1024px) 68vw, 520px"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
                      </div>
                    </div>
                  )}
                </div>

                {/* text */}
                <div className={`flex flex-col justify-center ${side === "left" ? "md:[direction:ltr]" : ""}`}>
                  <h3 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight text-slate-900">
                    <Words text={s.title} baseDelay={0} step={30} />
                  </h3>
                  <p className="mt-4 max-w-xl font-body text-lg sm:text-xl text-slate-800">
                    <Words text={s.desc} baseDelay={120} step={18} />
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
