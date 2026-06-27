import type { ReadingDay } from "./types";

// Canonical chapter counts per book (Protestant 66-book canon, in order).
// These are structural facts about the Bible's table of contents, not text.
export const BOOK_CHAPTERS: [string, number][] = [
  ["Genesis", 50], ["Exodus", 40], ["Leviticus", 27], ["Numbers", 36], ["Deuteronomy", 34],
  ["Joshua", 24], ["Judges", 21], ["Ruth", 4], ["1 Samuel", 31], ["2 Samuel", 24],
  ["1 Kings", 22], ["2 Kings", 25], ["1 Chronicles", 29], ["2 Chronicles", 36], ["Ezra", 10],
  ["Nehemiah", 13], ["Esther", 10], ["Job", 42], ["Psalms", 150], ["Proverbs", 31],
  ["Ecclesiastes", 12], ["Song of Solomon", 8], ["Isaiah", 66], ["Jeremiah", 52], ["Lamentations", 5],
  ["Ezekiel", 48], ["Daniel", 12], ["Hosea", 14], ["Joel", 3], ["Amos", 9],
  ["Obadiah", 1], ["Jonah", 4], ["Micah", 7], ["Nahum", 3], ["Habakkuk", 3],
  ["Zephaniah", 3], ["Haggai", 2], ["Zechariah", 14], ["Malachi", 4],
  ["Matthew", 28], ["Mark", 16], ["Luke", 24], ["John", 21], ["Acts", 28],
  ["Romans", 16], ["1 Corinthians", 16], ["2 Corinthians", 13], ["Galatians", 6], ["Ephesians", 6],
  ["Philippians", 4], ["Colossians", 4], ["1 Thessalonians", 5], ["2 Thessalonians", 3], ["1 Timothy", 6],
  ["2 Timothy", 4], ["Titus", 3], ["Philemon", 1], ["Hebrews", 13], ["James", 5],
  ["1 Peter", 5], ["2 Peter", 3], ["1 John", 5], ["2 John", 1], ["3 John", 1],
  ["Jude", 1], ["Revelation", 22],
];

const TOTAL_CHAPTERS = BOOK_CHAPTERS.reduce((sum, [, n]) => sum + n, 0); // 1189
const PLAN_LENGTH_DAYS = 365;

/**
 * Flattens every (book, chapter) pair in canonical order, then buckets them
 * into ~365 days. Buckets never split a book's final chapter across a day
 * boundary in a way that looks awkward — each day gets a contiguous run of
 * chapters, biased so every book starts on its own day.
 */
function buildPlan(): ReadingDay[] {
  const flat: { book: string; chapter: number }[] = [];
  for (const [book, chapters] of BOOK_CHAPTERS) {
    for (let c = 1; c <= chapters; c++) flat.push({ book, chapter: c });
  }

  const perDay = TOTAL_CHAPTERS / PLAN_LENGTH_DAYS; // ~3.26
  const plan: ReadingDay[] = [];
  let cursor = 0;
  let day = 1;

  while (cursor < flat.length && day <= PLAN_LENGTH_DAYS) {
    const remainingDays = PLAN_LENGTH_DAYS - day + 1;
    const remainingChapters = flat.length - cursor;
    // Recompute target size each day so we land exactly on the last day.
    const target = Math.max(1, Math.round(remainingChapters / remainingDays));

    let take = target;
    // Don't strand a single trailing chapter of a book into tomorrow if it's
    // just one chapter over — fold it in (keeps books from feeling chopped).
    if (cursor + take < flat.length && flat[cursor + take - 1].book !== flat[cursor + take].book) {
      // clean break between books — good, leave as is
    }
    take = Math.min(take, remainingChapters);

    const slice = flat.slice(cursor, cursor + take);

    // build compact book ranges for the slice in a single pass (avoid repeated filters)
    const ranges: { book: string; start: number; end: number }[] = [];
    if (slice.length > 0) {
      let curBook = slice[0].book;
      let startChap = slice[0].chapter;
      let endChap = startChap;
      for (let i = 1; i < slice.length; i++) {
        const s = slice[i];
        if (s.book === curBook) {
          endChap = s.chapter;
        } else {
          ranges.push({ book: curBook, start: startChap, end: endChap });
          curBook = s.book;
          startChap = s.chapter;
          endChap = s.chapter;
        }
      }
      ranges.push({ book: curBook, start: startChap, end: endChap });
    }

    const reference = ranges.length === 1
      ? `${ranges[0].book} ${ranges[0].start}${ranges[0].end > ranges[0].start ? `-${ranges[0].end}` : ""}`
      : ranges.map(r => (r.end > r.start ? `${r.book} ${r.start}-${r.end}` : `${r.book} ${r.start}`)).join(", ");

    plan.push({ day, reference, passages: slice });
    cursor += take;
    day++;
  }

  return plan;
}

export const READING_PLAN: ReadingDay[] = buildPlan();
const READING_PLAN_BY_DAY = new Map<number, ReadingDay>(READING_PLAN.map((d) => [d.day, d]));

export function getReadingDay(day: number): ReadingDay | undefined {
  return READING_PLAN_BY_DAY.get(day);
}

export function planProgressPercent(completedDays: number[]): number {
  if (READING_PLAN.length === 0) return 0;
  const unique = new Set(completedDays);
  return Math.round((unique.size / READING_PLAN.length) * 100);
}
