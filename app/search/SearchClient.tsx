"use client";

import { useEffect, useMemo, useState } from "react";
import { Search as SearchIcon, BookOpen, Tag, NotebookPen } from "lucide-react";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";
import { searchTopics, searchBooks, looksLikeReference } from "@/lib/topics";
import type { BibleVerse, Note } from "@/lib/types";

export default function SearchClient({ notes }: { notes: Note[] }) {
  const [query, setQuery] = useState("");
  const [refResult, setRefResult] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(false);

  const topicMatches = useMemo(() => searchTopics(query), [query]);
  const bookMatches = useMemo(() => searchBooks(query), [query]);
  const noteMatches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return notes.filter(
      (n) =>
        n.reference.toLowerCase().includes(q) ||
        n.note_body?.toLowerCase().includes(q) ||
        n.verse_text?.toLowerCase().includes(q)
    );
  }, [notes, query]);

  useEffect(() => {
    if (!looksLikeReference(query)) {
      setRefResult(null);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    fetch(`/api/verse?ref=${encodeURIComponent(query)}`, { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => setRefResult(data))
      .catch(() => {})
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [query]);

  const hasResults = !!refResult || topicMatches.length > 0 || bookMatches.length > 0 || noteMatches.length > 0;

  return (
    <div className="pb-4">
      <PageHeader title="Smart Search" subtitle="Verses, topics, books, and your notes" />

      <div className="px-5 space-y-5">
        <div className="relative">
          <SearchIcon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Try “John 3:16”, “fear”, or “Romans”…"
            className="w-full rounded-xl glass border-none p-3 pl-10 text-sm text-ink focus-ring outline-none"
            autoFocus
          />
        </div>

        {!query && (
          <p className="text-center text-ink-muted text-sm py-8">
            Search a verse reference, a topic like &ldquo;peace&rdquo;, a book name, or your own notes.
          </p>
        )}

        {loading && <p className="text-xs text-ink-muted">Looking that up…</p>}

        {refResult && (
          <GlassCard strong>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={14} className="text-gold" />
              <p className="text-[11px] uppercase tracking-widest text-gold/80">Verse</p>
            </div>
            <p className="font-display text-base italic text-ink leading-relaxed">&ldquo;{refResult.text}&rdquo;</p>
            <p className="text-xs text-gold mt-2 font-semibold">{refResult.reference}</p>
          </GlassCard>
        )}

        {topicMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <Tag size={14} className="text-ink-muted" />
              <p className="text-[11px] uppercase tracking-widest text-ink-muted">Topics</p>
            </div>
            <div className="space-y-2">
              {topicMatches.map(({ topic, refs }) => (
                <GlassCard key={topic}>
                  <p className="text-sm font-medium text-ink capitalize">{topic}</p>
                  <p className="text-xs text-ink-soft mt-1">{refs.join(" · ")}</p>
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {bookMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <BookOpen size={14} className="text-ink-muted" />
              <p className="text-[11px] uppercase tracking-widest text-ink-muted">Books</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {bookMatches.map((b) => (
                <span key={b} className="glass rounded-full px-3 py-1.5 text-xs text-ink-soft">
                  {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {noteMatches.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-2 px-1">
              <NotebookPen size={14} className="text-ink-muted" />
              <p className="text-[11px] uppercase tracking-widest text-ink-muted">Your Notes</p>
            </div>
            <div className="space-y-2">
              {noteMatches.map((n) => (
                <GlassCard key={n.id}>
                  <p className="text-xs text-gold font-semibold">{n.reference}</p>
                  {n.note_body && <p className="text-sm text-ink mt-1">{n.note_body}</p>}
                </GlassCard>
              ))}
            </div>
          </div>
        )}

        {query && !loading && !hasResults && (
          <p className="text-center text-ink-muted text-sm py-8">No results for &ldquo;{query}&rdquo;.</p>
        )}
      </div>
    </div>
  );
}
