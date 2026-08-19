"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function SettingsPage({ params }) {
  const { id } = use(params);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    api.get(`/weddings/${id}`).then((res) => {
      const w = res.data;
      setForm({
        coupleName: w.coupleName, partnerName: w.partnerName,
        weddingDate: w.weddingDate?.split("T")[0] || "",
        location: w.location || "", description: w.description || "",
        primaryLanguage: w.primaryLanguage, isPrivate: w.isPrivate,
      });
    });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/weddings/${id}`, form);
      addToast("Settings updated", "success");
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  if (!form) return <div className="space-y-4">{[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton rounded-lg" />)}</div>;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in space-y-6">
      <Link href={`/dashboard/weddings/${id}`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Wedding
      </Link>

      <h1 className="font-display text-3xl font-light text-deep-brown">Wedding Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Couple Name" value={form.coupleName} onChange={update("coupleName")} required />
          <Input label="Partner Name" value={form.partnerName} onChange={update("partnerName")} required />
        </div>
        <Input label="Wedding Date" type="date" value={form.weddingDate} onChange={update("weddingDate")} required />
        <Input label="Location" value={form.location} onChange={update("location")} />
        <Select label="Primary Language" value={form.primaryLanguage} onChange={update("primaryLanguage")}>
          <option value="en">English</option>
          <option value="rw">Kinyarwanda</option>
          <option value="fr">French</option>
        </Select>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            className="w-full h-24 px-3 py-2 rounded-md border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-colors resize-none"
            value={form.description}
            onChange={update("description")}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={loading}><Save className="h-4 w-4 mr-2" /> Save Changes</Button>
        </div>
      </form>
    </div>
  );
}
