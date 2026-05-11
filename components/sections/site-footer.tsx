export function SiteFooter() {
  return (
    <footer role="contentinfo">
      <div className="container footer-grid">
        <div className="footer-col footer-brand-col">
          <p className="footer-brand">Lorem Ipsum, MD</p>
          <p className="footer-tag">Dolor sit amet consectetur adipiscing elit sed do.</p>
        </div>

        <nav className="footer-col" aria-label="Services">
          <p className="footer-eyebrow">Lorem</p>
          <ul>
            <li><a href="#services">Lorem Ipsum</a></li>
            <li><a href="#services">Dolor Sit Amet</a></li>
            <li><a href="#services">Consectetur</a></li>
            <li><a href="#services">Adipiscing</a></li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Practice">
          <p className="footer-eyebrow">Ipsum</p>
          <ul>
            <li><a href="#about">Lorem</a></li>
            <li><a href="#process">Dolor Sit</a></li>
            <li><a href="#faq">Amet</a></li>
            <li><a href="#">Consectetur</a></li>
          </ul>
        </nav>

        <div className="footer-col">
          <p className="footer-eyebrow">Dolor</p>
          <address>
            123 Lorem Ipsum Street<br />
            Dolor Sit, AM 12345<br />
            <a href="tel:5550000000" className="mono-num">(555) 000-0000</a><br />
            <a href="mailto:hello@example.com">hello@example.com</a>
          </address>
          <a href="#book" className="btn-text btn-text--on-dark">Lorem ipsum →</a>
        </div>
      </div>

      <div className="container footer-legal">
        <p>© 2026 Lorem Ipsum, MD · <a href="#">Privacy Policy</a> · <a href="#">HIPAA Notice</a> · <a href="#">Accessibility</a></p>
        <p className="crisis-line">
          Lorem ipsum dolor sit amet, call or text <a href="tel:988"><strong>988</strong></a> (consectetur adipiscing).
        </p>
      </div>
    </footer>
  );
}
