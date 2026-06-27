"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PageHeader({
  title,
  subtitle,
  backHref = "/",
}: {
  title: string;
  subtitle?: string;
  backHref?: string;
}) {
  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-4">
      <Link
        href={backHref}
        className="tap-press focus-ring rounded-full glass p-2"
        aria-label="Back"
      >
        <ChevronLeft size={18} className="text-ink" />
      </Link>
      <div>
        <h1 className="font-display text-xl text-ink leading-tight">{title}</h1>
        {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
