"use client";

import { MAY_AVAILABLE, TODAY_DAY, MORNING_SLOTS, AFTERNOON_SLOTS } from "@/lib/appointments-data";
import type { TimeSlot } from "@/lib/appointments-types";

interface Step2Props {
  selectedDate: number | null;
  setSelectedDate: (d: number) => void;
  selectedTime: string | null;
  setSelectedTime: (t: string) => void;
  onContinue: () => void;
  getDateLabel: (d: number) => string;
}

interface TimeSlotBtnProps {
  slot: TimeSlot;
  selected: boolean;
  onClick: () => void;
}

function TimeSlotBtn({ slot, selected, onClick }: TimeSlotBtnProps) {
  return (
    <button
      className="time-slot-btn"
      aria-pressed={selected}
      disabled={!slot.available}
      onClick={onClick}
    >
      {slot.label}
    </button>
  );
}

// May 2026: 31 days, starts on Friday (index 5)
const START_DOW = 5;
const TOTAL_DAYS = 31;
// Single-letter labels on mobile, 3-letter as aria
const DOW_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const DOW_FULL  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendarCells(): (number | null)[] {
  const cells: (number | null)[] = [];
  for (let i = 0; i < START_DOW; i++) cells.push(null);
  for (let d = 1; d <= TOTAL_DAYS; d++) cells.push(d);
  return cells;
}

const CALENDAR_CELLS = buildCalendarCells();

export function Step2Schedule({
  selectedDate, setSelectedDate,
  selectedTime, setSelectedTime,
  onContinue, getDateLabel,
}: Step2Props) {
  return (
    <div>
      <div
        className="rounded-xl border bg-white mb-4 p-4 sm:p-5"
        style={{ borderColor: "var(--linen)" }}
      >
        <span style={{ fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-500)", fontFamily: "var(--font-body)", fontWeight: 500 }}>STEP 2</span>
        <div style={{ fontFamily: "var(--font-display)", fontSize: "1.375rem", color: "var(--ink)", marginTop: "0.25rem", marginBottom: "0.25rem" }}>
          Pick a <em style={{ fontStyle: "italic" }}>date &amp; time</em>
        </div>
        <p style={{ fontSize: "0.875rem", color: "var(--stone-600)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
          Available slots for Dr. Hernandez · your local time zone.
        </p>

        {/* ── Calendar ── */}
        {/* Month header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--ink)" }}>May 2026</span>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            <button
              aria-label="Previous month"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--linen)", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-600)", fontSize: "1.125rem" }}
            >
              ‹
            </button>
            <button
              aria-label="Next month"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--linen)", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-600)", fontSize: "1.125rem" }}
            >
              ›
            </button>
          </div>
        </div>

        {/* Day-of-week headers — single letter, accessible full name via aria-label */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "0.25rem" }}>
          {DOW_SHORT.map((d, i) => (
            <div
              key={i}
              aria-label={DOW_FULL[i]}
              style={{
                textAlign: "center",
                fontSize: "0.75rem",
                color: "var(--stone-400)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                fontFamily: "var(--font-body)",
                padding: "0.25rem 0",
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Day grid — buttons fill cell width, aspect-ratio keeps them square */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
          {CALENDAR_CELLS.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;

            const isSelected  = selectedDate === day;
            const isToday     = day === TODAY_DAY;
            const isAvailable = MAY_AVAILABLE.has(day);

            return (
              <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button
                  onClick={() => isAvailable && setSelectedDate(day)}
                  aria-label={`May ${day}${!isAvailable ? " unavailable" : ""}`}
                  aria-pressed={isSelected}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    minHeight: 36,
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.875rem",
                    fontFamily: "var(--font-body)",
                    border: isToday && !isSelected ? "1.5px solid var(--sage-300)" : "1.5px solid transparent",
                    cursor: isAvailable ? "pointer" : "default",
                    transition: "all 150ms",
                    background: isSelected ? "var(--sage-700)" : "transparent",
                    color: isSelected
                      ? "white"
                      : isAvailable
                      ? "var(--ink)"
                      : "var(--stone-300)",
                  }}
                >
                  {day}
                </button>
                {/* availability dot */}
                {isAvailable && !isSelected
                  ? <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--sage-400)", display: "block", marginTop: 2, flexShrink: 0 }} />
                  : <span style={{ width: 4, height: 4, display: "block", marginTop: 2 }} />
                }
              </div>
            );
          })}
        </div>

        {/* ── Time slots ── */}
        <div style={{ marginTop: "1.25rem" }}>
          {/* Section header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.875rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--ink)" }}>
              {selectedDate ? (
                <>Times for <em style={{ fontStyle: "italic", color: "var(--sage-600)" }}>{getDateLabel(selectedDate)}</em></>
              ) : (
                <span style={{ color: "var(--stone-400)" }}>Select a date above</span>
              )}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--stone-400)", fontFamily: "var(--font-detail)", flexShrink: 0, marginLeft: "0.5rem" }}>PT · UTC-7</span>
          </div>

          {/* Morning */}
          <div style={{ marginBottom: "0.875rem" }}>
            <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--stone-400)", fontFamily: "var(--font-body)", marginBottom: "0.5rem" }}>
              Morning
            </div>
            {/* 3 cols on mobile, 4 on sm+ */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {MORNING_SLOTS.map((slot) => (
                <TimeSlotBtn
                  key={slot.label}
                  slot={slot}
                  selected={selectedTime === slot.label}
                  onClick={() => slot.available && setSelectedTime(slot.label)}
                />
              ))}
            </div>
          </div>

          {/* Afternoon */}
          <div>
            <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--stone-400)", fontFamily: "var(--font-body)", marginBottom: "0.5rem" }}>
              Afternoon
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {AFTERNOON_SLOTS.map((slot) => (
                <TimeSlotBtn
                  key={slot.label}
                  slot={slot}
                  selected={selectedTime === slot.label}
                  onClick={() => slot.available && setSelectedTime(slot.label)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn-primary"
          onClick={onContinue}
          disabled={!selectedTime}
          style={{ opacity: selectedTime ? 1 : 0.45, cursor: selectedTime ? "pointer" : "not-allowed" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

