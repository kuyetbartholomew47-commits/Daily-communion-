export type Badge = {
  key: string;
  label: string;
  description: string;
  threshold: number;
  icon: "flame" | "sunrise" | "crown" | "trophy";
};

export const STREAK_BADGES: Badge[] = [
  { key: "streak_7", label: "First Week", description: "7-day streak", threshold: 7, icon: "flame" },
  { key: "streak_30", label: "Steadfast", description: "30-day streak", threshold: 30, icon: "sunrise" },
  { key: "streak_100", label: "Rooted", description: "100-day streak", threshold: 100, icon: "crown" },
  { key: "streak_365", label: "Faithful Year", description: "365-day streak", threshold: 365, icon: "trophy" },
];

export function badgesEarnedAt(streakCount: number): Badge[] {
  return STREAK_BADGES.filter((b) => streakCount >= b.threshold);
}

export function nextBadge(streakCount: number): Badge | null {
  return STREAK_BADGES.find((b) => streakCount < b.threshold) ?? null;
}
