"use client";
import Link from "next/link";
import { Heart, ArrowRight, Users, Sparkles, Shield, Globe, Award, Target } from "lucide-react";
import { useReveal, RevealDiv } from "@/lib/animations";
import Footer from "@/components/Footer";
import WedoraLogo from "@/components/WedoraLogo";
import CTA from "@/components/CTA";
import Navbar from "@/components/Shared/Navbar/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Nav */}
      <><Navbar /></>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-champagne/30 to-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm font-medium tracking-[0.3em] text-muted-gold uppercase mb-4 hero-stagger" style={{ animationDelay: "0.2s" }}>Our Story</p>
          <h1 className="hero-stagger font-display text-5xl sm:text-6xl lg:text-7xl font-light text-deep-brown leading-tight mb-6" style={{ animationDelay: "0.4s" }}>
            We believe every wedding<br />deserves to be <span className="italic text-shimmer">remembered</span>.
          </h1>
          <p className="hero-stagger text-lg text-warm-gray max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: "0.6s" }}>
            Born from a simple observation, Wedora transforms how couples experience and preserve their most important day.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <RevealDiv direction="left">
              <div className="space-y-6 text-warm-gray leading-relaxed">
                <p className="text-lg">Weddings are one of life&apos;s most treasured moments, yet so much of the experience gets lost  untracked contributions, scattered photos, forgotten names.</p>
                <p>We started Wedora because we saw couples struggling with the same problems: guests wanting to help but having no easy way, photos scattered across dozens of phones, MCs fumbling with paper lists, and memories fading because nobody organized them.</p>
                <p>We built a platform that brings everything together in one elegant place. From the moment guests scan a QR code to the days after the celebration, Wedora ensures every contribution is recorded, every photo is preserved, and every memory is accessible forever.</p>
                <p>Our technology works quietly in the background  no apps to download, no accounts required for guests. Just a beautiful, seamless experience that lets couples focus on what matters most: each other.</p>
              </div>
            </RevealDiv>
            <RevealDiv direction="right">
              <div className="bg-gradient-to-br from-champagne to-soft-beige rounded-3xl p-10">
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { icon: Users, label: "Team Members", value: "12+" },
                    { icon: Globe, label: "Countries Served", value: "8" },
                    { icon: Award, label: "Awards Won", value: "3" },
                    { icon: Target, label: "Our Mission", value: "1" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/80 rounded-2xl p-5 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <s.icon className="h-6 w-6 text-muted-gold mx-auto mb-2" />
                      <p className="font-display text-2xl text-deep-brown">{s.value}</p>
                      <p className="text-xs text-warm-gray mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">Our Values</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-deep-brown">What drives us</h2>
          </RevealDiv>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children">
            {[
              { icon: Heart, title: "Love First", desc: "Every decision we make is guided by love for our craft, for our users, and for the couples who trust us with their most important day." },
              { icon: Shield, title: "Privacy Always", desc: "Wedding memories are deeply personal. We never sell data, never show ads, and give couples complete control over who sees what." },
              { icon: Sparkles, title: "Elegant Simplicity", desc: "Technology should feel invisible. We obsess over making complex things simple so couples and guests can focus on the celebration." },
            ].map((v, i) => (
              <RevealDiv key={i}>
                <div className="bg-white rounded-2xl p-8 border border-border/50 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-champagne mb-5">
                    <v.icon className="h-7 w-7 text-muted-gold" />
                  </div>
                  <h3 className="font-display text-xl text-deep-brown mb-3">{v.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{v.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to start?"
        subtitle="Join hundreds of couples who trust Wedora with their wedding."
        buttonText="Get Started Free"
      />

      <Footer />
    </div>
  );
}
