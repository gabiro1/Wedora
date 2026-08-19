"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Heart, Camera, Sparkles } from "lucide-react";

export default function GuestWelcomePage({ params }) {
  const { token } = use(params);
  const [wedding, setWedding] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.get(`/weddings/public/${token}`)
      .then((res) => setWedding(res.data))
      .catch(() => setError("Wedding not found"));
  }, [token]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory px-4">
        <div className="text-center animate-fade-in">
          <Heart className="h-12 w-12 text-light-gray mx-auto mb-4" />
          <h1 className="font-display text-3xl text-deep-brown mb-2">Wedding Not Found</h1>
          <p className="text-warm-gray">This wedding link may have expired or is invalid.</p>
        </div>
      </div>
    );
  }

  if (!wedding) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="skeleton h-8 w-48 rounded" />
      </div>
    );
  }

  const date = new Date(wedding.weddingDate);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-US", { month: "2-digit" });
  const year = date.getFullYear();

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-gradient-to-b from-champagne/30 via-ivory to-ivory pointer-events-none" />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 text-center">
        <div className="animate-fade-in">
          <Sparkles className="h-6 w-6 text-muted-gold mx-auto mb-8" />

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-light text-deep-brown leading-tight mb-2">
            {wedding.coupleName}
          </h1>

          <div className="flex items-center justify-center gap-3 text-lg text-warm-gray font-display my-6">
            <span>{day}</span>
            <span className="text-muted-gold">·</span>
            <span>{month}</span>
            <span className="text-muted-gold">·</span>
            <span>{year}</span>
          </div>

          <p className="text-warm-gray font-display text-xl italic mb-12 max-w-md mx-auto">
            Welcome to our celebration.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
            <Link
              href={`/w/${token}/capture`}
              className="flex items-center justify-center gap-3 h-14 px-8 bg-primary text-white rounded-lg text-base font-medium hover:bg-primary/90 transition-all shadow-lg shadow-primary/15"
            >
              <Camera className="h-5 w-5" />
              Capture a Memory
            </Link>
            <Link
              href={`/w/${token}/contribute`}
              className="flex items-center justify-center gap-3 h-14 px-8 border border-border bg-white text-foreground rounded-lg text-base font-medium hover:bg-champagne transition-all"
            >
              <Heart className="h-5 w-5 text-muted-gold" />
              Register Contribution
            </Link>
          </div>
        </div>
      </div>

      <footer className="relative py-6 text-center">
        <p className="text-xs text-light-gray font-display">
          Powered by <span className="text-muted-gold font-medium">Wedora</span>
        </p>
      </footer>
    </div>
  );
}
