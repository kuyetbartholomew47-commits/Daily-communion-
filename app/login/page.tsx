"use client";

import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function signInWithEmailPassword(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) {
        setMessage(res.error.message || "Sign-in failed");
      } else if (res.data.session) {
        // logged in
        router.push("/");
      } else {
        // no session (edge cases)
        setMessage("Sign-in succeeded but no session was returned.");
      }
    } catch (err: any) {
      setMessage(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  async function sendMagicLink(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const redirectTo = `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/`;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) setMessage(error.message || "Failed to send magic link");
      else setMessage("Magic link sent — check your email.");
    } catch (err: any) {
      setMessage(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-8 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center"
      >
        <div className="w-20 h-20 rounded-2xl bg-gold-sheen shadow-glow flex items-center justify-center mb-6">
          <span className="font-display text-3xl text-navy-deep">DC</span>
        </div>
        <h1 className="font-display text-3xl text-ink mb-2">Daily Communion</h1>
        <p className="text-ink-soft text-sm max-w-xs mb-6">
          A quiet place to meet with God every day — reading, memory, prayer,
          and a streak that keeps you coming back.
        </p>

        <form onSubmit={signInWithEmailPassword} className="w-full max-w-xs">
          <label className="sr-only" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full mb-3 px-3 py-2 rounded-md bg-white/5 text-ink"
          />

          <label className="sr-only" htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (or leave blank for magic link)"
            className="w-full mb-3 px-3 py-2 rounded-md bg-white/5 text-ink"
          />

          <Button type="submit" fullWidth disabled={loading} className="mb-3">
            {loading ? "Signing in..." : "Sign in with email"}
          </Button>

          <Button type="button" fullWidth variant="secondary" onClick={sendMagicLink} disabled={loading}>
            {loading ? "Sending..." : "Send magic link"}
          </Button>
        </form>

        {message && <p className="text-sm text-ink-muted mt-4">{message}</p>}

        <p className="text-[11px] text-ink-muted mt-8 max-w-xs">
          By continuing you agree this is a personal devotional space — your prayers and notes are private to you.
        </p>
      </motion.div>
    </div>
  );
}
