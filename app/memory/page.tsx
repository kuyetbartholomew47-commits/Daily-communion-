import { fetchVerse, getDailyMemoryReference } from "@/lib/bible-api";
import MemoryClient from "./MemoryClient";

export const revalidate = 0;

export default async function MemoryPage() {
  const ref = getDailyMemoryReference();
  const verse = await fetchVerse(ref);

  return <MemoryClient verse={verse} />;
}
