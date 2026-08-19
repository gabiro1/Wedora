"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { BarChart3, Heart, Camera, Users, Calendar, TrendingUp } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/weddings").then(async (res) => {
      const weddings = res.data.weddings || [];
      let totalContributions = 0;
      let totalMemories = 0;
      let totalGuests = 0;
      const statusCounts = { PLANNING: 0, ACTIVE: 0, COMPLETED: 0 };

      for (const w of weddings) {
        totalContributions += w._count?.contributions || 0;
        totalMemories += w._count?.memories || 0;
        totalGuests += w._count?.guests || 0;
        statusCounts[w.status] = (statusCounts[w.status] || 0) + 1;
      }

      setStats({
        totalWeddings: weddings.length,
        totalContributions,
        totalMemories,
        totalGuests,
        statusCounts,
        recentWeddings: weddings.slice(0, 5),
      });
    }).catch(() => setStats({ totalWeddings: 0, totalContributions: 0, totalMemories: 0, totalGuests: 0, statusCounts: {}, recentWeddings: [] }));
  }, []);

  return (
    <div className="animate-fade-in space-y-8">
      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-primary" /> Analytics
        </h1>
        <p className="text-warm-gray text-sm mt-1">Overview of all your weddings</p>
      </div>

      {stats === null ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 skeleton rounded-xl" />)}
        </div>
      ) : stats.totalWeddings === 0 ? (
        <EmptyState icon={BarChart3} title="No data yet" description="Create a wedding to see analytics." />
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Weddings", value: stats.totalWeddings, icon: Calendar, color: "text-primary" },
              { label: "Contributions", value: stats.totalContributions, icon: Heart, color: "text-muted-gold" },
              { label: "Memories", value: stats.totalMemories, icon: Camera, color: "text-sage" },
              { label: "Guests", value: stats.totalGuests, icon: Users, color: "text-dusty-rose" },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl border border-border p-6">
                <s.icon className={`h-5 w-5 ${s.color} mb-2`} />
                <p className="font-display text-3xl text-deep-brown">{s.value}</p>
                <p className="text-xs text-warm-gray mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-medium text-deep-brown mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" /> Wedding Status
              </h3>
              <div className="space-y-3">
                {Object.entries(stats.statusCounts).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="text-sm text-warm-gray">{status}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-2 bg-champagne rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${(count / stats.totalWeddings) * 100}%` }} />
                      </div>
                      <span className="text-sm font-medium text-deep-brown w-6 text-right">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-medium text-deep-brown mb-4">Recent Weddings</h3>
              <div className="space-y-3">
                {stats.recentWeddings.map((w) => (
                  <div key={w.id} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm font-medium text-deep-brown">{w.coupleName} & {w.partnerName}</p>
                      <p className="text-xs text-warm-gray">{new Date(w.weddingDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-warm-gray">
                      <span>{w._count?.contributions || 0} contributions</span>
                      <span>{w._count?.memories || 0} memories</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
