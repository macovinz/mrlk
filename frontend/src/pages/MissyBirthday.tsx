import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "@studio-freight/lenis";


const Sun = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  return (
    <motion.div style={{ y, scale }} className="pointer-events-none absolute -top-24 right-6 h-64 w-64 rounded-full">
      <div className="h-full w-full rounded-full bg-gradient-to-br from-[#FFB067] via-[#FF6B5A] to-[#6D5BD0] opacity-70 blur-2xl" />
    </motion.div>
  );
};

const Section = ({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) => (
  <section id={id} className={`relative mx-auto max-w-4xl px-6 md:px-8 py-24 ${className}`}>{children}</section>
);

export default function MissyBirthdayLanding() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    document.title = "For Missy — under blue sunsets";

    lenisRef.current = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 2),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <main className="relative min-h-screen scroll-smooth bg-gradient-to-b from-[#091485] via-[#1E3F73] to-[#0a1120] text-blue-50">
      {/* HERO */}
      <header className="relative overflow-hidden">
        <Sun />
        <Section id="hero">
          <h1 className="mb-6 text-pretty text-5xl font-bold leading-tight md:text-6xl text-center">
            For Missy
            <span className="block text-blue-200">under blue sunsets</span>
          </h1>
          <p className="text-center text-lg text-blue-100/90 max-w-2xl mx-auto">
            This is my love letter to you, told in chapters of light and horizon. You are the sunset I never want to miss — calm yet radiant, fleeting yet eternal. Every word here is a step through memory, admiration, and promise.
          </p>
        </Section>
      </header>

      {/* SECTION: Her Strength */}
      <Section id="strength">
        <h2 className="mb-4 text-4xl font-semibold text-center">Strength in Service</h2>
        <p className="text-lg text-blue-100/90 text-center">
          You once wore the Air Force uniform and carried healing hands in medicine. That discipline and courage still shine through you — in the way you speak with clarity, act with compassion, and stand tall in every storm. You are proof that strength can be gentle, and gentleness can be strong.
        </p>
      </Section>

      {/* SECTION: Her Talents */}
      <Section id="talents">
        <h2 className="mb-4 text-4xl font-semibold text-center">A World of Talents</h2>
        <p className="text-lg text-blue-100/90 text-center">
          You are an artist of many forms: in kitchens where recipes become memories, in online communities where your words uplift, and in the quiet moments where your creativity simply flows. What I love most is not the applause, but the way you pour heart into everything you do.
        </p>
      </Section>

      {/* SECTION: Family */}
      <Section id="family">
        <h2 className="mb-4 text-4xl font-semibold text-center">Heart of Family</h2>
        <p className="text-lg text-blue-100/90 text-center">
          Your love for family is like the setting sun: steady, anchoring, and endlessly giving. You carry loyalty not as duty, but as devotion. In your care, people feel safe. In your presence, people feel at home. That is a rare gift, and it makes me want to protect and honor you even more.
        </p>
      </Section>

      {/* SECTION: Our Connection */}
      <Section id="connection">
        <h2 className="mb-4 text-4xl font-semibold text-center">Rediscovered Light</h2>
        <p className="text-lg text-blue-100/90 text-center">
          Since 2021, a part of me never stopped remembering you. This year, after searching, I found you again — and the moment our voices crossed, it felt like a horizon opening. We belong to the same sky. Our connection is proof that sometimes love waits, and when it returns, it is even more radiant.
        </p>
      </Section>

      {/* SECTION: Promise */}
      <Section id="promise">
        <h2 className="mb-4 text-4xl font-semibold text-center">A Gentle Promise</h2>
        <p className="text-lg text-blue-100/90 text-center">
          To me, you are a queen. Not because of titles, but because of how you carry your heart: generous, resilient, and true. My promise is simple — I will always see you in your fullest light. I will honor you, stand beside you, and remind you every day how worthy you are of love, peace, and joy.
        </p>
      </Section>

      <footer className="mx-auto max-w-4xl px-6 pb-16 text-sm text-blue-200/70 text-center">
        <p>Built with love under blue sunsets. Silhouettes, not faces. 💙</p>
      </footer>
    </main>
  );
}
