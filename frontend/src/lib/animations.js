"use client";
import { useEffect, useRef } from "react";

export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return ref;
}

export function RevealDiv({ children, className = "", direction = "up", delay = 0, ...props }) {
  const dirClass = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : direction === "scale" ? "reveal-scale" : "reveal";
  const ref = useReveal();
  return <div ref={ref} className={`${dirClass} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...props}>{children}</div>;
}
