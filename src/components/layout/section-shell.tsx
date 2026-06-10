import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionShellProps = {
  children: ReactNode;
  className?: string;
  id: string;
};

export function SectionShell({ children, className, id }: SectionShellProps) {
  return (
    <section
      className={cn(
        "scroll-mt-28 border-t border-line/70 py-16 sm:py-20 lg:py-24",
        className,
      )}
      id={id}
    >
      {children}
    </section>
  );
}
