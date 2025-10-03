export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 pointer-events-none">
      <div className="pointer-events-auto border-b border-white/20 bg-white/10 backdrop-blur-lg">
        {/* frosty highlight gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-[0.15] pointer-events-none" />
        
        <nav className="relative mx-auto max-w-7xl px-5 md:px-6 py-3.5 flex items-center justify-between text-white drop-shadow-md">
          <a href="/" className="font-extrabold tracking-tight">
            <span className="font-bold text-blue-950">MRLK’s</span>
            <span> UNIVERSE</span>
          </a>

          <div className="flex items-center gap-5 text-sm">
            <a className="hover:text-white/80 transition-colors" href="/mood">Feelings</a>
            <a className="hover:text-white/80 transition-colors" href="/gift">Gift</a>
            <a className="hover:text-white/80 transition-colors" href="/podcast">Podcast</a>
            <a className="hover:text-white/80 transition-colors" href="/blog">Blog</a>
          </div>
        </nav>
      </div>
    </header>
  );
}
