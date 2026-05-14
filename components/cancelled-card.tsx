import type { CancelledAppt } from "@/lib/appointments-types";

interface CancelledCardProps {
  appt: CancelledAppt;
}

export function CancelledCard({ appt }: CancelledCardProps) {
  return (
    <article className="appt-card">
      <div className="flex gap-4">
        <div className="appt-date-block appt-date-block--past">
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-400)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>{appt.month}</span>
          <span style={{ fontSize: "1.625rem", color: "var(--stone-400)", fontFamily: "var(--font-display)", lineHeight: 1 }}>{appt.day}</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-400)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>{appt.dow}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--stone-400)", textDecoration: "line-through" }}>
              {appt.title}{appt.titleEm && <em style={{ fontStyle: "italic" }}>{appt.titleEm}</em>}
            </span>
            <span className="badge-chip" style={{ background: "var(--cream)", color: "var(--stone-500)", border: "1px solid var(--linen)" }}>
              CANCELLED
            </span>
          </div>
          <div style={{ fontSize: "0.875rem", color: "var(--stone-500)", marginBottom: "0.4rem" }}>
            <span style={{ fontFamily: "var(--font-detail)" }}>{appt.timeRange}</span>
            {" · "}
            <span>{appt.provider}</span>
          </div>
          <p style={{ fontSize: "0.8125rem", color: "var(--stone-500)", margin: 0, lineHeight: 1.6 }}>
            {appt.reason}
          </p>
        </div>
      </div>
    </article>
  );
}
