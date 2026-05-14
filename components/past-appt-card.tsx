import { BadgeChip } from "@/components/ui/badge-chip";
import { GhostBtn } from "@/components/ui/ghost-btn";
import type { PastAppt } from "@/lib/appointments-types";

interface PastApptCardProps {
  appt: PastAppt;
}

export function PastApptCard({ appt }: PastApptCardProps) {
  return (
    <article className="appt-card">
      <div className="flex gap-4">
        {/* Date block */}
        <div className="appt-date-block appt-date-block--past">
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-500)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>{appt.month}</span>
          <span style={{ fontSize: "1.625rem", color: "var(--ink)", fontFamily: "var(--font-display)", lineHeight: 1 }}>{appt.day}</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-500)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>{appt.dow}</span>
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--ink)" }}>
              {appt.title}{appt.titleEm && <em style={{ fontStyle: "italic", color: "var(--sage-600)" }}>{appt.titleEm}</em>}
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem" }}>
              {appt.badges.map((b) => (
                <BadgeChip key={b.label} type={b.type} label={b.label} />
              ))}
            </div>
          </div>

          <div
            className="flex flex-wrap items-center"
            style={{ gap: "0.25rem 0.5rem", fontSize: "0.875rem", color: "var(--stone-700)", marginBottom: appt.note || appt.location ? "0.625rem" : 0 }}
          >
            <span style={{ fontFamily: "var(--font-detail)", color: "var(--ink)" }}>{appt.timeRange}</span>
            <span style={{ color: "var(--stone-300)" }}>·</span>
            <span>{appt.provider}</span>
            {appt.location && (
              <>
                <span style={{ color: "var(--stone-300)" }}>·</span>
                <span style={{ color: "var(--stone-500)" }}>{appt.location}</span>
              </>
            )}
          </div>

          {appt.note && (
            <div className="appt-note appt-note--past">{appt.note}</div>
          )}
        </div>

        {/* Desktop actions */}
        <div className="hidden sm:flex flex-row items-center gap-2 flex-shrink-0">
          <GhostBtn small>VISIT SUMMARY</GhostBtn>
          <button
            aria-label="More options"
            style={{
              width: 28, height: 28, borderRadius: 4, border: "none",
              background: "transparent", color: "var(--stone-400)", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "1rem",
            }}
          >
            ⋮
          </button>
        </div>
      </div>

      {/* Mobile action */}
      <div className="sm:hidden mt-2 flex gap-2">
        <GhostBtn small>VISIT SUMMARY</GhostBtn>
      </div>
    </article>
  );
}
