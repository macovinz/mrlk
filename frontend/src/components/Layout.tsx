import Header from './Header'
import type { ReactNode } from 'react'
import { Toaster } from "./ui/sonner"
import React from 'react'

function useRevealOnScroll() {
  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("reveal-in"); io.unobserve(e.target) }
      })
    }, { threshold: 0.2 })
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

export default function Layout({ children }: { children: ReactNode }) {
  React.useEffect(() => { document.documentElement.classList.add("lenis-smooth-lite"); return () => document.documentElement.classList.remove("lenis-smooth-lite") }, [])
  useRevealOnScroll()

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white font-sans">
      <Header />
      <main className="flex-grow">{children}</main>
      <Toaster/>
    </div>
  )
}
