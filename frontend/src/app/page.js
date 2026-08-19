"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Heart, Camera, QrCode, Shield, Users, LayoutDashboard, Sparkles, Menu, X, Mail, Phone, MapPin, ArrowRight, ChevronRight, Zap, Clock, Globe } from "lucide-react";
import WedoraLogo from "@/components/WedoraLogo";
import ThemeToggle from "@/components/ThemeToggle";
import CircularTestimonials from "@/components/ui/circular-testimonials";
import HeroSlideshow from "@/components/ui/parallax-scrolling";
import Footer from "@/components/Footer";
import CTA from "@/components/CTA";

function useReveal(threshold = 0.12) {
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

function RevealDiv({ children, className = "", direction = "up", delay = 0, ...props }) {
  const dirClass = direction === "left" ? "reveal-left" : direction === "right" ? "reveal-right" : direction === "scale" ? "reveal-scale" : "reveal";
  const ref = useReveal();
  return <div ref={ref} className={`${dirClass} ${className}`} style={{ transitionDelay: `${delay}ms` }} {...props}>{children}</div>;
}

function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const duration = 2000;
        const step = (timestamp) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * target));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
  ];

  const testimonialData = [
    {
      quote: "Wedora made our wedding so much more special. Every guest could contribute and capture moments without any hassle. The MC queue was a game-changer for us.",
      name: "Sarah & James",
      designation: "Married June 2025",
      src: "https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80",
    },
    {
      quote: "The QR code experience was seamless. Our elderly relatives could use it without any help. We have memories we never would have captured otherwise.",
      name: "Marie & Pierre",
      designation: "Married December 2024",
      src: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80",
    },
    {
      quote: "The AI album organization saved us hours. Our photos are beautifully categorized and the wedding story feature brought tears to our eyes.",
      name: "Grace & Samuel",
      designation: "Married March 2025",
      src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80",
    },
    {
      quote: "We wanted something modern but elegant. Wedora delivered exactly that. Our guests loved the live memory wall — it kept everyone engaged all night.",
      name: "Amara & David",
      designation: "Married August 2024",
      src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=80",
    },
    {
      quote: "Being able to relive every moment through the smart album is incredible. The quality of photos our guests captured exceeded all our expectations.",
      name: "Chiara & Luca",
      designation: "Married January 2025",
      src: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* ─── NAVIGATION ──────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? "bg-ivory/95 backdrop-blur-xl border-b border-border/50 shadow-sm" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <WedoraLogo className="h-8 w-8" />
              <span className="font-display text-2xl font-semibold text-deep-brown tracking-tight">Wedora</span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm font-medium text-deep-brown hover:text-muted-gold transition-colors relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-muted-gold transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <Link href="/login" className="text-sm font-medium text-deep-brown hover:text-muted-gold transition-colors px-4 py-2">Sign In</Link>
              <Link href="/register" className="text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-md hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20">Create Your Wedding</Link>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 hover:bg-champagne rounded-lg">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-border animate-fade-in">
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-medium text-warm-gray hover:text-foreground hover:bg-champagne rounded-lg transition-all">
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-3 mt-3 space-y-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-medium text-warm-gray hover:text-foreground hover:bg-champagne rounded-lg transition-all">Sign In</Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="block px-3 py-3 text-sm font-medium bg-primary text-white rounded-lg text-center">Create Your Wedding</Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ─── HERO ────────────────────────────────────────── */}
      <HeroSlideshow />

      {/* ─── HERO CTA BAR ───────────────────────────────── */}
      <section className="relative -mt-32 z-10 pb-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/register" className="group inline-flex items-center justify-center h-14 px-10 bg-primary text-white rounded-md text-lg font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5">
              Create Your Wedding
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/features" className="group inline-flex items-center justify-center h-14 px-10 border border-border bg-white/60 backdrop-blur-sm text-foreground rounded-md text-lg font-medium hover:bg-champagne transition-all hover:-translate-y-0.5">
              Explore Features
            </Link>
          </div>
          <div className="flex items-center justify-center gap-6">
            <div className="flex -space-x-2">
              {["S", "M", "G", "A"].map((l, i) => (
                <div key={i} className="h-9 w-9 rounded-full bg-champagne border-2 border-white flex items-center justify-center text-xs font-medium text-deep-brown">{l}</div>
              ))}
            </div>
            <p className="text-sm text-warm-gray">Trusted by <span className="font-medium text-deep-brown">500+</span> couples</p>
          </div>
        </div>
      </section>

      {/* ─── ABOUT ───────────────────────────────────────── */}
      <section id="about" className="py-28 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <RevealDiv direction="left">
              <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">About Wedora</p>
              <h2 className="font-display text-4xl sm:text-5xl font-light text-deep-brown mb-8 leading-tight">
                We believe every wedding <span className="italic">deserves</span> to be remembered beautifully.
              </h2>
              <div className="space-y-5 text-warm-gray leading-relaxed">
                <p>Wedora was born from a simple observation: weddings are one of life&apos;s most treasured moments, yet so much of the experience gets lost — untracked contributions, scattered photos, forgotten names.</p>
                <p>We built a platform that brings everything together in one elegant place. From the moment guests scan a QR code to the days after the celebration, Wedora ensures every contribution is recorded, every photo is preserved, and every memory is accessible forever.</p>
              </div>
              <Link href="/about" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-muted-gold transition-colors mt-6 group">
                Read our full story <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </RevealDiv>

            <RevealDiv direction="right">
              <div className="grid grid-cols-2 gap-5">
                {[
                  { value: 500, suffix: "+", label: "Weddings" },
                  { value: 50000, suffix: "+", label: "Memories" },
                  { value: 10000, suffix: "+", label: "Guests" },
                  { value: 99, suffix: "%", label: "Satisfaction" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-6 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <p className="font-display text-3xl text-deep-brown">
                      <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-xs text-warm-gray mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ─── MEMORIES GALLERY ──────────────────────────── */}
      <section className="py-28 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">Memories</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-deep-brown dark:text-white">Every moment, beautifully preserved</h2>
            <p className="text-warm-gray mt-4 max-w-2xl mx-auto">See the kind of memories Wedora helps couples keep forever.</p>
          </RevealDiv>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[200px] md:auto-rows-[240px]">
            {/* 1 — Large hero */}
            <RevealDiv className="col-span-2 row-span-2">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=900&auto=format&fit=crop&q=80" alt="Wedding couple walking together" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display text-xl">Sarah & James</p>
                  <p className="text-white/60 text-xs">June 15, 2025</p>
                </div>
              </div>
            </RevealDiv>

            {/* 2 — Ceremony */}
            <RevealDiv className="col-span-1 row-span-1">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&auto=format&fit=crop&q=80" alt="Wedding ceremony" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium">The Ceremony</p>
                </div>
              </div>
            </RevealDiv>

            {/* 3 — Flowers */}
            <RevealDiv className="col-span-1 row-span-2">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&auto=format&fit=crop&q=80" alt="Wedding flowers" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium">Floral Details</p>
                </div>
              </div>
            </RevealDiv>

            {/* 4 — Venue */}
            <RevealDiv className="col-span-1 row-span-1">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&auto=format&fit=crop&q=80" alt="Wedding venue" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium">The Venue</p>
                </div>
              </div>
            </RevealDiv>

            {/* 5 — Couple portrait */}
            <RevealDiv className="col-span-1 row-span-1">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&auto=format&fit=crop&q=80" alt="Couple portrait" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium">Portrait</p>
                </div>
              </div>
            </RevealDiv>

            {/* 6 — Celebration */}
            <RevealDiv className="col-span-1 row-span-1">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1546032996-6dfacbacbf3f?w=600&auto=format&fit=crop&q=80" alt="Wedding celebration" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium">Celebration</p>
                </div>
              </div>
            </RevealDiv>

            {/* 7 — Rings */}
            <RevealDiv className="col-span-1 row-span-1">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&auto=format&fit=crop&q=80" alt="Wedding rings" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium">Rings</p>
                </div>
              </div>
            </RevealDiv>

            {/* 8 — First dance */}
            <RevealDiv className="col-span-2 row-span-1">
              <div className="relative h-full w-full rounded-2xl overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?w=900&auto=format&fit=crop&q=80" alt="First dance" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-display text-lg">The First Dance</p>
                  <p className="text-white/60 text-xs">A moment to cherish forever</p>
                </div>
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* ─── SERVICES ────────────────────────────────────── */}
      <section id="services" className="py-28 bg-ivory ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">What We Do</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-deep-brown dark:text-white">Complete wedding technology</h2>
            <p className="text-warm-gray mt-4 max-w-2xl mx-auto">From guest registration to memory preservation, we handle every aspect of your digital wedding experience.</p>
          </RevealDiv>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children">
            {[
              { icon: QrCode, title: "QR-Powered Guest Access", desc: "Every wedding gets a unique QR code. Guests scan it and instantly access a beautiful, mobile-first experience.", color: "bg-primary/10 text-primary" },
              { icon: Heart, title: "Contribution Registration", desc: "Guests register contributions digitally — physical gifts, monetary, or heartfelt messages. The MC sees only names.", color: "bg-muted-gold/10 text-muted-gold" },
              { icon: Users, title: "MC Acknowledgement Queue", desc: "A real-time queue showing guest names only. The MC acknowledges contributions with a single tap.", color: "bg-deep-wine/10 text-deep-wine" },
              { icon: Camera, title: "Collaborative Memory Capture", desc: "Guests capture photos and videos directly through the web camera. No app installation required.", color: "bg-sage/10 text-sage" },
              { icon: LayoutDashboard, title: "Live Memory Wall", desc: "Approved photos appear on a large screen at the venue in real-time. A beautiful, moderated experience.", color: "bg-dusty-rose/10 text-dusty-rose" },
              { icon: Sparkles, title: "AI-Powered Intelligence", desc: "Quality assessment, duplicate detection, smart albums, and AI-generated wedding stories.", color: "bg-rich-gold/10 text-rich-gold" },
            ].map((service, i) => (
              <RevealDiv key={i}>
                <div className="group p-8 rounded-2xl bg-ivory border border-muted-gold/30  hover:border-muted-gold/30 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 h-full">
                  <div className={`mb-5 inline-flex h-14 w-14 items-center justify-center rounded-xl ${service.color} group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                    <service.icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-xl font-medium text-deep-brown dark:text-white mb-3">{service.title}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{service.desc}</p>
                </div>
              </RevealDiv>
            ))}
          </div>

          <RevealDiv className="text-center mt-12">
            <Link href="/services" className="group inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-muted-gold transition-colors">
              View all services <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </RevealDiv>
        </div>
      </section>

      {/* ─── HOW IT WORKS ────────────────────────────────── */}
      <section className="py-28 bg-ivory dark:bg-[#0A0A0A] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv className="text-center mb-20">
            <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">Simple & Elegant</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-deep-brown dark:text-white">How it works</h2>
          </RevealDiv>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-border dark:bg-[#222222] md:-translate-x-px" />

            <div className="space-y-16 md:space-y-24">
              {[
                { num: "01", title: "Create your wedding", desc: "Set up your wedding in under 2 minutes. Add names, date, venue — and you're ready to go.", icon: LayoutDashboard, img: "https://images.unsplash.com/photo-1519741497674-611481863552?w=500&auto=format&fit=crop&q=80" },
                { num: "02", title: "Share your QR code", desc: "Every wedding gets a unique QR code. Print it, display it, or send it to guests digitally.", icon: QrCode, img: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&auto=format&fit=crop&q=80" },
                { num: "03", title: "Guests scan & participate", desc: "Guests scan the QR code with their phone camera — no app needed. They enter a beautiful mobile experience instantly.", icon: Users, img: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=500&auto=format&fit=crop&q=80" },
                { num: "04", title: "Memories collected in real-time", desc: "Every photo and video guests capture is instantly saved to your private wedding gallery.", icon: Camera, img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=500&auto=format&fit=crop&q=80" },
                { num: "05", title: "Relive forever", desc: "Your AI-organized album is ready after the wedding. Browse, download, and relive every moment for years to come.", icon: Sparkles, img: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=500&auto=format&fit=crop&q=80" },
              ].map((step, i) => (
                <RevealDiv key={i}>
                  <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 === 1 ? "md:direction-rtl" : ""}`}>
                    {/* Number dot */}
                    <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-muted-gold text-white flex items-center justify-center font-display text-sm font-semibold z-10 shadow-lg shadow-muted-gold/20">
                      {step.num}
                    </div>

                    {/* Text */}
                    <div className={`pl-16 md:pl-0 ${i % 2 === 1 ? "md:order-2 md:pl-16" : "md:pr-16"}`}>
                      <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-muted-gold/10 dark:bg-muted-gold/15 mb-4">
                        <step.icon className="h-5 w-5 text-muted-gold" />
                      </div>
                      <h3 className="font-display text-2xl md:text-3xl text-deep-brown dark:text-white mb-3">{step.title}</h3>
                      <p className="text-warm-gray leading-relaxed max-w-md">{step.desc}</p>
                    </div>

                    {/* Image */}
                    <div className={`pl-16 md:pl-0 ${i % 2 === 1 ? "md:order-1 md:pr-16" : "md:pl-16"}`}>
                      <div className="relative rounded-xl overflow-hidden shadow-lg shadow-deep-brown/5 dark:shadow-black/20 group">
                        <img src={step.img} alt={step.title} className="w-full h-64 md:h-72 object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/20 to-transparent" />
                      </div>
                    </div>
                  </div>
                </RevealDiv>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ────────────────────────────────── */}
      <section className="bg-white dark:bg-[#000000]">
        <div className="py-28">
          <RevealDiv className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">Testimonials</p>
            <h2 className="font-display text-4xl sm:text-5xl font-light text-deep-brown dark:text-white">Loved by couples</h2>
          </RevealDiv>

          <div className="flex justify-center">
            <CircularTestimonials
              testimonials={testimonialData}
              autoplay={true}
              colors={{
                name: "#2C2420",
                designation: "#6B6560",
                testimony: "#4b5563",
                arrowBackground: "#2C2420",
                arrowForeground: "#f1f1f7",
                arrowHoverBackground: "#C9A96E",
              }}
              fontSizes={{ name: "28px", designation: "16px", quote: "18px" }}
            />
          </div>
        </div>
      </section>

      {/* ─── CTA ─────────────────────────────────────────── */}
      <CTA
        title="Turn your wedding into a memory that never gets lost."
        subtitle="Join couples who trust Wedora to preserve the most important day of their lives."
        buttonText="Get Started Free"
      />

      {/* ─── FOOTER ──────────────────────────────────────── */}
      <footer className="bg-charcoal text-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <RevealDiv>
              <Link href="/" className="flex items-center gap-2 mb-4">
                <WedoraLogo className="h-8 w-8" />
                <span className="font-display text-2xl font-semibold text-white">Wedora</span>
              </Link>
              <p className="text-sm leading-relaxed mb-6">A premium digital platform that transforms how couples experience their wedding day.</p>
              <div className="flex gap-3">
                {["T", "I", "F"].map((s, i) => (
                  <a key={i} href="#" className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-sm font-medium text-white/40 hover:bg-muted-gold/20 hover:text-muted-gold transition-all duration-300 hover:scale-110">{s}</a>
                ))}
              </div>
            </RevealDiv>

            <RevealDiv delay={100}>
              <h4 className="font-display text-lg text-white mb-5">Product</h4>
              <ul className="space-y-3">
                {["Features", "How It Works", "AI Intelligence", "For MCs"].map((link) => (
                  <li key={link}><Link href="/features" className="text-sm hover:text-muted-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />{link}</Link></li>
                ))}
              </ul>
            </RevealDiv>

            <RevealDiv delay={200}>
              <h4 className="font-display text-lg text-white mb-5">Company</h4>
              <ul className="space-y-3">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Services", href: "/services" },
                  { label: "Contact", href: "/contact" },
                ].map((link) => (
                  <li key={link.label}><Link href={link.href} className="text-sm hover:text-muted-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />{link.label}</Link></li>
                ))}
              </ul>
            </RevealDiv>

            <RevealDiv delay={300}>
              <h4 className="font-display text-lg text-white mb-5">Legal</h4>
              <ul className="space-y-3">
                {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                  <li key={link}><a href="#" className="text-sm hover:text-muted-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />{link}</a></li>
                ))}
              </ul>
            </RevealDiv>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} Wedora. All rights reserved.</p>
            <div className="flex items-center gap-1.5 text-sm">
              <span>Made By Jovial Fleuron</span>
              
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
