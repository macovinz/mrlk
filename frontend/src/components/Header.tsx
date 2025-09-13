export default function Header() {
return (
<header className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-[min(100%-1.5rem,1080px)]">
<nav className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur px-4 py-2 flex items-center justify-between text-white">
<a href="#hero" className="font-extrabold tracking-tight">
<span>For</span>
<span className="ml-1 text-blue-400"> Her</span>
</a>
<div className="flex gap-4 text-sm">
<a className="hover:text-white/80" href="#talents">Talents</a>
<a className="hover:text-white/80" href="#sunsets">Sunsets</a>
<a className="hover:text-white/80" href="#podcast">Podcast</a>
<a className="hover:text-white/80" href="#blog">Blog</a>
</div>
</nav>
</header>
);
}