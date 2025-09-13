// src/components/Layout.tsx
import React, { useEffect } from "react";
import Header from "@/components/Header";

function useScrollEasing() {
  useEffect(() => {
    document.documentElement.classList.add("lenis-smooth-lite");
    return () => document.documentElement.classList.remove("lenis-smooth-lite");
  }, []);
}

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  useScrollEasing();
  useRevealOnScroll();
  return (
    // 👇 make background transparent so no dark gap shows between sections
    <div id="app-root" className="relative min-h-screen bg-transparent text-white">
      <Header />
      {children}
    </div>
  );
}
