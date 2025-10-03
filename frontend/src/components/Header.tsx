export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pointer-events-none">
      {/* full-width translucent bar */}
      <div className="pointer-events-auto border-b border-yellow/10 bg-yellow/35 backdrop-blur-md">
        {/* subtle gradient & shadow for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-[0.06] pointer-events-none" />
        <nav className="relative mx-auto max-w-7xl px-5 md:px-6 py-3.5 flex items-center justify-between text-white shadow-[rgba(0,0,0,0.6)]">
          <a href="/" className="font-extrabold tracking-tight">
            <span className="font-bold text-blue-950"> MRLK's</span>
            <span> UNIVERSE</span>
          </a>

          <div className="flex items-center gap-5 text-sm">
            <a className="hover:text-white/80 transition-colors" href="/affirmation">Feelings</a>
            <a className="hover:text-white/80 transition-colors" href="/gift">Gift</a>
            <a className="hover:text-white/80 transition-colors" href="/podcast">Podcast</a>
            <a className="hover:text-white/80 transition-colors" href="/blog">Blog</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
