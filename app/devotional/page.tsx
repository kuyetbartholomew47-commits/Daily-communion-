import { createClient } from "@/lib/supabase/server";
import { getDevotional, DEVOTIONALS } from "@/lib/devotionals";
import PageHeader from "@/components/PageHeader";
import GlassCard from "@/components/GlassCard";

export const revalidate = 0;

export default async function DevotionalPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progress } = await supabase
    .from("reading_progress")
    .select("current_day")
    .eq("user_id", user?.id)
    .single();

  const currentDay = progress?.current_day ?? 1;
  // Cycle through the sample set until the full 365-day library is written.
  const devotional =
    getDevotional(currentDay) ?? DEVOTIONALS[(currentDay - 1) % DEVOTIONALS.length];

  return (
    <div className="pb-4">
      <PageHeader title="Daily Communion" subtitle={`Based on ${devotional.basedOn}`} />
      <div className="px-5 space-y-4">
        <GlassCard strong>
          <h2 className="font-display text-xl text-ink">{devotional.title}</h2>
        </GlassCard>

        <GlassCard>
          <p className="text-[11px] uppercase tracking-widest text-gold/80 mb-2">Key Lesson</p>
          <p className="text-sm text-ink-soft leading-relaxed">{devotional.keyLesson}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-[11px] uppercase tracking-widest text-gold/80 mb-2">Reflection</p>
          <p className="text-sm text-ink-soft leading-relaxed">{devotional.reflection}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-[11px] uppercase tracking-widest text-gold/80 mb-2">Prayer</p>
          <p className="text-sm text-ink-soft leading-relaxed italic">{devotional.prayer}</p>
        </GlassCard>

        <GlassCard>
          <p className="text-[11px] uppercase tracking-widest text-gold/80 mb-2">Practical Application</p>
          <p className="text-sm text-ink-soft leading-relaxed">{devotional.application}</p>
        </GlassCard>
      </div>
    </div>
  );
}
