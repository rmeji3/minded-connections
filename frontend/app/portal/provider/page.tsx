"use client";

import { PortalHeader } from "@/components/portal-header";
import { useAuth } from "@/hooks/use-auth";

type ActivePage = "overview" | "appointments" | "messages" | "medications" | "records" | "billing";

const PROVIDER_NAV_ITEMS: { label: string; id: ActivePage }[] = [
  { label: "Overview",      id: "overview"      },
  { label: "Appointments",  id: "appointments"  },
  { label: "Messages",      id: "messages"      },
  { label: "Records",       id: "records"       },
];

const UPCOMING = [
  { time: "9:00 am",  name: "Jordan Kim",      type: "Initial evaluation",   mode: "Telehealth" },
  { time: "10:30 am", name: "Sam Rivera",      type: "Follow-up · 30 min",   mode: "In person"  },
  { time: "1:00 pm",  name: "Taylor Brooks",   type: "Report review",        mode: "Telehealth" },
  { time: "3:00 pm",  name: "Casey Morgan",    type: "Initial evaluation",   mode: "In person"  },
];

const TASKS = [
  { text: "Sign evaluation report — Jordan Kim",    urgent: true  },
  { text: "Review intake form — New patient Fri",   urgent: false },
  { text: "Complete session notes from May 13",     urgent: true  },
  { text: "Renew telehealth consent — Sam Rivera",  urgent: false },
];

