"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import Button from "@/components/ui/Button";
import { addNote } from "@/lib/actions";
import type { Note } from "@/lib/types";

const COLORS = ["gold", "royal", "rose", "green"] as const;
const COLOR_MAP: Record<string, string> = {
  gold: "border-gold/50",
  royal: "border-royal/50",
  rose: "border-rose-400/50",
  green: "border-emerald-400/50",
};

export default function NotesClient({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [reference, setReference] = useState("");
  const [verseText, setVerseText] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [category, setCategory] = useState("general");
  const [color, setColor] = useState<typeof COLORS[number]>("gold");

  const filtered = useMemo(() => {
    if (!query.trim()) return notes;
    const q = query.toLowerCase();
    return notes.filter(
      (n) =>
        n.reference.toLowerCase().includes(q) ||
        n.note_body?.toLowerCase().includes(q) ||
        n.verse_text?.toLowerCase().includes(q)
    );
  }, [notes, query]);

  async function handleSubmit() {
    if (!reference.trim()) return;
    await addNote(reference.trim(), verseText.trim(), noteBody.trim(), category, color);
    setReference("");
    setVerseText("");
    setNoteBody("");
    setShowForm(false);
  }

  return (
    <div className="pb-4">
      <PageHeader title="Notes & Highlights" subtitle="Your study, organized" />

      <div className="px-5 space-y-4">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your notes…"
            className="w-full rounded-xl glass border-none p-3 pl-10 text-sm text-ink focus-ring outline-none"
          />
        </div>

        <Button fullWidth onClick={() => setShowForm(true)}>
          <Plus size={16} /> New note
        </Button>

        <div className="space-y-3">
          {filtered.length === 0 && (
            <p className="text-center text-ink-muted text-sm py-10">
              No notes yet. Highlight a verse and reflect on it.
            </p>
          )}
          {filtered.map((n) => (
            <GlassCard key={n.id} className={`border-l-2 ${COLOR_MAP[n.color] ?? "border-gold/50"}`}>
              <p className="text-xs text-gold font-semibold">{n.reference}</p>
              {n.verse_text && (
                <p className="text-sm text-ink-soft italic mt-1.5">&ldquo;{n.verse_text}&rdquo;</p>
              )}
              {n.note_body && <p className="text-sm text-ink mt-2">{n.note_body}</p>}
              <p className="text-[10px] text-ink-muted mt-2 uppercase tracking-wide">{n.category}</p>
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
                <h3 className="font-display text-lg text-ink">New Note</h3>
                <button onClick={() => setShowForm(false)} className="tap-press focus-ring">
                  <X size={18} className="text-ink-muted" />
                </button>
              </div>
              <input
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="Reference (e.g. John 3:16)"
                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-ink focus-ring outline-none mb-3"
              />
              <input
                value={verseText}
                onChange={(e) => setVerseText(e.target.value)}
                placeholder="Verse text (optional)"
                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-ink focus-ring outline-none mb-3"
              />
              <textarea
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
                rows={3}
                placeholder="Your note…"
                className="w-full rounded-xl bg-black/20 border border-white/10 p-3 text-sm text-ink focus-ring outline-none resize-none mb-3"
              />
              <div className="flex gap-2 mb-4">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={c}
                    className={`tap-press focus-ring w-7 h-7 rounded-full border-2 ${
                      color === c ? "border-ink" : "border-transparent"
                    } ${
                      c === "gold" ? "bg-gold" : c === "royal" ? "bg-royal" : c === "rose" ? "bg-rose-400" : "bg-emerald-400"
                    }`}
                  />
                ))}
              </div>
              <Button fullWidth onClick={handleSubmit}>
                Save note
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
