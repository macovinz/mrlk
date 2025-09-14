// src/components/Layout.tsx
"use client";

import React from "react";
import Header from "@/components/Header";
import SmoothScroll from "@/components/SmoothScroll";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div id="app-root" className="relative min-h-screen bg-transparent text-white">
      {/* Lenis smooth scrolling (client-only) */}
      <SmoothScroll />

      <Header />
      {children}
    </div>
  );
}
