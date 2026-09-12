"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Camera, Heart, CheckCircle, XCircle, Clock, Star } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";
import Badge from "@/components/ui/Badge";
import { bentoSpan, BENTO_GRID, cn } from "@/lib/utils";

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
    if (filter === "approved") return m.moderationStatus === "APPROVED";
    if (filter === "pending") return m.moderationStatus === "PENDING";
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
        <div className={BENTO_GRID}>
          {[1, 2, 3, 4, 5, 6].map((i) => <div key={i} className={cn(bentoSpan(i), "skeleton rounded-2xl")} />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState icon={Camera} title="No memories yet" description="Memories will appear here once guests upload photos." />
      ) : (
        <div className={BENTO_GRID}>
          {filtered.map((m, i) => (
            <Link
              key={m.id}
              href={`/dashboard/weddings/${m.weddingId}/gallery`}
              className={cn(bentoSpan(i), "group relative block")}
            >
              <div className="relative h-full w-full rounded-2xl overflow-hidden bg-champagne border border-border hover:shadow-lg transition-all duration-300">
                {m.thumbnailUrl || m.storageUrl || m.url ? (
                  <img src={m.thumbnailUrl || m.storageUrl || m.url} alt={m.caption || ""} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Camera className="h-8 w-8 text-muted-gold/30" /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge variant={m.moderationStatus === "APPROVED" ? "success" : m.moderationStatus === "REJECTED" ? "error" : "default"} className="text-[9px]">{m.moderationStatus}</Badge>
                  {m.isFavorite && <Badge variant="gold" className="text-[9px]"><Star className="h-2.5 w-2.5 mr-0.5" /> Fav</Badge>}
                </div>
                {m.mediaType === "VIDEO" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
                      <div className="h-0 w-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-deep-brown ml-1" />
                    </div>
                  </div>
                )}
                <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <p className="text-white text-sm font-medium truncate">{m.guestName || "Anonymous"}</p>
                  {m.caption && <p className="text-white/60 text-xs truncate">{m.caption}</p>}
                  <p className="text-white/50 text-[10px] mt-0.5">{m.weddingName}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
