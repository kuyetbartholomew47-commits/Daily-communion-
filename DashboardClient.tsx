"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Share2, Copy, Heart, Volume2, BookOpen, HeartHandshake, Brain } from "lucide-react";
import GlassCard from "@/components/GlassCard";
import StreakRing from "@/components/StreakRing";
import ProgressBar from "@/components/ProgressBar";
import type { BibleVerse, Favorite, ReadingDay } from "@/lib/types";
import { useState } from "react";

function greeting() {
  const h = new Date().getHours();
  if (h < 5) return "Good night";
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default function DashboardClient({
  firstName,
  verse,
  streak,
  longestStreak,
  readingDay,
  progressPercent,
  weeklyGoal,
  favorites,
}: {
  firstName: string;
  verse: BibleVerse | null;
  streak: number;
  longestStreak: number;
  readingDay: ReadingDay;
  progressPercent: number;
  weeklyGoal: number;
  favorites: Favorite[];
}) {
  const [copied, setCopied] = useState(false);

  async function copyVerse() {
    if (!verse) return;
    await navigator.clipboard.writeText(`"${verse.text}" — ${verse.reference}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function shareVerse() {
    if (!verse) return;
    const text = `"${verse.text}" — ${verse.reference}`;
    if (navigator.share) {
      await navigator.share({ title: "Daily Communion", text });
    } else {
      copyVerse();
    }
  }

  function speakVerse() {
    if (!verse) return;
    const utter = new SpeechSynthesisUtterance(`${verse.text} — ${verse.reference}`);
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  }

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: 0.05 * i, duration: 0.45, ease: "easeOut" as const },
  });

  return (
    <div className="px-5 pt-8 space-y-5">
      <motion.div {...stagger(0)}>
        <p className="text-ink-muted text-sm">{greeting()}, {firstName}</p>
        <h1 className="font-display text-2xl text-ink mt-0.5">Welcome back to your communion</h1>
      </motion.div>

      {/* Daily verse hero */}
      <motion.div {...stagger(1)}>
        <GlassCard strong className="relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gold/10 blur-3xl" />
          <p className="text-[11px] uppercase tracking-widest text-gold/80 mb-3">Today&apos;s Verse</p>
          {verse ? (
            <>
              <p className="font-display text-lg leading-relaxed text-ink italic">
                &ldquo;{verse.text}&rdquo;
              </p>
              <p className="text-sm text-gold mt-3 font-semibold">{verse.reference} · {verse.translation}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={speakVerse} aria-label="Listen" className="tap-press focus-ring glass rounded-full p-2.5">
                  <Volume2 size={16} className="text-ink-soft" />
                </button>
                <button onClick={copyVerse} aria-label="Copy" className="tap-press focus-ring glass rounded-full p-2.5">
                  <Copy size={16} className="text-ink-soft" />
                </button>
                <button onClick={shareVerse} aria-label="Share" className="tap-press focus-ring glass rounded-full p-2.5">
                  <Share2 size={16} className="text-ink-soft" />
                </button>
                <button aria-label="Save to favorites" className="tap-press focus-ring glass rounded-full p-2.5 ml-auto">
                  <Heart size={16} className="text-gold" />
                </button>
              </div>
              {copied && <p className="text-[11px] text-gold mt-2">Copied to clipboard</p>}
            </>
          ) : (
            <p className="text-ink-muted text-sm">Verse unavailable offline — check your connection.</p>
          )}
        </GlassCard>
      </motion.div>

      {/* Streak + weekly goal */}
      <motion.div {...stagger(2)} className="grid grid-cols-2 gap-4">
        <GlassCard className="flex flex-col items-center justify-center">
          <StreakRing streak={streak} goal={Math.max(7, longestStreak)} />
          <Link href="/streak" className="text-xs text-gold mt-2 tap-press focus-ring">
            View streak →
          </Link>
        </GlassCard>
        <GlassCard className="flex flex-col justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ink-muted">Weekly Goal</p>
            <p className="font-display text-2xl text-ink mt-1">{Math.min(streak, weeklyGoal)}/{weeklyGoal}</p>
            <p className="text-xs text-ink-muted">days this week</p>
          </div>
          <ProgressBar percent={(Math.min(streak, weeklyGoal) / weeklyGoal) * 100} />
        </GlassCard>
      </motion.div>

      {/* Today's reading */}
      <motion.div {...stagger(3)}>
        <Link href="/reading" className="block tap-press focus-ring">
          <GlassCard className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-royal/20 flex items-center justify-center shrink-0">
              <BookOpen size={20} className="text-royal-light" />
            </div>
            <div className="flex-1">
              <p className="text-[11px] uppercase tracking-widest text-ink-muted">Today&apos;s Reading · Day {readingDay.day}</p>
              <p className="text-ink font-medium">{readingDay.reference}</p>
              <div className="mt-2">
                <ProgressBar percent={progressPercent} />
              </div>
            </div>
          </GlassCard>
        </Link>
      </motion.div>

      {/* Memory verse + prayer */}
      <motion.div {...stagger(4)} className="grid grid-cols-2 gap-4">
        <Link href="/memory" className="tap-press focus-ring">
          <GlassCard className="h-full">
            <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center mb-3">
              <Brain size={17} className="text-gold" />
            </div>
            <p className="text-sm font-medium text-ink">Memory Verse</p>
            <p className="text-[11px] text-ink-muted mt-1">Hide &amp; show challenge</p>
          </GlassCard>
        </Link>
        <Link href="/prayer" className="tap-press focus-ring">
          <GlassCard className="h-full">
            <div className="w-9 h-9 rounded-lg bg-royal/15 flex items-center justify-center mb-3">
              <HeartHandshake size={17} className="text-royal-light" />
            </div>
            <p className="text-sm font-medium text-ink">Prayer Journal</p>
            <p className="text-[11px] text-ink-muted mt-1">Write today&apos;s prayer</p>
          </GlassCard>
        </Link>
      </motion.div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <motion.div {...stagger(5)}>
          <p className="text-[11px] uppercase tracking-widest text-ink-muted mb-2 px-1">Recently Saved</p>
          <div className="space-y-2">
            {favorites.map((f) => (
              <GlassCard key={f.id} className="!p-3.5">
                <p className="text-sm text-ink-soft italic line-clamp-2">&ldquo;{f.verse_text}&rdquo;</p>
                <p className="text-xs text-gold mt-1">{f.reference}</p>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
