"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowRight, Heart, Check } from "lucide-react";

const perks = [
  "Unlimited wedding pages",
  "Guest contribution tracking",
  "AI-powered memory collection",
];

export default function RegisterPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      api.setAuth(res.data.accessToken, res.data.refreshToken);
      addToast("Account created! Let's set up your wedding.", "success");
      router.push("/dashboard");
    } catch (err) {
      addToast(err.message || "Registration failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted-gold/10 text-muted-gold text-xs font-medium mb-4">
          <Heart className="h-3 w-3" />
          Create your account
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-deep-brown dark:text-foreground tracking-tight">
          Start your wedding journey
        </h1>
        <p className="text-warm-gray mt-2 text-sm leading-relaxed">
          Join thousands of couples planning their perfect celebration.
        </p>
      </div>

      {/* Perks */}
      <div className="space-y-2.5">
        {perks.map((perk) => (
          <div key={perk} className="flex items-center gap-2.5 text-sm text-warm-gray">
            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-muted-gold/10 flex items-center justify-center">
              <Check className="h-3 w-3 text-muted-gold" />
            </div>
            {perk}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            placeholder="Jean"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />
          <Input
            label="Last Name"
            placeholder="Hakizimana"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />
        </div>
        <Input
          label="Email"
          type="email"
          placeholder="inezastecy@yopmail.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          minLength={8}
        />

        <Button
          type="submit"
          loading={loading}
          className="w-full group"
          size="lg"
        >
          <span>Create Account</span>
          {!loading && <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-warm-gray">
        Already have an account?{" "}
        <Link href="/login" className="text-muted-gold font-medium hover:text-rich-gold transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
}
