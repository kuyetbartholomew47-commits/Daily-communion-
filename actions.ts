"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { badgesEarnedAt } from "@/lib/achievements";

function isoToday() {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string) {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.round((d2 - d1) / 86_400_000);
}

/**
 * Central streak-bump logic. Call this any time the user completes a
 * qualifying daily action (reading, memory review, devotional, prayer).
 * Safe to call multiple times a day — only the first call per day advances
 * the streak.
 */
export async function bumpStreak(activityType: "reading" | "memory" | "devotional" | "prayer") {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const today = isoToday();

  // Log the activity (unique constraint prevents duplicates for the same day/type)
  await supabase
    .from("activity_log")
    .upsert({ user_id: user.id, activity_date: today, activity_type: activityType }, { onConflict: "user_id,activity_date,activity_type" });

  const { data: streak } = await supabase
    .from("streaks")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!streak) {
    await supabase.from("streaks").insert({
      user_id: user.id,
      current_streak: 1,
      longest_streak: 1,
      last_active_date: today,
      total_active_days: 1,
    });
  } else if (streak.last_active_date !== today) {
    const gap = streak.last_active_date ? daysBetween(streak.last_active_date, today) : 999;
    const newCurrent = gap === 1 ? streak.current_streak + 1 : 1;
    const newLongest = Math.max(streak.longest_streak, newCurrent);

    await supabase
      .from("streaks")
      .update({
        current_streak: newCurrent,
        longest_streak: newLongest,
        last_active_date: today,
        total_active_days: streak.total_active_days + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);

    // Award any newly-crossed badges
    const earned = badgesEarnedAt(newCurrent);
    for (const badge of earned) {
      await supabase
        .from("achievements")
        .upsert({ user_id: user.id, badge_key: badge.key }, { onConflict: "user_id,badge_key", ignoreDuplicates: true });
    }
  }

  revalidatePath("/", "layout");
}

export async function completeReadingDay(day: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: progress } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const completed = new Set<number>(progress?.completed_days ?? []);
  completed.add(day);

  await supabase.from("reading_progress").upsert({
    user_id: user.id,
    current_day: day + 1,
    completed_days: Array.from(completed),
    updated_at: new Date().toISOString(),
  });

  await bumpStreak("reading");
  revalidatePath("/reading");
  revalidatePath("/");
}

export async function addFavorite(reference: string, verseText: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase
    .from("favorites")
    .upsert({ user_id: user.id, reference, verse_text: verseText }, { onConflict: "user_id,reference" });
  revalidatePath("/");
}

export async function addPrayer(title: string, body: string, category: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("prayers").insert({ user_id: user.id, title, body, category });
  await bumpStreak("prayer");
  revalidatePath("/prayer");
}

export async function markPrayerAnswered(id: number, note: string) {
  const supabase = createClient();
  await supabase
    .from("prayers")
    .update({ is_answered: true, answered_note: note, answered_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/prayer");
}

export async function addNote(
  reference: string,
  verseText: string,
  noteBody: string,
  category: string,
  color: string
) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("notes").insert({
    user_id: user.id,
    reference,
    verse_text: verseText,
    note_body: noteBody,
    category,
    color,
  });
  revalidatePath("/notes");
}

export async function updateMemoryMastery(verseId: string, level: number) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  await supabase.from("memory_progress").upsert(
    { user_id: user.id, verse_id: verseId, mastery_level: level, last_reviewed: new Date().toISOString() },
    { onConflict: "user_id,verse_id" }
  );
  await bumpStreak("memory");
  revalidatePath("/memory");
}

export async function signOut() {
  const supabase = createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
}
