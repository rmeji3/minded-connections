import type { CancelledAppt } from "@/lib/appointments-types";

interface CancelledCardProps {
  appt: CancelledAppt;
}

export function CancelledCard({ appt }: CancelledCardProps) {
  return (
    <article className="bg-[var(--warm-white)] border border-[var(--linen)] rounded-[10px] px-4 py-4 sm:px-5 sm:py-[1.125rem] transition-shadow hover:shadow-[0_2px_12px_rgba(39,35,32,.06)]">
      <div className="flex gap-3 sm:gap-4">
        <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 w-[68px] h-[68px] sm:w-[96px] sm:h-[96px] rounded-lg sm:rounded-xl text-center bg-[var(--linen)]">
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-400)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>{appt.month}</span>
          <span className="text-[1.375rem] sm:text-[1.625rem] leading-none" style={{ color: "var(--stone-400)", fontFamily: "var(--font-display)" }}>{appt.day}</span>
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-400)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.04em" }}>{appt.dow}</span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--stone-400)", textDecoration: "line-through" }}>
              {appt.title}{appt.titleEm && <em style={{ fontStyle: "italic" }}>{appt.titleEm}</em>}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.625rem] font-medium tracking-widest uppercase whitespace-nowrap border border-[var(--linen)] bg-[var(--cream)] text-[var(--stone-500)]">
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
