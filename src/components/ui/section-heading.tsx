import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  headingLevel?: 1 | 2 | 3;
  intro?: string;
  index?: string;
  action?: ReactNode;
  className?: string;
};

export function SectionHeading({
  eyebrow,
  headingLevel = 2,
  title,
  intro,
  index,
  action,
  className,
}: SectionHeadingProps) {
  const HeadingTag = `h${headingLevel}` as "h1" | "h2" | "h3";

  return (
    <div
      className={cn(
        "grid gap-5 border-l border-line pl-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-end",
        className,
      )}
    >
      <div>
        <p className="font-mono text-sm font-medium uppercase tracking-[0.2em] text-cyan">
          {index ? <span className="text-muted">{index}{" // "}</span> : null}
          {eyebrow}
        </p>
        <HeadingTag className="mt-3 max-w-3xl text-[clamp(2rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-normal text-text">
          {title}
        </HeadingTag>
        {intro ? (
          <p className="mt-4 max-w-2xl text-base leading-7 text-muted sm:text-lg">
            {intro}
          </p>
        ) : null}
      </div>
      {action ? <div className="md:pb-1">{action}</div> : null}
    </div>
  );
}
