// src/pages/Home.tsx
import { useEffect } from "react";
import Hero from "@/components/Hero";
import GentleScroller from "@/components/GentleScroller";

export default function Home() {
  useEffect(() => { document.title = "For Mechiel — Stories at Sunset"; }, []);
  return (
    <>
      <Hero />
      <section id="stories">
        <GentleScroller />
      </section>
      
    </>
  );
}
