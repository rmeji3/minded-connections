interface ConfirmedViewProps {
  onBack: () => void;
}

export function ConfirmedView({ onBack }: ConfirmedViewProps) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", maxWidth: 480, marginInline: "auto" }}>
      <div
        style={{
          width: 64, height: 64, borderRadius: "50%", background: "var(--sage-500)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "1.25rem",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      </div>
      <div
        style={{
          fontFamily: "var(--font-display)", fontSize: "clamp(1.75rem,4vw,2.5rem)",
          color: "var(--ink)", marginBottom: "0.75rem", lineHeight: 1.2,
        }}
      >
        Appointment <em style={{ fontStyle: "italic", color: "var(--sage-500)" }}>confirmed!</em>
      </div>
      <p style={{ fontSize: "1rem", color: "var(--stone-700)", marginBottom: "1.75rem", lineHeight: 1.7, marginInline: "auto" }}>
        You&apos;re all set. A confirmation has been sent to your email, and the visit will appear in your portal 15 minutes before start time.
      </p>
      <button className="btn-primary" onClick={onBack}>
        Back to appointments
      </button>
    </div>
  );
}
