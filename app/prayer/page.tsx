import { createClient } from "@/lib/supabase/server";
import PrayerClient from "./PrayerClient";

export const revalidate = 0;

export default async function PrayerPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: prayers } = await supabase
    .from("prayers")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return <PrayerClient prayers={prayers ?? []} />;
}
