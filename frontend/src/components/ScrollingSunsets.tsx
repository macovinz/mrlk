import { useEffect, useMemo, useRef, useState } from "react"
import EchoBeach from "@/assets/echo-beach.jpg"
import JimbaranBay from "@/assets/jimbaran-bay.jpg"

export type SunsetBg = 0 | 1
const BACKGROUNDS = [EchoBeach, JimbaranBay]

export function ScrollingSunsets({ active }: { active: SunsetBg }) {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  const translate = useMemo(() => `translateY(${-(scrollY * 0.05)}px)`, [scrollY])

  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {BACKGROUNDS.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Sunset background"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out will-change-transform"
          style={{ opacity: active === i ? 1 : 0, transform: translate }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900/40 to-slate-950/70" />
    </div>
  )
}

export function useActiveSection(opts = { threshold: 0.6 }) {
  const [active, setActive] = useState(0)
  const refs = useRef<HTMLElement[]>([])
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const indexAttr = e.target.getAttribute("data-index")
            if (indexAttr) setActive(parseInt(indexAttr, 10))
          }
        })
      },
      { threshold: opts.threshold }
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [opts.threshold])

  const setRef = (el: HTMLElement | null, i: number) => {
    if (!el) return
    el.setAttribute("data-index", String(i))
    refs.current[i] = el
  }
  return { active, setRef } as const
}
