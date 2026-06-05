"use client";

import { useState, useEffect } from "react";
import { PortalHeader } from "@/components/portal-header";
import { PortalFooter } from "@/components/portal-footer";
import { ApptCard } from "@/components/appt-card";
import { PastApptCard } from "@/components/past-appt-card";
import { CancelledCard } from "@/components/cancelled-card";
import { BookingWizard } from "@/components/booking/booking-wizard";
import { EditApptDialog } from "@/components/booking/edit-appt-dialog";
import { useBookingFlow } from "@/hooks/use-booking-flow";
import { getAppointments, getAppointmentStats, cancelAppointment, AppointmentDto, AppointmentStatsDto } from "@/lib/scheduling-api";
import type { Tab, Appointment, PastAppt, CancelledAppt, ApptGroup, PastGroup } from "@/lib/appointments-types";
import { toast } from "sonner";

// Helper to format ISO date strings for UI
function formatTimeRange(startStr: string, endStr: string) {
  const localStartStr = startStr.endsWith('Z') ? startStr.slice(0, -1) : startStr;
  const localEndStr = endStr.endsWith('Z') ? endStr.slice(0, -1) : endStr;
  const start = new Date(localStartStr);
  const end = new Date(localEndStr);
  const formatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
  return `${formatter.format(start)} - ${formatter.format(end)}`;
}

function getDurationStr(startStr: string, endStr: string) {
  const localStartStr = startStr.endsWith('Z') ? startStr.slice(0, -1) : startStr;
  const localEndStr = endStr.endsWith('Z') ? endStr.slice(0, -1) : endStr;
  const diff = new Date(localEndStr).getTime() - new Date(localStartStr).getTime();
  return `${Math.round(diff / 60000)} min`;
}

function getDow(d: Date) {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
}

function getMonthShort(d: Date) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][d.getMonth()];
}

