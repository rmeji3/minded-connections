import { BadgeChip } from "@/components/ui/badge-chip";
import { GhostBtn } from "@/components/ui/ghost-btn";
import type { Appointment } from "@/lib/appointments-types";

interface ApptCardProps {
  appt: Appointment;
}

export function ApptCard({ appt }: ApptCardProps) {
  return (
    <article className="bg-[var(--warm-white)] border border-[var(--linen)] rounded-[10px] px-4 py-4 sm:px-5 sm:py-[1.125rem] transition-shadow hover:shadow-[0_2px_12px_rgba(39,35,32,.06)]">
      <div className="flex gap-3 sm:gap-5 flex-col sm:flex-row sm:items-start">
        {/* Left: date block + content + note stacked */}
        <div className="flex flex-col flex-1 min-w-0 gap-3">
          {/* Main row: date block + content */}
          <div className="flex gap-3 sm:gap-3.5">
            {/* Date block */}
            <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 w-[68px] h-[68px] sm:w-[96px] sm:h-[96px] rounded-lg sm:rounded-xl text-center bg-[var(--sage-700)]">
              <span style={{ fontSize: "0.6875rem", color: "rgba(255,255,255,0.8)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>
                {appt.month}
              </span>
              <span className="text-[1.5rem] sm:text-[1.75rem] leading-none" style={{ color: "white", fontFamily: "var(--font-display)" }}>
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

              <div style={{ marginBottom: appt.location ? "0.5rem" : 0 }}>
                <div style={{ fontFamily: "var(--font-detail)", fontSize: "0.875rem", color: "var(--ink)", marginBottom: "0.2rem" }}>{appt.timeRange}</div>
                <div className="flex items-center flex-wrap" style={{ gap: "0.25rem 0.4rem", fontSize: "0.875rem", color: "var(--stone-700)" }}>
                  <span className="whitespace-nowrap">{appt.provider}</span>
                  <span style={{ color: "var(--stone-300)" }}>·</span>
                  <span className="whitespace-nowrap" style={{ color: "var(--stone-500)" }}>{appt.duration}</span>
                </div>
              </div>

              {appt.location && (
                <div className="flex items-center" style={{ gap: "0.35rem", fontSize: "0.8125rem", color: "var(--stone-500)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {appt.location}
                </div>
              )}
            </div>
          </div>

          {/* Note — always below the date+content row */}
          {appt.note && (
            <div className="text-[0.8125rem] text-[var(--stone-600)] leading-[1.65] px-3 py-2 bg-[var(--cream)] rounded-md border-l-[2.5px] border-[var(--sage-300)]">
              {appt.note}
            </div>
          )}

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
      </div>
    </article>
  );
}