export default function ProviderPortalPage() {
  const { user } = useAuth();
  const firstName = user?.firstName ?? "there";

  return (
    <div style={{ background: "var(--cream)", minHeight: "100vh" }}>
      <PortalHeader activePage="overview" basePath="/portal/provider" />

      <main style={{ maxWidth: 1320, marginInline: "auto", padding: "var(--sp-8) clamp(1.25rem,4vw,2.5rem) 0" }}>

        {/* Greeting */}
        <section style={{ marginBottom: "2rem" }}>
          <span className="eyebrow" style={{ marginBottom: "0.5rem" }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </span>
          <h1 style={{ color: "var(--ink)", marginBottom: "0.75rem" }}>
            Good {greeting()}, <em>{firstName}</em>.
          </h1>
          <div className="flex flex-wrap items-center gap-3" style={{ fontSize: "0.9rem", color: "var(--stone-500)" }}>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", background: "var(--sage-50)", border: "1px solid var(--sage-200)", borderRadius: 100, fontSize: "0.8125rem", color: "var(--sage-600)" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sage-400)", display: "inline-block" }} />
              4 appointments today
            </span>
            <span>2 items need your attention</span>
          </div>
        </section>

        <div className="grid gap-4 sm:gap-5 items-start lg:grid-cols-[3fr_2fr]">

          {/* Left */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Today's schedule */}
            <section className="p-4 sm:p-6" style={{ background: "var(--warm-white)", border: "1px solid var(--linen)", borderRadius: 10 }}>
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Today&#39;s <em>schedule</em></h3>
                <a href="#" className="btn-text" style={{ fontSize: "0.875rem", flexShrink: 0 }}>Full calendar</a>
              </header>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {UPCOMING.map((appt, i) => (
                  <div
                    key={i}
                    style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 0", borderBottom: i < UPCOMING.length - 1 ? "1px solid var(--linen)" : "none" }}
                  >
                    <time style={{ fontFamily: "var(--font-detail)", fontSize: "0.8125rem", color: "var(--stone-500)", width: 60, flexShrink: 0 }}>{appt.time}</time>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "0.9rem", color: "var(--ink)", fontFamily: "var(--font-body)", marginBottom: "0.15rem" }}>{appt.name}</div>
                      <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>{appt.type}</div>
                    </div>
                    <span style={{ fontSize: "0.75rem", padding: "0.2rem 0.6rem", borderRadius: 100, background: appt.mode === "Telehealth" ? "var(--sage-50)" : "var(--linen)", color: appt.mode === "Telehealth" ? "var(--sage-600)" : "var(--stone-600)", border: `1px solid ${appt.mode === "Telehealth" ? "var(--sage-200)" : "var(--stone-200)"}`, flexShrink: 0, whiteSpace: "nowrap" }}>
                      {appt.mode}
                    </span>
                    <button style={{ padding: "0.4rem 0.875rem", borderRadius: 5, border: "1.5px solid var(--sage-400)", background: "var(--sage-500)", color: "white", fontSize: "0.8125rem", fontFamily: "var(--font-body)", cursor: "pointer", flexShrink: 0 }}>
                      Start
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent messages */}
            <section className="p-4 sm:p-6" style={{ background: "var(--warm-white)", border: "1px solid var(--linen)", borderRadius: 10 }}>
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Patient <em>messages</em></h3>
                <span style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>3 unread</span>
                  <a href="#" className="btn-text" style={{ fontSize: "0.875rem" }}>View all</a>
                </span>
              </header>
              {[
                { initials: "JK", name: "Jordan Kim",    preview: "Thank you for the report. I had a question about…",   time: "8:14 am",    unread: true  },
                { initials: "SR", name: "Sam Rivera",    preview: "Can we move Thursday's session to 11am instead?",     time: "Yesterday",  unread: true  },
                { initials: "TB", name: "Taylor Brooks", preview: "Got the consent form, signing now.",                  time: "May 13",     unread: false },
              ].map((msg, i, arr) => (
                <article key={i} style={{ display: "flex", gap: "0.875rem", padding: "0.875rem 0", borderBottom: i < arr.length - 1 ? "1px solid var(--linen)" : "none", cursor: "pointer" }}>
                  <span style={{ width: 38, height: 38, borderRadius: "50%", background: "var(--sage-100)", color: "var(--sage-700)", fontFamily: "var(--font-display)", fontSize: "0.9rem", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{msg.initials}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.2rem" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: msg.unread ? 500 : 400, color: "var(--ink)" }}>{msg.name}</span>
                      <time style={{ fontSize: "0.75rem", color: "var(--stone-500)", fontFamily: "var(--font-detail)", flexShrink: 0 }}>{msg.time}</time>
                    </div>
                    <div style={{ fontSize: "0.8125rem", color: "var(--stone-500)", overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{msg.preview}</div>
                  </div>
                  {msg.unread && <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sage-500)", flexShrink: 0, marginTop: "0.45rem" }} />}
                </article>
              ))}
            </section>
          </div>

          {/* Right */}
          <div className="flex flex-col gap-4 sm:gap-5">

            {/* Action items */}
            <section className="p-4 sm:p-6" style={{ background: "var(--warm-white)", border: "1px solid var(--linen)", borderRadius: 10 }}>
              <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <h3 style={{ color: "var(--ink)", margin: 0, fontSize: "1.25rem", lineHeight: 1.3 }}>Action <em>items</em></h3>
                <span style={{ fontSize: "0.8125rem", fontFamily: "var(--font-detail)", color: "var(--stone-500)" }}>{TASKS.filter(t => t.urgent).length} urgent</span>
              </header>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {TASKS.map((task, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "0.625rem" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: task.urgent ? "var(--color-error)" : "var(--sage-400)", flexShrink: 0, marginTop: "0.45rem" }} />
                    <span style={{ fontSize: "0.875rem", color: "var(--stone-700)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>{task.text}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Weekly summary */}
            <section className="p-4 sm:p-6" style={{ background: "var(--sage-700)", borderRadius: 10, color: "var(--warm-white)" }}>
              <div style={{ fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-300)", fontFamily: "var(--font-body)", fontWeight: 500, marginBottom: "0.5rem" }}>This week</div>
              <div className="grid grid-cols-3 gap-3" style={{ marginBottom: "1.25rem" }}>
                {[
                  { label: "Sessions",  value: "12" },
                  { label: "Reports",   value: "3"  },
                  { label: "New patients", value: "2" },
                ].map((s) => (
                  <div key={s.label}>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: "1.75rem", color: "var(--warm-white)", lineHeight: 1 }}>{s.value}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--sage-300)", marginTop: "0.25rem" }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <a href="#" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0.55rem 1.25rem", border: "1.5px solid rgba(228,235,226,.3)", borderRadius: 4, color: "var(--sage-200)", fontSize: "0.8125rem", textDecoration: "none", fontFamily: "var(--font-body)" }}>
                View full report
              </a>
            </section>
          </div>
        </div>
      </main>

      <footer className="portal-foot-wrap">
        <div className="portal-foot">
          <p className="crisis-band" style={{ margin: 0 }}>
            In crisis? Call or text <strong>988</strong> · This portal isn&#39;t monitored for emergencies.
          </p>
          <div>
            <a href="#">HIPAA notice</a> · <a href="#">Privacy</a> · <a href="#">Help</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}
