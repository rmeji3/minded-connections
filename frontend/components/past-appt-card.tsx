import { BadgeChip } from "@/components/ui/badge-chip";
import { GhostBtn } from "@/components/ui/ghost-btn";
import type { PastAppt } from "@/lib/appointments-types";

interface PastApptCardProps {
  appt: PastAppt;
}

export function PastApptCard({ appt }: PastApptCardProps) {
  return (
    <article className="bg-[var(--warm-white)] border border-[var(--linen)] rounded-[10px] px-4 py-4 sm:px-5 sm:py-[1.125rem] transition-shadow hover:shadow-[0_2px_12px_rgba(39,35,32,.06)]">
      <div className="flex gap-3 sm:gap-4">
        {/* Date block */}
        <div className="flex flex-col items-center justify-center gap-0.5 shrink-0 w-[68px] h-[68px] sm:w-[96px] sm:h-[96px] rounded-lg sm:rounded-xl text-center bg-[var(--linen)]">
          <span style={{ fontSize: "0.6875rem", color: "var(--stone-500)", textTransform: "uppercase", fontFamily: "var(--font-body)", letterSpacing: "0.06em" }}>{appt.month}</span>
          <span className="text-[1.375rem] sm:text-[1.625rem] leading-none" style={{ color: "var(--ink)", fontFamily: "var(--font-display)" }}>{appt.day}</span>
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

          <div style={{ marginBottom: appt.location ? "0.625rem" : 0 }}>
            <div style={{ fontFamily: "var(--font-detail)", fontSize: "0.875rem", color: "var(--ink)", marginBottom: "0.2rem" }}>{appt.timeRange}</div>
            <div className="flex items-center flex-wrap" style={{ gap: "0.25rem 0.4rem", fontSize: "0.875rem", color: "var(--stone-700)" }}>
              <span className="whitespace-nowrap">{appt.provider}</span>
              {appt.location && (
                <>
                  <span style={{ color: "var(--stone-300)" }}>·</span>
                  <span className="whitespace-nowrap" style={{ color: "var(--stone-500)" }}>{appt.location}</span>
                </>
              )}
            </div>
          </div>
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

      {/* Note — full card width */}
      {appt.note && (
        <div className="mt-3 text-[0.8125rem] text-[var(--stone-500)] leading-[1.65] px-3 py-2 bg-[var(--cream)] rounded-md border-l-[2.5px] border-[var(--stone-300)]">{appt.note}</div>
      )}
    </article>
  );
}
