// src/components/Layout.tsx
import React, { useEffect } from "react";
import Header from "@/components/Header";
import BackgroundGradientAnimation from "@/components/BackgroundGradientAnimation";
import Footer from "@/components/Footer";
import SmoothScroll from "./SmoothScroll";

function useScrollEasing() {
  useEffect(() => {
    document.documentElement.classList.add("lenis-smooth-lite");
    return () => document.documentElement.classList.remove("lenis-smooth-lite");
  }, []);
}

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("reveal-in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);
}

export default function Layout({ children }: { children: React.ReactNode }) {
  useScrollEasing();
  useRevealOnScroll();
  return (
    <div id="app-root" className="relative min-h-screen">
      <BackgroundGradientAnimation interactive={false} containerClassName="-z-10" />
      <div
        aria-hidden
        className="pointer-events-none fixed top-[100vh] left-0 right-0 h-24 -z-10"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.02), rgba(0,0,0,0))",
          mixBlendMode: "soft-light",
        }}
      />

      <Header />
      <div className="relative z-10">{children}</div>
      <SmoothScroll/>
      <Footer/>
    </div>
  );
}
