"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, Copy, CheckCircle, Trash2 } from "lucide-react";
import Link from "next/link";

export default function AIDuplicatesPage({ params }) {
  const { id } = use(params);
  const [groups, setGroups] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const detect = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/weddings/${id}/ai/duplicates/detect`);
      addToast(`Found ${res.data.totalGroups} duplicate groups`, "success");
      loadGroups();
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const loadGroups = () => {
    // Reload page data
    api.get(`/weddings/${id}/ai/duplicates`).then((res) => {
      // Groups are loaded from the detect response or separate endpoint
    }).catch(() => {});
  };

  useEffect(() => { detect(); }, [id]);

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}/ai`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> AI Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
            <Copy className="h-6 w-6 text-dusty-rose" /> Duplicate Detection
          </h1>
          <p className="text-warm-gray text-sm mt-1">Find near-duplicate and burst photos</p>
        </div>
        <Button onClick={detect} loading={loading} variant="outline">
          Re-scan
        </Button>
      </div>

      {groups && groups.groups?.length > 0 ? (
        <div className="space-y-4">
          <p className="text-sm text-warm-gray">{groups.totalGroups} potential duplicate groups found</p>
          {groups.groups.map((group) => (
            <div key={group.id} className="bg-white rounded-xl border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Badge variant="warning">{group.groupSize} similar photos</Badge>
                  <span className="text-xs text-warm-gray">{group.similarityScore}% similar</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" className="text-xs">Keep All</Button>
                  <Button size="sm" variant="ghost" className="text-xs text-destructive">
                    <Trash2 className="h-3 w-3 mr-1" /> Delete Selected
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {group.members?.map((member) => (
                  <div key={member.id} className={`relative rounded-lg overflow-hidden border-2 ${member.isRecommended ? "border-muted-gold" : "border-transparent"}`}>
                    {member.memory?.thumbnailUrl ? (
                      <img src={member.memory.thumbnailUrl} alt="" className="aspect-square object-cover w-full" />
                    ) : (
                      <div className="aspect-square bg-champagne" />
                    )}
                    {member.isRecommended && (
                      <div className="absolute top-1 left-1">
                        <span className="bg-muted-gold text-white text-[9px] px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                          <CheckCircle className="h-2.5 w-2.5" /> Best
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Copy}
          title="No duplicates found"
          description="Run duplicate detection to find near-identical photos."
          action={<Button onClick={detect} loading={loading}>Run Detection</Button>}
        />
      )}
    </div>
  );
}
