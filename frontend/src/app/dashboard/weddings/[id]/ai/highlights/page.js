"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, Sparkles, Heart, Users, Camera, Music, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AIHighlightsPage({ params }) {
  const { id } = use(params);
  const [highlights, setHighlights] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/weddings/${id}/ai/highlights/generate`, { count: 25 });
      setHighlights(res.data.highlights);
      addToast(`Generated ${res.data.total} highlights`, "success");
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get(`/weddings/${id}/ai/highlights`).then((res) => { if (res.data) setHighlights(res.data); }).catch(() => {});
  }, [id]);

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}/ai`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> AI Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-rich-gold" /> AI Highlights
          </h1>
          <p className="text-warm-gray text-sm mt-1">Auto-curated best moments</p>
        </div>
        <Button onClick={generate} loading={loading}>
          <Sparkles className="h-4 w-4 mr-2" /> {highlights ? "Regenerate" : "Generate Highlights"}
        </Button>
      </div>

      {highlights && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total", value: highlights.totalCount, icon: Sparkles },
              { label: "Couple", value: highlights.coupleMoments, icon: Heart },
              { label: "Family", value: highlights.familyMoments, icon: Users },
              { label: "Ceremony", value: highlights.ceremonyMoments, icon: Camera },
              { label: "Reception", value: highlights.receptionMoments, icon: Music },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-4 text-center">
                <s.icon className="h-4 w-4 text-muted-gold mx-auto mb-1" />
                <p className="font-display text-2xl text-deep-brown">{s.value}</p>
                <p className="text-xs text-warm-gray">{s.label}</p>
              </div>
            ))}
          </div>

          {highlights.items && highlights.items.length > 0 ? (
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-3 space-y-3">
              {highlights.items.map((item, i) => (
                <div key={item.id} className="break-inside-avoid relative rounded-lg overflow-hidden bg-white border border-border group">
                  <div className="relative">
                    <div className="aspect-square bg-champagne">
                      <img
                        src={`/api/placeholder/300/300`}
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1">
                      <Badge variant="gold" className="text-[9px]">#{i + 1}</Badge>
                      <Badge variant="default" className="text-[9px]">{item.category}</Badge>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-red-500">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Sparkles} title="No highlights yet" description="Generate highlights to see AI-selected best moments." />
          )}
        </>
      )}
    </div>
  );
}
