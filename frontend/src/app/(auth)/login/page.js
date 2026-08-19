"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { ArrowRight, Sparkles } from "lucide-react";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      api.setAuth(res.data.accessToken, res.data.refreshToken);
      addToast("Welcome back!", "success");
      router.push("/dashboard");
    } catch (err) {
      addToast(err.message || "Login failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-muted-gold/10 text-muted-gold text-xs font-medium mb-4">
          <Sparkles className="h-3 w-3" />
          Welcome back
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-light text-deep-brown dark:text-foreground tracking-tight">
          Sign in to Wedora
        </h1>
        <p className="text-warm-gray mt-2 text-sm leading-relaxed">
          Manage your wedding, track contributions, and capture memories.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="inezastecy@yopmail.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <div className="flex justify-end mt-1.5">
            <Link href="/forgot-password" className="text-xs text-muted-gold hover:text-rich-gold transition-colors">
              Forgot password?
            </Link>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full group" size="lg">
          <span>Sign In</span>
          {!loading && <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-warm-gray">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-muted-gold font-medium hover:text-rich-gold transition-colors">
          Create one free
        </Link>
      </p>
    </div>
  );
}
