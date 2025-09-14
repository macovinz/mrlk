
export default function Footer() {
  return (
    <footer
      className="relative z-40 border-t border-white/10 bg-black/35 backdrop-blur-md"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* subtle gradient sheen, same vibe as header */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-[0.06]" />

      <div className="relative mx-auto max-w-7xl px-6 py-3 text-center">
        <p className="text-xs tracking-wide text-white/75">
        <span className="font-semibold">Built with love under golden sunsets, tu Corazon</span>
        </p>
      </div>
    </footer>
  );
}
