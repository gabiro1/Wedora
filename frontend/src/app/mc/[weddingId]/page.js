"use client";
import { useState, useEffect, useRef, use } from "react";
import api from "@/lib/api";
import Button from "@/components/ui/Button";
import { Heart, Wifi, WifiOff, Undo2 } from "lucide-react";
import { io } from "socket.io-client";

export default function MCQueuePage({ params }) {
  const { weddingId } = use(params);
  const [queue, setQueue] = useState({ current: null, next: [], total: 0 });
  const [connected, setConnected] = useState(false);
  const [lastAck, setLastAck] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Load initial queue
    api.get(`/weddings/${weddingId}/contributions/queue`).then((res) => setQueue(res.data)).catch(() => {});

    // Connect socket
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || `${window.location.protocol}//${window.location.hostname}:5000`, {
      withCredentials: true, reconnection: true,
    });
    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join:mc", weddingId);
    });
    socket.on("disconnect", () => setConnected(false));
    socket.on("queue:updated", (data) => setQueue(data));
    socket.on("contribution:created", () => {
      api.get(`/weddings/${weddingId}/contributions/queue`).then((res) => setQueue(res.data));
    });

    return () => socket.disconnect();
  }, [weddingId]);

  const acknowledge = async () => {
    try {
      const res = await api.post(`/weddings/${weddingId}/contributions/queue/acknowledge`);
      setLastAck(res.data.acknowledged);
    } catch {}
  };

  const undo = async () => {
    if (!lastAck) return;
    try {
      // find the last acknowledged entry from queue history
      await api.post(`/weddings/${weddingId}/contributions/queue/last/undo`);
    } catch {}
  };

  return (
    <div className="min-h-screen bg-charcoal text-white flex flex-col select-none">
      {/* Header */}
      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <Heart className="h-5 w-5 text-muted-gold" fill="currentColor" />
          <span className="font-display text-xl">LIVE QUEUE</span>
        </div>
        <div className="flex items-center gap-2">
          {connected ? (
            <span className="flex items-center gap-1.5 text-xs text-green-400"><Wifi className="h-3.5 w-3.5" /> Live</span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs text-red-400"><WifiOff className="h-3.5 w-3.5" /> Disconnected</span>
          )}
          <span className="text-xs text-white/40 ml-2">{queue.total} waiting</span>
        </div>
      </div>

      {/* Queue display */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12">
        {queue.current ? (
          <div className="text-center w-full max-w-lg animate-fade-in">
            {/* Current */}
            <p className="text-xs tracking-[0.3em] text-white/40 uppercase mb-4">Currently Acknowledging</p>
            <div className="bg-white/5 rounded-2xl p-8 sm:p-12 mb-8 border border-white/10">
              <p className="font-display text-4xl sm:text-6xl font-light text-white leading-tight">
                {queue.current.contribution.guestName}
              </p>
            </div>

            {/* Next */}
            {queue.next.length > 0 && (
              <>
                <p className="text-xs tracking-[0.3em] text-white/30 uppercase mb-4">Next in Queue</p>
                <div className="space-y-2 mb-8">
                  {queue.next.map((entry, i) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-3 px-5 py-3 bg-white/5 rounded-lg border border-white/5 animate-slide-up"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <span className="text-xs text-white/30 w-4">{i + 1}</span>
                      <p className="font-display text-lg text-white/80">{entry.contribution.guestName}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={acknowledge}
                className="h-16 px-12 text-lg bg-muted-gold hover:bg-rich-gold"
              >
                MARK AS ACKNOWLEDGED
              </Button>
              {lastAck && (
                <Button
                  variant="ghost"
                  onClick={undo}
                  className="h-16 px-6 border border-white/20 text-white/60 hover:text-white hover:bg-white/10"
                >
                  <Undo2 className="h-5 w-5" />
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center animate-fade-in">
            <Heart className="h-16 w-16 text-white/10 mx-auto mb-6" />
            <h2 className="font-display text-3xl text-white/40 mb-2">Queue is empty</h2>
            <p className="text-white/20">Waiting for contributions...</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 text-center border-t border-white/10">
        <p className="text-xs text-white/20">
          MC Mode — Only guest names are visible. Gift details are not shown.
        </p>
      </div>
    </div>
  );
}
