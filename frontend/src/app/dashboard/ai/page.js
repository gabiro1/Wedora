"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { Brain, Sparkles, Search, SlidersHorizontal, Layers, BookOpen, BarChart3, ChevronRight, ArrowRight } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AIDashboardPage() {
  const [weddings, setWeddings] = useState(null);
  const [selectedWedding, setSelectedWedding] = useState(null);

  useEffect(() => {
    api.get("/weddings").then((res) => {
      const list = res.data.weddings || [];
      setWeddings(list);
      if (list.length === 1) setSelectedWedding(list[0]);
    }).catch(() => setWeddings([]));
  }, []);

  const features = [
    { icon: SlidersHorizontal, title: "Quality Assessment", desc: "AI-powered photo quality analysis", color: "text-primary", path: "quality" },
    { icon: Search, title: "Smart Search", desc: "Natural language memory search", color: "text-sage", path: "search" },
    { icon: Sparkles, title: "Highlights", desc: "Auto-curated best moments", color: "text-rich-gold", path: "highlights" },
    { icon: Layers, title: "Smart Album", desc: "AI-organized digital album", color: "text-deep-wine", path: "album" },
    { icon: BookOpen, title: "Wedding Story", desc: "AI-generated narrative", color: "text-dusty-rose", path: "story" },
    { icon: BarChart3, title: "Duplicate Detection", desc: "Find and merge duplicates", color: "text-warm-gray", path: "duplicates" },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
          <Brain className="h-7 w-7 text-primary" /> AI Intelligence
        </h1>
        <p className="text-warm-gray text-sm mt-1">AI-powered insights for your wedding memories</p>
      </div>

      {weddings === null ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-40 skeleton rounded-xl" />)}
        </div>
      ) : weddings.length === 0 ? (
        <EmptyState icon={Brain} title="No weddings yet" description="Create a wedding first to use AI features." />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-border p-6">
            <h2 className="text-sm font-medium text-warm-gray mb-3">Select a wedding</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weddings.map((w) => (
                <button
                  key={w.id}
                  onClick={() => setSelectedWedding(w)}
                  className={`text-left p-4 rounded-lg border transition-all ${selectedWedding?.id === w.id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-border hover:border-muted-gold/30"}`}
                >
                  <p className="font-display text-lg text-deep-brown">{w.coupleName} & {w.partnerName}</p>
                  <p className="text-xs text-warm-gray mt-1">{new Date(w.weddingDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedWedding && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((f) => (
                <Link
                  key={f.path}
                  href={`/dashboard/weddings/${selectedWedding.id}/ai/${f.path}`}
                  className="group bg-white rounded-xl border border-border p-6 hover:border-muted-gold/30 hover:shadow-md transition-all"
                >
                  <f.icon className={`h-6 w-6 ${f.color} mb-3`} />
                  <h3 className="font-medium text-deep-brown mb-1 flex items-center gap-1">
                    {f.title}
                    <ChevronRight className="h-4 w-4 text-warm-gray opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="text-xs text-warm-gray">{f.desc}</p>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
