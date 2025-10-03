export default function Footer() {
  return (
    <footer
      className="relative z-40 border-t border-white/20 bg-white/10 backdrop-blur-lg"
      role="contentinfo"
      aria-label="Site footer"
    >
      {/* frosty highlight */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/30 to-transparent opacity-[0.15]" />

      <div className="relative mx-auto max-w-7xl px-6 py-4 text-center">
        <p className="text-xs tracking-wide text-white/80">
          <span className="font-semibold">
            Built with love under golden sunsets, tu Corazon
          </span>
        </p>
      </div>
    </footer>
  );
}
