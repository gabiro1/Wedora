"use client";
import Link from "next/link";
import { Heart, ArrowRight, QrCode, Users, Camera, LayoutDashboard, Sparkles, Shield, Zap, Clock, Globe, Search, Layers, BookOpen } from "lucide-react";
import { RevealDiv } from "@/lib/animations";
import Footer from "@/components/Footer";
import WedoraLogo from "@/components/WedoraLogo";
import CTA from "@/components/CTA";
import Navbar from "@/components/Shared/Navbar/Navbar";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
     <><Navbar /></>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-champagne/30 to-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="hero-stagger text-sm font-medium tracking-[0.3em] text-muted-gold uppercase mb-4" style={{ animationDelay: "0.2s" }}>Features</p>
          <h1 className="hero-stagger font-display text-5xl sm:text-6xl lg:text-7xl font-light text-deep-brown leading-tight mb-6" style={{ animationDelay: "0.4s" }}>
            Built for <span className="italic text-shimmer">real</span> weddings
          </h1>
          <p className="hero-stagger text-lg text-warm-gray max-w-2xl mx-auto" style={{ animationDelay: "0.6s" }}>
            Every feature is designed with one goal: making your wedding experience seamless and memorable.
          </p>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {[
              { icon: QrCode, title: "QR-Powered Experience", desc: "Each wedding gets a unique QR code. Guests scan it and immediately enter a beautiful, mobile-first experience.", color: "bg-primary/10 text-primary" },
              { icon: Heart, title: "Contribution Registration", desc: "Guests register contributions digitally — physical gifts, monetary, or heartfelt messages. The MC sees only names.", color: "bg-muted-gold/10 text-muted-gold" },
              { icon: Users, title: "MC Acknowledgement Queue", desc: "Real-time queue showing only guest names. The MC acknowledges contributions with a single tap.", color: "bg-deep-wine/10 text-deep-wine" },
              { icon: Camera, title: "Collaborative Memories", desc: "Guests capture photos and videos directly through the web camera. No app installation required.", color: "bg-sage/10 text-sage" },
              { icon: LayoutDashboard, title: "Live Memory Wall", desc: "Approved photos appear on a large screen at the venue in real-time.", color: "bg-dusty-rose/10 text-dusty-rose" },
              { icon: Shield, title: "Privacy First", desc: "Every upload is moderated. Guests control their contributions. Nothing goes public without approval.", color: "bg-warm-gray/10 text-warm-gray" },
              { icon: Sparkles, title: "AI Quality Assessment", desc: "Automatic photo quality scoring — blur detection, exposure analysis, composition scoring.", color: "bg-rich-gold/10 text-rich-gold" },
              { icon: Search, title: "Smart Search", desc: "Natural language search across all memories. Find photos by description, guest name, or tags.", color: "bg-primary/10 text-primary" },
              { icon: Layers, title: "Smart Albums", desc: "AI automatically organizes photos into sections — ceremony, reception, family, friends.", color: "bg-muted-gold/10 text-muted-gold" },
              { icon: BookOpen, title: "Wedding Stories", desc: "AI-generated narratives from your wedding day. A beautiful written account of every moment.", color: "bg-sage/10 text-sage" },
              { icon: Zap, title: "Instant Upload", desc: "Photos and videos upload instantly via the browser. No app, no friction.", color: "bg-dusty-rose/10 text-dusty-rose" },
              { icon: Globe, title: "Multi-Language", desc: "Support for English, French, and Kinyarwanda. Your guests feel at home.", color: "bg-deep-wine/10 text-deep-wine" },
            ].map((f, i) => (
              <RevealDiv key={i}>
                <div className="group p-8 rounded-2xl bg-ivory border border-muted-gold/30  hover:border-muted-gold/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${f.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <f.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-deep-brown mb-3">{f.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{f.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Experience it yourself"
        subtitle="Create your wedding in minutes. No credit card required."
        buttonText="Get Started Free"
      />

      <Footer />
    </div>
  );
}
