"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shuffle, PenLine, RotateCcw } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/ui/Button";
import { updateMemoryMastery } from "@/lib/actions";
import type { BibleVerse } from "@/lib/types";

type Mode = "hide" | "quiz";

export default function MemoryClient({ verse }: { verse: BibleVerse | null }) {
  const [mode, setMode] = useState<Mode>("hide");
  const words = useMemo(() => verse?.text.split(" ") ?? [], [verse]);
  const [hidden, setHidden] = useState<boolean[]>(() => words.map(() => false));
  const [quizInput, setQuizInput] = useState("");
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  function hideByPercent(pct: number) {
    setHidden(words.map(() => Math.random() < pct));
  }

  function toggleWord(i: number) {
    setHidden((prev) => prev.map((h, idx) => (idx === i ? !h : h)));
  }

  function normalize(s: string) {
    return s.toLowerCase().replace(/[^\w\s]/g, "").trim().split(/\s+/);
  }

  function checkQuiz() {
    if (!verse) return;
    const target = normalize(verse.text);
    const given = normalize(quizInput);
    let correct = 0;
    target.forEach((w, i) => {
      if (given[i] === w) correct++;
    });
    const score = Math.round((correct / target.length) * 100);
    setQuizScore(score);
  }

  async function markMastered(level: number) {
    if (!verse) return;
    setSaved(true);
    await updateMemoryMastery(verse.reference, level);
  }

  if (!verse) {
    return (
      <div className="px-5 pt-10 text-center text-ink-muted text-sm">
        Memory verse unavailable offline.
      </div>
    );
  }

  return (
    <div className="pb-4">
      <PageHeader title="Memory Verse" subtitle={verse.reference} />

      <div className="px-5 space-y-5">
        <div className="flex gap-2">
          <Button
            variant={mode === "hide" ? "gold" : "ghost"}
            onClick={() => setMode("hide")}
            className="flex-1"
          >
            <EyeOff size={15} /> Hide &amp; Show
          </Button>
          <Button
            variant={mode === "quiz" ? "gold" : "ghost"}
            onClick={() => setMode("quiz")}
            className="flex-1"
          >
            <PenLine size={15} /> Quiz Mode
          </Button>
        </div>

        {mode === "hide" && (
          <>
            <GlassCard strong>
              <p className="font-display text-lg leading-relaxed flex flex-wrap gap-x-1.5 gap-y-1">
                {words.map((w, i) => (
                  <motion.span
                    key={i}
                    onClick={() => toggleWord(i)}
                    className={`cursor-pointer tap-press rounded px-0.5 ${
                      hidden[i] ? "bg-gold/15 text-transparent select-none" : "text-ink"
                    }`}
                  >
                    {hidden[i] ? "•".repeat(Math.min(w.length, 6)) : w}
                  </motion.span>
                ))}
              </p>
              <p className="text-xs text-gold mt-3 font-semibold">{verse.reference}</p>
            </GlassCard>

            <div className="flex gap-2 flex-wrap">
              {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                <button
                  key={p}
                  onClick={() => hideByPercent(p)}
                  className="tap-press focus-ring glass rounded-full px-3 py-1.5 text-xs text-ink-soft"
                >
                  {p === 0 ? "Reveal all" : `Hide ${Math.round(p * 100)}%`}
                </button>
              ))}
              <button
                onClick={() => hideByPercent(0.5)}
                className="tap-press focus-ring glass rounded-full px-3 py-1.5 text-xs text-gold flex items-center gap-1"
              >
                <Shuffle size={12} /> Shuffle
              </button>
            </div>
          </>
        )}

        {mode === "quiz" && (
          <>
            <GlassCard>
              <p className="text-xs text-ink-muted mb-2">Type the verse from memory:</p>
              <textarea
                value={quizInput}
                onChange={(e) => setQuizInput(e.target.value)}
                rows={4}
                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-ink focus-ring outline-none resize-none"
                placeholder="Begin typing…"
              />
              <Button fullWidth className="mt-3" onClick={checkQuiz}>
                Check my answer
              </Button>
              {quizScore !== null && (
                <div className="mt-4 text-center">
                  <p className="font-display text-3xl text-gold">{quizScore}%</p>
                  <p className="text-xs text-ink-muted mt-1">word-match accuracy</p>
                </div>
              )}
            </GlassCard>
            <button
              onClick={() => { setQuizInput(""); setQuizScore(null); }}
              className="flex items-center gap-2 text-sm text-ink-soft tap-press focus-ring"
            >
              <RotateCcw size={14} /> Try again
            </button>
          </>
        )}

        <GlassCard>
          <p className="text-xs text-ink-muted mb-3">How well do you know this verse?</p>
          <div className="flex gap-2">
            {[
              { label: "New", level: 0 },
              { label: "Learning", level: 1 },
              { label: "Familiar", level: 2 },
              { label: "Mastered", level: 3 },
            ].map((opt) => (
              <button
                key={opt.level}
                onClick={() => markMastered(opt.level)}
                className="tap-press focus-ring flex-1 rounded-lg bg-white/5 hover:bg-white/10 py-2 text-[11px] text-ink-soft"
              >
                {opt.label}
              </button>
            ))}
          </div>
          {saved && <p className="text-[11px] text-gold mt-2">Saved to your weekly review.</p>}
        </GlassCard>
      </div>
    </div>
  );
}
