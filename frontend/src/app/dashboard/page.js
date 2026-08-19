"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Calendar, Users, Camera, Heart, Plus, Mic, Gift, ArrowRight, Clock, CheckCircle } from "lucide-react";
import Badge from "@/components/ui/Badge";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [weddings, setWeddings] = useState(null);

  useEffect(() => {
    if (!api.isAuthenticated()) return;
    Promise.all([
      api.get("/auth/profile"),
      api.get("/weddings"),
    ]).then(([uRes, wRes]) => {
      setUser(uRes.data);
      setWeddings(wRes.data.weddings || []);
    }).catch(() => setWeddings([]));
  }, []);

  if (!user || weddings === null) return (
    <div className="animate-fade-in space-y-6">
      <div className="h-10 w-48 skeleton rounded-lg" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="h-28 skeleton rounded-xl" />)}
      </div>
    </div>
  );

  // ─── MC DASHBOARD ────────────────────────────────────────
  if (user.role === "MC") {
    return (
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="font-display text-3xl font-light text-deep-brown">Welcome, {user.firstName}</h2>
          <p className="text-warm-gray mt-1">Your MC assignments</p>
        </div>

        {weddings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-border">
            <Mic className="h-12 w-12 text-muted-gold/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-deep-brown mb-2">No weddings assigned</h3>
            <p className="text-warm-gray text-sm">Ask the wedding organizer to assign you to a wedding.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddings.map((w) => (
              <div key={w.id} className="bg-white rounded-xl border border-border p-6 hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl text-deep-brown">{w.coupleName} & {w.partnerName}</h3>
                    <p className="text-sm text-warm-gray">{new Date(w.weddingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                  <Badge variant={w.status === "ACTIVE" ? "success" : "default"}>{w.status}</Badge>
                </div>
                <div className="flex gap-3 text-sm text-warm-gray mb-4">
                  <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {w._count?.contributions || 0}</span>
                  <span className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> {w._count?.memories || 0}</span>
                </div>
                <Link
                  href={`/mc/${w.id}`}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-deep-wine text-white rounded-lg text-sm font-medium hover:bg-deep-wine/90 transition-all"
                >
                  <Mic className="h-4 w-4" /> Open MC Queue <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── COUPLE DASHBOARD ────────────────────────────────────
  if (user.role === "COUPLE") {
    return (
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="font-display text-3xl font-light text-deep-brown">Welcome, {user.firstName} & {user.lastName}</h2>
          <p className="text-warm-gray mt-1">Your wedding memories</p>
        </div>

        {weddings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-border">
            <Heart className="h-12 w-12 text-muted-gold/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-deep-brown mb-2">No wedding yet</h3>
            <p className="text-warm-gray text-sm">Your wedding details will appear here once created.</p>
          </div>
        ) : (
          weddings.map((w) => (
            <div key={w.id} className="bg-white rounded-xl border border-border p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display text-2xl text-deep-brown">{w.coupleName} & {w.partnerName}</h3>
                  <p className="text-warm-gray">{new Date(w.weddingDate).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</p>
                </div>
                <Badge variant="gold">{w.status}</Badge>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Link href={`/dashboard/weddings/${w.id}/gallery`} className="p-4 rounded-lg border border-border hover:border-muted-gold/30 hover:shadow-sm transition-all text-center">
                  <Camera className="h-6 w-6 text-sage mx-auto mb-2" />
                  <p className="font-medium text-deep-brown text-sm">Gallery</p>
                  <p className="text-xs text-warm-gray">{w._count?.memories || 0} photos</p>
                </Link>
                <Link href={`/dashboard/weddings/${w.id}/contributions`} className="p-4 rounded-lg border border-border hover:border-muted-gold/30 hover:shadow-sm transition-all text-center">
                  <Heart className="h-6 w-6 text-muted-gold mx-auto mb-2" />
                  <p className="font-medium text-deep-brown text-sm">Contributions</p>
                  <p className="text-xs text-warm-gray">{w._count?.contributions || 0} received</p>
                </Link>
                <Link href={`/dashboard/weddings/${w.id}/memories`} className="p-4 rounded-lg border border-border hover:border-muted-gold/30 hover:shadow-sm transition-all text-center">
                  <Camera className="h-6 w-6 text-dusty-rose mx-auto mb-2" />
                  <p className="font-medium text-deep-brown text-sm">All Memories</p>
                  <p className="text-xs text-warm-gray">Browse all</p>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    );
  }

  // ─── GIFT_STAFF DASHBOARD ────────────────────────────────
  if (user.role === "GIFT_STAFF") {
    return (
      <div className="animate-fade-in space-y-8">
        <div>
          <h2 className="font-display text-3xl font-light text-deep-brown">Welcome, {user.firstName}</h2>
          <p className="text-warm-gray mt-1">Gift & contribution management</p>
        </div>

        {weddings.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-border">
            <Gift className="h-12 w-12 text-muted-gold/30 mx-auto mb-4" />
            <h3 className="font-display text-xl text-deep-brown mb-2">No weddings assigned</h3>
            <p className="text-warm-gray text-sm">Ask the organizer to assign you to a wedding.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {weddings.map((w) => (
              <div key={w.id} className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl text-deep-brown">{w.coupleName} & {w.partnerName}</h3>
                    <p className="text-sm text-warm-gray">{new Date(w.weddingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                  </div>
                </div>
                <div className="flex gap-3 mb-4">
                  <div className="bg-champagne rounded-lg px-4 py-2 text-center flex-1">
                    <p className="font-display text-2xl text-deep-brown">{w._count?.contributions || 0}</p>
                    <p className="text-xs text-warm-gray">Contributions</p>
                  </div>
                </div>
                <Link href={`/dashboard/weddings/${w.id}/contributions`} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
                  <Gift className="h-4 w-4" /> Manage Gifts <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── ORGANIZER / SUPER_ADMIN DASHBOARD ────────────────────
  const totalContributions = weddings.reduce((sum, w) => sum + (w._count?.contributions || 0), 0);
  const totalMemories = weddings.reduce((sum, w) => sum + (w._count?.memories || 0), 0);
  const totalGuests = weddings.reduce((sum, w) => sum + (w._count?.guests || 0), 0);

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl font-light text-deep-brown">Welcome back, {user.firstName}</h2>
          <p className="text-warm-gray mt-1">Here&apos;s an overview of your weddings</p>
        </div>
        <Link href="/dashboard/weddings/new" className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> New Wedding
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Weddings", value: weddings.length, icon: Calendar, color: "text-primary" },
          { label: "Contributions", value: totalContributions, icon: Heart, color: "text-muted-gold" },
          { label: "Memories", value: totalMemories, icon: Camera, color: "text-sage" },
          { label: "Guests", value: totalGuests, icon: Users, color: "text-dusty-rose" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-border p-5">
            <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
            <p className="font-display text-3xl text-deep-brown">{s.value}</p>
            <p className="text-xs text-warm-gray mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weddings.map((w) => {
          const date = new Date(w.weddingDate);
          return (
            <Link
              key={w.id}
              href={`/dashboard/weddings/${w.id}`}
              className="group block p-6 bg-white rounded-xl border border-border hover:border-muted-gold/30 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={w.status === "ACTIVE" ? "success" : w.status === "PLANNING" ? "default" : "gold"}>{w.status}</Badge>
              </div>
              <h3 className="font-display text-2xl text-deep-brown font-medium mb-1 group-hover:text-muted-gold transition-colors">
                {w.coupleName} & {w.partnerName}
              </h3>
              <p className="text-sm text-warm-gray mb-4">
                {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </p>
              <div className="flex gap-4 text-xs text-warm-gray">
                <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {w._count?.contributions || 0} contributions</span>
                <span className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> {w._count?.memories || 0} memories</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
