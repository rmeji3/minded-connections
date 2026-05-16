"use client";
import { useState } from "react";
import { PortalHeader } from "@/components/portal-header";

const TASKS = [
  { title: "Confirm Tuesday's appointment", meta: "Completed May 12", tag: null },
  { title: "Review updated consent form", meta: "Signed electronically May 10", tag: null },
  { title: "Complete PHQ-9 check-in", meta: "Takes about 3 minutes · due before Tuesday", tag: "urgent" },
  { title: "Upload updated insurance card", meta: "Front and back · for billing", tag: "optional" },
];

const MOOD_BARS = [28, 42, 55, 48, 35, 50, 62, 70, 58, 66, 72, 78, 74, 82];

/* ── shared card wrapper ── responsive padding via className ── */
const Card = ({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => (
  <section
    className={`p-4 sm:p-6 ${className}`}
    style={{ background: "var(--warm-white)", border: "1px solid var(--linen)", borderRadius: 10, ...style }}
  >
    {children}
  </section>
);

const CardHead = ({ children }: { children: React.ReactNode }) => (
  <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1.25rem" }}>
    {children}
  </header>
);

export default function PortalPage() {
  const [doneTasks, setDoneTasks] = useState(new Set([0, 1]));

  const toggleTask = (i: number) => {
    setDoneTasks((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const doneCount = doneTasks.size;

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <PortalHeader activePage="overview" />

      {/* ════════════════ Main ════════════════ */}
      <main style={{ maxWidth: 1320, marginInline: "auto", padding: "var(--sp-8) clamp(1.25rem,4vw,2.5rem) 0" }}>

        {/* Greeting */}
        <section style={{ marginBottom: "2rem" }}>
          <span className="eyebrow" style={{ marginBottom: "0.5rem" }}>Thursday, May 14</span>
          <h1 style={{ color: "var(--ink)", marginBottom: "0.75rem" }}>Good afternoon, <em>Sarah</em>.</h1>
          <div className="flex flex-wrap items-center gap-3" style={{ fontSize: "0.9rem", color: "var(--stone-500)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", background: "var(--sage-50)", border: "1px solid var(--sage-200)", borderRadius: 100, fontSize: "0.8125rem", color: "var(--sage-600)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sage-400)", display: "inline-block" }} />
              Care plan on track
            </span>
            <span>Last visit <span style={{ fontFamily: "var(--font-detail)", fontSize: "0.8125rem" }}>Apr 30, 2026</span></span>
            <span className="hidden sm:inline" style={{ color: "var(--linen)" }}>·</span>
            <span className="hidden sm:inline">2 things need your attention</span>
          </div>
        </section>

        {/* Two-column grid — stacks on mobile */}
        <div className="grid gap-4 sm:gap-5 items-start lg:grid-cols-[3fr_2fr]">

          {/* ── Left column ── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Messages */}
            <Card>
              <CardHead>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Secure <em>messages</em></h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexShrink: 0 }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>2 unread</span>
                  <a href="#" className="btn-text" style={{ fontSize: "0.875rem" }}>View all</a>
                </div>
              </CardHead>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  { avatar: "M", staff: false, from: "Michelle Hernandez, LEP, Ed.S.", subj: "Following up on your evaluation notes", snippet: "Thanks for sending those school records — let's plan to review findings together at our session Tuesday and go over next steps.", time: "9:42 am", unread: true },
                  { avatar: "R", staff: true, from: "Rae, Client Coordinator", subj: "Your evaluation report is ready", snippet: "Your report has been uploaded to the portal. Reply here if you'd like to schedule a feedback session to review the findings.", time: "Yesterday", unread: true },
                  { avatar: "M", staff: false, from: "Michelle Hernandez, LEP, Ed.S.", subj: "Session summary from Apr 30", snippet: "Attached your session summary and recommendations. Keep notes on the strategies we discussed — we'll revisit at our next appointment.", time: "May 1", unread: false },
                ].map((msg, i) => (
                  <article key={i} style={{ display: "flex", gap: "0.875rem", padding: "0.875rem 0", borderBottom: i < 2 ? "1px solid var(--linen)" : "none", cursor: "pointer" }}>
                    <div style={{ width: 38, height: 38, borderRadius: "50%", background: msg.staff ? "var(--linen)" : "var(--sage-100)", color: msg.staff ? "var(--stone-700)" : "var(--sage-700)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontSize: "0.95rem", flexShrink: 0 }}>{msg.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.2rem" }}>
                        <span style={{ fontSize: "0.875rem", fontWeight: msg.unread ? 500 : 400, color: "var(--ink)", fontFamily: "var(--font-body)" }}>{msg.from}</span>
                        <time style={{ fontSize: "0.75rem", color: "var(--stone-500)", flexShrink: 0, fontFamily: "var(--font-detail)" }}>{msg.time}</time>
                      </div>
                      <div style={{ fontSize: "0.875rem", fontWeight: msg.unread ? 500 : 400, color: msg.unread ? "var(--ink)" : "var(--stone-700)", marginBottom: "0.25rem" }}>{msg.subj}</div>
                      <div className="hidden sm:block" style={{ fontSize: "0.8125rem", color: "var(--stone-500)", lineHeight: 1.5, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}>{msg.snippet}</div>
                    </div>
                    {msg.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sage-500)", flexShrink: 0, marginTop: "0.45rem" }} />}
                  </article>
                ))}
              </div>
            </Card>

            {/* Medications */}
            <Card>
              <CardHead>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Medications</h3>
                <a href="#" className="btn-text" style={{ fontSize: "0.875rem", flexShrink: 0 }}>Manage all</a>
              </CardHead>
              <div>
                {[
                  { name: "Sertraline", brand: "Zoloft", dose: "50 mg", freq: "1 tablet, morning", refills: "2 left", low: false },
                  { name: "Bupropion XL", brand: "Wellbutrin", dose: "150 mg", freq: "1 tablet, morning", refills: "0 left", low: true },
                  { name: "Hydroxyzine", brand: "Vistaril", dose: "25 mg", freq: "As needed, evening", refills: "3 left", low: false },
                ].map((med, i, arr) => (
                  <div key={med.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", padding: "0.875rem 0", borderBottom: i < arr.length - 1 ? "1px solid var(--linen)" : "none" }}>
                    <div>
                      <div style={{ fontSize: "0.9375rem", color: "var(--ink)", fontFamily: "var(--font-body)", marginBottom: "0.2rem" }}>
                        {med.name}{" "}
                        <span style={{ color: "var(--stone-500)", fontWeight: 300, fontSize: "0.875rem" }}>({med.brand})</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1" style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>
                        <span style={{ fontFamily: "var(--font-detail)" }}>{med.dose}</span>
                        <span style={{ color: "var(--linen)" }}>·</span>
                        <span>{med.freq}</span>
                        <span className="hidden sm:inline" style={{ color: "var(--linen)" }}>·</span>
                        <span className="hidden sm:inline">Refills: <span style={{ fontFamily: "var(--font-detail)", color: med.low ? "var(--color-error)" : "var(--stone-700)" }}>{med.refills}</span></span>
                      </div>
                    </div>
                    <button style={{ padding: "0.45rem 0.875rem", borderRadius: 5, border: med.low ? "1.5px solid var(--sage-400)" : "1.5px solid var(--linen)", background: med.low ? "var(--sage-500)" : "transparent", color: med.low ? "white" : "var(--stone-700)", fontSize: "0.8125rem", fontFamily: "var(--font-body)", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 160ms" }}>
                      {med.low ? "Refill now" : "Request refill"}
                    </button>
                  </div>
                ))}
              </div>
            </Card>

            {/* Tasks */}
            <Card>
              <CardHead>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Before your <em>next visit</em></h3>
                <span style={{ fontSize: "0.8125rem", fontFamily: "var(--font-detail)", color: "var(--stone-500)", flexShrink: 0 }}>{doneCount} of {TASKS.length} done</span>
              </CardHead>
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {TASKS.map((task, i) => {
                  const done = doneTasks.has(i);
                  return (
                    <li
                      key={i}
                      onClick={() => toggleTask(i)}
                      style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.875rem 0", borderBottom: i < TASKS.length - 1 ? "1px solid var(--linen)" : "none", cursor: "pointer", opacity: done ? 0.6 : 1, transition: "opacity 200ms" }}
                    >
                      <span style={{ width: 20, height: 20, borderRadius: "50%", border: done ? "none" : "1.5px solid var(--stone-300)", background: done ? "var(--sage-500)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 200ms" }}>
                        {done && (
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                            <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: "0.9rem", color: "var(--ink)", textDecoration: done ? "line-through" : "none", fontFamily: "var(--font-body)" }}>{task.title}</div>
                        <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", marginTop: "0.15rem" }}>{task.meta}</div>
                      </div>
                      {task.tag === "urgent" && (
                        <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: 100, background: "rgba(166,60,46,.08)", color: "var(--color-error)", border: "1px solid rgba(166,60,46,.2)", flexShrink: 0 }}>Due soon</span>
                      )}
                      {task.tag === "optional" && (
                        <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: 100, background: "var(--sage-50)", color: "var(--sage-600)", border: "1px solid var(--sage-200)", flexShrink: 0 }}>Optional</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </Card>
          </div>

          {/* ── Right column ── */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Next appointment */}
            <aside className="p-4 sm:p-6" style={{ background: "var(--sage-700)", borderRadius: 10, color: "var(--warm-white)" }} aria-label="Next appointment">
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-300)", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "0.5rem" }}>Next appointment</div>
              <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--warm-white)", marginBottom: "0.5rem" }}>
                Tue, May 19 · <em>2:30 pm</em>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--sage-200)", marginBottom: "1.25rem" }}>
                Evaluation follow-up · 30 min · Telehealth with Michelle Hernandez
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="btn-primary" style={{ background: "var(--warm-white)", color: "var(--sage-700)", border: "2px solid transparent", minHeight: 40, padding: "0.55rem 1.25rem", fontSize: "0.8125rem" }}>Join visit</a>
                <a href="#" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.55rem 1.25rem", border: "1.5px solid rgba(228,235,226,.3)", borderRadius: 4, color: "var(--sage-200)", fontSize: "0.8125rem", textDecoration: "none", fontFamily: "var(--font-body)" }}>Reschedule</a>
              </div>
            </aside>

            {/* Mood check-in */}
            <Card>
              <CardHead>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>How you&#39;re <em>doing</em></h3>
                <span style={{ fontSize: "0.75rem", color: "var(--stone-500)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "var(--font-body)", flexShrink: 0 }}>Last 14 days</span>
              </CardHead>
              <div style={{ fontSize: "2rem", fontFamily: "var(--font-display)", color: "var(--ink)", marginBottom: "1rem" }}>
                9 <em>days</em> <small style={{ fontSize: "0.875rem", color: "var(--stone-500)", fontFamily: "var(--font-body)", fontStyle: "normal" }}>checked in</small>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 64, marginBottom: "0.5rem" }} aria-hidden="true">
                {MOOD_BARS.map((h, i) => (
                  <span key={i} style={{ flex: 1, height: `${h}%`, background: i === MOOD_BARS.length - 1 ? "var(--sage-500)" : "var(--sage-200)", borderRadius: 3 }} />
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--stone-500)", marginBottom: "1rem", fontFamily: "var(--font-detail)" }}>
                <span>May 1</span><span>May 14 · today</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.875rem", color: "var(--stone-700)" }}>
                  Mood trending{" "}
                  <em style={{ color: "var(--sage-500)", fontStyle: "italic", fontFamily: "var(--font-display)" }}>gently upward</em>
                </span>
                <button style={{ padding: "0.4rem 0.875rem", border: "1.5px solid var(--linen)", borderRadius: 5, background: "transparent", color: "var(--stone-700)", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>Log today</button>
              </div>
            </Card>

            {/* Care team */}
            <Card>
              <CardHead>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Your <em>care team</em></h3>
              </CardHead>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { initials: "MH", name: "Michelle Hernandez, LEP, Ed.S.", role: "Licensed Educational Psychologist · primary" },
                  { initials: "JL", name: "Jules Liu, LMFT", role: "Therapist · weekly check-ins" },
                  { initials: "R", name: "Rae Okafor", role: "Patient coordinator · scheduling & billing" },
                ].map((m) => (
                  <div key={m.initials} style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <span style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--sage-100)", color: "var(--sage-700)", fontFamily: "var(--font-display)", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{m.initials}</span>
                    <div>
                      <div style={{ fontSize: "0.9rem", color: "var(--ink)", fontFamily: "var(--font-body)", lineHeight: 1.4 }}>{m.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>{m.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Balance */}
            <Card style={{ background: "var(--sage-50)", border: "1px solid var(--sage-200)" }}>
              <CardHead>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Balance</h3>
                <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)", flexShrink: 0 }}>Statement May 1</span>
              </CardHead>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--ink)", lineHeight: 1 }}>
                  $72<span style={{ fontSize: "1.25rem" }}>.50</span>
                </span>
                <span style={{ fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--stone-500)", fontFamily: "var(--font-body)", fontWeight: 500 }}>Due May 28</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "var(--stone-700)", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                After insurance adjustment from Apr 30 visit. Auto-pay is currently{" "}
                <strong style={{ color: "var(--ink)", fontWeight: 500 }}>off</strong>.
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#" className="btn-primary" style={{ minHeight: 40, padding: "0.55rem 1.25rem", fontSize: "0.8125rem" }}>Pay balance</a>
                <a href="#" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.55rem 1.25rem", border: "1.5px solid var(--sage-200)", borderRadius: 4, color: "var(--sage-600)", fontSize: "0.8125rem", textDecoration: "none", fontFamily: "var(--font-body)" }}>Statement details</a>
              </div>
            </Card>
          </div>
        </div>
      </main>

      {/* ════════════════ Footer ════════════════ */}
      <footer className="portal-foot-wrap">
        <div className="portal-foot">
          <p className="crisis-band" style={{ margin: 0 }}>
            In crisis? Call or text <strong>988</strong> · This portal isn't monitored for emergencies.
          </p>
          <div>
            <a href="#">HIPAA notice</a> · <a href="#">Privacy</a> · <a href="#">Help</a> ·{" "}
            <a href="/login">Sign out</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
