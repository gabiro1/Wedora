"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import EmptyState from "@/components/ui/EmptyState";
import { Heart, Search, ArrowLeft, Download, Users } from "lucide-react";
import Link from "next/link";

const typeLabels = { PHYSICAL_GIFT: "Physical Gift", MONETARY: "Monetary", OTHER: "Other", MESSAGE: "Message" };
const statusColors = { PENDING: "warning", ACKNOWLEDGED: "success", VERIFIED: "info", ARCHIVED: "default" };

export default function ContributionsPage({ params }) {
  const { id } = use(params);
  const [data, setData] = useState(null);
  const [filters, setFilters] = useState({ page: 1, type: "", status: "", search: "", sort: "newest" });
  const { addToast } = useToast();

  const load = () => {
    const qs = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v) qs.set(k, v); });
    api.get(`/weddings/${id}/contributions?${qs}`)
      .then((res) => setData(res.data))
      .catch(() => addToast("Failed to load", "error"));
  };

  useEffect(() => { load(); }, [filters]);

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Wedding
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-light text-deep-brown">Contributions</h1>
          <p className="text-warm-gray text-sm mt-1">{data?.total || 0} total contributions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm"><Download className="h-4 w-4 mr-1" /> Export</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-light-gray" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full h-10 pl-10 pr-3 rounded-md border border-border bg-white text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring/30"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          />
        </div>
        <Select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}>
          <option value="">All Types</option>
          <option value="PHYSICAL_GIFT">Physical Gift</option>
          <option value="MONETARY">Monetary</option>
          <option value="OTHER">Other</option>
          <option value="MESSAGE">Message</option>
        </Select>
        <Select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
          <option value="VERIFIED">Verified</option>
        </Select>
      </div>

      {/* Table */}
      {data && data.contributions.length === 0 ? (
        <EmptyState icon={Heart} title="No contributions yet" description="Contributions will appear here once guests start submitting." />
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-warm-white/50">
                  <th className="text-left p-4 font-medium text-warm-gray">Guest</th>
                  <th className="text-left p-4 font-medium text-warm-gray">Type</th>
                  <th className="text-left p-4 font-medium text-warm-gray hidden sm:table-cell">Description</th>
                  <th className="text-left p-4 font-medium text-warm-gray">Status</th>
                  <th className="text-left p-4 font-medium text-warm-gray hidden md:table-cell">Date</th>
                </tr>
              </thead>
              <tbody>
                {data?.contributions.map((c) => (
                  <tr key={c.id} className="border-b border-border/50 hover:bg-warm-white/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-champagne flex items-center justify-center text-xs font-medium text-deep-brown">
                          {c.guestName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                        </div>
                        <span className="font-medium">{c.guestName}</span>
                      </div>
                    </td>
                    <td className="p-4"><Badge>{typeLabels[c.type]}</Badge></td>
                    <td className="p-4 text-warm-gray hidden sm:table-cell max-w-[200px] truncate">{c.description || "—"}</td>
                    <td className="p-4"><Badge variant={statusColors[c.status]}>{c.status}</Badge></td>
                    <td className="p-4 text-warm-gray hidden md:table-cell">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {data && data.totalPages > 1 && (
            <div className="flex items-center justify-between p-4 border-t border-border">
              <p className="text-xs text-warm-gray">
                Page {data.page} of {data.totalPages}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" disabled={data.page <= 1} onClick={() => setFilters({ ...filters, page: data.page - 1 })}>Previous</Button>
                <Button variant="outline" size="sm" disabled={data.page >= data.totalPages} onClick={() => setFilters({ ...filters, page: data.page + 1 })}>Next</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
