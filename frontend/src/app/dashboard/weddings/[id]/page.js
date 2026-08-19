"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { Calendar, MapPin, Users, Heart, Camera, QrCode, Download, Settings, Sparkles } from "lucide-react";

export default function WeddingDetailPage({ params }) {
  const { id } = use(params);
  const [wedding, setWedding] = useState(null);
  const [stats, setStats] = useState(null);
  const [qr, setQr] = useState(null);
  const [showQR, setShowQR] = useState(false);
  const { addToast } = useToast();
  const router = useRouter();

  useEffect(() => {
    Promise.all([
      api.get(`/weddings/${id}`),
      api.get(`/weddings/${id}/stats`),
    ]).then(([w, s]) => { setWedding(w.data); setStats(s.data); })
      .catch(() => addToast("Failed to load wedding", "error"));
  }, [id]);

  const loadQR = async (type = "main") => {
    try {
      const res = await api.get(`/weddings/${id}/qr?type=${type}`);
      setQr(res.data);
      setShowQR(true);
    } catch (err) {
      addToast(err.message, "error");
    }
  };

  if (!wedding) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-24 skeleton rounded-xl" />)}</div>;

  const date = new Date(wedding.weddingDate);

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="bg-white rounded-xl border border-border p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="gold">{wedding.status}</Badge>
              <span className="text-xs text-warm-gray">{wedding.primaryLanguage?.toUpperCase()}</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-deep-brown font-light">
              {wedding.coupleName}
            </h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-warm-gray">
              <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />
                {date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
              </span>
              {wedding.location && <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{wedding.location}</span>}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => loadQR("main")}><QrCode className="h-4 w-4 mr-2" />QR Code</Button>
            <Link href={`/dashboard/weddings/${id}/settings`}>
              <Button variant="ghost"><Settings className="h-4 w-4 mr-2" />Settings</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Contributions", value: stats.totalContributions, icon: Heart, color: "text-muted-gold" },
            { label: "Guests", value: stats.totalGuests, icon: Users, color: "text-sage" },
            { label: "Photos", value: stats.photos, icon: Camera, color: "text-dusty-rose" },
            { label: "Videos", value: stats.videos, icon: Camera, color: "text-deep-wine" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-border p-5">
              <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
              <p className="font-display text-3xl text-deep-brown font-light">{stat.value}</p>
              <p className="text-xs text-warm-gray mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Link href={`/dashboard/weddings/${id}/contributions`} className="bg-white rounded-xl border border-border p-6 hover:border-muted-gold/30 hover:shadow-md transition-all group">
          <Heart className="h-6 w-6 text-muted-gold mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-deep-brown mb-1">Contributions</h3>
          <p className="text-xs text-warm-gray">View and manage all contributions</p>
        </Link>
        <Link href={`/dashboard/weddings/${id}/memories`} className="bg-white rounded-xl border border-border p-6 hover:border-muted-gold/30 hover:shadow-md transition-all group">
          <Camera className="h-6 w-6 text-sage mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-deep-brown mb-1">Memories</h3>
          <p className="text-xs text-warm-gray">Browse and moderate uploads</p>
        </Link>
        <Link href={`/dashboard/weddings/${id}/gallery`} className="bg-white rounded-xl border border-border p-6 hover:border-muted-gold/30 hover:shadow-md transition-all group">
          <QrCode className="h-6 w-6 text-dusty-rose mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-deep-brown mb-1">Gallery</h3>
          <p className="text-xs text-warm-gray">View approved memories</p>
        </Link>
        <Link href={`/dashboard/weddings/${id}/ai`} className="bg-white rounded-xl border border-border p-6 hover:border-muted-gold/30 hover:shadow-md transition-all group">
          <Sparkles className="h-6 w-6 text-rich-gold mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-medium text-deep-brown mb-1">AI Intelligence</h3>
          <p className="text-xs text-warm-gray">Quality, highlights, search</p>
        </Link>
      </div>

      {/* QR Modal */}
      {showQR && qr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setShowQR(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full mx-4 text-center animate-scale-in">
            <h3 className="font-display text-2xl text-deep-brown mb-1">{wedding.coupleName}</h3>
            <p className="text-sm text-warm-gray mb-6">{date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</p>
            <img src={qr.png} alt="QR Code" className="mx-auto mb-6 rounded-lg" width={280} height={280} />
            <p className="text-xs text-warm-gray mb-6">Scan to access the wedding experience</p>
            <div className="flex gap-2 justify-center">
              {["main", "contribution", "memory"].map((type) => (
                <button
                  key={type}
                  onClick={() => loadQR(type)}
                  className="px-3 py-1.5 text-xs rounded-full border border-border hover:bg-champagne transition-colors capitalize"
                >
                  {type}
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-2 justify-center">
              <a href={qr.png} download={`wedora-${id}-qr.png`} className="inline-flex items-center gap-1 text-xs text-muted-gold hover:underline">
                <Download className="h-3.5 w-3.5" /> Download PNG
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
