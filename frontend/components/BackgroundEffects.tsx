"use client";

import { useEffect, useRef } from "react";

export function BackgroundEffects() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!particlesRef.current) return;

    // Create floating particles
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "absolute w-2 h-2 bg-indigo-400/50 rounded-full animate-float";
      particle.style.left = Math.random() * 100 + "%";
      particle.style.top = Math.random() * 100 + "%";
      particle.style.animationDelay = Math.random() * 2 + "s";
      particle.style.animationDuration = 3 + Math.random() * 2 + "s";
      particlesRef.current.appendChild(particle);
    }
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/30 rounded-full blur-3xl animate-glow"></div>
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-glow"
        style={{ animationDelay: "1s" }}
      ></div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0"></div>
    </div>
  );
}
