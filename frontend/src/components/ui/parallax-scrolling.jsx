"use client";
import React, { useState, useEffect } from "react";

const images = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1565038930214-09566ed2149b?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1600&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=1600&auto=format&fit=crop&q=80",
];

export function HeroSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[600px] w-full overflow-hidden">
      {/* Images */}
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />

      {/* Bottom gradient fade */}
      <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[var(--background)] via-transparent to-transparent" />

      {/* Text */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
        <p className="hero-stagger text-sm font-medium tracking-[0.35em] text-muted-gold uppercase mb-5" style={{ animationDelay: "0.2s" }}>
          Wedding Technology
        </p>
        <h1 className="hero-stagger font-hero text-5xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.08] mb-7" style={{ animationDelay: "0.4s", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
          Every contribution <em className="text-muted-gold not-italic">remembered.</em>
          <br />
          Every moment <em className="text-muted-gold not-italic">preserved.</em>
        </h1>
        <p className="hero-stagger text-lg text-white/80 max-w-xl mb-10 leading-relaxed" style={{ animationDelay: "0.6s", textShadow: "0 1px 4px rgba(0,0,0,0.4)" }}>
          A premium digital platform that transforms how couples experience their wedding day.
        </p>
      </div>
    </section>
  );
}

export default HeroSlideshow;
