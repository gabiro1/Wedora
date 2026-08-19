"use client"
import React, { useState, useEffect } from 'react'
import Link from "next/link";
import WedoraLogo from '../../../../src/components/WedoraLogo'
import { Menu, X } from 'lucide-react'
import ThemeToggle from '../../ThemeToggle'

 const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
    { href: "/features", label: "Features" },
    { href: "/contact", label: "Contact" },
  ];


const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div>
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
    </div>
  )
}

export default Navbar