export const TOPIC_INDEX: Record<string, string[]> = {
  love: ["John 3:16", "1 Corinthians 13:4-7", "1 John 4:19", "Romans 5:8"],
  fear: ["Joshua 1:9", "Isaiah 41:10", "2 Timothy 1:7", "Psalm 27:1"],
  hope: ["Jeremiah 29:11", "Romans 15:13", "Psalm 130:5"],
  peace: ["John 14:27", "Philippians 4:6-7", "Isaiah 26:3"],
  strength: ["Philippians 4:13", "Isaiah 40:31", "Psalm 73:26"],
  anxiety: ["Philippians 4:6-7", "1 Peter 5:7", "Matthew 6:34"],
  forgiveness: ["1 John 1:9", "Ephesians 4:32", "Colossians 3:13"],
  gratitude: ["1 Thessalonians 5:16-18", "Psalm 100:1-2", "Colossians 3:15"],
  trust: ["Proverbs 3:5-6", "Psalm 56:3", "Isaiah 26:4"],
  guidance: ["Psalm 119:105", "Proverbs 16:9", "James 1:5"],
  identity: ["Psalm 139:14", "2 Corinthians 5:17", "Ephesians 2:10"],
  grief: ["Psalm 34:18", "Matthew 5:4", "Revelation 21:4"],
  patience: ["James 1:2-3", "Romans 12:12", "Galatians 6:9"],
  joy: ["Psalm 16:11", "Nehemiah 8:10", "John 15:11"],
  prayer: ["Matthew 7:7", "1 Thessalonians 5:17", "Philippians 4:6"],
  faith: ["Hebrews 11:1", "Romans 10:9", "Mark 11:24"],
};

export function searchTopics(query: string): { topic: string; refs: string[] }[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return Object.entries(TOPIC_INDEX)
    .filter(([topic]) => topic.includes(q) || q.includes(topic))
    .map(([topic, refs]) => ({ topic, refs }));
}

export const BIBLE_BOOKS = [
  "Genesis","Exodus","Leviticus","Numbers","Deuteronomy","Joshua","Judges","Ruth",
  "1 Samuel","2 Samuel","1 Kings","2 Kings","1 Chronicles","2 Chronicles","Ezra",
  "Nehemiah","Esther","Job","Psalms","Proverbs","Ecclesiastes","Song of Solomon",
  "Isaiah","Jeremiah","Lamentations","Ezekiel","Daniel","Hosea","Joel","Amos",
  "Obadiah","Jonah","Micah","Nahum","Habakkuk","Zephaniah","Haggai","Zechariah",
  "Malachi","Matthew","Mark","Luke","John","Acts","Romans","1 Corinthians",
  "2 Corinthians","Galatians","Ephesians","Philippians","Colossians","1 Thessalonians",
  "2 Thessalonians","1 Timothy","2 Timothy","Titus","Philemon","Hebrews","James",
  "1 Peter","2 Peter","1 John","2 John","3 John","Jude","Revelation",
];

export function searchBooks(query: string): string[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return BIBLE_BOOKS.filter((b) => b.toLowerCase().includes(q));
}

/** Loose check for whether a query already looks like "Book chapter:verse" */
export function looksLikeReference(query: string): boolean {
  return /\d/.test(query) && BIBLE_BOOKS.some((b) => query.toLowerCase().includes(b.toLowerCase()));
}
