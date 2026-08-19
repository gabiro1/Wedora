"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, Camera, Star, TrendingUp } from "lucide-react";
import Link from "next/link";

const gradeColors = { EXCELLENT: "success", GOOD: "info", ACCEPTABLE: "warning", POOR: "destructive" };

export default function AIQualityPage({ params }) {
  const { id } = use(params);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("");
  const [memories, setMemories] = useState([]);
  const { addToast } = useToast();

  useEffect(() => {
    api.get(`/weddings/${id}/ai/quality`).then((res) => setStats(res.data)).catch(() => {});
    loadMemories("");
  }, [id]);

  const loadMemories = (grade) => {
    setFilter(grade);
    const qs = grade ? `&qualityGrade=${grade}` : "";
    api.get(`/weddings/${id}/memories?page=1&limit=50&moderationStatus=APPROVED`).then((res) => {
      const withQuality = res.data.memories.map((m) => ({
        ...m,
        quality: m.analysis || null,
      })).filter((m) => !grade || m.quality?.qualityGrade === grade);
      setMemories(withQuality);
    }).catch(() => {});
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}/ai`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> AI Dashboard
      </Link>

      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
          <Camera className="h-6 w-6 text-muted-gold" /> Quality Assessment
        </h1>
        <p className="text-warm-gray text-sm mt-1">AI-powered photo quality analysis</p>
      </div>

      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          {Object.entries(stats.grades).map(([grade, count]) => (
            <button
              key={grade}
              onClick={() => loadMemories(grade)}
              className={`p-4 rounded-xl border text-center transition-all ${filter === grade ? "border-muted-gold bg-champagne" : "border-border bg-white hover:border-muted-gold/30"}`}
            >
              <Badge variant={gradeColors[grade]} className="mb-2">{grade}</Badge>
              <p className="font-display text-2xl text-deep-brown">{count}</p>
            </button>
          ))}
          <div className="p-4 rounded-xl border border-border bg-white text-center">
            <TrendingUp className="h-5 w-5 text-muted-gold mx-auto mb-2" />
            <p className="font-display text-2xl text-deep-brown">{stats.averageScore}</p>
            <p className="text-xs text-warm-gray">Avg Score</p>
          </div>
        </div>
      )}

      {memories.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {memories.map((m) => (
            <div key={m.id} className="bg-white rounded-lg border border-border overflow-hidden">
              <div className="aspect-square bg-champagne relative">
                <img src={m.thumbnailUrl || m.storageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                {m.quality && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-black/60 text-white text-xs px-2 py-1 rounded-full font-medium">
                      {m.quality.qualityScore}/100
                    </span>
                  </div>
                )}
              </div>
              <div className="p-2">
                <Badge variant={gradeColors[m.quality?.qualityGrade || "POOR"]} className="text-[10px]">
                  {m.quality?.qualityGrade || "UNGRADED"}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}

      {memories.length === 0 && stats && (
        <EmptyState icon={Camera} title="No memories analyzed" description="Run AI processing to analyze photo quality." />
      )}
    </div>
  );
}
