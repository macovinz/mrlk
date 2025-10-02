// src/components/GentleScroller.tsx
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

export default function GentleScroller() {
  return (
    <div className="relative z-10">
      {SLIDES.map((s, i) => {
        const side = s.portraitSide ?? (i % 2 === 0 ? "right" : "left");
        return (
          <section key={i} className="relative grid min-h-[92vh] place-items-stretch py-10">
            {/* No per-section tint – global background handles it */}
            <div className="relative mx-auto flex w-full max-w-7xl items-center px-6">
              <div
                className={`grid w-full grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 xl:gap-20 ${
                  side === "left" ? "md:[direction:rtl]" : ""
                }`}
              >
                {/* image */}
                <div
                  className="relative order-2 md:order-none"
                  data-reveal
                  style={{ ["--reveal-delay" as any]: "0.12s" }}
                >
                  {s.image && (
                    <div className={`${side === "left" ? "md:[direction:ltr]" : ""}`}>
                      <div className="relative ml-auto aspect-[4/5] w-[82vw] max-w-[520px] sm:w-[68vw] overflow-hidden rounded-[2rem] border border-black/10 bg-white/60 backdrop-blur">
                        <img src={s.image} alt="" className="h-full w-full object-cover" loading="lazy" />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/10" />
                      </div>
                    </div>
                  )}
                </div>

                {/* text */}
                <div className={`flex flex-col justify-center ${side === "left" ? "md:[direction:ltr]" : ""}`}>
                  <h3 className="font-display text-4xl sm:text-5xl md:text-6xl leading-[1.06] tracking-tight text-slate-900" data-reveal>
                    {s.title}
                  </h3>
                  <p
                    className="mt-4 max-w-xl font-body text-lg sm:text-xl text-slate-800"
                    data-reveal
                    style={{ ["--reveal-delay" as any]: "0.06s" }}
                  >
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
