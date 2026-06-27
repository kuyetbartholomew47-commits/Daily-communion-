"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle2, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/ui/Button";
import { addPrayer, markPrayerAnswered } from "@/lib/actions";
import type { Prayer } from "@/lib/types";

const CATEGORIES = ["general", "family", "health", "guidance", "gratitude"];

export default function PrayerClient({ prayers }: { prayers: Prayer[] }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("general");
  const [filter, setFilter] = useState<"all" | "active" | "answered">("all");

  async function handleSubmit() {
    if (!title.trim()) return;
    await addPrayer(title.trim(), body.trim(), category);
    setTitle("");
    setBody("");
    setShowForm(false);
  }

  const visible = prayers.filter((p) =>
    filter === "all" ? true : filter === "answered" ? p.is_answered : !p.is_answered
  );

  return (
    <div className="pb-4">
      <PageHeader title="Prayer Journal" subtitle="A private space between you and God" />

      <div className="px-5 space-y-4">
        <Button fullWidth onClick={() => setShowForm(true)}>
          <Plus size={16} /> New prayer
        </Button>

        <div className="flex gap-2">
          {(["all", "active", "answered"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`tap-press focus-ring rounded-full px-3 py-1.5 text-xs ${
                filter === f ? "bg-gold-sheen text-navy-deep font-semibold" : "glass text-ink-soft"
              }`}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {visible.length === 0 && (
            <p className="text-center text-ink-muted text-sm py-10">
              No prayers here yet. Write the first one above.
            </p>
          )}
          {visible.map((p) => (
            <GlassCard key={p.id} className={p.is_answered ? "border border-gold/30" : ""}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-ink">{p.title}</p>
                  {p.body && <p className="text-xs text-ink-soft mt-1">{p.body}</p>}
                  <p className="text-[10px] text-ink-muted mt-2 uppercase tracking-wide">{p.category}</p>
                </div>
                {!p.is_answered ? (
                  <button
                    onClick={() => markPrayerAnswered(p.id, "")}
                    className="tap-press focus-ring shrink-0"
                    aria-label="Mark answered"
                  >
                    <CheckCircle2 size={20} className="text-ink-muted hover:text-gold" />
                  </button>
                ) : (
                  <span className="text-[10px] text-gold font-semibold shrink-0">Answered</span>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ y: 200 }}
              animate={{ y: 0 }}
              exit={{ y: 200 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md glass-strong rounded-t-xl3 p-5 pb-8"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg text-ink">New Prayer</h3>
                <button onClick={() => setShowForm(false)} className="tap-press focus-ring">
                  <X size={18} className="text-ink-muted" />
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What are you praying for?"
                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-ink focus-ring outline-none mb-3"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
                placeholder="Add details (optional)…"
                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-ink focus-ring outline-none resize-none mb-3"
              />
              <div className="flex gap-2 flex-wrap mb-4">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`tap-press focus-ring rounded-full px-3 py-1 text-xs ${
                      category === c ? "bg-gold-sheen text-navy-deep" : "bg-white/5 text-ink-soft"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <Button fullWidth onClick={handleSubmit}>
                Save prayer
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
