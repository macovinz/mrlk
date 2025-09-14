// src/components/BackgroundVideoStack.tsx
type Props = {
  src: string | string[];
  className?: string;
  /** Tailwind gradient classes for readability */
  tintGradient?: string; // e.g. "from-black/10 via-black/25 to-[#0a0f2b]/50"
};

export default function BackgroundVideoStack({
  src,
  className,
  tintGradient = "from-slate-900/10 via-slate-900/25 to-slate-950/45",
}: Props) {
  const videos = Array.isArray(src) ? src : [src];

  return (
    <div className={`pointer-events-none absolute inset-0 -z-20 ${className ?? ""}`} aria-hidden>
      {videos.map((url, i) => (
        <video
          key={i}
          className={`absolute inset-0 h-full w-full object-cover ${i === 0 ? "opacity-100" : "opacity-0"}`}
          playsInline
          muted
          loop
          autoPlay
        >
          <source src={url} type="video/webm" />
        </video>
      ))}

      {/* soft tint for text legibility */}
      <div className={`absolute inset-0 bg-gradient-to-b ${tintGradient}`} />

      {/* tasteful grain */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,.7) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "soft-light",
        }}
      />
    </div>
  );
}
