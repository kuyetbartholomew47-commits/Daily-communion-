import { createClient } from "@/lib/supabase/server";
import { fetchVerse, getDailyVerseReference } from "@/lib/bible-api";
import { READING_PLAN, planProgressPercent } from "@/lib/reading-plan";
import DashboardClient from "./DashboardClient";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: profile }, { data: streak }, { data: progress }, { data: favorites }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user?.id).single(),
      supabase.from("streaks").select("*").eq("user_id", user?.id).single(),
      supabase.from("reading_progress").select("*").eq("user_id", user?.id).single(),
      supabase.from("favorites").select("*").eq("user_id", user?.id).order("created_at", { ascending: false }).limit(3),
    ]);

  const verseRef = getDailyVerseReference();
  const verse = await fetchVerse(verseRef);

  const currentDay = progress?.current_day ?? 1;
  const readingDay = READING_PLAN.find((d) => d.day === currentDay) ?? READING_PLAN[0];
  const progressPercent = planProgressPercent(progress?.completed_days ?? []);

  return (
    <DashboardClient
      firstName={profile?.full_name?.split(" ")[0] ?? "Friend"}
      verse={verse}
      streak={streak?.current_streak ?? 0}
      longestStreak={streak?.longest_streak ?? 0}
      readingDay={readingDay}
      progressPercent={progressPercent}
      weeklyGoal={profile?.weekly_goal_days ?? 5}
      favorites={favorites ?? []}
    />
  );
}
