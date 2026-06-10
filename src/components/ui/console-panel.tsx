import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ConsolePanelProps = {
  title?: string;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: "solid" | "glass";
};

export function ConsolePanel({
  title,
  eyebrow,
  action,
  children,
  className,
  contentClassName,
  variant = "solid",
}: ConsolePanelProps) {
  const hasHeader = title || eyebrow || action;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-panel border border-line shadow-none transition duration-200 motion-reduce:transition-none",
        "hover:border-line-strong focus-within:border-cyan/70",
        variant === "glass"
          ? "bg-panel backdrop-blur-md"
          : "bg-panel-solid/90",
        className,
      )}
    >
      {hasHeader ? (
        <header className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            {eyebrow ? (
              <p className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-cyan">
                {eyebrow}
              </p>
            ) : null}
            {title ? (
              <h2 className="mt-1 text-lg font-semibold tracking-normal text-text">
                {title}
              </h2>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      ) : null}
      <div className={cn("p-5", contentClassName)}>{children}</div>
    </section>
  );
}
