"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, Layers, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AIAlbumPage({ params }) {
  const { id } = use(params);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);
  const { addToast } = useToast();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/weddings/${id}/ai/album/generate`);
      setAlbum(res.data);
      addToast("Album generated", "success");
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    api.get(`/weddings/${id}/ai/album`).then((res) => { if (res.data) setAlbum(res.data); }).catch(() => {});
  }, [id]);

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}/ai`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> AI Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
            <Layers className="h-6 w-6 text-deep-wine" /> Smart Album
          </h1>
          <p className="text-warm-gray text-sm mt-1">AI-organized digital wedding album</p>
        </div>
        <Button onClick={generate} loading={loading}>
          <Layers className="h-4 w-4 mr-2" /> {album ? "Regenerate" : "Generate Album"}
        </Button>
      </div>

      {album ? (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="font-display text-2xl text-deep-brown mb-1">{album.title}</h2>
            <p className="text-sm text-warm-gray">{album.sections?.length || 0} sections</p>
          </div>

          {album.sections?.map((section, i) => (
            <div key={section.id} className="bg-white rounded-xl border border-border overflow-hidden">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-warm-white/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="font-display text-2xl text-muted-gold font-light w-8">{String(i + 1).padStart(2, "0")}</span>
                  <div className="text-left">
                    <h3 className="font-display text-lg text-deep-brown">{section.title}</h3>
                    <p className="text-xs text-warm-gray">{section.items?.length || 0} photos</p>
                  </div>
                </div>
                <ChevronRight className={`h-5 w-5 text-warm-gray transition-transform ${expandedSection === section.id ? "rotate-90" : ""}`} />
              </button>

              {expandedSection === section.id && section.items && (
                <div className="px-5 pb-5 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="aspect-square bg-champagne rounded-lg overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-champagne to-soft-beige" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Layers}
          title="No album yet"
          description="Generate an AI-organized album from your memories."
          action={<Button onClick={generate} loading={loading}>Generate Album</Button>}
        />
      )}
    </div>
  );
}
