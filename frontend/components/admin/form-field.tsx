import * as React from "react";

interface FormFieldProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactElement<{ id: string; "aria-describedby"?: string; "aria-required"?: boolean }>;
}

export function FormField({ id, label, required, error, hint, children }: FormFieldProps) {
  const hintId  = hint  ? `${id}-hint`  : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
      <label
        htmlFor={id}
        style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", fontFamily: "var(--font-body)" }}
      >
        {label}
        {required && <span aria-hidden="true" style={{ color: "var(--color-error)", marginLeft: "0.2rem" }}>*</span>}
      </label>

      {React.cloneElement(children, {
        id,
        "aria-describedby": describedBy,
        "aria-required": required,
      })}

      {hint && !error && (
        <span id={hintId} style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>{hint}</span>
      )}
      {error && (
        <span id={errorId} role="alert" style={{ fontSize: "0.8125rem", color: "var(--color-error)" }}>{error}</span>
      )}
    </div>
  );
}
