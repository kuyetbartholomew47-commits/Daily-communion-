"use client";

import { motion } from "framer-motion";
import { Flame, Sunrise, Crown, Trophy, Lock } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import StreakRing from "@/components/StreakRing";
import type { Badge } from "@/lib/achievements";

const ICONS = { flame: Flame, sunrise: Sunrise, crown: Crown, trophy: Trophy };

export default function StreakClient({
  current,
  longest,
  totalDays,
  badges,
  next,
  activeDates,
}: {
  current: number;
  longest: number;
  totalDays: number;
  badges: (Badge & { earned: boolean })[];
  next: Badge | null;
  activeDates: string[];
}) {
  const activeSet = new Set(activeDates);
  const today = new Date();
  const days = Array.from({ length: 42 }, (_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (41 - i));
    return d;
  });

  return (
    <div className="pb-4">
      <PageHeader title="Your Streak" subtitle="Consistency over intensity" />

      <div className="px-5 space-y-5">
        <GlassCard strong className="flex flex-col items-center py-8">
          <StreakRing streak={current} goal={Math.max(7, longest)} />
          <div className="flex gap-6 mt-5 text-center">
            <div>
              <p className="font-display text-xl text-ink">{longest}</p>
              <p className="text-[11px] text-ink-muted">longest streak</p>
            </div>
            <div>
              <p className="font-display text-xl text-ink">{totalDays}</p>
              <p className="text-[11px] text-ink-muted">total active days</p>
            </div>
          </div>
        </GlassCard>

        {next && (
          <GlassCard className="text-center">
            <p className="text-xs text-ink-muted">
              <span className="text-gold font-semibold">{next.threshold - current} days</span> to unlock
              &ldquo;{next.label}&rdquo;
            </p>
          </GlassCard>
        )}

        <div>
          <p className="text-[11px] uppercase tracking-widest text-ink-muted mb-2 px-1">Calendar</p>
          <GlassCard>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d, i) => {
                const key = d.toISOString().slice(0, 10);
                const active = activeSet.has(key);
                return (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.006 }}
                    className={`aspect-square rounded-md ${
                      active ? "bg-gold-sheen" : "bg-white/5"
                    }`}
                    title={key}
                  />
                );
              })}
            </div>
          </GlassCard>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-widest text-ink-muted mb-2 px-1">Milestones</p>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => {
              const Icon = ICONS[badge.icon];
              return (
                <GlassCard
                  key={badge.key}
                  className={`flex flex-col items-center text-center ${!badge.earned && "opacity-50"}`}
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${
                      badge.earned ? "bg-gold-sheen shadow-glow" : "bg-white/10"
                    }`}
                  >
                    {badge.earned ? (
                      <Icon size={20} className="text-navy-deep" />
                    ) : (
                      <Lock size={16} className="text-ink-muted" />
                    )}
                  </div>
                  <p className="text-xs font-medium text-ink">{badge.label}</p>
                  <p className="text-[10px] text-ink-muted">{badge.description}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
