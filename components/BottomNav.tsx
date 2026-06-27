"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Brain, HeartHandshake, NotebookPen } from "lucide-react";
import { motion } from "framer-motion";

const TABS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/reading", label: "Reading", icon: BookOpen },
  { href: "/memory", label: "Memory", icon: Brain },
  { href: "/prayer", label: "Prayer", icon: HeartHandshake },
  { href: "/notes", label: "Notes", icon: NotebookPen },
];

export default function BottomNav() {
  const pathname = usePathname();

  if (pathname === "/login" || pathname.startsWith("/auth")) return null;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass-strong mx-3 mb-3 rounded-xl3 shadow-glass flex items-center justify-between px-2 py-2">
        {TABS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className="relative flex flex-1 flex-col items-center gap-1 py-2 tap-press focus-ring rounded-xl"
              aria-current={active ? "page" : undefined}
            >
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-gold/15"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon
                size={20}
                strokeWidth={active ? 2.4 : 1.8}
                className={active ? "text-gold" : "text-ink-muted"}
              />
              <span
                className={`text-[10px] font-medium ${active ? "text-gold" : "text-ink-muted"}`}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
