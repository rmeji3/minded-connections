export function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Practice highlights">
      <div className="container trust-bar-inner">
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M4 12l5 5L20 6" /></svg>
          </span>
          <span>Accepting New Patients</span>
        </div>
        <div className="trust-divider" aria-hidden="true" />
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 9h18" /></svg>
          </span>
          <span>In-Person &amp; Telehealth</span>
        </div>
        <div className="trust-divider" aria-hidden="true" />
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
          </span>
          <span>12+ Years in Practice</span>
        </div>
        <div className="trust-divider" aria-hidden="true" />
        <div className="trust-item">
          <span className="trust-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.3"><path d="M12 21s-7-4.5-7-10a7 7 0 0 1 14 0c0 5.5-7 10-7 10z" /><circle cx="12" cy="11" r="2.5" /></svg>
          </span>
          <span>Corona, CA &amp; Surrounding Area</span>
        </div>
      </div>
    </section>
  );
}
