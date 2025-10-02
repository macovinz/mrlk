import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
  startingGap?: number;          // % — initial radius
  Breathing?: boolean;
  gradientColors?: string[];
  gradientStops?: number[];      // %
  animationSpeed?: number;       // smaller = slower
  breathingRange?: number;       // %
  containerStyle?: React.CSSProperties;
  containerClassName?: string;
  /** Gradient center, e.g. "50% 120%" to match your hero */
  center?: string;
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  startingGap = 120,
  Breathing = true,
  gradientColors = ["#ef6a2f","#ff934d","#ffd2a8","#cfcbe2","#8ea1c7"],
  gradientStops  = [0, 25, 45, 70, 100],
  animationSpeed = 0.09,
  breathingRange = 7,
  containerStyle = {},
  containerClassName = "",
  center = "50% 120%",   // matches your current hero center
}) => {
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `GradientColors and GradientStops must have the same length.
      Received gradientColors length: ${gradientColors.length},
      gradientStops length: ${gradientStops.length}`
    );
  }

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let frame = 0;
    let size = startingGap;
    let dir = 1;

    const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    const reduce = media?.matches;

    const tick = () => {
      // Respect reduced motion
      const active = Breathing && !reduce;

      if (active) {
        if (size >= startingGap + breathingRange) dir = -1;
        if (size <= startingGap - breathingRange) dir = 1;
        size += dir * animationSpeed;
      }

      const stops = gradientStops
        .map((stop, i) => `${gradientColors[i]} ${stop}%`)
        .join(", ");

      const gradient = `radial-gradient(${size}% ${size}% at ${center}, ${stops})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [startingGap, Breathing, gradientColors, gradientStops, animationSpeed, breathingRange, center]);

  return (
    <motion.div
      key="animated-gradient-background"
      initial={{ opacity: 0, scale: 1.05 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] } }}
      className={`absolute inset-0 overflow-hidden ${containerClassName}`}
    >
      <div
        ref={containerRef}
        style={{ willChange: "background", ...containerStyle }}
        className="absolute inset-0"
      />
    </motion.div>
  );
};

export default AnimatedGradientBackground;
