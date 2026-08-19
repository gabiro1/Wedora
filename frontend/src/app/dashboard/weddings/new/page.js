"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";

export default function NewWeddingPage() {
  const [form, setForm] = useState({
    coupleName: "", partnerName: "", weddingDate: "",
    location: "", description: "", primaryLanguage: "en",
  });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/weddings", { ...form, isPrivate: true, timezone: "Africa/Kigali" });
      addToast("Wedding created successfully!", "success");
      router.push(`/dashboard/weddings/${res.data.id}`);
    } catch (err) {
      addToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h2 className="font-display text-3xl font-light text-deep-brown mb-8">Create Your Wedding</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Input label="Couple Name" placeholder="Jean & Alice" value={form.coupleName} onChange={update("coupleName")} required />
          <Input label="Partner Name" placeholder="Partner's full name" value={form.partnerName} onChange={update("partnerName")} required />
        </div>
        <Input label="Wedding Date" type="date" value={form.weddingDate} onChange={update("weddingDate")} required />
        <Input label="Location" placeholder="Kigali, Rwanda" value={form.location} onChange={update("location")} />
        <Select label="Primary Language" value={form.primaryLanguage} onChange={update("primaryLanguage")}>
          <option value="en">English</option>
          <option value="rw">Kinyarwanda</option>
          <option value="fr">French</option>
        </Select>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea
            className="w-full h-24 px-3 py-2 rounded-md border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-colors resize-none"
            placeholder="Tell your guests about your celebration..."
            value={form.description}
            onChange={update("description")}
          />
        </div>
        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Wedding
        </Button>
      </form>
    </div>
  );
}
