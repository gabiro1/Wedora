"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import api from "@/lib/api";
import WedoraLogo from "@/components/WedoraLogo";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { bentoSpan, BENTO_GRID, cn } from "@/lib/utils";
import { Camera, ArrowLeft, X, ChevronLeft, ChevronRight, Play, Images, Download, Trash2, Loader2 } from "lucide-react";

export default function MemoriesPage({ params }) {
  const { token } = use(params);
  const [wedding, setWedding] = useState(null);
  const [memories, setMemories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { addToast } = useToast();

  const load = (p = 1, append = false) => {
    api.get(`/guest/${token}/memories?page=${p}&limit=30`)
      .then((res) => {
        const serverMemories = res.data.memories || [];
        if (append) {
          setMemories((prev) => [...prev, ...serverMemories]);
        } else {
          let local = [];
          try {
            local = JSON.parse(localStorage.getItem(`wedora_my_memories_${token}`) || "[]");
          } catch {}
          const localByToken = {};
          local.forEach((m) => { if (m?.id && m?.uploadToken) localByToken[m.id] = m.uploadToken; });
          const merged = serverMemories.map((m) =>
            localByToken[m.id] ? { ...m, uploadToken: localByToken[m.id] } : m
          );
          local.forEach((m) => {
            if (m?.id && !merged.some((x) => x.id === m.id)) merged.unshift(m);
          });
          setMemories(merged);
        }
        setTotalPages(res.data.totalPages);
        setPage(p);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get(`/weddings/public/${token}`)
      .then((res) => setWedding(res.data))
      .catch(() => setError(true));
    load();
  }, [token]);

  const loadMore = () => {
    setLoading(true);
    const next = page + 1;
    load(next, true);
  };

  const showPrevious = () => {
    const idx = memories.findIndex((m) => m.id === selected.id);
    setSelected(memories[idx - 1] || memories[memories.length - 1]);
  };

  const showNext = () => {
    const idx = memories.findIndex((m) => m.id === selected.id);
    setSelected(memories[(idx + 1) % memories.length]);
  };

  const download = async (m) => {
    try {
      const res = await fetch(m.storageUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `wedora-memory-${m.id}.${m.mediaType === "VIDEO" ? "mp4" : "jpg"}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      window.open(m.storageUrl, "_blank");
    }
  };

  const handleDelete = async (m) => {
    if (!m.uploadToken) return;
    if (!window.confirm("Delete this memory? This cannot be undone.")) return;
    setDeletingId(m.id);
    try {
      await api.request(`/guest/${token}/memories/${m.id}`, {
        method: "DELETE",
        headers: { "X-Delete-Token": m.uploadToken },
      });
      setMemories((prev) => prev.filter((x) => x.id !== m.id));
      try {
        const key = `wedora_my_memories_${token}`;
        const saved = JSON.parse(localStorage.getItem(key) || "[]").filter((x) => x.id !== m.id);
        localStorage.setItem(key, JSON.stringify(saved));
      } catch {}
      if (selected?.id === m.id) setSelected(null);
      addToast("Memory deleted", "success");
    } catch {
      addToast("Could not delete this memory", "error");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        const idx = memories.findIndex((m) => m.id === selected.id);
        if (idx === -1) return;
        const next = e.key === "ArrowLeft"
          ? memories[idx - 1] || memories[memories.length - 1]
          : memories[(idx + 1) % memories.length];
        setSelected(next);
      }
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, memories]);

  return (
    <div className="min-h-screen bg-ivory">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-ivory/90 backdrop-blur-sm border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href={`/w/${token}`} className="h-10 w-10 flex items-center justify-center rounded-full bg-white border border-border text-foreground hover:bg-champagne transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-display text-xl text-deep-brown leading-tight">
              {wedding ? `${wedding.coupleName} & ${wedding.partnerName}` : "Memory Wall"}
            </h1>
            <p className="text-xs text-light-gray">Every moment shared by our guests</p>
          </div>
          <Link href="/" aria-label="Wedora home">
            <WedoraLogo className="h-9 w-9" />
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {error ? (
          <div className="text-center text-warm-gray py-20">
            <Images className="h-12 w-12 text-light-gray mx-auto mb-4" />
            <p className="font-display text-xl">Could not load memories.</p>
            <Link href={`/w/${token}`} className="inline-flex items-center gap-2 mt-6 h-10 px-6 border border-border bg-white rounded-lg text-sm hover:bg-champagne transition-all">
              <ArrowLeft className="h-4 w-4" /> Back
            </Link>
          </div>
        ) : loading && memories.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton h-48 sm:h-64 rounded-lg" />
            ))}
          </div>
        ) : memories.length === 0 ? (
          <EmptyState
            icon={Camera}
            title="No memories shared yet"
            description="Be the first to capture and share a moment from this celebration."
            action={
              <Link href={`/w/${token}/capture`} className="inline-flex items-center gap-2 h-11 px-6 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-all">
                <Camera className="h-4 w-4" /> Capture a Memory
              </Link>
            }
          />
        ) : (
          <>
            <div className={BENTO_GRID}>
              {memories.map((m, i) => (
                <div
                  key={m.id}
                  className={cn(bentoSpan(i), "group relative cursor-pointer")}
                  onClick={() => setSelected(m)}
                >
                  <div className="relative h-full w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    {m.mediaType === "PHOTO" ? (
                      <img src={m.thumbnailUrl || m.storageUrl} alt={m.caption || "Wedding memory"} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    ) : (
                      <video src={m.storageUrl} className="h-full w-full object-cover" preload="metadata" muted playsInline />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-deep-brown/60 via-transparent to-transparent" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {m.mediaType === "VIDEO" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/85 flex items-center justify-center">
                          <Play className="h-5 w-5 text-deep-brown ml-0.5" fill="currentColor" />
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <p className="text-white text-sm font-medium">{m.guestName || "Anonymous"}</p>
                      <p className="text-white/60 text-xs">{new Date(m.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {page < totalPages && (
              <div className="text-center mt-8">
                <button onClick={loadMore} className="h-11 px-8 border border-border bg-white rounded-lg text-sm font-medium text-foreground hover:bg-champagne transition-all">
                  {loading ? "Loading..." : "Load more memories"}
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setSelected(null)}>
          {selected.uploadToken && (
            <button
              onClick={(e) => { e.stopPropagation(); handleDelete(selected); }}
              className="absolute top-4 left-4 text-white/60 hover:text-red-400 p-2 z-10"
              aria-label="Delete memory"
            >
              {deletingId === selected.id ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Trash2 className="h-6 w-6" />
              )}
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); download(selected); }}
            className="absolute top-4 right-14 text-white/60 hover:text-white p-2 z-10"
            aria-label="Download"
          >
            <Download className="h-6 w-6" />
          </button>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white p-2 z-10" aria-label="Close">
            <X className="h-6 w-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); showPrevious(); }}
            className="absolute left-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10"
            aria-label="Previous"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); showNext(); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 hover:text-white p-2 z-10"
            aria-label="Next"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          <div className="max-w-4xl max-h-[90vh] w-full px-4" onClick={(e) => e.stopPropagation()}>
            {selected.mediaType === "PHOTO" ? (
              <img src={selected.storageUrl} alt="" className="max-h-[80vh] mx-auto rounded-lg object-contain" />
            ) : (
              <video src={selected.storageUrl} controls autoPlay className="max-h-[80vh] mx-auto rounded-lg" />
            )}
            <div className="text-center mt-4 pb-6">
              <p className="text-white/80 text-sm">{selected.guestName || "Anonymous"}</p>
              {selected.caption && <p className="text-white/50 text-xs mt-1">{selected.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}