"use client";

import { VISIT_TYPES } from "@/lib/appointments-data";
import type { Step, VisitMode } from "@/lib/appointments-types";

interface Step4Props {
  visitType: string | null;
  visitMode: VisitMode;
  selectedDate: number | null;
  selectedTime: string | null;
  notes: string;
  onJumpToStep: (s: Step) => void;
  onConfirm: () => void;
}

interface SummaryRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  onClick?: () => void;
  actionLabel?: string;
}

function SummaryRow({ icon, label, value, sub, onClick, actionLabel }: SummaryRowProps) {
  const content = (
    <>
      <span style={{ color: "var(--sage-400)", flexShrink: 0, paddingTop: 2 }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <div style={{ fontSize: "0.6875rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--stone-500)", fontFamily: "var(--font-body)", marginBottom: "0.2rem" }}>
            {label}
          </div>
          {actionLabel && (
            <span style={{ fontSize: "0.75rem", color: "var(--sage-600)", fontFamily: "var(--font-body)", textDecoration: "underline", textUnderlineOffset: 2 }}>
              {actionLabel}
            </span>
          )}
        </div>
        <div style={{ fontSize: "1rem", color: "var(--ink)", fontFamily: "var(--font-body)", marginBottom: "0.15rem" }}>{value}</div>
        <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", lineHeight: 1.5 }}>{sub}</div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className="flex w-full items-start gap-3 rounded-md border border-transparent p-1 text-left transition-colors hover:border-[var(--linen)] hover:bg-[var(--cream)]"
        style={{ background: "transparent" }}
      >
        {content}
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
      {content}
    </div>
  );
}

export function Step4Review({ visitType, visitMode, selectedDate, selectedTime, notes, onJumpToStep, onConfirm }: Step4Props) {
  const visitLabel = VISIT_TYPES.find((v) => v.id === visitType)?.label ?? "Appointment";
  const spaceIdx = visitLabel.indexOf(" ");
  const visitPre = spaceIdx > -1 ? visitLabel.substring(0, spaceIdx + 1) : "";
  const visitEm = spaceIdx > -1 ? visitLabel.substring(spaceIdx + 1) : visitLabel;
  const dateStr = selectedDate ? `Tue, May ${selectedDate}` : "—";
  const timeStr = selectedTime ?? "—";

  return (
    <div style={{ border: "1px solid var(--linen)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{ background: "var(--sage-700)", padding: "1.25rem 1.5rem" }}>
        <span style={{ fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.6)", fontFamily: "var(--font-body)", fontWeight: 500 }}>STEP 4 · REVIEW</span>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "white", lineHeight: 1.2, marginTop: "0.35rem" }}>
          {visitPre}<em style={{ fontStyle: "italic", color: "var(--sage-200)" }}>{visitEm}</em>
        </div>
      </div>

      <div style={{ background: "white", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <SummaryRow
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
          label="PROVIDER"
          value="Dr. Michelle Hernandez"
          sub="Psychiatrist · primary"
          onClick={() => onJumpToStep(1)}
          actionLabel="Edit"
        />
        <SummaryRow
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 9h18"/><path d="M8 3v4M16 3v4"/></svg>}
          label="DATE & TIME"
          value={`${dateStr} · ${timeStr}`}
          sub="30 min · Pacific Time"
          onClick={() => onJumpToStep(2)}
          actionLabel="Edit"
        />
        <SummaryRow
          icon={
            visitMode === "telehealth"
              ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
              : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          }
          label="MODE"
          value={visitMode === "telehealth" ? "Telehealth" : "In-person"}
          sub={visitMode === "telehealth" ? "Secure video link · 15 min before start" : "Menifee office · Menifee, CA 92584"}
          onClick={() => onJumpToStep(1)}
          actionLabel="Edit"
        />
        <SummaryRow
          icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="6" width="20" height="13" rx="2"/><path d="M2 11h20"/></svg>}
          label="ESTIMATED COST"
          value="$72.50"
          sub="After insurance · Anthem PPO on file"
        />
        {notes.trim() && (
          <SummaryRow
            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>}
            label="YOUR NOTES"
            value={notes.length > 80 ? notes.slice(0, 80) + "…" : notes}
            sub=""
            onClick={() => onJumpToStep(3)}
            actionLabel="Edit"
          />
        )}

        <div style={{ borderTop: "1px solid var(--linen)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <button className="btn-primary" onClick={onConfirm} style={{ width: "100%", letterSpacing: "0.08em" }}>
            CONFIRM APPOINTMENT
          </button>
          <p style={{ fontSize: "0.8125rem", color: "var(--stone-500)", textAlign: "center", margin: 0 }}>
            By confirming you agree to our{" "}
            <a href="#" style={{ color: "var(--sage-500)" }}>cancellation policy</a>{" "}
            (24 hr notice).
          </p>
        </div>
      </div>
    </div>
  );
}
