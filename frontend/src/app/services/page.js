"use client";
import Link from "next/link";
import { useState } from "react";
import { Heart, ArrowRight, QrCode, Users, Camera, LayoutDashboard, Sparkles, CheckCircle, Zap, Clock } from "lucide-react";
import { RevealDiv } from "@/lib/animations";
import Footer from "@/components/Footer";
import WedoraLogo from "@/components/WedoraLogo";
import CTA from "@/components/CTA";
import Navbar from "@/components/Shared/Navbar/Navbar";

function QRCodeSVG({ size = 120 }) {
  const cells = [
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,0,1,1,0,1,1,1,0,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,0,1],
    [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
    [1,0,1,0,1,1,1,1,0,0,1,0,1,1,0,1,0],
    [0,0,0,0,0,0,0,0,1,0,1,1,0,1,1,0,1],
    [1,1,1,1,1,1,1,0,0,1,1,0,1,0,1,1,0],
    [1,0,0,0,0,0,1,0,1,0,0,1,0,1,0,1,1],
    [1,0,1,1,1,0,1,0,1,1,1,0,1,0,1,0,1],
    [1,0,1,1,1,0,1,0,0,0,1,1,0,1,0,1,0],
    [1,0,1,1,1,0,1,0,1,0,0,1,1,0,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,1,1,0,1],
  ];
  const cellSize = size / 19;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" rx="8" />
      {cells.map((row, y) => row.map((cell, x) => cell ? (
        <rect key={`${x}-${y}`} x={x * cellSize + cellSize} y={y * cellSize + cellSize} width={cellSize} height={cellSize} fill="#2C2420" rx="1" />
      ) : null))}
    </svg>
  );
}

