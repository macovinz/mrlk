// src/components/Layout.tsx
import React, { useEffect } from "react";
import Header from "@/components/Header";
import BackgroundGradientAnimation from "@/components/BackgroundGradientAnimation";

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
    <div id="app-root" className="relative min-h-screen">
      {/* Global animated background (fixed, behind Hero too) */}
      <BackgroundGradientAnimation
        interactive={false}
        containerClassName="-z-20"
        /* Tuned to match the Hero’s sunset tones so the transition is seamless */
        gradientBackgroundStart="rgb(255, 210, 168)"   // ≈ #ffd2a8
        gradientBackgroundEnd="rgb(251, 230, 213)"     // soft peach
        firstColor="255, 147, 77"                      // ≈ #ff934d
        secondColor="255, 169, 112"                    // ≈ #ffa970
        thirdColor="207, 203, 226"                     // ≈ #cfcbe2
        fourthColor="142, 161, 199"                    // ≈ #8ea1c7
        fifthColor="255, 215, 180"
        pointerColor="142, 161, 199"
        size="80%"
        blendingValue="hard-light"
      />

      {/* Top blend shim: fades from hero’s orange-peach into transparent */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 h-28 -z-10
                   bg-[linear-gradient(to_bottom,rgba(239,106,47,0.28),rgba(255,147,77,0.22),rgba(255,210,168,0.16),transparent)]"
      />

      <Header />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
