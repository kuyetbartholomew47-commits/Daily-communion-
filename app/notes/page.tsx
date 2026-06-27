import { createClient } from "@/lib/supabase/server";
import NotesClient from "./NotesClient";

export const revalidate = 0;

export default async function NotesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  return <NotesClient notes={notes ?? []} />;
}
