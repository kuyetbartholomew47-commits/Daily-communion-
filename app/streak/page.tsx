import { createClient } from "@/lib/supabase/server";
import { STREAK_BADGES, nextBadge } from "@/lib/achievements";
import StreakClient from "./StreakClient";

export const revalidate = 0;

export default async function StreakPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: streak }, { data: achievements }, { data: activity }] = await Promise.all([
    supabase.from("streaks").select("*").eq("user_id", user?.id).single(),
    supabase.from("achievements").select("badge_key").eq("user_id", user?.id),
    supabase
      .from("activity_log")
      .select("activity_date")
      .eq("user_id", user?.id)
      .order("activity_date", { ascending: false })
      .limit(60),
  ]);

  const earnedKeys = new Set((achievements ?? []).map((a) => a.badge_key));
  const activeDates = new Set((activity ?? []).map((a) => a.activity_date));

  return (
    <StreakClient
      current={streak?.current_streak ?? 0}
      longest={streak?.longest_streak ?? 0}
      totalDays={streak?.total_active_days ?? 0}
      badges={STREAK_BADGES.map((b) => ({ ...b, earned: earnedKeys.has(b.key) }))}
      next={nextBadge(streak?.current_streak ?? 0)}
      activeDates={Array.from(activeDates)}
    />
  );
}
