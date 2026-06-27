import { createClient } from "@/lib/supabase/server";
import SearchClient from "./SearchClient";

export const revalidate = 0;

export default async function SearchPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user?.id);

  return <SearchClient notes={notes ?? []} />;
}
