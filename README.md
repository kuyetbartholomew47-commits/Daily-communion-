# Daily Communion

A premium, iOS-inspired Bible & devotion PWA — built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase.

## What's wired up and working

- **Auth**: Google sign-in via Supabase Auth, session refresh middleware, protected routes.
- **Daily Verse**: fetched live each day from bible-api.com (public-domain KJV by default) — copy, share, listen (text-to-speech), favorite.
- **Daily Memory Verse**: hide/show word challenge + typed quiz mode with word-match scoring, mastery levels saved per user.
- **Scripture Reading Plan**: full Genesis→Revelation plan auto-generated from real chapter counts (1,189 chapters spread across 365 days), progress tracking, "continue where you left off," 5-week history grid.
- **Daily Devotional**: key lesson / reflection / prayer / application, tied to your current reading day. 7 sample days are written; the data shape is ready for you to extend to the full 365.
- **Streak system**: current streak, longest streak, animated streak ring, 6-week activity calendar, 4 milestone badges (7/30/100/365 days), auto-awarded.
- **Prayer Journal**: add prayers, mark answered, filter active/answered, private per-user via RLS.
- **Notes & Highlights**: color-coded notes tied to a reference, searchable.
- **Smart Search**: verse-reference lookup, topical index (love, fear, peace, etc.), book name matching, and search across your own notes.
- **Dashboard**: greeting, daily verse hero, streak ring, weekly goal, today's reading, quick links, recent favorites.
- **PWA**: manifest, service worker (offline shell + cache-first static assets, network-first content), installable on iOS/Android, app icons included.

## What's stubbed / needs your input before launch

- **Devotional content**: only 7 of 365 days are written (`lib/devotionals.ts`). They cycle until you add the rest.
- **Push notifications**: reminder *preferences* are in the schema (`profiles.notif_reading` etc.) but a settings UI and actual push delivery aren't built — that needs a service like OneSignal, Firebase Cloud Messaging, or web push + a cron job, since Supabase doesn't send notifications itself.
- **Audio reading**: uses the browser's built-in text-to-speech (`speechSynthesis`) rather than studio-recorded narration.
- **Image-share cards**: "Share verse as image" currently uses the native share sheet / clipboard with text. A canvas-rendered shareable image card is a nice follow-up.
- **Light mode**: dark mode is the default and only theme right now, per the brief.

## 1. Run the SQL schema

In your Supabase project: **SQL Editor → New query** → paste the contents of `supabase/schema.sql` → Run.

This creates all tables (profiles, streaks, activity_log, reading_progress, memory_progress, prayers, notes, favorites, achievements), row-level security policies so users can only see their own data, and a trigger that auto-creates a profile row on signup.

## 2. Enable Google sign-in

In Supabase: **Authentication → Providers → Google** → toggle on, paste your Google OAuth Client ID + Secret (from Google Cloud Console → Credentials → OAuth 2.0 Client).

In **Authentication → URL Configuration**, set:
- Site URL: your deployed domain (e.g. `https://yourapp.vercel.app`)
- Redirect URLs: add `http://localhost:3000/auth/callback` (dev) and `https://yourapp.vercel.app/auth/callback` (prod)

## 3. Environment variables

`.env.local` is already filled in with the URL + publishable key you gave me:

```
NEXT_PUBLIC_SUPABASE_URL=https://kpyeqkyfdozeknrmswwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ld4O8GffqEeERrcSIXVf5g_TtV7Bow_
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Update `NEXT_PUBLIC_SITE_URL` to your real domain before deploying.

## 4. Install & run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` — you'll be redirected to `/login` until you sign in with Google.

## 5. Deploy

Push to GitHub, import into Vercel, add the same environment variables in the Vercel project settings, deploy. Update the Supabase redirect URLs to match your production domain.

## Generating real app icons

Placeholder icons are in `public/icons/` (navy background, gold "DC" monogram). Swap them for your real brand icon at the same filenames/sizes: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`.

## Project structure

```
app/                  Next.js App Router pages (one folder per feature)
components/           Shared UI (GlassCard, StreakRing, BottomNav, etc.)
lib/                  Supabase clients, types, Bible API, reading plan, actions
supabase/schema.sql   Full DB schema + RLS policies
public/               Manifest, service worker, icons
```
