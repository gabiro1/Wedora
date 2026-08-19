"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Calendar, Plus, Heart, Camera, Users, MapPin } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";

export default function WeddingsPage() {
  const [weddings, setWeddings] = useState(null);

  useEffect(() => {
    api.get("/weddings").then((res) => setWeddings(res.data.weddings)).catch(() => setWeddings([]));
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-deep-brown">Weddings</h1>
          <p className="text-warm-gray text-sm mt-1">All your wedding events</p>
        </div>
        <Link href="/dashboard/weddings/new" className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-all">
          <Plus className="h-4 w-4" /> New Wedding
        </Link>
      </div>

      {weddings === null ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <div key={i} className="h-52 skeleton rounded-xl" />)}
        </div>
      ) : weddings.length === 0 ? (
        <EmptyState icon={Calendar} title="No weddings yet" description="Create your first wedding to get started." action={<Link href="/dashboard/weddings/new" className="inline-flex items-center gap-2 h-10 px-5 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-all"><Plus className="h-4 w-4" /> Create Wedding</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weddings.map((w) => {
            const date = new Date(w.weddingDate);
            return (
              <Link key={w.id} href={`/dashboard/weddings/${w.id}`} className="group block bg-white rounded-xl border border-border hover:border-muted-gold/30 hover:shadow-lg transition-all duration-300 overflow-hidden">
                <div className="h-32 bg-gradient-to-br from-champagne via-soft-beige to-ivory flex items-center justify-center relative">
                  <Heart className="h-12 w-12 text-muted-gold/30" fill="currentColor" />
                  <div className="absolute top-3 right-3">
                    <Badge variant={w.status === "ACTIVE" ? "success" : w.status === "PLANNING" ? "default" : "gold"}>{w.status}</Badge>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-deep-brown font-medium group-hover:text-muted-gold transition-colors mb-1">
                    {w.coupleName} & {w.partnerName}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-warm-gray mb-3">
                    <Calendar className="h-3.5 w-3.5" />
                    {date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  {w.venue && (
                    <div className="flex items-center gap-1 text-xs text-warm-gray mb-3">
                      <MapPin className="h-3 w-3" /> {w.venue}
                    </div>
                  )}
                  <div className="flex gap-4 text-xs text-warm-gray border-t border-border pt-3">
                    <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" /> {w._count?.contributions || 0}</span>
                    <span className="flex items-center gap-1"><Camera className="h-3.5 w-3.5" /> {w._count?.memories || 0}</span>
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {w._count?.guests || 0}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
