"use client";
import Link from "next/link";
import WedoraLogo from "@/components/WedoraLogo";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({ error, reset }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-8 w-8 text-destructive" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-light text-deep-brown dark:text-foreground tracking-tight mb-3">
          Something went wrong
        </h1>
        <p className="text-warm-gray text-sm leading-relaxed mb-2">
          An unexpected error occurred. Please try again.
        </p>
        {process.env.NODE_ENV === "development" && error?.message && (
          <p className="text-xs text-destructive/70 font-mono bg-destructive/5 rounded-lg px-4 py-3 mb-8 text-left overflow-x-auto">
            {error.message}
          </p>
        )}

        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => reset()}
            className="h-11 px-6 flex items-center justify-center gap-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="h-11 px-6 flex items-center justify-center rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-champagne dark:hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
