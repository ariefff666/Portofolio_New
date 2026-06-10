import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type StatusBadgeVariant = "online" | "success" | "info" | "warning" | "error" | "muted";

type StatusBadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: StatusBadgeVariant;
};

const badgeVariants: Record<StatusBadgeVariant, string> = {
  online: "border-cyan/35 bg-cyan/10 text-cyan",
  success: "border-success/35 bg-success/10 text-success",
  info: "border-blue/40 bg-blue/10 text-text",
  warning: "border-warning/40 bg-warning/10 text-warning",
  error: "border-red/40 bg-red/10 text-red",
  muted: "border-line bg-bg-navy/80 text-muted",
};

export function StatusBadge({
  children,
  className,
  variant = "online",
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs font-semibold uppercase tracking-[0.14em]",
        badgeVariants[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="grid h-4 w-4 place-items-center rounded-full border border-current">
        <span className="h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      {children}
    </span>
  );
}
