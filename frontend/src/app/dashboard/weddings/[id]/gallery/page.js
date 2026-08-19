"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { Camera, ArrowLeft, X, ChevronLeft, ChevronRight, Heart } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/ui/EmptyState";

export default function GalleryPage({ params }) {
  const { id } = use(params);
  const [memories, setMemories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const load = (p = 1) => {
    api.get(`/weddings/${id}/memories?page=${p}&limit=30&moderationStatus=APPROVED`)
      .then((res) => {
        if (p === 1) setMemories(res.data.memories);
        else setMemories((prev) => [...prev, ...res.data.memories]);
        setHasMore(p < res.data.totalPages);
      })
      .catch(() => {});
  };

  useEffect(() => { load(); }, []);

  const loadMore = () => { const next = page + 1; setPage(next); load(next); };

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Wedding
      </Link>

      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown">Memory Gallery</h1>
        <p className="text-warm-gray text-sm mt-1">Approved memories from your celebration</p>
      </div>

      {memories.length === 0 ? (
        <EmptyState icon={Camera} title="No approved memories" description="Approved photos and videos will appear here." />
      ) : (
        <>
          <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
            {memories.map((m) => (
              <div
                key={m.id}
                className="break-inside-avoid cursor-pointer group relative rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                onClick={() => setSelected(m)}
              >
                {m.mediaType === "PHOTO" ? (
                  <img src={m.thumbnailUrl || m.storageUrl} alt="" className="w-full object-cover" loading="lazy" />
                ) : (
                  <div className="relative">
                    <video src={m.storageUrl} className="w-full object-cover" preload="metadata" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <div className="h-10 w-10 rounded-full bg-white/80 flex items-center justify-center">
                        <div className="h-0 w-0 border-t-8 border-b-8 border-l-12 border-t-transparent border-b-transparent border-l-deep-brown ml-1" />
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs">{m.guestName || "Anonymous"}</p>
                </div>
              </div>
            ))}
          </div>
          {hasMore && (
            <div className="text-center">
              <button onClick={loadMore} className="text-sm text-muted-gold hover:underline font-medium">
                Load more memories
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setSelected(null)}>
          <button className="absolute top-4 right-4 text-white/60 hover:text-white p-2"><X className="h-6 w-6" /></button>
          <div className="max-w-4xl max-h-[90vh] w-full px-4" onClick={(e) => e.stopPropagation()}>
            {selected.mediaType === "PHOTO" ? (
              <img src={selected.storageUrl} alt="" className="max-h-[80vh] mx-auto rounded-lg object-contain" />
            ) : (
              <video src={selected.storageUrl} controls className="max-h-[80vh] mx-auto rounded-lg" />
            )}
            <div className="text-center mt-4">
              <p className="text-white/80 text-sm">{selected.guestName || "Anonymous"}</p>
              {selected.caption && <p className="text-white/40 text-xs mt-1">{selected.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
