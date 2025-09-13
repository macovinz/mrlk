// src/components/ConfettiCanvas.tsx
import { useEffect, useRef } from "react";

export default function ConfettiOnScroll() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = (c.width = c.offsetWidth);
    let h = (c.height = c.offsetHeight);
    let raf = 0;
    const onResize = () => {
      w = c.width = c.offsetWidth;
      h = c.height = c.offsetHeight;
    };
    window.addEventListener("resize", onResize);

    const N = 90;
    const pieces = Array.from({ length: N }).map(() => ({
      x: Math.random() * w,
      y: -Math.random() * h * 0.6,
      s: 6 + Math.random() * 10,
      r: Math.random() * Math.PI,
      v: 0.8 + Math.random() * 1.6,
      w: (Math.random() - 0.5) * 0.08,
      color: ["#3b82f6", "#1d4ed8", "#60a5fa"][Math.floor(Math.random() * 3)],
    }));

    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      pieces.forEach(p => {
        p.y += p.v;
        p.r += p.w;
        if (p.y > h + 30) {
          // recycle a few so it doesn’t run forever
          p.y = -30;
          p.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.r);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.s * 0.5, -p.s * 0.2, p.s, p.s * 0.4);
        ctx.restore();
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none absolute inset-0 z-10 block"
      style={{ width: "100%", height: "100%" }}
      aria-hidden
    />
  );
}
