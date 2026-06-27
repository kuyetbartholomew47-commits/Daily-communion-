export type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string;
  weekly_goal_days: number;
  notif_reading: boolean;
  notif_memory: boolean;
  notif_prayer: boolean;
};

export type Streak = {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
  total_active_days: number;
};

export type ReadingProgress = {
  user_id: string;
  current_day: number;
  completed_days: number[];
  plan_started_at: string;
};

export type Prayer = {
  id: number;
  user_id: string;
  title: string;
  body: string | null;
  category: string;
  is_answered: boolean;
  answered_note: string | null;
  answered_at: string | null;
  created_at: string;
};

export type Note = {
  id: number;
  user_id: string;
  reference: string;
  verse_text: string | null;
  note_body: string | null;
  category: string;
  color: string;
  created_at: string;
};

export type Favorite = {
  id: number;
  user_id: string;
  reference: string;
  verse_text: string;
  created_at: string;
};

export type BibleVerse = {
  reference: string;
  text: string;
  translation: string;
};

export type ReadingDay = {
  day: number;
  reference: string; // e.g. "Genesis 1-3"
  passages: { book: string; chapter: number }[];
};

export type MemoryVerse = {
  id: string;
  reference: string;
  text: string;
};

export type Devotional = {
  day: number;
  title: string;
  basedOn: string;
  keyLesson: string;
  reflection: string;
  prayer: string;
  application: string;
};
