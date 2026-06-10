import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

function fieldIdFrom(label: string, fallback?: string) {
  return (
    fallback ??
    label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
  );
}

const fieldClass =
  "min-h-11 w-full rounded-control border border-line bg-bg-navy/80 px-3.5 py-2.5 text-base text-text transition duration-200 placeholder:text-muted/70 hover:border-line-strong focus:border-cyan focus:outline-none focus-visible:shadow-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-45 motion-reduce:transition-none";

type FieldShellProps = {
  children: ReactNode;
  error?: string;
  helperText?: string;
  id: string;
  label: string;
};

function FieldShell({ children, error, helperText, id, label }: FieldShellProps) {
  return (
    <div className="grid gap-2">
      <label className="text-sm font-medium text-text" htmlFor={id}>
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-sm leading-6 text-red" id={`${id}-error`}>
          {error}
        </p>
      ) : helperText ? (
        <p className="text-sm leading-6 text-muted" id={`${id}-helper`}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

type TextFieldProps = ComponentPropsWithoutRef<"input"> & {
  error?: string;
  helperText?: string;
  label: string;
};

export function TextField({
  className,
  error,
  helperText,
  id,
  label,
  name,
  type = "text",
  ...props
}: TextFieldProps) {
  const fieldId = fieldIdFrom(label, id ?? name);
  const descriptionId = error
    ? `${fieldId}-error`
    : helperText
      ? `${fieldId}-helper`
      : undefined;

  return (
    <FieldShell error={error} helperText={helperText} id={fieldId} label={label}>
      <input
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(fieldClass, error && "border-red focus:border-red", className)}
        id={fieldId}
        name={name}
        type={type}
        {...props}
      />
    </FieldShell>
  );
}

type TextAreaProps = ComponentPropsWithoutRef<"textarea"> & {
  error?: string;
  helperText?: string;
  label: string;
};

export function TextArea({
  className,
  error,
  helperText,
  id,
  label,
  name,
  rows = 5,
  ...props
}: TextAreaProps) {
  const fieldId = fieldIdFrom(label, id ?? name);
  const descriptionId = error
    ? `${fieldId}-error`
    : helperText
      ? `${fieldId}-helper`
      : undefined;

  return (
    <FieldShell error={error} helperText={helperText} id={fieldId} label={label}>
      <textarea
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(
          fieldClass,
          "min-h-32 resize-y leading-7",
          error && "border-red focus:border-red",
          className,
        )}
        id={fieldId}
        name={name}
        rows={rows}
        {...props}
      />
    </FieldShell>
  );
}

type SelectOption = {
  disabled?: boolean;
  label: string;
  value: string;
};

type SelectProps = ComponentPropsWithoutRef<"select"> & {
  error?: string;
  helperText?: string;
  label: string;
  options?: SelectOption[];
  placeholder?: string;
};

export function Select({
  children,
  className,
  error,
  helperText,
  id,
  label,
  name,
  options,
  placeholder,
  ...props
}: SelectProps) {
  const fieldId = fieldIdFrom(label, id ?? name);
  const descriptionId = error
    ? `${fieldId}-error`
    : helperText
      ? `${fieldId}-helper`
      : undefined;

  return (
    <FieldShell error={error} helperText={helperText} id={fieldId} label={label}>
      <select
        aria-describedby={descriptionId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(fieldClass, error && "border-red focus:border-red", className)}
        id={fieldId}
        name={name}
        {...props}
      >
        {placeholder ? (
          <option disabled value="">
            {placeholder}
          </option>
        ) : null}
        {children ??
          options?.map((option) => (
            <option disabled={option.disabled} key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
      </select>
    </FieldShell>
  );
}
