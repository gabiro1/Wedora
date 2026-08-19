"use client";
import { useState, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, Search, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AISearchPage({ params }) {
  const { id } = use(params);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const search = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await api.get(`/weddings/${id}/ai/search?q=${encodeURIComponent(query)}`);
      setResults(res.data);
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}/ai`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> AI Dashboard
      </Link>

      <div>
        <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
          <Search className="h-6 w-6 text-sage" /> Smart Memory Search
        </h1>
        <p className="text-warm-gray text-sm mt-1">Search your memories naturally</p>
      </div>

      <form onSubmit={search} className="flex gap-3">
        <Input
          placeholder='Try: "bride with mother", "dancing", "ceremony", "smiling faces"...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" loading={loading}>
          <Search className="h-4 w-4 mr-2" /> Search
        </Button>
      </form>

      <div className="flex flex-wrap gap-2">
        {["bride", "groom", "couple", "family", "ceremony", "dancing", "smiling", "outdoor", "reception"].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => { setQuery(suggestion); }}
            className="px-3 py-1.5 text-xs rounded-full border border-border bg-white hover:bg-champagne transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>

      {results && (
        <div>
          <p className="text-sm text-warm-gray mb-4">{results.total} results found for &quot;{results.query}&quot;</p>
          {results.results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {results.results.map((r) => (
                <div key={r.id} className="bg-white rounded-lg border border-border overflow-hidden group">
                  <div className="aspect-square bg-champagne relative">
                    <img src={r.thumbnailUrl || r.storageUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="bg-black/60 text-white text-[10px] px-2 py-1 rounded-full">
                        Score: {r.searchScore}
                      </span>
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="text-xs text-warm-gray truncate">{r.guestName || "Anonymous"}</p>
                    {r.reasons?.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {r.reasons.slice(0, 2).map((reason) => (
                          <span key={reason} className="text-[9px] bg-champagne text-muted-gold px-1.5 py-0.5 rounded-full">
                            {reason.replace("_match", "")}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Search} title="No results" description="Try different search terms." />
          )}
        </div>
      )}
    </div>
  );
}
