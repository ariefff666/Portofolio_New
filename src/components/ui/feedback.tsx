import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { DangerButton, PrimaryButton, SecondaryButton } from "./button";

type EmptyStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  eyebrow?: string;
  title: string;
};

export function EmptyState({
  action,
  className,
  description,
  eyebrow = "No data",
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-dashed border-line bg-bg-navy/45 p-6 text-center",
        className,
      )}
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
        {eyebrow}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-text">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted">
        {description}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

type LoadingSkeletonProps = {
  className?: string;
  lines?: number;
};

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading"
      className={cn(
        "grid gap-3 rounded-panel border border-line bg-bg-navy/45 p-5",
        className,
      )}
      role="status"
    >
      {Array.from({ length: lines }).map((_, index) => (
        <span
          className={cn(
            "h-3 animate-pulse rounded-full bg-line-strong motion-reduce:animate-none",
            index === lines - 1 ? "w-2/3" : "w-full",
          )}
          key={index}
        />
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

type ErrorStateProps = {
  action?: ReactNode;
  className?: string;
  description: string;
  title?: string;
};

export function ErrorState({
  action,
  className,
  description,
  title = "Unable to load state",
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "rounded-panel border border-red/45 bg-red/10 p-6",
        className,
      )}
      role="alert"
    >
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-red">
        Error state
      </p>
      <h3 className="mt-3 text-xl font-semibold text-text">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

type ConfirmDialogProps = {
  cancelLabel?: string;
  confirmLabel?: string;
  description: string;
  destructive?: boolean;
  inline?: boolean;
  open?: boolean;
  title: string;
};

export function ConfirmDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description,
  destructive = false,
  inline = false,
  open = false,
  title,
}: ConfirmDialogProps) {
  if (!open) {
    return null;
  }

  const ConfirmButton = destructive ? DangerButton : PrimaryButton;

  return (
    <div
      aria-labelledby="confirm-dialog-title"
      aria-modal={inline ? undefined : true}
      className={cn(
        inline
          ? "rounded-panel border border-line bg-bg-navy/60 p-4"
          : "fixed inset-0 z-50 grid place-items-center bg-bg-void/80 p-5 backdrop-blur-sm",
      )}
      role="dialog"
    >
      <div
        className={cn(
          "w-full max-w-lg rounded-panel border border-line bg-panel-solid p-6 shadow-none",
          inline && "max-w-none",
        )}
      >
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
          Confirmation
        </p>
        <h2 id="confirm-dialog-title" className="mt-3 text-2xl font-semibold text-text">
          {title}
        </h2>
        <p className="mt-3 text-base leading-7 text-muted">{description}</p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <SecondaryButton>{cancelLabel}</SecondaryButton>
          <ConfirmButton>{confirmLabel}</ConfirmButton>
        </div>
      </div>
    </div>
  );
}

type ToastVariant = "info" | "success" | "error";

type ToastProps = {
  className?: string;
  description?: string;
  title: string;
  variant?: ToastVariant;
};

const toastVariants: Record<ToastVariant, string> = {
  info: "border-line bg-panel-solid text-text",
  success: "border-success/45 bg-success/10 text-success",
  error: "border-red/45 bg-red/10 text-red",
};

export function Toast({
  className,
  description,
  title,
  variant = "info",
}: ToastProps) {
  return (
    <div
      className={cn(
        "w-full max-w-sm rounded-panel border p-4 shadow-none",
        toastVariants[variant],
        className,
      )}
      role={variant === "error" ? "alert" : "status"}
    >
      <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em]">
        {title}
      </p>
      {description ? (
        <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
      ) : null}
    </div>
  );
}
