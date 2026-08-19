"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Brain, Sparkles, Search, Camera, BookOpen, BarChart3, Layers, ArrowLeft, Zap } from "lucide-react";
import Link from "next/link";

export default function AIDashboardPage({ params }) {
  const { id } = use(params);
  const [insights, setInsights] = useState(null);
  const [processing, setProcessing] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    Promise.all([
      api.get(`/weddings/${id}/ai/insights`),
      api.get(`/weddings/${id}/ai/process/status`),
    ]).then(([ins, proc]) => { setInsights(ins.data); setProcessing(proc.data); })
      .catch(() => {});
  }, [id]);

  const runProcessing = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/weddings/${id}/ai/process`);
      addToast(`Processed ${res.data.processed} memories`, "success");
      const proc = await api.get(`/weddings/${id}/ai/process/status`);
      setProcessing(proc.data);
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <Link href={`/dashboard/weddings/${id}`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Wedding
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Brain className="h-5 w-5 text-muted-gold" />
            <h1 className="font-display text-3xl font-light text-deep-brown">AI Intelligence</h1>
          </div>
          <p className="text-warm-gray text-sm">Smart analysis of your wedding memories</p>
        </div>
        <Button onClick={runProcessing} loading={loading} variant="outline">
          <Zap className="h-4 w-4 mr-2" /> Run AI Processing
        </Button>
      </div>

      {/* Processing Status */}
      {processing && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-sm font-medium text-warm-gray mb-4">AI Processing Status</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total", value: processing.total, color: "text-foreground" },
              { label: "Completed", value: processing.completed, color: "text-success" },
              { label: "Pending", value: processing.pending, color: "text-warning" },
              { label: "Failed", value: processing.failed, color: "text-destructive" },
            ].map((s) => (
              <div key={s.label}>
                <p className={`font-display text-2xl ${s.color}`}>{s.value}</p>
                <p className="text-xs text-warm-gray">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Feature Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Camera, title: "Quality Assessment", desc: "Analyze photo quality, blur, exposure, and composition", href: `/dashboard/weddings/${id}/ai/quality`, stat: insights?.quality?.totalProcessed, color: "text-muted-gold" },
          { icon: Layers, title: "Duplicate Detection", desc: "Find near-duplicate photos and burst shots", href: `/dashboard/weddings/${id}/ai/duplicates`, stat: insights?.duplicateStats?.totalGroups, color: "text-dusty-rose" },
          { icon: Search, title: "Smart Search", desc: "Search memories by description, people, or events", href: `/dashboard/weddings/${id}/ai/search`, color: "text-sage" },
          { icon: Sparkles, title: "AI Highlights", desc: "Auto-curated best moments from your celebration", href: `/dashboard/weddings/${id}/ai/highlights`, stat: insights?.summary?.aiSelectedHighlights, color: "text-rich-gold" },
          { icon: Layers, title: "Smart Album", desc: "AI-organized digital album with sections", href: `/dashboard/weddings/${id}/ai/album`, color: "text-deep-wine" },
          { icon: BookOpen, title: "Wedding Story", desc: "AI-generated narrative of your wedding day", href: `/dashboard/weddings/${id}/ai/story`, color: "text-primary" },
        ].map((feature, i) => (
          <Link
            key={i}
            href={feature.href}
            className="group p-6 bg-white rounded-xl border border-border hover:border-muted-gold/30 hover:shadow-lg transition-all duration-300"
          >
            <feature.icon className={`h-6 w-6 ${feature.color} mb-3 group-hover:scale-110 transition-transform`} />
            <h3 className="font-medium text-deep-brown mb-1">{feature.title}</h3>
            <p className="text-xs text-warm-gray mb-3">{feature.desc}</p>
            {feature.stat !== undefined && (
              <p className="text-sm font-medium text-muted-gold">{feature.stat} items</p>
            )}
          </Link>
        ))}
      </div>

      {/* Insights Summary */}
      {insights && (
        <div className="bg-white rounded-xl border border-border p-6">
          <h3 className="text-sm font-medium text-warm-gray mb-4">AI-Generated Insights</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <p className="font-display text-3xl text-deep-brown">{insights.summary.totalMemories}</p>
              <p className="text-xs text-warm-gray">Total Memories</p>
            </div>
            <div>
              <p className="font-display text-3xl text-deep-brown">{insights.summary.activeContributors}</p>
              <p className="text-xs text-warm-gray">Active Contributors</p>
            </div>
            <div>
              <p className="font-display text-3xl text-muted-gold">{insights.quality.averageScore}</p>
              <p className="text-xs text-warm-gray">Avg Quality Score</p>
            </div>
            <div>
              <p className="font-display text-3xl text-deep-brown">{insights.activity.peakHour}</p>
              <p className="text-xs text-warm-gray">Peak Activity</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
