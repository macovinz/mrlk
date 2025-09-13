// src/components/ScrollingSunsets.tsx
import { useEffect, useMemo, useState } from "react";
import EchoBeach from "@/assets/echo-beach.jpg";
import JimbaranBay from "@/assets/jimbaran-bay.jpg";

export function ScrollingSunsets({ active }: { active: 0 | 1 }) {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const t = useMemo(() => `translateY(${-(y * 0.05)}px)`, [y]);

  const IMAGES = [EchoBeach, JimbaranBay];
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      {IMAGES.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Sunset"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out will-change-transform"
          style={{ opacity: active === i ? 1 : 0, transform: t }}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-slate-900/40 to-slate-950/70" />
    </div>
  );
}
