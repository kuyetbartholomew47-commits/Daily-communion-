"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, History } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import ProgressBar from "@/components/ProgressBar";
import Button from "@/components/ui/Button";
import { completeReadingDay } from "@/lib/actions";
import type { BibleVerse, ReadingDay } from "@/lib/types";

export default function ReadingClient({
  today,
  preview,
  progressPercent,
  completedDays,
  totalDays,
}: {
  today: ReadingDay;
  preview: BibleVerse | null;
  progressPercent: number;
  completedDays: number[];
  totalDays: number;
}) {
  const [done, setDone] = useState(completedDays.includes(today.day));
  const [showHistory, setShowHistory] = useState(false);

  async function handleComplete() {
    setDone(true);
    await completeReadingDay(today.day);
  }

  return (
    <div className="pb-4">
      <PageHeader title="Scripture Reading" subtitle="Genesis to Revelation, one day at a time" />

      <div className="px-5 space-y-5">
        <GlassCard>
          <ProgressBar percent={progressPercent} label={`${completedDays.length} of ${totalDays} days`} />
        </GlassCard>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <GlassCard strong>
            <p className="text-[11px] uppercase tracking-widest text-gold/80">Day {today.day}</p>
            <h2 className="font-display text-xl text-ink mt-1">{today.reference}</h2>

            {preview && (
              <div className="mt-4 rounded-xl bg-black/20 p-4">
                <p className="text-sm text-ink-soft italic leading-relaxed">&ldquo;{preview.text}&rdquo;</p>
                <p className="text-xs text-gold mt-2">{preview.reference} (preview verse)</p>
              </div>
            )}

            <Button
              fullWidth
              className="mt-5"
              variant={done ? "ghost" : "gold"}
              onClick={handleComplete}
              disabled={done}
            >
              <CheckCircle2 size={16} />
              {done ? "Completed for today" : "Mark today's reading complete"}
            </Button>
          </GlassCard>
        </motion.div>

        <button
          onClick={() => setShowHistory((s) => !s)}
          className="flex items-center gap-2 text-sm text-ink-soft tap-press focus-ring"
        >
          <History size={16} />
          {showHistory ? "Hide history" : "View reading history"}
        </button>

        {showHistory && (
          <GlassCard>
            <div className="grid grid-cols-7 gap-1.5">
              {Array.from({ length: 35 }, (_, i) => {
                const day = today.day - 34 + i;
                const isCompleted = completedDays.includes(day);
                const isToday = day === today.day;
                return (
                  <div
                    key={i}
                    className={`aspect-square rounded-md flex items-center justify-center text-[10px] ${
                      day < 1
                        ? "opacity-0"
                        : isCompleted
                        ? "bg-gold-sheen text-navy-deep font-semibold"
                        : isToday
                        ? "border border-gold/60 text-gold"
                        : "bg-white/5 text-ink-muted"
                    }`}
                  >
                    {day > 0 ? day : ""}
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}
      </div>
    </div>
  );
}
