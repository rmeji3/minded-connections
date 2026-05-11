export function SiteFooter() {
  return (
    <footer role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-col footer-brand-col">
          <p className="footer-brand">Minded Connections</p>
          <p className="footer-tag">Child &amp; adolescent psychiatry for families who want a partner in care.</p>
        </div>

        <nav className="footer-col" aria-label="Services">
          <p className="footer-eyebrow">Services</p>
          <ul>
            <li><a href="#services">Psychiatric Evaluation</a></li>
            <li><a href="#services">Medication Management</a></li>
            <li><a href="#services">Individual Therapy</a></li>
            <li><a href="#services">Family Therapy</a></li>
            <li><a href="#services">School Consultation</a></li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Practice">
          <p className="footer-eyebrow">Practice</p>
          <ul>
            <li><a href="#about">About Dr. Hernandez</a></li>
            <li><a href="#process">How It Works</a></li>
            <li><a href="#conditions">Conditions We Treat</a></li>
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#">Patient Portal</a></li>
          </ul>
        </nav>

        <div className="footer-col">
          <p className="footer-eyebrow">Contact</p>
          <address>
            1450 Magnolia Ave, Suite 210<br />
            Corona, CA 92879<br />
            <a href="tel:6175550142" className="mono-num">(617) 555-0142</a><br />
            <a href="mailto:hello@mindedconnections.com">hello@mindedconnections.com</a>
          </address>
          <a href="#book" className="btn-text btn-text--on-dark">Book a consultation →</a>
        </div>
      </div>

      <div className="container footer-legal">
        <p>© 2026 Minded Connections · Dr. Michelle Hernandez, MD · <a href="#">Privacy Policy</a> · <a href="#">HIPAA Notice</a> · <a href="#">Accessibility</a></p>
        <p className="crisis-line">
          If you or someone you know is in crisis, call or text <a href="tel:988"><strong>988</strong></a> (Suicide &amp; Crisis Lifeline) — available 24/7.
        </p>
      </div>
    </footer>
  );
}
