"use client";

import { useState } from "react";
import { PortalHeader } from "@/components/portal-header";
import { PortalFooter } from "@/components/portal-footer";
import { ApptCard } from "@/components/appt-card";
import { PastApptCard } from "@/components/past-appt-card";
import { CancelledCard } from "@/components/cancelled-card";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { UPCOMING_GROUPS, PAST_GROUPS, CANCELLED_ITEMS } from "@/lib/appointments-data";
import type { Tab } from "@/lib/appointments-types";

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [bookingOpen, setBookingOpen] = useState(false);

  const booking = useBookingFlow();

  const openBooking = () => {
    booking.reset();
    setBookingOpen(true);
  };

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming",  label: "Upcoming",  count: 3 },
    { id: "past",      label: "Past",      count: 11 },
    { id: "cancelled", label: "Cancelled", count: 1 },
  ];

  return (
    <>
      <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
        <PortalHeader activePage="appointments" />

        <main style={{ maxWidth: 1320, marginInline: "auto", padding: "var(--sp-8) clamp(1.25rem,4vw,2.5rem) 0" }}>

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" style={{ marginBottom: "1.5rem" }}>
            <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-body)" }}>
              <a href="/portal" style={{ color: "var(--stone-500)", textDecoration: "none" }}>Portal</a>
              <span style={{ margin: "0 0.4rem" }}>/</span>
              <span style={{ color: "var(--ink)" }}>Appointments</span>
            </span>
          </nav>

          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4" style={{ marginBottom: "2rem" }}>
            <div>
              <span className="eyebrow">Appointments</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,5vw,3.5rem)", color: "var(--ink)", lineHeight: 1.1, letterSpacing: "-0.015em", marginBottom: "0.5rem" }}>
                Your <em style={{ fontStyle: "italic", color: "var(--sage-500)" }}>visits</em>.
              </div>
              <p style={{ fontSize: "1rem", color: "var(--stone-700)", margin: 0, maxWidth: "54ch", lineHeight: 1.7 }}>
                Upcoming visits, past sessions, and cancelled appointments. Need a new time? Pick one from open slots.
              </p>
            </div>
            <div className="sm:flex-shrink-0 w-full sm:w-auto">
              <button className="btn-primary w-full sm:w-auto" onClick={openBooking}>
                + Book an appointment
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginBottom: "2rem" }}>
            {[
              { eyebrow: "NEXT VISIT",       value: <>Tue, <em style={{ fontStyle: "italic", color: "var(--sage-500)" }}>May 19</em></>,  sub: "In 5 days · 2:30 pm" },
              { eyebrow: "VISITS THIS YEAR", value: <>14</>,  sub: "+ 2 since April" },
              { eyebrow: "ATTENDANCE",       value: <>96%</>, sub: "1 reschedule, 0 no-shows" },
              { eyebrow: "TELEHEALTH RATIO", value: <>11 / 14</>, sub: "3 in-person at Menifee office" },
            ].map((stat, i) => (
              <div key={i} style={{ background: "white", border: "1px solid var(--linen)", borderRadius: 10, padding: "1rem" }}>
                <div style={{ fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--stone-500)", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "0.5rem" }}>
                  {stat.eyebrow}
                </div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", color: "var(--ink)", lineHeight: 1, marginBottom: "0.4rem" }}>
                  {stat.value}
                </div>
                <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>
                  {stat.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Tab bar */}
          <div style={{ marginBottom: "1.75rem" }}>
            <div className="flex items-center gap-0" style={{ paddingBottom: 2 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "inline-flex", background: "white", border: "1px solid var(--linen)", borderRadius: 100, padding: "3px", gap: 2 }}>
                  {TABS.map((t) => {
                    const active = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        style={{
                          display: "inline-flex", alignItems: "center", gap: "0.4rem",
                          padding: "0.45rem 1rem", borderRadius: 100, border: "none",
                          background: active ? "var(--sage-700)" : "transparent",
                          color: active ? "white" : "var(--stone-600)",
                          fontSize: "0.875rem", fontFamily: "var(--font-body)",
                          cursor: "pointer", whiteSpace: "nowrap",
                          fontWeight: active ? 500 : 400, transition: "all 150ms",
                        }}
                      >
                        {t.label}
                        <span style={{ fontSize: "0.75rem", opacity: 0.75, fontFamily: "var(--font-detail)" }}>{t.count}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <span className="hidden sm:inline" style={{ fontSize: "0.8125rem", fontFamily: "var(--font-body)", color: "var(--stone-500)", whiteSpace: "nowrap", paddingLeft: "1rem" }}>
                Time zone <span style={{ fontFamily: "var(--font-detail)" }}>Pacific (UTC-7)</span>
              </span>
            </div>
            <div className="flex justify-end sm:hidden" style={{ marginTop: "0.5rem" }}>
              <span style={{ fontSize: "0.8125rem", fontFamily: "var(--font-body)", color: "var(--stone-500)" }}>
                Time zone <span style={{ fontFamily: "var(--font-detail)" }}>Pacific (UTC-7)</span>
              </span>
            </div>
          </div>

          {/* ── Upcoming ── */}
          {tab === "upcoming" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "var(--sp-8)" }}>
              {UPCOMING_GROUPS.map((group) => (
                <div key={group.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--linen)", paddingBottom: "0.5rem", marginBottom: "0.875rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", fontFamily: "var(--font-body)" }}>{group.label}</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>{group.range}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {group.items.map((appt, i) => <ApptCard key={i} appt={appt} />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Past ── */}
          {tab === "past" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "var(--sp-8)" }}>
              {PAST_GROUPS.map((group) => (
                <div key={group.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--linen)", paddingBottom: "0.5rem", marginBottom: "0.875rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--ink)" }}>{group.label}</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>{group.count} {group.count === 1 ? "visit" : "visits"}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {group.items.map((appt, i) => <PastApptCard key={i} appt={appt} />)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Cancelled ── */}
          {tab === "cancelled" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "var(--sp-8)" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--linen)", paddingBottom: "0.5rem", marginBottom: "0.875rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--ink)" }}>March 2026</span>
                  <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>1 visit</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {CANCELLED_ITEMS.map((appt, i) => <CancelledCard key={i} appt={appt} />)}
                </div>
              </div>
            </div>
          )}

        </main>

        <PortalFooter />
      </div>

      {/* ── Booking wizard (Radix Dialog + floating X) ── */}
      {bookingOpen && (
        <BookingWizard
          {...booking}
          onClose={() => setBookingOpen(false)}
        />
      )}
    </>
  );
}
