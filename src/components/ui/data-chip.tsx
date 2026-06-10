import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type DataChipVariant = "cyan" | "blue" | "success" | "warning" | "red" | "muted";

type DataChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: DataChipVariant;
};

const chipVariants: Record<DataChipVariant, string> = {
  cyan: "border-cyan/35 bg-cyan/10 text-cyan",
  blue: "border-blue/40 bg-blue/10 text-text",
  success: "border-success/35 bg-success/10 text-success",
  warning: "border-warning/35 bg-warning/10 text-warning",
  red: "border-red/35 bg-red/10 text-red",
  muted: "border-line bg-bg-navy/70 text-muted",
};

export function DataChip({
  children,
  className,
  variant = "cyan",
  ...props
}: DataChipProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 items-center gap-2 rounded-chip border px-2.5 py-1 font-mono text-xs font-medium uppercase tracking-[0.12em]",
        chipVariants[variant],
        className,
      )}
      {...props}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
