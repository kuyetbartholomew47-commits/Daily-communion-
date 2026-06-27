"use client";

import { motion } from "framer-motion";

export default function ProgressBar({
  percent,
  label,
}: {
  percent: number;
  label?: string;
}) {
  const clamped = Math.min(100, Math.max(0, percent));
  return (
    <div>
      {label && (
        <div className="flex items-center justify-between mb-1.5 text-xs text-ink-soft">
          <span>{label}</span>
          <span className="text-gold font-semibold">{clamped}%</span>
        </div>
      )}
      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gold-sheen"
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
