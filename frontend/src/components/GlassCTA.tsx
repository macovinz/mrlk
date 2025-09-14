// src/components/GlassCTA.tsx
export default function GlassCTA() {
  return (
    <section id="cta" className="relative isolate py-20 sm:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#FFF5E8] via-[#FFD9B2] to-[#9AAEF5] opacity-60" />
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-xl">
          <div className="px-6 py-10 sm:px-10 sm:py-12 text-center text-white">
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl">
              A place that grows with you
            </h3>
            <p className="mt-4 font-body text-lg text-white/90">
              Cozy blog for recipes and notes, plus an audio-first podcast space whenever you’re ready.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#blog" className="rounded-full bg-white/20 px-5 py-2 text-white hover:bg-white/30">Read the blog</a>
              <a href="#podcast" className="rounded-full border border-white/60 px-5 py-2 text-white hover:bg-white/10">Visit podcast</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