function PhoneMockup({ children, className = "" }) {
  return (
    <div className={`relative mx-auto ${className}`}>
      <div className="bg-deep-brown rounded-[2rem] p-2.5 shadow-2xl shadow-deep-brown/20">
        <div className="bg-white rounded-[1.5rem] overflow-hidden relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-5 bg-deep-brown rounded-b-xl z-10" />
          <div className="h-9 bg-champagne/30 flex items-end justify-between px-6 pb-1">
            <span className="text-[10px] font-medium text-deep-brown">9:41</span>
            <div className="w-4 h-2.5 border border-deep-brown/40 rounded-sm relative"><div className="absolute inset-0.5 bg-deep-brown/60 rounded-[1px]" style={{ width: "70%" }} /></div>
          </div>
          <div className="min-h-[420px]">{children}</div>
          <div className="h-6 flex items-center justify-center">
            <div className="w-24 h-1 bg-deep-brown/20 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      {/* NAV */}
      <>
      <Navbar />
      </>

      {/* HERO */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-champagne/30 to-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="hero-stagger text-sm font-medium tracking-[0.3em] text-muted-gold uppercase mb-4" style={{ animationDelay: "0.2s" }}>What We Do</p>
          <h1 className="hero-stagger font-display text-5xl sm:text-6xl lg:text-7xl font-light text-deep-brown leading-tight mb-6" style={{ animationDelay: "0.4s" }}>
            Complete wedding<br /><span className="italic text-shimmer">technology</span>
          </h1>
          <p className="hero-stagger text-lg text-warm-gray max-w-2xl mx-auto" style={{ animationDelay: "0.6s" }}>
            From guest registration to AI-powered memory preservation, we handle every aspect of your digital wedding experience.
          </p>
        </div>
      </section>

      {/* SERVICE 1: QR */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary mb-5"><QrCode className="h-7 w-7" /></div>
                <h2 className="font-display text-3xl sm:text-4xl text-deep-brown mb-4">QR-Powered Guest Access</h2>
                <p className="text-warm-gray leading-relaxed mb-6 text-lg">Every wedding gets a unique QR code. Guests scan it with their phone camera and instantly access a beautiful mobile experience — no app download, no account creation.</p>
                <ul className="space-y-3 mb-8">
                  {["Unique QR code per wedding", "Works with any phone camera", "No app download required", "Instant access in 2 seconds"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-warm-gray"><CheckCircle className="h-4 w-4 text-sage flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
                <Link href="/register" className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-muted-gold transition-colors">Try it now <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              </div>
              <div className="flex justify-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-md auto-rows-[100px]">
                  <div className="col-span-1 row-span-2 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&auto=format&fit=crop&q=80" alt="Ceremony" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2"><p className="text-white text-[9px] font-medium">Scan to enter</p></div>
                  </div>
                  <div className="col-span-1 row-span-1 rounded-lg bg-white border border-border p-3 flex flex-col items-center justify-center">
                    <QRCodeSVG size={60} />
                    <p className="text-[8px] text-warm-gray mt-1.5 font-medium">Sarah & James</p>
                  </div>
                  <div className="col-span-1 row-span-1 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&auto=format&fit=crop&q=80" alt="Flowers" className="h-full w-full object-cover" />
                  </div>
                  <div className="col-span-1 row-span-1 rounded-lg bg-ivory p-3 flex flex-col justify-center">
                    <p className="text-[9px] text-muted-gold uppercase tracking-wider mb-1">Welcome to</p>
                    <p className="font-display text-sm text-deep-brown font-medium">Sarah & James</p>
                    <p className="text-[8px] text-warm-gray">June 15, 2025</p>
                  </div>
                  <div className="col-span-1 row-span-1 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=300&auto=format&fit=crop&q=80" alt="Couple" className="h-full w-full object-cover" />
                  </div>
                  <div className="col-span-2 row-span-1 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600&auto=format&fit=crop&q=80" alt="Celebration" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-deep-brown/60 to-transparent" />
                    <div className="absolute bottom-2.5 left-3"><p className="text-white text-[10px] font-medium">Guest Experience</p><p className="text-white/60 text-[8px]">No app needed</p></div>
                  </div>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* SERVICE 2: Contributions */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv direction="right">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-muted-gold/10 text-muted-gold mb-5"><Heart className="h-7 w-7" /></div>
                <h2 className="font-display text-3xl sm:text-4xl text-deep-brown mb-4">Contribution Registration</h2>
                <p className="text-warm-gray leading-relaxed mb-6 text-lg">Guests register their contributions digitally — physical gifts, monetary, or heartfelt messages. Everything is tracked and organized privately.</p>
                <ul className="space-y-3 mb-8">
                  {["Physical gifts, monetary, or messages", "Private — MC sees names only", "Guest adds personal note", "Real-time queue updates"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-warm-gray"><CheckCircle className="h-4 w-4 text-sage flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="lg:order-1 flex justify-center">
                <PhoneMockup className="w-[250px]">
                  <div className="p-4">
                    <p className="font-display text-base text-deep-brown mb-1">Register Gift</p>
                    <p className="text-[10px] text-warm-gray mb-4">Sarah & James&apos; Wedding</p>
                    <div className="space-y-3">
                      <div><label className="text-[10px] text-warm-gray mb-1 block">Your Name</label><div className="h-9 bg-champagne/50 rounded-md px-3 flex items-center"><span className="text-xs text-deep-brown">Amara Johnson</span></div></div>
                      <div><label className="text-[10px] text-warm-gray mb-1 block">Gift Type</label><div className="grid grid-cols-3 gap-1.5">{["Physical", "Monetary", "Message"].map((t, i) => (<div key={t} className={`h-8 rounded-md flex items-center justify-center text-[10px] font-medium border ${i === 1 ? "bg-muted-gold text-white border-muted-gold" : "bg-white text-warm-gray border-border"}`}>{t}</div>))}</div></div>
                      <div><label className="text-[10px] text-warm-gray mb-1 block">Amount (RWF)</label><div className="h-9 bg-champagne/50 rounded-md px-3 flex items-center"><span className="text-xs text-deep-brown">50,000</span></div></div>
                      <div><label className="text-[10px] text-warm-gray mb-1 block">Personal Note</label><div className="h-14 bg-champagne/50 rounded-md px-3 py-2"><span className="text-[10px] text-warm-gray leading-relaxed">Wishing you a lifetime of love and happiness!</span></div></div>
                      <div className="h-9 bg-primary rounded-md flex items-center justify-center"><span className="text-[10px] font-medium text-white">Submit Contribution</span></div>
                    </div>
                  </div>
                </PhoneMockup>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* SERVICE 3: MC Queue */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-deep-wine/10 text-deep-wine mb-5"><Users className="h-7 w-7" /></div>
                <h2 className="font-display text-3xl sm:text-4xl text-deep-brown mb-4">MC Acknowledgement Queue</h2>
                <p className="text-warm-gray leading-relaxed mb-6 text-lg">A real-time queue showing guest names only. The MC acknowledges contributions with a single tap. Gift details stay completely private.</p>
                <ul className="space-y-3 mb-8">
                  {["Names only — no gift details visible", "Real-time via WebSocket", "One-tap acknowledge", "Undo if mistake"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-warm-gray"><CheckCircle className="h-4 w-4 text-sage flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="bg-charcoal rounded-xl shadow-2xl p-4 w-full max-w-md">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2"><Heart className="h-4 w-4 text-muted-gold" fill="currentColor" /><span className="text-sm font-medium text-white">MC Queue</span></div>
                    <div className="flex items-center gap-2"><div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" /><span className="text-[10px] text-white/50">Live</span></div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: "Amara Johnson", time: "Just now", pending: true },
                      { name: "Pierre & Marie Dubois", time: "1 min ago", pending: true },
                      { name: "David Mukamuri", time: "2 min ago", pending: false },
                      { name: "Sarah Kimani", time: "3 min ago", pending: false },
                      { name: "Grace Nkurunziza", time: "5 min ago", pending: false },
                    ].map((item, i) => (
                      <div key={i} className={`flex items-center justify-between p-3 rounded-lg ${item.pending ? "bg-white/10 border border-white/10" : "bg-white/5 opacity-50"}`}>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-champagne/20 flex items-center justify-center text-[10px] font-medium text-white">{item.name.split(" ").map(w => w[0]).join("").slice(0, 2)}</div>
                          <div><p className="text-xs font-medium text-white">{item.name}</p><p className="text-[10px] text-white/40">{item.time}</p></div>
                        </div>
                        {item.pending ? <div className="h-7 px-3 rounded-md bg-muted-gold text-white flex items-center justify-center"><span className="text-[10px] font-medium">Acknowledge</span></div> : <CheckCircle className="h-4 w-4 text-green-400/60" />}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between text-[10px] text-white/40"><span>3 acknowledged</span><span>2 pending</span><span>Total: 5</span></div>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* SERVICE 4: Memory Capture */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv direction="right">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-sage/10 text-sage mb-5"><Camera className="h-7 w-7" /></div>
                <h2 className="font-display text-3xl sm:text-4xl text-deep-brown mb-4">Collaborative Memory Capture</h2>
                <p className="text-warm-gray leading-relaxed mb-6 text-lg">Guests capture photos and videos directly through the web browser. No app installation required. Every angle of your day, preserved.</p>
                <ul className="space-y-3 mb-8">
                  {["In-browser camera access", "Photo and video support", "Instant upload", "Guest name attribution"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-warm-gray"><CheckCircle className="h-4 w-4 text-sage flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="lg:order-1 flex justify-center">
                <div className="grid grid-cols-2 gap-2 w-full max-w-sm auto-rows-[120px]">
                  <div className="col-span-2 row-span-2 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80" alt="Wedding couple" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent" />
                    <div className="absolute bottom-3 left-3"><p className="text-white text-xs font-medium">Guest capture</p><p className="text-white/60 text-[10px]">Amara Johnson</p></div>
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop&q=80" alt="Ceremony" className="h-full w-full object-cover" />
                  </div>
                  <div className="rounded-lg overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&auto=format&fit=crop&q=80" alt="Venue" className="h-full w-full object-cover" />
                  </div>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* SERVICE 5: Live Memory Wall */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-dusty-rose/10 text-dusty-rose mb-5"><LayoutDashboard className="h-7 w-7" /></div>
                <h2 className="font-display text-3xl sm:text-4xl text-deep-brown mb-4">Live Memory Wall</h2>
                <p className="text-warm-gray leading-relaxed mb-6 text-lg">Approved photos appear on a large screen at the venue in real-time. A beautiful, moderated digital experience that keeps guests engaged all night.</p>
                <ul className="space-y-3 mb-8">
                  {["Real-time photo display", "Moderation before publish", "Full-screen slideshow mode", "Auto-rotate with transitions"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-warm-gray"><CheckCircle className="h-4 w-4 text-sage flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-center">
                <div className="w-full max-w-lg">
                  <div className="bg-charcoal rounded-t-lg p-2"><div className="flex items-center gap-1.5 px-2"><div className="h-2 w-2 rounded-full bg-red-400" /><div className="h-2 w-2 rounded-full bg-yellow-400" /><div className="h-2 w-2 rounded-full bg-green-400" /><span className="text-[9px] text-white/30 ml-2">Memory Wall — Sarah & James</span></div></div>
                  <div className="bg-charcoal rounded-b-lg p-1.5">
                    <div className="bg-ivory rounded-md overflow-hidden">
                      <div className="grid grid-cols-4 grid-rows-3 gap-1 p-1.5" style={{ height: "280px" }}>
                        <div className="col-span-2 row-span-2 rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80" alt="Wedding couple" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-2 left-2"><p className="text-white text-[9px] font-medium">Sarah & James</p></div>
                        </div>
                        <div className="rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=300&auto=format&fit=crop&q=80" alt="Ceremony" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                          <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity"><p className="text-white text-[8px]">Ceremony</p></div>
                        </div>
                        <div className="rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=300&auto=format&fit=crop&q=80" alt="Flowers" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-sage flex items-center justify-center"><CheckCircle className="h-2.5 w-2.5 text-white" /></div>
                        </div>
                        <div className="rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=300&auto=format&fit=crop&q=80" alt="Couple" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1460978812857-470ed1c77af0?w=300&auto=format&fit=crop&q=80" alt="Bride groom" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-sage flex items-center justify-center"><CheckCircle className="h-2.5 w-2.5 text-white" /></div>
                        </div>
                        <div className="col-span-2 rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600&auto=format&fit=crop&q=80" alt="Celebration" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                          <div className="absolute bottom-2 left-2"><p className="text-white text-[9px] font-medium">Celebration</p></div>
                        </div>
                        <div className="rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=300&auto=format&fit=crop&q=80" alt="Venue" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="rounded-md overflow-hidden relative group">
                          <img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=300&auto=format&fit=crop&q=80" alt="Rings" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-sage flex items-center justify-center"><CheckCircle className="h-2.5 w-2.5 text-white" /></div>
                        </div>
                      </div>
                      <div className="bg-champagne/30 px-3 py-2 flex items-center justify-between">
                        <span className="text-[10px] text-warm-gray">8 photos approved</span>
                        <div className="flex items-center gap-1"><div className="h-1.5 w-1.5 rounded-full bg-sage animate-pulse" /><span className="text-[10px] text-warm-gray">Live</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* SERVICE 6: AI Intelligence */}
      <section className="py-24 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv direction="right">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="lg:order-2">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-lg bg-rich-gold/10 text-rich-gold mb-5"><Sparkles className="h-7 w-7" /></div>
                <h2 className="font-display text-3xl sm:text-4xl text-deep-brown mb-4">AI-Powered Intelligence</h2>
                <p className="text-warm-gray leading-relaxed mb-6 text-lg">Automatic quality assessment, duplicate detection, smart albums, and AI-generated wedding stories — all running in the background without slowing anything down.</p>
                <ul className="space-y-3 mb-8">
                  {["Photo quality scoring (blur, exposure, composition)", "Perceptual hash duplicate detection", "AI-curated smart albums and highlights", "Auto-generated wedding stories"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-warm-gray"><CheckCircle className="h-4 w-4 text-sage flex-shrink-0" /> {f}</li>
                  ))}
                </ul>
              </div>
              <div className="lg:order-1 flex justify-center">
                <div className="grid grid-cols-3 gap-2 w-full max-w-sm auto-rows-[100px]">
                  <div className="col-span-2 row-span-2 rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&auto=format&fit=crop&q=80" alt="AI analyzed photo" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="flex items-center gap-1.5 mb-1"><Sparkles className="h-3 w-3 text-rich-gold" /><span className="text-white text-xs font-medium">AI Quality: 92%</span></div>
                      <div className="h-1 bg-white/20 rounded-full overflow-hidden"><div className="h-full bg-rich-gold rounded-full" style={{ width: "92%" }} /></div>
                    </div>
                  </div>
                  <div className="rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=250&auto=format&fit=crop&q=80" alt="Detail photo" className="h-full w-full object-cover" />
                    <div className="absolute top-1.5 right-1.5 h-5 px-1.5 bg-sage rounded flex items-center justify-center"><span className="text-[8px] text-white font-medium">95%</span></div>
                  </div>
                  <div className="rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=250&auto=format&fit=crop&q=80" alt="Venue photo" className="h-full w-full object-cover" />
                    <div className="absolute top-1.5 right-1.5 h-5 px-1.5 bg-sage rounded flex items-center justify-center"><span className="text-[8px] text-white font-medium">88%</span></div>
                  </div>
                  <div className="rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=250&auto=format&fit=crop&q=80" alt="Celebration photo" className="h-full w-full object-cover" />
                    <div className="absolute top-1.5 right-1.5 h-5 px-1.5 bg-dusty-rose rounded flex items-center justify-center"><span className="text-[8px] text-white font-medium">78%</span></div>
                  </div>
                  <div className="rounded-lg overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1507504031003-b417219a0fde?w=250&auto=format&fit=crop&q=80" alt="Rings photo" className="h-full w-full object-cover" />
                    <div className="absolute top-1.5 right-1.5 h-5 px-1.5 bg-sage rounded flex items-center justify-center"><span className="text-[8px] text-white font-medium">97%</span></div>
                  </div>
                </div>
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      <CTA
        title="Ready to experience Wedora?"
        subtitle="Start free — no credit card required. Join hundreds of couples who trust us with their most important day."
        buttonText="Get Started"
      />

      <Footer />
    </div>
  );
}
