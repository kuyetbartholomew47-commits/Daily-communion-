import { NextRequest, NextResponse } from "next/server";
import { fetchVerse } from "@/lib/bible-api";

export async function GET(req: NextRequest) {
  const ref = req.nextUrl.searchParams.get("ref");
  if (!ref) return NextResponse.json({ error: "Missing ref" }, { status: 400 });

  const verse = await fetchVerse(ref);
  if (!verse) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(verse);
}
