"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";

export default function StreakRing({
  streak,
  goal = 30,
}: {
  streak: number;
  goal?: number;
}) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(1, streak / goal);

  return (
    <div className="relative w-36 h-36 flex items-center justify-center">
      <svg width="144" height="144" className="absolute -rotate-90">
        <circle
          cx="72"
          cy="72"
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="10"
          fill="none"
        />
        <motion.circle
          cx="72"
          cy="72"
          r={radius}
          stroke="url(#goldGradient)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - pct) }}
          transition={{ duration: 1.1, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FBDE82" />
            <stop offset="100%" stopColor="#C9A02E" />
          </linearGradient>
        </defs>
      </svg>
      <motion.div
        className="flex flex-col items-center"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
      >
        <Flame className="text-gold mb-1" size={22} strokeWidth={2.2} />
        <span className="text-3xl font-display font-semibold text-ink">{streak}</span>
        <span className="text-[11px] text-ink-muted -mt-0.5">day streak</span>
      </motion.div>
    </div>
  );
}
