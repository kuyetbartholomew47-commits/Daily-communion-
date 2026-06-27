"use client";

import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const supabase = createClient();

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? window.location.origin}/auth/callback`,
      },
    });
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
        <p className="text-ink-soft text-sm max-w-xs mb-10">
          A quiet place to meet with God every day — reading, memory, prayer,
          and a streak that keeps you coming back.
        </p>

        <Button fullWidth onClick={signInWithGoogle} className="max-w-xs">
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path
              fill="#1a1a1a"
              d="M44.5 20H24v8.5h11.8C34.6 33.9 30 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.3 0 6.3 1.2 8.6 3.2l6-6C38.1 4.1 31.4 1 24 1 11.3 1 1 11.3 1 24s10.3 23 23 23c11.9 0 22-8.6 22-23 0-1.4-.2-2.7-.5-4z"
            />
          </svg>
          Continue with Google
        </Button>

        <p className="text-[11px] text-ink-muted mt-8 max-w-xs">
          By continuing you agree this is a personal devotional space —
          your prayers and notes are private to you.
        </p>
      </motion.div>
    </div>
  );
}
