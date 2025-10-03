export default function Footer() {
  return (
    <footer data-footer="true" className="relative z-40 border-t border-white/5 bg-black/30 backdrop-blur-md">
  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/10 to-transparent opacity-[0.03]" />

      <div className="relative mx-auto max-w-7xl px-6 py-3 text-center">
        <p className="text-xs tracking-wide text-white/75">
        <span className="font-semibold">Built with love under golden sunsets, tu Corazon</span>
        </p>
      </div>
    </footer>
  );
}
