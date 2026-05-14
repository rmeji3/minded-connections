import { BadgeChip } from "@/components/ui/badge-chip";
import { GhostBtn } from "@/components/ui/ghost-btn";
import type { Appointment } from "@/lib/appointments-types";

interface ApptCardProps {
  appt: Appointment;
}

export function ApptCard({ appt }: ApptCardProps) {
  return (
    <article className="appt-card">
      <div className="flex gap-3 sm:gap-5 flex-col sm:flex-row sm:items-center">
        {/* Main row: date block + content */}
        <div style={{ display: "flex", gap: "0.875rem", flex: 1 }}>
          {/* Date block */}
          <div className="appt-date-block appt-date-block--upcoming">
            <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
              {appt.month}
            </span>
            <span style={{ fontSize: "1.75rem", color: "white", fontFamily: "var(--font-display)", lineHeight: 1 }}>
              {appt.day}
            </span>
            <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>
              {appt.dow}
            </span>
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--ink)" }}>
                {appt.title}<em style={{ fontStyle: "italic", color: "var(--sage-600)" }}>{appt.titleEm}</em>
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
                {appt.badges.map((b) => (
                  <BadgeChip key={b.label} type={b.type} label={b.label} />
                ))}
              </div>
            </div>

            <div
              className="flex flex-wrap items-center"
              style={{ gap: "0.25rem 0.5rem", fontSize: "0.875rem", color: "var(--stone-700)", marginBottom: appt.location || appt.note ? "0.5rem" : 0 }}
            >
              <span style={{ fontFamily: "var(--font-detail)", color: "var(--ink)" }}>{appt.timeRange}</span>
              <span style={{ color: "var(--stone-300)" }}>·</span>
              <span>{appt.provider}</span>
              <span style={{ color: "var(--stone-300)" }}>·</span>
              <span style={{ color: "var(--stone-500)" }}>{appt.duration}</span>
            </div>

            {appt.location && (
              <div className="flex items-center" style={{ gap: "0.35rem", fontSize: "0.8125rem", color: "var(--stone-500)", marginBottom: appt.note ? "0.5rem" : 0 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                {appt.location}
              </div>
            )}

            {appt.note && (
              <div className="appt-note" style={{ marginTop: "0.75rem" }}>
                {appt.note}
              </div>
            )}
          </div>
        </div>

        {/* Desktop actions */}
        <div className="sm:flex hidden flex-row items-center gap-2 flex-shrink-0">
          {appt.primaryAction === "join" ? (
            <button
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0.4rem 0.875rem", border: "1.5px solid var(--sage-700)", borderRadius: 4,
                background: "var(--sage-700)", color: "white", fontSize: "0.75rem",
                fontFamily: "var(--font-body)", cursor: "pointer", letterSpacing: "0.06em",
                whiteSpace: "nowrap", minWidth: 88,
              }}
            >
              JOIN
            </button>
          ) : (
            <GhostBtn small>VIEW DETAILS</GhostBtn>
          )}
          <GhostBtn small>RESCHEDULE</GhostBtn>
          <button
            aria-label="More options"
            style={{
              width: 32, height: 32, borderRadius: 5, border: "none",
              background: "transparent", color: "var(--stone-400)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem",
            }}
          >
            ⋮
          </button>
        </div>

        {/* Mobile actions */}
        <div className="sm:hidden flex flex-wrap gap-2">
          {appt.primaryAction === "join" ? (
            <button
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                padding: "0.4rem 0.875rem", border: "1.5px solid var(--sage-700)", borderRadius: 4,
                background: "var(--sage-700)", color: "white", fontSize: "0.75rem",
                fontFamily: "var(--font-body)", cursor: "pointer", letterSpacing: "0.06em",
                whiteSpace: "nowrap", minWidth: 88,
              }}
            >
              JOIN
            </button>
          ) : (
            <GhostBtn small>VIEW DETAILS</GhostBtn>
          )}
          <GhostBtn small>RESCHEDULE</GhostBtn>
        </div>
      </div>
    </article>
  );
}
