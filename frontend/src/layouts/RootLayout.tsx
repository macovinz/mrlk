// src/app/RootLayout.tsx (or wherever your root layout is)
"use client";

import { useEffect, useRef } from "react";
import Lenis, { type LenisOptions } from "lenis";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // IMPORTANT: avoid conflicts with native smooth-behavior
    document.documentElement.style.scrollBehavior = "auto";

    const options: LenisOptions = {
      // feel free to tweak these:
      duration: 1.1,                 // seconds for momentum
      easing: (t) => 1 - Math.pow(1 - t, 2),
      orientation: "vertical",
      gestureOrientation: "vertical",
      wheelMultiplier: 1,            // higher = faster wheel
      touchMultiplier: 1.1,          // higher = faster touch/trackpad
    };

    const lenis = new Lenis(options);
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    // optional: sync with hash links
    const onHashLink = (e: Event) => {
      const a = e.target as HTMLAnchorElement;
      if (a.tagName === "A" && a.getAttribute("href")?.startsWith("#")) {
        e.preventDefault();
        const id = a.getAttribute("href")!.slice(1);
        const el = document.getElementById(id);
        if (el) lenis.scrollTo(el, { offset: -80 }); // adjust header height
      }
    };
    document.addEventListener("click", onHashLink);

    return () => {
      document.removeEventListener("click", onHashLink);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
