"use client";
import { useState, useEffect, use } from "react";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Heart, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const TYPES = [
  { value: "PHYSICAL_GIFT", label: "Physical Gift" },
  { value: "MONETARY", label: "Monetary Contribution" },
  { value: "OTHER", label: "Other Contribution" },
  { value: "MESSAGE", label: "Personal Message" },
];

export default function ContributePage({ params }) {
  const { token } = use(params);
  const [wedding, setWedding] = useState(null);
  const [form, setForm] = useState({ guestName: "", type: "PHYSICAL_GIFT", description: "", monetaryAmount: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { addToast } = useToast();

  useEffect(() => {
    api.get(`/weddings/public/${token}`).then((res) => setWedding(res.data)).catch(() => {});
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { ...form, currency: "RWF" };
      if (form.type !== "MONETARY") delete body.monetaryAmount;
      if (!body.description) delete body.description;
      if (!body.notes) delete body.notes;
      await fetch(`${typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:5000/api` : process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/guest/${token}/contribute`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => { if (!r.ok) throw new Error("Failed to submit"); });
      setSubmitted(true);
    } catch (err) {
      addToast(err.message || "Failed to submit", "error");
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  if (submitted) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
        <div className="text-center animate-scale-in max-w-md">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-50 mb-6">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="font-display text-3xl text-deep-brown mb-3">Thank you!</h1>
          <p className="text-warm-gray mb-8 font-display text-lg italic">
            Your contribution has been received and will be acknowledged shortly.
          </p>
          <Link
            href={`/w/${token}`}
            className="inline-flex items-center gap-2 h-12 px-8 border border-border bg-white rounded-lg font-medium hover:bg-champagne transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Wedding
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="max-w-lg mx-auto px-4 py-12">
        <Link href={`/w/${token}`} className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>

        <div className="text-center mb-10">
          <Heart className="h-8 w-8 text-muted-gold mx-auto mb-4" fill="currentColor" />
          <h1 className="font-display text-3xl text-deep-brown mb-1">Register Your Contribution</h1>
          <p className="text-warm-gray">
            {wedding ? `${wedding.coupleName} & ${wedding.partnerName}` : "Loading..."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-8 space-y-5 animate-slide-up">
          <Input
            label="Your Name"
            placeholder="Enter your full name"
            value={form.guestName}
            onChange={update("guestName")}
            required
          />

          <Select label="Contribution Type" value={form.type} onChange={update("type")}>
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </Select>

          {form.type === "MONETARY" && (
            <Input
              label="Amount (RWF)"
              type="number"
              placeholder="Enter amount"
              value={form.monetaryAmount}
              onChange={update("monetaryAmount")}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Description / Message</label>
            <textarea
              className="w-full h-24 px-3 py-2 rounded-md border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-colors resize-none"
              placeholder={
                form.type === "MESSAGE"
                  ? "Write your heartfelt message..."
                  : form.type === "PHYSICAL_GIFT"
                  ? "Describe your gift (optional)"
                  : "Add any notes (optional)"
              }
              value={form.description}
              onChange={update("description")}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Additional Notes</label>
            <textarea
              className="w-full h-20 px-3 py-2 rounded-md border border-border bg-white text-foreground placeholder:text-light-gray focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-muted-gold transition-colors resize-none"
              placeholder="Any special notes or cultural declarations (e.g., Nguhaye inka)"
              value={form.notes}
              onChange={update("notes")}
            />
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Submit Contribution
          </Button>
        </form>
      </div>
    </div>
  );
}
