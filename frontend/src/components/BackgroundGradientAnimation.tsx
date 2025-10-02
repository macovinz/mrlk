// src/components/BackgroundGradientAnimation.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export default function BackgroundGradientAnimation({
  gradientBackgroundStart = "rgb(255, 210, 168)", // soft peach base
  gradientBackgroundEnd   = "rgb(142, 161, 199)", // soft periwinkle base
  firstColor  = "255, 210, 168",   // #ef6a2f
  secondColor = "239, 106, 47",   // #ff934d
  thirdColor  = "255, 210, 168",  // #ffd2a8
  fourthColor = "207, 203, 226",  // #cfcbe2
  fifthColor  = "239, 106, 47",  // #8ea1c7
  pointerColor = "239, 106, 47",
  size = "80%",
  blendingValue = "hard-light",
  children,
  className,
  interactive = true,
  containerClassName,
  /** NEW: flip vertically so the top of this background matches the bottom of Hero */
  flipVertical = true,
}: {
  gradientBackgroundStart?: string; gradientBackgroundEnd?: string;
  firstColor?: string; secondColor?: string; thirdColor?: string; fourthColor?: string; fifthColor?: string;
  pointerColor?: string; size?: string; blendingValue?: string;
  children?: React.ReactNode; className?: string; interactive?: boolean; containerClassName?: string;
  flipVertical?: boolean;
}) {
  const interactiveRef = useRef<HTMLDivElement>(null);
  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    const root = document.documentElement.style;
    root.setProperty("--gradient-background-start", gradientBackgroundStart);
    root.setProperty("--gradient-background-end",   gradientBackgroundEnd);
    root.setProperty("--first-color",  firstColor);
    root.setProperty("--second-color", secondColor);
    root.setProperty("--third-color",  thirdColor);
    root.setProperty("--fourth-color", fourthColor);
    root.setProperty("--fifth-color",  fifthColor);
    root.setProperty("--pointer-color", pointerColor);
    root.setProperty("--size", size);
    root.setProperty("--blending-value", blendingValue);
  }, [
    gradientBackgroundStart, gradientBackgroundEnd,
    firstColor, secondColor, thirdColor, fourthColor, fifthColor,
    pointerColor, size, blendingValue
  ]);

  useEffect(() => {
    if (!interactiveRef.current) return;
    const el = interactiveRef.current;
    let raf = 0;
    const move = () => {
      setCurX((x) => x + (tgX - x) / 20);
      setCurY((y) => y + (tgY - y) / 20);
      el.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
      raf = requestAnimationFrame(move);
    };
    raf = requestAnimationFrame(move);
    return () => cancelAnimationFrame(raf);
  }, [tgX, tgY, curX, curY]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactiveRef.current) return;
    const r = interactiveRef.current.getBoundingClientRect();
    setTgX(e.clientX - r.left);
    setTgY(e.clientY - r.top);
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => { setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent)); }, []);

  return (
    <div
      onMouseMove={interactive ? onMove : undefined}
      className={cn(
        "fixed inset-0 -z-10 overflow-hidden bg-[linear-gradient(to_bottom,var(--gradient-background-start),var(--gradient-background-end))]",
        containerClassName
      )}
      aria-hidden
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* The moving blobs layer (flip only this visual layer) */}
      <div
        className={cn(
          "absolute inset-0",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]",
          flipVertical && "-scale-y-100"   // <-- NEW
        )}
      >
        <div className={cn(
          "absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
          "[background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]",
          "[mix-blend-mode:var(--blending-value)] animate-first opacity-100"
        )}/>
        <div className={cn(
          "absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
          "[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]",
          "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%-400px)] animate-second opacity-100"
        )}/>
        <div className={cn(
          "absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
          "[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]",
          "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%+400px)] animate-third opacity-100"
        )}/>
        <div className={cn(
          "absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
          "[background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]",
          "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%-200px)] animate-fourth opacity-70"
        )}/>
        <div className={cn(
          "absolute w-[var(--size)] h-[var(--size)] top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
          "[background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]",
          "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%-800px)_calc(50%+800px)] animate-fifth opacity-100"
        )}/>
        {/* Pointer layer flipped together is fine since interactive={false} in Layout */}
        {interactive && (
          <div
            ref={interactiveRef}
            className={cn(
              "absolute w-full h-full -top-1/2 -left-1/2 opacity-70",
              "[background:radial-gradient(circle_at_center,_rgba(var(--pointer-color),_.8)_0,_rgba(var(--pointer-color),_0)_50%)_no-repeat]",
              "[mix-blend-mode:var(--blending-value)]"
            )}
          />
        )}
      </div>

      {/* If you ever want children layered above the gradient */}
      <div className={className}>{children}</div>
    </div>
  );
}
