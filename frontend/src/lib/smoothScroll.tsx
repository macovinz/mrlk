// src/components/SmoothScroll.tsx
import { type PropsWithChildren, useEffect, useRef } from "react"
import Lenis from "@studio-freight/lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: PropsWithChildren) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    document.documentElement.classList.add("lenis", "lenis-smooth")

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
    })
    lenisRef.current = lenis

    // Sync Lenis → ScrollTrigger (official pattern)
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove((t) => lenis.raf(t * 1000))
      lenis.destroy()
      document.documentElement.classList.remove("lenis", "lenis-smooth")
    }
  }, [])

  return <>{children}</>
}
