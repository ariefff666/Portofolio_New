import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const baseButtonClass =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-5 py-2.5 font-mono text-sm font-semibold uppercase tracking-[0.12em] transition duration-200 motion-reduce:transition-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-45";

export function PrimaryButton({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        baseButtonClass,
        "border border-cyan bg-cyan text-bg-void hover:bg-text hover:text-bg-void focus-visible:shadow-[var(--focus-ring)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export function SecondaryButton({
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        baseButtonClass,
        "border border-line-strong bg-bg-navy/60 text-cyan hover:border-cyan hover:bg-cyan/10 focus-visible:shadow-[var(--focus-ring)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}

export function DangerButton({ className, type = "button", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        baseButtonClass,
        "border border-red bg-red/12 text-red hover:bg-red hover:text-bg-void focus-visible:shadow-[0_0_0_2px_var(--bg-void),0_0_0_4px_var(--red)]",
        className,
      )}
      type={type}
      {...props}
    />
  );
}