export default function AppointmentsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [bookingOpen, setBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [stats, setStats] = useState<AppointmentStatsDto | null>(null);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);

  const booking = useBookingFlow();

  const openBooking = () => {
    booking.reset();
    setBookingOpen(true);
  };

  const load = async () => {
    try {
      const [apptsRes, statsRes] = await Promise.all([
        getAppointments({ pageSize: 100 }),
        getAppointmentStats()
      ]);
      setAppointments(apptsRes.items);
      setStats(statsRes);
    } catch (err) {
      console.error("Failed to load appointments data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appt: Appointment) => {
    if (!confirm("Are you sure you want to cancel this appointment?")) return;
    try {
      await cancelAppointment(appt.id);
      toast.success("Appointment cancelled successfully");
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to cancel appointment");
    }
  };

  const handleEditClick = (appt: Appointment) => {
    setEditingAppt(appt);
  };

  const handleRescheduleFromEdit = () => {
    if (!editingAppt) return;
    booking.reset();
    booking.setRescheduleApptId(editingAppt.id);
    // Copy the original fields so the wizard retains them
    booking.setNotes(editingAppt.note || "");
    const isTelehealth = !editingAppt.badges.some((b: any) => b.type === "in-person");
    booking.setVisitMode(isTelehealth ? "telehealth" : "in-person");
    booking.setVisitType(editingAppt.visitType || "Therapy Session");
    booking.setStep(2); // Skip straight to schedule step
    setBookingOpen(true);
  };

  useEffect(() => {
    load();
  }, []);

  const now = new Date();
  
  // Categorize
  const upcomingRaw = appointments.filter(a => {
    const localTimeStr = a.startsAt.endsWith('Z') ? a.startsAt.slice(0, -1) : a.startsAt;
    return a.status === "Scheduled" && new Date(localTimeStr) >= now;
  });
  const pastRaw = appointments.filter(a => {
    const localTimeStr = a.startsAt.endsWith('Z') ? a.startsAt.slice(0, -1) : a.startsAt;
    return (a.status === "Scheduled" && new Date(localTimeStr) < now) || a.status === "Completed" || a.status === "NoShow";
  });
  const cancelledRaw = appointments.filter(a => a.status === "Cancelled");

  const hasHadAnyPastVisit = pastRaw.length > 0;
  const hasPendingInitialVisit = upcomingRaw.length > 0 && !hasHadAnyPastVisit;
  const canBook = !hasPendingInitialVisit;

  const TABS: { id: Tab; label: string; count: number }[] = [
    { id: "upcoming",  label: "Upcoming",  count: upcomingRaw.length },
    { id: "past",      label: "Past",      count: pastRaw.length },
    { id: "cancelled", label: "Cancelled", count: cancelledRaw.length },
  ];

  // Map to UI groups
  const upcomingGrouped: ApptGroup[] = [];
  if (upcomingRaw.length > 0) {
    const group = { label: "Upcoming Appointments", range: "Next 30 days", items: upcomingRaw.map((a, idx) => {
      const d = new Date(a.startsAt);
      const isFirstEver = pastRaw.length === 0 && idx === 0;
      return {
        id: a.id,
        month: getMonthShort(d), day: d.getDate(), dow: getDow(d),
        title: a.visitType || "Therapy Session", 
        titleEm: "",
        badges: [
          { label: "Next Visit", type: "next" },
          { label: a.visitMode === "in-person" ? "In Person" : "Telehealth", type: a.visitMode === "in-person" ? "in-person" : "telehealth" }
        ] as any,
        timeRange: formatTimeRange(a.startsAt, a.endsAt),
        provider: "Dr. Provider", // Mock
        duration: getDurationStr(a.startsAt, a.endsAt),
        note: a.notes, primaryAction: (a.visitMode === "telehealth" ? "join" : "view") as "join" | "view",
        meetingUrl: a.meetingUrl,
      };
    })};
    upcomingGrouped.push(group);
  }

  const pastGrouped: PastGroup[] = [];
  if (pastRaw.length > 0) {
    const group = { label: "Past Appointments", count: pastRaw.length, items: pastRaw.map(a => {
      const d = new Date(a.startsAt);
      return {
        month: getMonthShort(d), day: d.getDate(), dow: getDow(d),
        title: a.visitType || "Therapy Session", titleEm: "",
        badges: [
          { label: "Completed", type: "completed" },
          { label: a.visitMode === "in-person" ? "In Person" : "Telehealth", type: a.visitMode === "in-person" ? "in-person" : "telehealth" }
        ] as any,
        timeRange: formatTimeRange(a.startsAt, a.endsAt),
        provider: "Dr. Provider",
        note: a.notes
      };
    })};
    pastGrouped.push(group);
  }

  const cancelledMapped: CancelledAppt[] = cancelledRaw.map(a => {
    const d = new Date(a.startsAt);
    return {
      month: getMonthShort(d), day: d.getDate(), dow: getDow(d),
      title: "Follow-up ", titleEm: "Visit",
      timeRange: formatTimeRange(a.startsAt, a.endsAt),
      provider: "Dr. Provider",
      reason: "Patient cancelled"
    };
  });

  let nextVisitValue: React.ReactNode = "None scheduled";
  let nextVisitSub = "Book a new appointment";
  if (stats?.nextVisit) {
    const d = new Date(stats.nextVisit.startsAt);
    const formatter = new Intl.DateTimeFormat("en-US", { weekday: "short", month: "short", day: "numeric" });
    const parts = formatter.formatToParts(d);
    const weekday = parts.find(p => p.type === 'weekday')?.value;
    const month = parts.find(p => p.type === 'month')?.value;
    const day = parts.find(p => p.type === 'day')?.value;
    
    nextVisitValue = <>{weekday}, <em style={{ fontStyle: "italic", color: "var(--sage-500)" }}>{month} {day}</em></>;
    
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });
    nextVisitSub = `In ${diffDays} day${diffDays !== 1 ? 's' : ''} · ${timeFormatter.format(d)}`;
  }

  const statsCards = stats ? [
    { eyebrow: "NEXT VISIT",       value: nextVisitValue,  sub: nextVisitSub },
    { eyebrow: "VISITS THIS YEAR", value: <>{stats.visitsThisYear}</>,  sub: `+ ${stats.sinceLastMonthCount} recently` },
    { eyebrow: "ATTENDANCE",       value: <>{stats.attendanceRate}%</>, sub: `${stats.reschedules} reschedules, ${stats.noShows} no-shows` },
    { eyebrow: "TELEHEALTH RATIO", value: <>{stats.telehealthVisits} / {stats.totalVisits}</>, sub: `${stats.totalVisits - stats.telehealthVisits} in-person` },
  ] : [
    { eyebrow: "NEXT VISIT",       value: "-", sub: "-" },
    { eyebrow: "VISITS THIS YEAR", value: "-", sub: "-" },
    { eyebrow: "ATTENDANCE",       value: "-", sub: "-" },
    { eyebrow: "TELEHEALTH RATIO", value: "-", sub: "-" },
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
              {canBook && (
                <button className="btn-primary w-full sm:w-auto" onClick={openBooking}>
                  + Book an appointment
                </button>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginBottom: "2rem" }}>
            {statsCards.map((stat, i) => (
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

          {/* ── Loading State ── */}
          {loading && (
            <div className="py-12 flex justify-center text-[var(--stone-500)] animate-pulse">
              Loading appointments...
            </div>
          )}

          {/* ── Upcoming ── */}
          {!loading && tab === "upcoming" && (
            <div className="wizard-step" style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "var(--sp-8)" }}>
              {upcomingGrouped.length === 0 && (
                stats?.totalVisits === 0 ? (
                  <div style={{ textAlign: "center", padding: "4rem 2rem", background: "white", borderRadius: 12, border: "1px dashed var(--stone-300)" }}>
                    <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--sage-100)", color: "var(--sage-600)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
                    </div>
                    <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", color: "var(--ink)", marginBottom: "0.5rem" }}>Welcome to MindEd Connections!</h3>
                    <p style={{ color: "var(--stone-600)", maxWidth: "42ch", margin: "0 auto 1.5rem", lineHeight: 1.6 }}>You haven't had any appointments yet. Let's get started by scheduling your Initial Consultation.</p>
                    <button className="btn-primary" onClick={openBooking}>
                      + Book Initial Consultation
                    </button>
                  </div>
                ) : (
                  <div className="text-[var(--stone-500)]">No upcoming appointments.</div>
                )
              )}
              {upcomingGrouped.map((group) => (
                <div key={group.label}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--linen)", paddingBottom: "0.5rem", marginBottom: "0.875rem" }}>
                    <span style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--ink)", fontFamily: "var(--font-body)" }}>{group.label}</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>{group.range}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {group.items.map((appt, i) => (
                      <ApptCard key={i} appt={appt} onEdit={handleEditClick} onCancel={handleCancel} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Past ── */}
          {!loading && tab === "past" && (
            <div className="wizard-step" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "var(--sp-8)" }}>
              {pastGrouped.length === 0 && <div className="text-[var(--stone-500)]">No past appointments.</div>}
              {pastGrouped.map((group) => (
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
          {!loading && tab === "cancelled" && (
            <div className="wizard-step" style={{ display: "flex", flexDirection: "column", gap: "2.5rem", paddingBottom: "var(--sp-8)" }}>
              {cancelledMapped.length === 0 && <div className="text-[var(--stone-500)]">No cancelled appointments.</div>}
              {cancelledMapped.length > 0 && (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", borderBottom: "1px solid var(--linen)", paddingBottom: "0.5rem", marginBottom: "0.875rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontSize: "1.125rem", color: "var(--ink)" }}>Cancelled Visits</span>
                    <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)" }}>{cancelledMapped.length} visit{cancelledMapped.length === 1 ? '' : 's'}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {cancelledMapped.map((appt, i) => <CancelledCard key={i} appt={appt} />)}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>

        <PortalFooter />
      </div>

      {/* ── Booking wizard (Radix Dialog + floating X) ── */}
      {bookingOpen && (
        <BookingWizard
          {...booking}
          isFirstVisit={stats?.totalVisits === 0}
          onClose={() => {
            setBookingOpen(false);
            if (booking.confirmed) {
              load();
            }
          }}
        />
      )}

      {/* ── Edit / Reschedule Dialog ── */}
      <EditApptDialog
        isOpen={!!editingAppt}
        onOpenChange={(open) => { if (!open) setEditingAppt(null); }}
        appt={editingAppt}
        onEdited={load}
        onRescheduleClick={handleRescheduleFromEdit}
      />
    </>
  );
}
