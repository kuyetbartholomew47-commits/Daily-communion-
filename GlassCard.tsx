import { type ReactNode } from "react";
import clsx from "clsx";

export default function GlassCard({
  children,
  className,
  strong = false,
}: {
  children: ReactNode;
  className?: string;
  strong?: boolean;
}) {
  return (
    <div
      className={clsx(
        strong ? "glass-strong" : "glass",
        "rounded-xl2 shadow-glass p-5",
        className
      )}
    >
      {children}
    </div>
  );
}
