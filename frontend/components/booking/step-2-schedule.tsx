"use client";

import { useState, useEffect, useMemo } from "react";
import type { VisitMode } from "@/lib/appointments-types";
import { getAvailableSlots, SlotDto } from "@/lib/scheduling-api";

interface Step2Props {
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  selectedSlot: SlotDto | null;
  setSelectedSlot: (s: SlotDto | null) => void;
  onContinue: () => void;
  getDateLabel: (d: Date) => string;
}

interface TimeSlotBtnProps {
  slot: SlotDto;
  selected: boolean;
  onClick: () => void;
}

function formatTime(isoString: string) {
  const localTimeStr = isoString.endsWith('Z') ? isoString.slice(0, -1) : isoString;
  return new Date(localTimeStr).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function TimeSlotBtn({ slot, selected, onClick }: TimeSlotBtnProps) {
  return (
    <button
      className="time-slot-btn"
      aria-pressed={selected}
      onClick={onClick}
    >
      {formatTime(slot.startsAt)}
    </button>
  );
}

const DOW_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const DOW_FULL  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function Step2Schedule({
  selectedDate, setSelectedDate,
  selectedSlot, setSelectedSlot,
  onContinue, getDateLabel,
}: Step2Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  
  const [slots, setSlots] = useState<SlotDto[]>([]);
  const [loading, setLoading] = useState(false);
  const providerId = "00000000-0000-0000-0000-000000000000"; // Dummy provider ID until patient has an assigned provider

  useEffect(() => {
    // Fetch slots for the current month view (from 1st to end of month + some buffer)
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const now = new Date();
        const firstOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
        const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
        
        if (endOfMonth <= now) {
          setSlots([]);
          return;
        }

        const fromDate = firstOfMonth < now ? now : firstOfMonth;
        const from = fromDate.toISOString();
        const to = endOfMonth.toISOString();
        const data = await getAvailableSlots(providerId, from, to);
        setSlots(data);
      } catch (err) {
        console.error("Failed to fetch slots", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [currentMonth]);

  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const startDow = currentMonth.getDay();

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDow; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [daysInMonth, startDow]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Group slots by date string YYYY-MM-DD
  const slotsByDate = useMemo(() => {
    const map = new Map<string, SlotDto[]>();
    for (const slot of slots) {
      const dateStr = slot.startsAt.split('T')[0];
      if (!map.has(dateStr)) map.set(dateStr, []);
      map.get(dateStr)!.push(slot);
    }
    return map;
  }, [slots]);

  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : null;
  const selectedDaySlots = selectedDateStr ? slotsByDate.get(selectedDateStr) || [] : [];
  
  // Filter out slots that have already passed (if viewing today)
  const futureSlots = selectedDaySlots.filter(s => {
    // Treat the API's time as local time by stripping the 'Z' if present
    const localTimeStr = s.startsAt.endsWith('Z') ? s.startsAt.slice(0, -1) : s.startsAt;
    return new Date(localTimeStr) > new Date();
  });

  const morningSlots = futureSlots.filter(s => {
    const localTimeStr = s.startsAt.endsWith('Z') ? s.startsAt.slice(0, -1) : s.startsAt;
    return new Date(localTimeStr).getHours() < 12;
  });
  const afternoonSlots = futureSlots.filter(s => {
    const localTimeStr = s.startsAt.endsWith('Z') ? s.startsAt.slice(0, -1) : s.startsAt;
    return new Date(localTimeStr).getHours() >= 12;
  });

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
          Available slots for Michelle Hernandez · your local time zone.
        </p>

        {/* ── Calendar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.875rem" }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--ink)" }}>
            {currentMonth.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
          </span>
          <div style={{ display: "flex", gap: "0.375rem" }}>
            <button
              onClick={prevMonth}
              aria-label="Previous month"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--linen)", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-600)", fontSize: "1.125rem" }}
            >
              ‹
            </button>
            <button
              onClick={nextMonth}
              aria-label="Next month"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--linen)", background: "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--stone-600)", fontSize: "1.125rem" }}
            >
              ›
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: "0.25rem" }}>
          {DOW_SHORT.map((d, i) => (
            <div
              key={i}
              aria-label={DOW_FULL[i]}
              style={{ textAlign: "center", fontSize: "0.75rem", color: "var(--stone-400)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-body)", padding: "0.25rem 0" }}
            >
              {d}
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, opacity: loading ? 0.5 : 1, transition: "opacity 150ms", pointerEvents: loading ? "none" : "auto" }}>
          {calendarCells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;

            const cellDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            const dateStr = cellDate.toISOString().split('T')[0];
            const isSelected  = selectedDateStr === dateStr;
            const isToday     = cellDate.getTime() === today.getTime();
            const isPast      = cellDate < today;
            const availableCount = slotsByDate.get(dateStr)?.length || 0;
            const isAvailable = availableCount > 0 && !isPast;

            return (
              <div key={day} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <button
                  onClick={() => {
                    if (isAvailable) {
                      setSelectedDate(cellDate);
                      setSelectedSlot(null);
                    }
                  }}
                  disabled={isPast}
                  aria-label={`${cellDate.toLocaleDateString()}${!isAvailable ? " unavailable" : ""}`}
                  aria-pressed={isSelected}
                  style={{
                    width: "100%", aspectRatio: "1", minHeight: 36, borderRadius: "50%",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", fontFamily: "var(--font-body)",
                    border: isToday && !isSelected ? "1.5px solid var(--sage-300)" : "1.5px solid transparent",
                    cursor: isAvailable ? "pointer" : (isPast ? "not-allowed" : "default"),
                    transition: "all 150ms",
                    background: isSelected ? "var(--sage-700)" : "transparent",
                    color: isSelected ? "white" : isPast ? "var(--stone-200)" : isAvailable ? "var(--ink)" : "var(--stone-300)",
                  }}
                >
                  {day}
                </button>
                {isAvailable && !isSelected
                  ? <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--sage-400)", display: "block", marginTop: 2, flexShrink: 0 }} />
                  : <span style={{ width: 4, height: 4, display: "block", marginTop: 2 }} />
                }
              </div>
            );
          })}
        </div>

        {/* ── Time slots ── */}
        <div style={{ marginTop: "1.25rem", minHeight: "150px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "0.875rem" }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1rem", color: "var(--ink)" }}>
              {selectedDate ? (
                <>Times for <em style={{ fontStyle: "italic", color: "var(--sage-600)" }}>{getDateLabel(selectedDate)}</em></>
              ) : (
                <span style={{ color: "var(--stone-400)" }}>Select a date above</span>
              )}
            </span>
            <span style={{ fontSize: "0.75rem", color: "var(--stone-400)", fontFamily: "var(--font-detail)", flexShrink: 0, marginLeft: "0.5rem" }}>Local Time</span>
          </div>

          {loading && (
            <div className="animate-pulse">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ height: "42px", borderRadius: "8px", border: "1.5px solid var(--linen)", background: "var(--cream)" }} />
                ))}
              </div>
            </div>
          )}

          {!loading && selectedDate && selectedDaySlots.length === 0 && (
            <div style={{ fontSize: "0.875rem", color: "var(--stone-500)" }}>No slots available on this date.</div>
          )}

          {!loading && morningSlots.length > 0 && (
            <div style={{ marginBottom: "0.875rem" }}>
              <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--stone-400)", fontFamily: "var(--font-body)", marginBottom: "0.5rem" }}>Morning</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {morningSlots.map((slot) => (
                  <TimeSlotBtn key={slot.id} slot={slot} selected={selectedSlot?.id === slot.id} onClick={() => setSelectedSlot(slot)} />
                ))}
              </div>
            </div>
          )}

          {!loading && afternoonSlots.length > 0 && (
            <div>
              <div style={{ fontSize: "0.6875rem", textTransform: "uppercase", letterSpacing: "0.12em", color: "var(--stone-400)", fontFamily: "var(--font-body)", marginBottom: "0.5rem" }}>Afternoon</div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                {afternoonSlots.map((slot) => (
                  <TimeSlotBtn key={slot.id} slot={slot} selected={selectedSlot?.id === slot.id} onClick={() => setSelectedSlot(slot)} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
          className="btn-primary"
          onClick={onContinue}
          disabled={!selectedSlot}
          style={{ opacity: selectedSlot ? 1 : 0.45, cursor: selectedSlot ? "pointer" : "not-allowed" }}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
