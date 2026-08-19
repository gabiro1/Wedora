"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { ArrowLeft, BookOpen, Edit3, Check, X } from "lucide-react";
import Link from "next/link";

export default function AIStoryPage({ params }) {
  const { id } = use(params);
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const { addToast } = useToast();

  const generate = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/weddings/${id}/ai/story/generate`);
      setStory(res.data);
      addToast("Story generated", "success");
    } catch (err) { addToast(err.message, "error"); }
    finally { setLoading(false); }
  };

  const saveEdit = async () => {
    try {
      const res = await api.patch(`/weddings/${id}/ai/story`, { content: editContent });
      setStory(res.data);
      setEditing(false);
      addToast("Story updated", "success");
    } catch (err) { addToast(err.message, "error"); }
  };

  useEffect(() => {
    api.get(`/weddings/${id}/ai/story`).then((res) => { if (res.data) setStory(res.data); }).catch(() => {});
  }, [id]);

  return (
    <div className="animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}/ai`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> AI Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-light text-deep-brown flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" /> Wedding Story
          </h1>
          <p className="text-warm-gray text-sm mt-1">AI-generated narrative of your day</p>
        </div>
        <div className="flex gap-2">
          {story && (
            <Button variant="outline" onClick={() => { setEditing(!editing); setEditContent(story.content); }}>
              <Edit3 className="h-4 w-4 mr-2" /> Edit
            </Button>
          )}
          <Button onClick={generate} loading={loading}>
            <BookOpen className="h-4 w-4 mr-2" /> {story ? "Regenerate" : "Generate Story"}
          </Button>
        </div>
      </div>

      {story ? (
        <div className="bg-white rounded-xl border border-border p-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-medium tracking-widest text-muted-gold uppercase bg-muted-gold/10 px-2 py-0.5 rounded">AI Generated</span>
            <Badge variant={story.status === "GENERATED" ? "gold" : "default"}>{story.status}</Badge>
          </div>

          {editing ? (
            <div className="space-y-4">
              <textarea
                className="w-full h-96 px-4 py-3 rounded-lg border border-border bg-white text-foreground font-serif text-lg leading-relaxed focus:outline-none focus:ring-2 focus:ring-ring/30 resize-none"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setEditing(false)}><X className="h-4 w-4 mr-1" /> Cancel</Button>
                <Button onClick={saveEdit}><Check className="h-4 w-4 mr-1" /> Save</Button>
              </div>
            </div>
          ) : (
            <div className="prose prose-lg max-w-none">
              {story.content.split("\n").map((line, i) => {
                if (line.startsWith("# ")) return <h1 key={i} className="font-display text-4xl text-deep-brown font-light mt-8 mb-4">{line.slice(2)}</h1>;
                if (line.startsWith("## ")) return <h2 key={i} className="font-display text-2xl text-deep-brown font-light mt-6 mb-3">{line.slice(3)}</h2>;
                if (line.startsWith("---")) return <hr key={i} className="my-8 border-border" />;
                if (line.startsWith("*") && line.endsWith("*")) return <p key={i} className="text-sm text-warm-gray italic mt-4">{line.slice(1, -1)}</p>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="text-foreground leading-relaxed mb-2 font-serif">{line}</p>;
              })}
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={BookOpen}
          title="No story yet"
          description="Generate an AI narrative from your wedding memories."
          action={<Button onClick={generate} loading={loading}>Generate Story</Button>}
        />
      )}
    </div>
  );
}
