"use client";
import Link from "next/link";
import { Heart, ArrowRight, Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";
import { RevealDiv } from "@/lib/animations";
import Footer from "@/components/Footer";
import WedoraLogo from "@/components/WedoraLogo";
import CTA from "@/components/CTA";
import { useState } from "react";
import Navbar from "@/components/Shared/Navbar/Navbar";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen">
      <>
      <Navbar />
      </>

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-champagne/30 to-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="hero-stagger text-sm font-medium tracking-[0.3em] text-muted-gold uppercase mb-4" style={{ animationDelay: "0.2s" }}>Get In Touch</p>
          <h1 className="hero-stagger font-display text-5xl sm:text-6xl lg:text-7xl font-light text-deep-brown leading-tight mb-6" style={{ animationDelay: "0.4s" }}>
            We&apos;d love to <span className="italic text-shimmer">hear</span> from you.
          </h1>
          <p className="hero-stagger text-lg text-warm-gray max-w-2xl mx-auto" style={{ animationDelay: "0.6s" }}>
            Whether you have questions, need help, or want to discuss a partnership — our team is here.
          </p>
        </div>
      </section>

      {/* Contact Info + Form */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Info */}
            <RevealDiv direction="left">
              <h2 className="font-display text-3xl text-deep-brown mb-8">Contact Information</h2>
              <div className="space-y-8">
                {[
                  { icon: Mail, label: "Email Us", value: "helpcwedora@yopmail.com", href: "mailto:helpcwedora@yopmail.com", desc: "We respond within 24 hours" },
                  { icon: Phone, label: "Call Us", value: "+250 788 123 456", href: "tel:+250788123456", desc: "Mon–Fri, 8am–6pm EAT" },
                  { icon: MapPin, label: "Visit Us", value: "Kigali, Rwanda", href: null, desc: "KG 7 Avenue, Nyarugenge" },
                  { icon: Clock, label: "Response Time", value: "Within 24 hours", href: null, desc: "For all inquiries" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 group">
                    <div className="h-12 w-12 rounded-xl bg-champagne flex items-center justify-center flex-shrink-0 group-hover:bg-muted-gold/20 transition-all duration-300 group-hover:scale-110">
                      <item.icon className="h-5 w-5 text-muted-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-warm-gray uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.href ? (
                        <a href={item.href} className="text-deep-brown font-medium hover:text-muted-gold transition-colors">{item.value}</a>
                      ) : (
                        <p className="text-deep-brown font-medium">{item.value}</p>
                      )}
                      <p className="text-xs text-warm-gray mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </RevealDiv>

            {/* Form */}
            <RevealDiv direction="right">
              <div className="bg-ivory rounded-2xl border border-border p-8">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-sage/10 mb-4">
                      <MessageSquare className="h-8 w-8 text-sage" />
                    </div>
                    <h3 className="font-display text-2xl text-deep-brown mb-2">Message Sent!</h3>
                    <p className="text-warm-gray">We&apos;ll get back to you within 24 hours.</p>
                    <button onClick={() => setSubmitted(false)} className="mt-6 text-sm font-medium text-primary hover:text-muted-gold transition-colors">Send another message</button>
                  </div>
                ) : (
                  <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                    <h3 className="font-display text-2xl text-deep-brown mb-2">Send a Message</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                        <input type="text" required className="w-full h-11 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-all" placeholder="John" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                        <input type="text" required className="w-full h-11 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-all" placeholder="Doe" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                      <input type="email" required className="w-full h-11 px-4 rounded-xl border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-all" placeholder="johndoe@yopmail.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                      <select className="w-full h-11 px-4 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-all">
                        <option>General Inquiry</option>
                        <option>Wedding Setup Help</option>
                        <option>Partnership</option>
                        <option>Technical Support</option>
                        <option>Feedback</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                      <textarea rows={4} required className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-all resize-none" placeholder="Tell us how we can help..." />
                    </div>
                    <button type="submit" className="group w-full h-12 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/20">
                      Send Message <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </form>
                )}
              </div>
            </RevealDiv>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-ivory">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <RevealDiv className="text-center mb-16">
            <p className="text-sm font-medium tracking-[0.2em] text-muted-gold uppercase mb-3">FAQ</p>
            <h2 className="font-display text-4xl font-light text-deep-brown">Common questions</h2>
          </RevealDiv>
          <div className="space-y-4 stagger-children">
            {[
              { q: "Is Wedora free to use?", a: "Yes! Wedora is free for couples. Create your wedding, share the QR code, and start collecting memories and contributions at no cost." },
              { q: "Do guests need to download an app?", a: "No. Guests simply scan the QR code with their phone camera and access a beautiful web experience. No app download, no account creation." },
              { q: "How does the MC queue work?", a: "When guests register a contribution, the MC sees only their name in a real-time queue. Gift details remain private. The MC acknowledges with one tap." },
              { q: "Can I control what photos appear on the memory wall?", a: "Yes. Every photo goes through moderation first. You approve or reject each one before it appears on the live wall." },
              { q: "Is my wedding data private?", a: "Absolutely. Your wedding is not public. Only people with the QR code link can access it. You control all visibility settings." },
            ].map((faq, i) => (
              <RevealDiv key={i}>
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-medium text-deep-brown mb-2">{faq.q}</h3>
                  <p className="text-sm text-warm-gray leading-relaxed">{faq.a}</p>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>
      </section>

      <CTA
        title="Ready to get started?"
        subtitle="Create your wedding in minutes. No credit card required."
        buttonText="Get Started Free"
      />

      <Footer />
    </div>
  );
}
