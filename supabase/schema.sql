-- =========================================================
-- Daily Communion — Supabase schema
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- =========================================================

-- 1. PROFILES ------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  timezone text default 'UTC',
  weekly_goal_days int default 5,
  notif_reading boolean default true,
  notif_memory boolean default true,
  notif_prayer boolean default true,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_upsert_own" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. STREAKS ---------------------------------------------------
create table if not exists public.streaks (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_streak int default 0,
  longest_streak int default 0,
  last_active_date date,
  total_active_days int default 0,
  updated_at timestamptz default now()
);

alter table public.streaks enable row level security;
create policy "streaks_owner_all" on public.streaks
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Log of each day the user engaged (for calendar heatmap)
create table if not exists public.activity_log (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  activity_date date not null,
  activity_type text not null check (activity_type in ('reading','memory','devotional','prayer')),
  created_at timestamptz default now(),
  unique (user_id, activity_date, activity_type)
);

alter table public.activity_log enable row level security;
create policy "activity_owner_all" on public.activity_log
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 3. READING PROGRESS -------------------------------------------
create table if not exists public.reading_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  current_day int default 1,
  completed_days int[] default '{}',
  plan_started_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.reading_progress enable row level security;
create policy "reading_owner_all" on public.reading_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 4. MEMORY VERSE PROGRESS ---------------------------------------
create table if not exists public.memory_progress (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  verse_id text not null,
  mastery_level int default 0, -- 0=new,1=learning,2=familiar,3=mastered
  last_reviewed timestamptz default now(),
  unique (user_id, verse_id)
);

alter table public.memory_progress enable row level security;
create policy "memory_owner_all" on public.memory_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 5. PRAYER JOURNAL ------------------------------------------------
create table if not exists public.prayers (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  body text,
  category text default 'general',
  is_answered boolean default false,
  answered_note text,
  answered_at timestamptz,
  created_at timestamptz default now()
);

alter table public.prayers enable row level security;
create policy "prayers_owner_all" on public.prayers
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 6. NOTES & HIGHLIGHTS -----------------------------------------
create table if not exists public.notes (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  reference text not null,        -- e.g. "John 3:16"
  verse_text text,
  note_body text,
  category text default 'general',
  color text default 'gold',
  created_at timestamptz default now()
);

alter table public.notes enable row level security;
create policy "notes_owner_all" on public.notes
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 7. FAVORITES ----------------------------------------------------
create table if not exists public.favorites (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  reference text not null,
  verse_text text not null,
  created_at timestamptz default now(),
  unique (user_id, reference)
);

alter table public.favorites enable row level security;
create policy "favorites_owner_all" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 8. ACHIEVEMENTS ----------------------------------------------------
create table if not exists public.achievements (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade,
  badge_key text not null,   -- e.g. 'streak_7', 'streak_30', 'books_completed_5'
  earned_at timestamptz default now(),
  unique (user_id, badge_key)
);

alter table public.achievements enable row level security;
create policy "achievements_owner_all" on public.achievements
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- =========================================================
-- Done. Next step: Authentication → Providers → enable Google
-- and add your site URL under Authentication → URL Configuration.
-- =========================================================
