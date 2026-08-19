"use client";
import Link from "next/link";
import { Heart, ChevronRight } from "lucide-react";
import WedoraLogo from "./WedoraLogo";

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
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
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-5">Product</h4>
            <ul className="space-y-3">
              {["Features", "How It Works", "AI Intelligence", "For MCs"].map((link) => (
                <li key={link}><Link href="/features" className="text-sm hover:text-muted-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />{link}</Link></li>
              ))}
            </ul>
          </div>

          <div>
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
          </div>

          <div>
            <h4 className="font-display text-lg text-white mb-5">Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((link) => (
                <li key={link}><a href="#" className="text-sm hover:text-muted-gold transition-colors flex items-center gap-1.5 group"><ChevronRight className="h-3 w-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />{link}</a></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">&copy; {new Date().getFullYear()} Wedora. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-sm">
            <span>Made with</span>
            <Heart className="h-3.5 w-3.5 text-muted-gold fill-muted-gold animate-pulse" />
            <span>in Rwanda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
