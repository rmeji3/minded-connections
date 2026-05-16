"use client";

interface Step3Props {
  notes: string;
  setNotes: (v: string) => void;
  onContinue: () => void;
}

export function Step3Notes({ notes, setNotes, onContinue }: Step3Props) {
  return (
    <div
      style={{
        background: "white", border: "1px solid var(--linen)",
        borderRadius: 12, padding: "1.5rem",
      }}
    >
      <span style={{ fontSize: "0.6875rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--sage-500)", fontFamily: "var(--font-body)", fontWeight: 500 }}>STEP 3</span>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", color: "var(--ink)", marginTop: "0.25rem", marginBottom: "0.375rem" }}>
        Anything we should <em style={{ fontStyle: "italic" }}>know</em>?
      </div>
      <p style={{ fontSize: "0.9rem", color: "var(--stone-600)", margin: "0 0 1.25rem", lineHeight: 1.6 }}>
        A few words helps Michelle prepare. Completely optional.
      </p>

      <label
        htmlFor="appt-notes"
        style={{ display: "block", fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)", fontFamily: "var(--font-body)", marginBottom: "0.5rem" }}
      >
        What would you like to focus on?
      </label>
      <textarea
        id="appt-notes"
        rows={5}
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="e.g. Sleep has been better since the dose change, but afternoon energy is still low — want to revisit timing."
        style={{
          width: "100%", fontFamily: "var(--font-body)", fontSize: "0.9375rem",
          color: "var(--ink)", background: "var(--warm-white)", border: "1.5px solid var(--linen)",
          borderRadius: 8, padding: "0.8rem 1rem", resize: "vertical", lineHeight: 1.7, outline: "none",
        }}
      />
      <p style={{ fontSize: "0.8125rem", color: "var(--stone-500)", marginTop: "0.5rem", marginBottom: "1.5rem" }}>
        Encrypted &amp; visible only to your care team.{" "}
        <a href="#" style={{ color: "var(--sage-500)" }}>HIPAA notice</a>
      </p>

      <button className="btn-primary" onClick={onContinue} style={{ width: "100%" }}>
        Continue →
      </button>
    </div>
  );
}
