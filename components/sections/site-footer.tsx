export function SiteFooter() {
  return (
    <footer role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-col footer-brand-col">
          <p className="footer-brand">MindEd Connections</p>
          <p className="footer-tag">Evaluations for people who want clarity and a partner in their journey.</p>
        </div>

        <nav className="footer-col" aria-label="Services">
          <p className="footer-eyebrow">Services</p>
          <ul>
            <li><a href="#services">Psychological Evaluations</a></li>
            <li><a href="#services">ADHD &amp; Autism Assessments</a></li>
            <li><a href="#services">Learning Disability Testing</a></li>
            <li><a href="#services">IEP &amp; 504 Advocacy</a></li>
            <li><a href="#services">Telehealth</a></li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Practice">
          <p className="footer-eyebrow">Practice</p>
          <ul>
            <li><a href="#about">About Michelle Hernandez</a></li>
            <li><a href="#process">How It Works</a></li>
            <li><a href="#conditions">Conditions We Treat</a></li>
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#">Patient Portal</a></li>
          </ul>
        </nav>

        <div className="footer-col">
          <p className="footer-eyebrow">Contact</p>
          <address>
            Menifee, CA 92584<br />
            <a href="tel:9513388653" className="mono-num">(951) 338-8653</a><br />
            <a href="mailto:hello@mindedconnections.com">hello@mindedconnections.com</a>
          </address>
          <a href="#book" className="btn-text btn-text--on-dark">Book a consultation →</a>
        </div>
      </div>

      <div className="container footer-legal">
        <p>© 2026 MindEd Connections · Michelle Hernandez, LEP, Ed.S. · LEP4734 · <a href="#">Privacy Policy</a> · <a href="#">HIPAA Notice</a> · <a href="#">Accessibility</a></p>
        <p className="crisis-line">
          If you or someone you know is in crisis, call or text <a href="tel:988"><strong>988</strong></a> (Suicide &amp; Crisis Lifeline), available 24/7.
        </p>
      </div>
    </footer>
  );
}
