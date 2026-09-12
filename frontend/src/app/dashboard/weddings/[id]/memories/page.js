"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { bentoSpan, BENTO_GRID, cn } from "@/lib/utils";
import { Camera, ArrowLeft, Check, X, Trash2, Flag, Heart } from "lucide-react";
import Link from "next/link";

const modColors = { PENDING: "warning", APPROVED: "success", REJECTED: "destructive", REPORTED: "default" };

export default function MemoriesPage({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState("PENDING");
  const { addToast } = useToast();

  const load = () => {
    api.get(`/weddings/${id}/memories?page=1&limit=50&moderationStatus=${filter}`)
      .then((res) => setData(res.data))
      .catch(() => addToast("Failed to load", "error"));
  };

  useEffect(() => { load(); }, [filter]);

  const moderate = async (memId, action) => {
    try {
      await api.post(`/weddings/${id}/memories/${memId}/${action}`);
      addToast(`Memory ${action}d`, "success");
      load();
    } catch { addToast("Failed", "error"); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Wedding
      </Link>

      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown">Memory Moderation</h1>
        <p className="text-warm-gray text-sm mt-1">Review and moderate uploaded memories</p>
      </div>

      <div className="flex gap-2">
        {["PENDING", "APPROVED", "REJECTED", "REPORTED"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${filter === f ? "bg-primary text-white" : "bg-champagne text-warm-gray hover:text-foreground"}`}
          >
            {f} {f === "PENDING" && data?.total ? `(${data.total})` : ""}
          </button>
        ))}
      </div>

      {data && data.memories.length === 0 ? (
        <EmptyState icon={Camera} title="No memories" description={`No ${filter.toLowerCase()} memories to display.`} />
      ) : (
        <div className={BENTO_GRID}>
          {data?.memories.map((m, i) => (
            <div key={m.id} className={cn(bentoSpan(i), "group relative")}>
              <div className="relative h-full w-full rounded-2xl overflow-hidden bg-charcoal border border-border shadow-sm hover:shadow-lg transition-all duration-300">
                {m.mediaType === "PHOTO" ? (
                  <img src={m.thumbnailUrl || m.storageUrl} alt="" className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                ) : (
                  <video src={m.storageUrl} className="h-full w-full object-cover" preload="metadata" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-2 right-2">
                  <Badge variant={modColors[m.moderationStatus]}>{m.moderationStatus}</Badge>
                </div>

                {m.moderationStatus !== "REMOVED" && (
                  <button
                    onClick={() => moderate(m.id, "remove")}
                    className="absolute top-2 left-2 h-8 w-8 rounded-full bg-black/40 text-white/80 hover:bg-red-600 hover:text-white flex items-center justify-center transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}

                {m.mediaType === "VIDEO" && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
                      <div className="h-0 w-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-deep-brown ml-1" />
                    </div>
                  </div>
                )}

                {m.moderationStatus === "PENDING" ? (
                  <div className="absolute bottom-0 inset-x-0 p-3 flex gap-2">
                    <Button size="sm" onClick={() => moderate(m.id, "approve")} className="flex-1">
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => moderate(m.id, "reject")} className="flex-1">
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                ) : (
                  <div className="absolute bottom-2 left-3 right-3">
                    <p className="text-white text-sm font-medium truncate">{m.guestName || "Anonymous"}</p>
                    {m.caption && <p className="text-white/60 text-xs truncate mt-0.5">{m.caption}</p>}
                    <p className="text-white/40 text-[10px] mt-0.5">{new Date(m.createdAt).toLocaleString()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
