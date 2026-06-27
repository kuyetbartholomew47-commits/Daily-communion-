import type { BibleVerse } from "./types";

const API_BASE = "https://bible-api.com";

/**
 * bible-api.com serves public-domain translations (default: KJV) for free,
 * with no API key required. We fetch verse text at request time rather than
 * bundling Bible text in the app, which keeps the app legally clean and
 * lets you swap translations easily (?translation=web, kjv, bbe, etc).
 */
export async function fetchVerse(
  reference: string,
  translation: string = "kjv"
): Promise<BibleVerse | null> {
  try {
    const res = await fetch(
      `${API_BASE}/${encodeURIComponent(reference)}?translation=${translation}`,
      { next: { revalidate: 60 * 60 * 12 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return {
      reference: data.reference,
      text: data.text.trim().replace(/\n/g, " "),
      translation: data.translation_name ?? translation.toUpperCase(),
    };
  } catch {
    return null;
  }
}

export async function fetchPassage(
  references: string[],
  translation: string = "kjv"
): Promise<BibleVerse[]> {
  const results = await Promise.all(
    references.map((r) => fetchVerse(r, translation))
  );
  return results.filter((r): r is BibleVerse => r !== null);
}

/**
 * Rotating pool of well-known verse references used for the "Daily Verse"
 * and "Daily Memory Verse" features. The day-of-year picks an index, so
 * everyone sees the same verse on the same calendar day. Expand this list
 * any time — it's just references, no copyrighted text stored.
 */
export const DAILY_VERSE_POOL: string[] = [
  "John 3:16", "Psalm 23:1", "Philippians 4:13", "Joshua 1:9", "Romans 8:28",
  "Proverbs 3:5-6", "Isaiah 41:10", "Jeremiah 29:11", "Psalm 46:1", "Matthew 11:28",
  "2 Corinthians 5:17", "Galatians 2:20", "Psalm 119:105", "1 Peter 5:7", "Romans 12:2",
  "Philippians 4:6-7", "Isaiah 40:31", "Psalm 34:18", "Matthew 6:33", "John 14:27",
  "2 Timothy 1:7", "Psalm 27:1", "Hebrews 11:1", "Romans 15:13", "Psalm 91:1-2",
  "1 Corinthians 13:4-7", "Matthew 5:14-16", "Psalm 37:4", "Ephesians 2:8-9", "John 1:1",
  "Psalm 121:1-2", "Colossians 3:23", "Isaiah 26:3", "James 1:2-3", "Psalm 51:10",
  "Romans 5:8", "Psalm 139:14", "Matthew 28:19-20", "1 John 4:19", "Psalm 16:11",
  "Proverbs 16:3", "Galatians 5:22-23", "Psalm 100:1-2", "Hebrews 12:1-2", "Lamentations 3:22-23",
  "Psalm 23:4", "John 8:32", "Romans 10:9", "Psalm 73:26", "2 Corinthians 12:9",
  "Deuteronomy 31:6", "Psalm 19:1", "Matthew 7:7", "1 Thessalonians 5:16-18", "Psalm 103:2-3",
  "John 15:13", "Proverbs 18:10", "Romans 8:38-39", "Psalm 30:5", "Revelation 21:4",
];

export function dayOfYear(date: Date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86_400_000);
}

export function getDailyVerseReference(date: Date = new Date()): string {
  const idx = dayOfYear(date) % DAILY_VERSE_POOL.length;
  return DAILY_VERSE_POOL[idx];
}

export function getDailyMemoryReference(date: Date = new Date()): string {
  // Offset by half the pool so the memory verse differs from the daily verse.
  const offset = Math.floor(DAILY_VERSE_POOL.length / 2);
  const idx = (dayOfYear(date) + offset) % DAILY_VERSE_POOL.length;
  return DAILY_VERSE_POOL[idx];
}
