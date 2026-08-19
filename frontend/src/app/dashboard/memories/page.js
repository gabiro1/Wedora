"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Camera, Heart, CheckCircle, XCircle, Clock, Star } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";

export default function MemoriesPage() {
  const [memories, setMemories] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.get("/weddings").then(async (res) => {
      const all = [];
      for (const w of res.data.weddings) {
        try {
          const mRes = await api.get(`/weddings/${w.id}/memories`);
          const items = (mRes.data.memories || mRes.data || []).map((m) => ({ ...m, weddingName: w.coupleName, weddingId: w.id }));
          all.push(...items);
        } catch {}
      }
      setMemories(all);
    }).catch(() => setMemories([]));
  }, []);

  const filtered = memories?.filter((m) => {
    if (filter === "approved") return m.status === "APPROVED";
    if (filter === "pending") return m.status === "PENDING";
    if (filter === "favorites") return m.isFavorite;
    return true;
  }) || [];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown">Memories</h1>
        <p className="text-warm-gray text-sm mt-1">All memories across your weddings</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All", icon: Camera },
          { key: "approved", label: "Approved", icon: CheckCircle },
          { key: "pending", label: "Pending", icon: Clock },
          { key: "favorites", label: "Favorites", icon: Star },
        ].map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${filter === f.key ? "bg-primary text-white" : "bg-white border border-border text-warm-gray hover:text-foreground"}`}>
            <f.icon className="h-3.5 w-3.5" /> {f.label}
          </button>
        ))}
      </div>

      {memories === null ? (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className="skeleton h-48 rounded-lg" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Camera} title="No memories yet" description="Memories will appear here once guests upload photos." />
      ) : (
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map((m) => (
            <Link key={m.id} href={`/dashboard/weddings/${m.weddingId}/gallery`} className="break-inside-avoid block rounded-lg overflow-hidden bg-white border border-border hover:shadow-md transition-all group">
              <div className="aspect-square bg-champagne relative">
                {m.url ? (
                  <img src={m.url} alt={m.caption || ""} className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Camera className="h-8 w-8 text-muted-gold/30" /></div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge variant={m.status === "APPROVED" ? "success" : m.status === "REJECTED" ? "error" : "default"} className="text-[9px]">{m.status}</Badge>
                  {m.isFavorite && <Badge variant="gold" className="text-[9px]"><Star className="h-2.5 w-2.5 mr-0.5" /> Fav</Badge>}
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-warm-gray truncate">{m.guestName || "Anonymous"}</p>
                {m.caption && <p className="text-xs text-foreground truncate mt-0.5">{m.caption}</p>}
                <p className="text-[10px] text-warm-gray/70 mt-1">{m.weddingName}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
