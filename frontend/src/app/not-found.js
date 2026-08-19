import Link from "next/link";
import WedoraLogo from "@/components/WedoraLogo";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6">
      <div className="text-center max-w-md">
        {/* Decorative number */}
        <div className="relative mb-8">
          <span className="font-display text-[120px] sm:text-[160px] font-light text-champagne dark:text-white/5 leading-none select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <WedoraLogo className="h-16 w-16" />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl font-light text-deep-brown dark:text-foreground tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-warm-gray text-sm leading-relaxed mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="h-11 px-6 flex items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all active:scale-[0.98]"
          >
            Go Home
          </Link>
          <Link
            href="/dashboard"
            className="h-11 px-6 flex items-center justify-center rounded-lg border border-border bg-card text-foreground text-sm font-medium hover:bg-champagne dark:hover:bg-white/5 transition-all active:scale-[0.98]"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
