"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.memories.map((m) => (
            <div key={m.id} className="bg-white rounded-xl border border-border overflow-hidden group">
              <div className="aspect-square bg-champagne relative overflow-hidden">
                {m.mediaType === "PHOTO" ? (
                  <img src={m.thumbnailUrl || m.storageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                ) : (
                  <video src={m.storageUrl} className="w-full h-full object-cover" preload="metadata" />
                )}
                <div className="absolute top-2 right-2">
                  <Badge variant={modColors[m.moderationStatus]}>{m.moderationStatus}</Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm font-medium truncate">{m.guestName || "Anonymous"}</p>
                {m.caption && <p className="text-xs text-warm-gray truncate mt-1">{m.caption}</p>}
                <p className="text-xs text-light-gray mt-1">{new Date(m.createdAt).toLocaleString()}</p>
                {m.moderationStatus === "PENDING" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" onClick={() => moderate(m.id, "approve")} className="flex-1">
                      <Check className="h-3.5 w-3.5 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => moderate(m.id, "reject")} className="flex-1">
                      <X className="h-3.5 w-3.5 mr-1" /> Reject
                    </Button>
                  </div>
                )}
                {m.moderationStatus !== "REMOVED" && (
                  <Button size="sm" variant="ghost" onClick={() => moderate(m.id, "remove")} className="mt-2 w-full text-destructive">
                    <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
