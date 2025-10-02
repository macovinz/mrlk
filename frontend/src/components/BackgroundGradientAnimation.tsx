// src/components/BackgroundGradientAnimation.tsx
"use client";
import { useEffect, useRef, useMemo } from "react";
import { cn } from "@/lib/utils";

type Props = {
  gradientBackgroundStart?: string;
  gradientBackgroundEnd?: string;
  firstColor?: string;
  secondColor?: string;
  thirdColor?: string;
  fourthColor?: string;
  fifthColor?: string;
  pointerColor?: string;
  size?: string;
  blendingValue?: string;
  /** cursor-reactive light; auto-disabled on Safari & reduced motion */
  interactive?: boolean;
  className?: string;
  containerClassName?: string;
  children?: React.ReactNode;
};

export default function BackgroundGradientAnimation({
  // Lighter “sunset” defaults
  gradientBackgroundStart = "rgb(255, 244, 231)",
  gradientBackgroundEnd = "rgb(255, 217, 188)",
  firstColor = "255, 169, 112",
  secondColor = "255, 204, 160",
  thirdColor = "206, 203, 226",
  fourthColor = "166, 186, 220",
  fifthColor = "255, 235, 205",
  pointerColor = "142, 161, 199",
  size = "80%",
  blendingValue = "hard-light",
  interactive = true,
  className,
  containerClassName,
  children,
}: Props) {
  const rootStyle = useMemo(() => document?.documentElement?.style, []);
  const interactiveRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const curX = useRef(0);
  const curY = useRef(0);
  const tgX = useRef(0);
  const tgY = useRef(0);

  // write CSS vars once (or when props change)
  useEffect(() => {
    if (!rootStyle) return;
    rootStyle.setProperty("--gradient-background-start", gradientBackgroundStart);
    rootStyle.setProperty("--gradient-background-end", gradientBackgroundEnd);
    rootStyle.setProperty("--first-color", firstColor);
    rootStyle.setProperty("--second-color", secondColor);
    rootStyle.setProperty("--third-color", thirdColor);
    rootStyle.setProperty("--fourth-color", fourthColor);
    rootStyle.setProperty("--fifth-color", fifthColor);
    rootStyle.setProperty("--pointer-color", pointerColor);
    rootStyle.setProperty("--size", size);
    rootStyle.setProperty("--blending-value", blendingValue);
  }, [
    rootStyle,
    gradientBackgroundStart,
    gradientBackgroundEnd,
    firstColor,
    secondColor,
    thirdColor,
    fourthColor,
    fifthColor,
    pointerColor,
    size,
    blendingValue,
  ]);

  // smooth follow without causing React re-renders
  useEffect(() => {
    const el = interactiveRef.current;
    if (!el) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isSafari =
      typeof navigator !== "undefined" &&
      /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    // disable for Safari or reduced motion
    if (!interactive || prefersReduced || isSafari) return;

    const step = () => {
      curX.current += (tgX.current - curX.current) / 20;
      curY.current += (tgY.current - curY.current) / 20;
      el.style.transform = `translate(${Math.round(curX.current)}px, ${Math.round(
        curY.current
      )}px)`;
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [interactive]);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = interactiveRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    tgX.current = e.clientX - r.left;
    tgY.current = e.clientY - r.top;
  };

  // detect Safari and reduced motion for filter fallback & interaction
  const isSafari =
    typeof navigator !== "undefined" &&
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div
    onMouseMove={interactive ? onMove : undefined}
    className={cn(
      "fixed inset-0 z-0 overflow-hidden bg-[linear-gradient(40deg,var(--gradient-background-start),var(--gradient-background-end))]",
      containerClassName
    )}
  >
      {/* Filter defs */}
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>

      {/* Gradient blobs layer */}
      <div
        className={cn(
          "absolute inset-0",
          // Safari can't use the SVG filter+CSS filter combo reliably
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(40px)]"
        )}
      >
        <div
          className={cn(
            "absolute w-[var(--size)] h-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[background:radial-gradient(circle_at_center,_var(--first-color)_0,_var(--first-color)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)]",
            "animate-first opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute w-[var(--size)] h-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--second-color),_.8)_0,_rgba(var(--second-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%-400px)]",
            "animate-second opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute w-[var(--size)] h-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--third-color),_.8)_0,_rgba(var(--third-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%+400px)]",
            "animate-third opacity-100"
          )}
        />
        <div
          className={cn(
            "absolute w-[var(--size)] h-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--fourth-color),_.8)_0,_rgba(var(--fourth-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%-200px)]",
            "animate-fourth opacity-70"
          )}
        />
        <div
          className={cn(
            "absolute w-[var(--size)] h-[var(--size)]",
            "top-[calc(50%-var(--size)/2)] left-[calc(50%-var(--size)/2)]",
            "[background:radial-gradient(circle_at_center,_rgba(var(--fifth-color),_.8)_0,_rgba(var(--fifth-color),_0)_50%)_no-repeat]",
            "[mix-blend-mode:var(--blending-value)] [transform-origin:calc(50%-800px)_calc(50%+800px)]",
            "animate-fifth opacity-100"
          )}
        />

        {/* pointer-follow light (disabled for Safari/reduced motion automatically) */}
        {interactive && !prefersReduced && !isSafari && (
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

      {/* Optional content hook if you ever want to slot children into this layer */}
      <div className={className}>{children}</div>
    </div>
  );
}
