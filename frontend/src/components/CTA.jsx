"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RevealDiv } from "@/lib/animations";

export default function CTA({ title, subtitle, buttonText = "Get Started" }) {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1400&auto=format&fit=crop&q=80" alt="Wedding" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-brown/90 via-deep-brown/80 to-deep-brown/70" />
      </div>
      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <RevealDiv direction="scale">
          <h2 className="font-display text-4xl sm:text-5xl font-light text-white mb-6">{title}</h2>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto">{subtitle}</p>
          <Link href="/register" className="group inline-flex items-center h-14 px-10 bg-muted-gold text-white rounded-md text-lg font-medium hover:bg-rich-gold transition-all shadow-lg shadow-muted-gold/30 hover:shadow-xl hover:shadow-muted-gold/40 hover:-translate-y-0.5">
            {buttonText} <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </RevealDiv>
      </div>
    </section>
  );
}
