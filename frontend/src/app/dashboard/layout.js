"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { Heart, LayoutDashboard, Calendar, Users, Camera, BarChart3, Settings, LogOut, Menu, X, Brain, User, Gift, Mic } from "lucide-react";
import WedoraLogo from "@/components/WedoraLogo";
import ThemeToggle from "@/components/ThemeToggle";

const roleNavMap = {
  SUPER_ADMIN: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/weddings", icon: Calendar, label: "Weddings" },
    { href: "/dashboard/memories", icon: Camera, label: "Memories" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/ai", icon: Brain, label: "AI" },
  ],
  ORGANIZER: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/weddings", icon: Calendar, label: "Weddings" },
    { href: "/dashboard/memories", icon: Camera, label: "Memories" },
    { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/dashboard/ai", icon: Brain, label: "AI" },
  ],
  MC: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/mc-queue", icon: Mic, label: "MC Queue" },
  ],
  COUPLE: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/memories", icon: Camera, label: "Memories" },
  ],
  GIFT_STAFF: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { href: "/dashboard/gifts", icon: Gift, label: "Gifts" },
  ],
};

const roleLabels = {
  SUPER_ADMIN: "Super Admin",
  ORGANIZER: "Organizer",
  MC: "MC",
  COUPLE: "Couple",
  GIFT_STAFF: "Gift Staff",
  GUEST: "Guest",
};

const roleBadgeColors = {
  SUPER_ADMIN: "bg-muted-gold/10 text-muted-gold",
  ORGANIZER: "bg-primary/10 text-primary",
  MC: "bg-deep-wine/10 text-deep-wine",
  COUPLE: "bg-dusty-rose/10 text-dusty-rose",
  GIFT_STAFF: "bg-sage/10 text-sage",
  GUEST: "bg-warm-gray/10 text-warm-gray",
};

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!api.isAuthenticated()) { router.push("/login"); return; }
    api.get("/auth/profile").then((res) => setUser(res.data)).catch(() => { api.clearAuth(); router.push("/login"); });
  }, [router]);

  const handleLogout = () => { api.clearAuth(); router.push("/"); };

  const navItems = roleNavMap[user?.role] || roleNavMap.ORGANIZER;

  if (!user) return (
    <div className="min-h-screen flex items-center justify-center bg-ivory">
      <div className="skeleton h-8 w-32 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-ivory">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-border flex flex-col transition-transform duration-300",
        "lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-border">
          <Link href="/dashboard" className="flex items-center gap-2">
            <WedoraLogo className="h-8 w-8" />
            <span className="font-display text-xl font-semibold text-deep-brown">Wedora</span>
          </Link>
        </div>

        <div className="px-4 pt-4 pb-2">
          <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider", roleBadgeColors[user.role])}>
            {roleLabels[user.role] || user.role}
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-champagne text-deep-brown"
                  : "text-warm-gray hover:text-foreground hover:bg-warm-white"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <Link href="/dashboard/profile" className="flex items-center gap-3 mb-3 hover:bg-warm-white rounded-lg p-1 -m-1 transition-colors">
            <div className="h-9 w-9 rounded-full bg-champagne flex items-center justify-center text-sm font-medium text-deep-brown">
              {user.firstName?.[0]}{user.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-warm-gray truncate">{user.email}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm text-warm-gray hover:text-foreground transition-colors flex-1 px-3 py-2 rounded-lg hover:bg-warm-white">
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-border flex items-center px-4 lg:px-8 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 -ml-2 mr-2 hover:bg-champagne rounded-lg">
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="font-display text-xl text-deep-brown font-medium">
            {navItems.find((n) => pathname === n.href)?.label || "Dashboard"}
          </h1>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
