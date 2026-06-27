import { createClient } from "@/lib/supabase/server";
import { READING_PLAN, planProgressPercent } from "@/lib/reading-plan";
import { fetchPassage } from "@/lib/bible-api";
import ReadingClient from "./ReadingClient";

export const revalidate = 0;

export default async function ReadingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: progress } = await supabase
    .from("reading_progress")
    .select("*")
    .eq("user_id", user?.id)
    .single();

  const currentDay = progress?.current_day ?? 1;
  const completedDays: number[] = progress?.completed_days ?? [];
  const today = READING_PLAN.find((d) => d.day === currentDay) ?? READING_PLAN[0];

  // Fetch the first chapter of today's passage as a representative preview.
  const previewRef = `${today.passages[0].book} ${today.passages[0].chapter}`;
  const preview = await fetchPassage([previewRef]);

  return (
    <ReadingClient
      today={today}
      preview={preview[0] ?? null}
      progressPercent={planProgressPercent(completedDays)}
      completedDays={completedDays}
      totalDays={READING_PLAN.length}
    />
  );
}
