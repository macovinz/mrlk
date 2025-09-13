import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"

gsap.registerPlugin(ScrollTrigger)

type Panel = {
  title: string
  desc: string
  // big gradient behind each panel
  gradient: string
  // optional silhouette/illustration url
  img?: string
}

const PANELS: Panel[] = [
  {
    title: "For You, On Your Day",
    desc: "A little story about us — inspired by your sunsets, your voice, and your magic.",
    gradient: "from-[#FFBE88] via-[#E36D5B] to-[#6B4B8B]",
  },
  {
    title: "Your Talents",
    desc: "Cook, creator, gamer, guide. You inspire communities without needing the spotlight.",
    gradient: "from-[#FFD1A3] via-[#F08A5D] to-[#5457A6]",
  },
  {
    title: "Your Voice",
    desc: "A place for podcasts, posts, poems — anything you want to share next.",
    gradient: "from-[#FFC8A5] via-[#E46E59] to-[#4C5CAB]",
  },
  {
    title: "Always Us",
    desc: "And like the sun, we keep showing up for each other, every day.",
    gradient: "from-[#FFE0B3] via-[#F39C77] to-[#7A6BB3]",
  },
]

export default function SunsetSections() {
  const root = useRef<HTMLDivElement>(null)

  // Smooth scrolling (Belarosa & Gentlerain both use eased scroll)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let rafId = 0
    const raf = (t: number) => { lenis.raf(t); rafId = requestAnimationFrame(raf) }
    rafId = requestAnimationFrame(raf)
    return () => { cancelAnimationFrame(rafId); lenis.destroy() }
  }, [])

  // Section pin + transitions
  useEffect(() => {
    if (!root.current) return
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>(".sunset-panel")
      const cards  = gsap.utils.toArray<HTMLElement>(".sunset-card")

      // Pin the whole stack (Gentlerain)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${window.innerHeight * (panels.length + 0.5)}`,
          scrub: true,
          pin: true,
        },
      })

      // Initial states
      panels.forEach((p, i) => {
        gsap.set(p, {
          clipPath: i === 0
            ? "inset(0% 0% 0% 0% round 24px)"
            : "inset(100% 0% 0% 0% round 24px)",
        })
      })
      gsap.set(cards, { y: 24, opacity: 0 })

      // For each panel, reveal it and lift the card (Belarosa-style card elevate)
      panels.forEach((p, i) => {
        const card = p.querySelector(".sunset-card")
        const seg = gsap.timeline()
          .to(p, { clipPath: "inset(0% 0% 0% 0% round 24px)", ease: "none", duration: 0.66 }, 0)
          .to(card, { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }, 0.08)
          // slight parallax on the backdrop gradient
          .fromTo(p, { backgroundPosition: "50% 60%" }, { backgroundPosition: "50% 40%", ease: "none", duration: 0.66 }, 0)

        tl.add(seg, i)
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={root} aria-label="Sunset story scroller"
      className="relative isolate h-screen w-full overflow-hidden px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl h-full flex items-stretch">
        <div className="w-full grid grid-cols-1 gap-6 my-auto">
          {PANELS.map((p, i) => (
            <div
              key={i}
              className={`sunset-panel relative min-h-[76vh] rounded-3xl border border-white/10
                          bg-gradient-to-br ${p.gradient} text-white overflow-hidden will-change-transform`}
              style={{ backgroundSize: "150% 150%", backgroundPosition: "50% 60%" }}
            >
              <div className="sunset-card relative z-10 p-8 sm:p-12 md:p-16 max-w-2xl">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow">
                  {p.title}
                </h3>
                <p className="mt-4 text-base sm:text-lg text-white/90">
                  {p.desc}
                </p>
              </div>

              {/* optional silhouettes or images */}
              {p.img && (
                <img
                  src={p.img}
                  alt=""
                  className="pointer-events-none select-none absolute right-4 bottom-4 w-[42vw] max-w-[680px] opacity-90"
                  loading="lazy"
                />
              )}

              {/* glassy top fade like Belarosa cards */}
              <div className="pointer-events-none absolute inset-x-0 top-0 h-24
                              bg-gradient-to-b from-black/20 to-transparent" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24
                              bg-gradient-to-t from-black/20 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
