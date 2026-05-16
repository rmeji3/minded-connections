"use client";

import { VISIT_TYPES } from "@/lib/appointments-data";
import type { VisitMode } from "@/lib/appointments-types";
import { cn } from "@/lib/utils";

interface Step1Props {
  visitType: string | null;
  setVisitType: (v: string) => void;
  visitMode: VisitMode;
  setVisitMode: (m: VisitMode) => void;
  onContinue: () => void;
}

const VISIT_MODES = [
  {
    id: "telehealth" as VisitMode,
    label: "Telehealth",
    sub: "Secure video link · all of California",
    iconBg: "var(--sage-500)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
  },
  {
    id: "in-person" as VisitMode,
    label: "In-person",
    sub: "Menifee office · Menifee, CA 92584",
    iconBg: "var(--sage-500)",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
] as const;

export function Step1VisitType({ visitType, setVisitType, visitMode, setVisitMode, onContinue }: Step1Props) {
  return (
    <div>
      {/* Visit type card */}
      <div
        style={{
          background: "white", border: "1px solid var(--linen)",
          borderRadius: 12, padding: "1.5rem", marginBottom: "1rem",
        }}
      >
        <span style={{ fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-500)", fontFamily: "var(--font-body)", fontWeight: 500 }}>STEP 1</span>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)", marginTop: "0.25rem", marginBottom: "0.375rem" }}>
          What kind of <em style={{ fontStyle: "italic" }}>visit</em>?
        </div>
        <p style={{ fontSize: "0.9rem", color: "var(--stone-600)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
          Choose the option that best matches what you&apos;d like to discuss. Not sure? Pick &ldquo;Med follow-up&rdquo; — we can adjust on the call.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VISIT_TYPES.map((vt) => (
            <button
              key={vt.id}
              aria-pressed={visitType === vt.id}
              onClick={() => setVisitType(vt.id)}
              className={cn(
                "relative w-full cursor-pointer rounded-xl border p-5 text-left transition-all duration-150",
                visitType === vt.id
                  ? "border-2 border-[var(--sage-700)] bg-[var(--sage-50)]"
                  : "border border-[var(--linen)] bg-white hover:border-[var(--sage-300)] hover:bg-[var(--sage-50)]"
              )}
            >
              {vt.recommended && (
                <span
                  style={{
                    position: "absolute", top: "0.75rem", right: "0.75rem",
                    fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase",
                    color: "var(--stone-500)", fontFamily: "var(--font-body)",
                  }}
                >
                  RECOMMENDED
                </span>
              )}
              <div
                style={{
                  width: 40, height: 40, borderRadius: 8, background: "var(--sage-100)",
                  color: "var(--sage-600)", display: "inline-flex", alignItems: "center",
                  justifyContent: "center", marginBottom: "0.75rem",
                }}
              >
                {vt.icon}
              </div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ink)", marginBottom: "0.3rem", display: "block" }}>
                {vt.label}
              </div>
              <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", marginBottom: "0.5rem", fontFamily: "var(--font-detail)" }}>
                {vt.duration} · <span style={{ fontFamily: "var(--font-body)" }}>{vt.provider}</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--stone-700)", lineHeight: 1.55 }}>
                {vt.description}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Visit mode card */}
      <div
        style={{
          background: "white", border: "1px solid var(--linen)",
          borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem",
        }}
      >
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--ink)", marginBottom: "0.875rem" }}>
          Visit <em style={{ fontStyle: "italic" }}>mode</em>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {VISIT_MODES.map((m) => (
            <button
              key={m.id}
              aria-pressed={visitMode === m.id}
              onClick={() => setVisitMode(m.id)}
              className={cn(
                "flex w-full cursor-pointer items-start gap-3.5 rounded-xl border p-4 text-left transition-all duration-150",
                visitMode === m.id
                  ? "border-2 border-[var(--sage-700)] bg-[var(--sage-50)]"
                  : "border border-[var(--linen)] bg-white hover:border-[var(--sage-300)] hover:bg-[var(--sage-50)]"
              )}
            >
              <span
                style={{
                  width: 36, height: 36, borderRadius: 6, background: m.iconBg,
                  color: "white", display: "inline-flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0,
                }}
              >
                {m.icon}
              </span>
              <div>
                <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", color: "var(--ink)", fontWeight: 500, marginBottom: "0.2rem" }}>
                  {m.label}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>
                  {m.sub}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn-primary"
          onClick={onContinue}
          disabled={!visitType}
          style={{ opacity: visitType ? 1 : 0.45, cursor: visitType ? "pointer" : "not-allowed" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
