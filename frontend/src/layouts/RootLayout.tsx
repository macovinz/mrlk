// src/app/RootLayout.tsx
"use client";

import { useEffect, useRef } from "react";
import Lenis, { type LenisOptions } from "lenis";
import BackgroundGradientAnimation from "@/components/BackgroundGradientAnimation";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // avoid native smooth fighting Lenis
    document.documentElement.style.scrollBehavior = "auto";

    const options: LenisOptions = {
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 2),
      orientation: "vertical",
      gestureOrientation: "vertical",
      wheelMultiplier: 1,
      touchMultiplier: 1.1,
    };

    const lenis = new Lenis(options);
    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <html lang="en">
      <body>
        {/* Global fixed, **z-0** (NOT negative), and non-interactive */}
        <BackgroundGradientAnimation
          interactive={false}
          containerClassName="z-0 pointer-events-none"
          gradientBackgroundStart="rgb(255, 244, 231)"
          gradientBackgroundEnd="rgb(255, 217, 188)"
          firstColor="255, 169, 112"
          secondColor="255, 204, 160"
          thirdColor="206, 203, 226"
          fourthColor="166, 186, 220"
          fifthColor="255, 235, 205"
          pointerColor="142, 161, 199"
        />
        {/* All content above background */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
