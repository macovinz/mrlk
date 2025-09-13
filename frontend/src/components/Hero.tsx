// src/components/Hero.tsx
import { motion } from "framer-motion";
import ConfettiOnScroll from "./ConfettiOnScroll";

const SUNSET_BG =
  "bg-[radial-gradient(120%_80%_at_50%_120%,#ef6a2f_0%,#ff934d_25%,#ffd2a8_45%,#cfcbe2_70%,#8ea1c7_100%)]";

export default function Hero() {
  return (
    <section
      id="hero"
      className={`relative min-h-screen w-full overflow-hidden ${SUNSET_BG} text-white`}
    >
      {/* grain/noise overlay for warmth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: "radial-gradient(rgba(255,255,255,0.8)_1px,transparent_1px)",
          backgroundSize: "3px 3px",
          mixBlendMode: "soft-light",
        }}
      />

      {/* low sun glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,183,77,0.9), rgba(255,107,90,0.65) 45%, rgba(109,91,208,0.35) 70%, transparent 75%)",
        }}
      />

      {/* HERO CONTENT — centered */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 pt-40 pb-24 sm:pt-44 sm:pb-28 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-pretty text-4xl sm:text-6xl font-black leading-tight"
          style={{ color: "#091485" }}
        >
          For your birthday — your little universe
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.12 }}
          className="mt-4 text-lg/7 sm:text-xl/8 text-white/90"
        >
          A little home on the web to celebrate your light — your voice, your cooking magic,
          your games and giggles, and the sunsets you love. No faces needed, just stories.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22 }}
          className="mt-6 text-base/7 sm:text-lg/8 text-white"
        >
          This is my love letter to you… I value you, treasure you, and will always see you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 flex justify-center gap-3"
        >
          <a
            href="#stories"
            className="rounded-full bg-white/20 px-5 py-2 text-white backdrop-blur-md hover:bg-white/30"
          >
            Start reading
          </a>
          <a
            href="#about"
            className="rounded-full border border-white/50 px-5 py-2 text-white hover:bg-white/10"
          >
            About this gift
          </a>
        </motion.div>
      </div>

      {/* Blue confetti appears on hero only */}
      <ConfettiOnScroll/>
    </section>
  );
}
