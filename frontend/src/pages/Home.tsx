
import { ScrollingSunsets, useActiveSection } from "@/components/ScrollingSunsets"

export default function Home() {
  const { active, setRef } = useActiveSection()

  // Choose which background each section uses (0 = EchoBeach, 1 = JimbaranBay)
  const sections = [
    { id: "hero",    bg: 0 as const, kicker: "A sunset story",     title: "Happy Birthday, Love",
      body: "This is our little corner on the web—a living love letter to you. A place for your ideas, your voice, your craft. Scroll to journey through the things that make you, you." },
    { id: "talents", bg: 1 as const, kicker: "What she loves",     title: "Multi-talented & Brilliant",
      body: "She cooks with heart, hosts thoughtful podcasts, and uplifts gaming communities—all without needing to show her face. We'll showcase recipes, episodes, and highlights from Discord in one serene feed." },
    { id: "sunsets", bg: 0 as const, kicker: "She loves sunsets",  title: "Sunset to Sunset",
      body: "Each scroll reveals another evening sky. Soon this becomes a looped gallery of silhouettes against changing horizons—your shared moments and her words." },
    { id: "podcast", bg: 1 as const, kicker: "Podcast corner",     title: "Her Voice, Her Pace",
      body: "Embed her latest episode here (Spotify/Apple/YouTube). Until then, we’ll show notes, quotes, and topics that reflect how she thinks and cares." },
    { id: "blog",    bg: 0 as const, kicker: "Blog + Recipes",     title: "A Home for Her Stories",
      body: "Convert this into a full blog whenever you’re ready—recipes, long-form thoughts, and highlights from her communities." },
  ]

  return (
    <main className="min-h-screen overflow-x-hidden snap-y snap-mandatory">
      <ScrollingSunsets active={sections[active]?.bg ?? 0} />

      {sections.map((s, i) => (
        <section
          key={s.id}
          id={s.id}
          ref={(el) => setRef(el as HTMLElement, i)}
          className="relative min-h-screen snap-start grid grid-cols-1 lg:grid-cols-2 items-center px-6 sm:px-10 lg:px-16 py-24"
        >
          <div className="relative z-10 space-y-6" data-reveal>
            <span className="inline-block uppercase tracking-wides text-xs font-semibold/relaxed bg-white/10 px-3 py-1 rounded-full">{s.kicker}</span>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)]">{s.title}</h2>
            <p className="max-w-prose text-lg/8 text-white/90">{s.body}</p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#podcast" className="rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 text-sm font-medium backdrop-blur">Podcast</a>
              <a href="#blog" className="rounded-2xl bg-white/15 hover:bg-white/25 border border-white/20 px-4 py-2 text-sm font-medium backdrop-blur">Blog</a>
              <a href="#contact" className="rounded-2xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold">Say Hi</a>
            </div>
          </div>

          <div className="relative z-10 mt-10 lg:mt-0 flex justify-center lg:justify-end" data-reveal>
            <div className="rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/20">
              <div className="w-[22rem] aspect-[3/4] bg-black/20 grid place-items-center">
                <span className="text-white/80 text-sm">Silhouette / content card</span>
              </div>
            </div>
          </div>
        </section>
      ))}

      <footer id="contact" className="relative min-h-[60vh] grid place-items-center bg-slate-950">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_-20%,rgba(2,132,199,0.35),transparent_60%)]" />
        <div className="max-w-2xl mx-auto text-center px-6 py-20" data-reveal>
          <h2 className="text-3xl sm:text-4xl font-extrabold">From my heart to yours 💙</h2>
          <p className="mt-3 text-white/80">Happy birthday. This space will grow with your voice—recipes, episodes, and moments we love.</p>
          <form className="mt-8 grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
            <input type="email" placeholder="Your email for updates (optional)" className="rounded-xl bg-white/10 border border-white/15 px-4 py-3 placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <button type="button" className="rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 font-semibold">Notify me</button>
          </form>
          <p className="mt-4 text-xs text-white/60">Hook this to WordPress or a newsletter later.</p>
        </div>
      </footer>
    </main>
  )
}
