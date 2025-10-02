// src/pages/Home.tsx
import { useEffect } from "react";
import Hero from "@/components/Hero";
import GentleScroller from "@/components/GentleScroller";
import GlassCTA from "@/components/GlassCTA";

export default function Home() {
  useEffect(() => { document.title = "For Mechiel — Stories at Sunset"; }, []);
  return (
    <>
      <Hero />
      <section id="stories" className="relative z-10">
        <GentleScroller />
      </section>
      <div className="relative z-10">
        <GlassCTA />
      </div>
    </>
  );
}
