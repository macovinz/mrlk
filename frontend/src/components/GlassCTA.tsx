// src/components/GlassCTA.tsx
export default function GlassCTA() {
  return (
    <section id="gift" className="relative py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6">
        <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,.25)]">
          <div className="p-8 sm:p-12 text-center text-white">
            <h3 className="font-display text-3xl sm:text-4xl md:text-5xl" style={{ color: "#091485" }}>
              A gift that grows with you
            </h3>
            <p className="mt-4 font-body text-lg text-white/90">
              Blog, quiet notes, or a home for your voice—this space moves at your pace.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#blog" className="giovanni-btn bg-gradient-to-r from-[#ff934d] via-[#ffd2a8] to-[#8ea1c7] text-slate-900">
                Visit the Blog
              </a>
              <a href="#podcast" className="ghost-btn border-white/60 bg-white/15 text-white hover:bg-white/25">
                Open the Podcast
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
