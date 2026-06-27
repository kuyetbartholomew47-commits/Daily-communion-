import { type ButtonHTMLAttributes, type ReactNode } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "gold" | "ghost" | "outline";
  fullWidth?: boolean;
};

export default function Button({
  children,
  variant = "gold",
  fullWidth = false,
  className,
  ...rest
}: Props) {
  return (
    <button
      className={clsx(
        "tap-press focus-ring rounded-xl px-5 py-3 text-sm font-semibold transition-colors",
        fullWidth && "w-full flex items-center justify-center gap-2",
        variant === "gold" && "bg-gold-sheen text-navy-deep shadow-glow",
        variant === "ghost" && "bg-white/5 text-ink hover:bg-white/10",
        variant === "outline" && "border border-gold/40 text-gold hover:bg-gold/10",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
