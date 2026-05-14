"use client";

import type { Step } from "@/lib/appointments-types";

interface ProgressBarProps {
  step: Step;
  onStepClick: (s: Step) => void;
}

const STEPS: { label: string; n: Step }[] = [
  { label: "Visit type", n: 1 },
  { label: "Date & time", n: 2 },
  { label: "Your notes", n: 3 },
  { label: "Review", n: 4 },
];

export function ProgressBar({ step, onStepClick }: ProgressBarProps) {
  const currentLabel = STEPS.find((s) => s.n === step)?.label ?? "";

  return (
    <div>
      {/* ── Mobile layout (hidden on sm+) ── */}
      <div className="sm:hidden">
        <div className="flex items-center justify-between mb-2">
          <span
            style={{
              fontSize: "0.6875rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--stone-500)",
              fontFamily: "var(--font-body)",
            }}
          >
            Step {step} of {STEPS.length}
          </span>
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--ink)",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
            }}
          >
            {currentLabel}
          </span>
        </div>

        {/* Segmented progress track */}
        <div
          style={{
            display: "flex",
            gap: 4,
          }}
        >
          {STEPS.map((s) => {
            const isDone = s.n <= step;
            return (
              <button
                key={s.n}
                aria-label={`Step ${s.n}: ${s.label}`}
                onClick={() => s.n < step && onStepClick(s.n)}
                style={{
                  flex: 1,
                  height: 4,
                  borderRadius: 99,
                  background: isDone ? "var(--sage-500)" : "var(--linen)",
                  border: "none",
                  cursor: s.n < step ? "pointer" : "default",
                  padding: 0,
                  transition: "background 300ms",
                }}
              />
            );
          })}
        </div>
      </div>

      {/* ── Desktop layout (hidden below sm) ── */}
      <div className="hidden sm:flex items-center gap-0">
        {STEPS.map((s, idx) => {
          const isDone = s.n < step;
          const isActive = s.n === step;

          return (
            <div key={s.n} style={{ display: "flex", alignItems: "center", flex: idx < 3 ? 1 : 0 }}>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => isDone && onStepClick(s.n)}
                  aria-label={`Step ${s.n}: ${s.label}`}
                  style={{
                    width: 26, height: 26, borderRadius: "50%",
                    border: isActive ? "1.5px solid var(--sage-300)" : isDone ? "1.5px solid transparent" : "1.5px solid var(--stone-300)",
                    background: isActive ? "var(--sage-50)" : isDone ? "var(--sage-500)" : "transparent",
                    color: isActive ? "var(--sage-700)" : isDone ? "white" : "var(--stone-500)",
                    fontSize: "0.75rem", fontFamily: "var(--font-detail)",
                    cursor: isDone ? "pointer" : "default",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "all 200ms",
                  }}
                >
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    s.n
                  )}
                </button>
                <span
                  style={{
                    fontSize: "0.8125rem",
                    color: isActive ? "var(--ink)" : "var(--stone-500)",
                    fontFamily: "var(--font-body)", whiteSpace: "nowrap",
                    fontWeight: isActive ? 500 : 400,
                  }}
                >
                  {s.label}
                </span>
              </div>

              {idx < STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1, height: 1,
                    background: s.n < step ? "var(--sage-500)" : "var(--linen)",
                    margin: "0 0.75rem",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

