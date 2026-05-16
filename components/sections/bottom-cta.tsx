import { Reveal } from "@/components/reveal";

export function BottomCta() {
  return (
    <section className="bottom-cta" aria-label="Final call to action">
      <Reveal>
        <div className="container bottom-cta-inner">
          <p className="eyebrow eyebrow--on-dark">You&rsquo;re in the right place.</p>
          <h2 className="bottom-cta-headline">Many people feel relief just <em>from reaching out.</em></h2>
          <p className="bottom-cta-sub">Let us take it from here — no referral needed, no long wait.</p>
          <div className="bottom-cta-actions">
            <a href="#book" className="btn-light">Book a Consultation</a>
            <a href="tel:9513388653" className="btn-phone">Or call <span className="phone-num">(951) 338-8653</span></a>
          </div>
          <ul className="bottom-cta-points" role="list">
            <li><span className="check" aria-hidden="true">✓</span> No referral required</li>
            <li><span className="check" aria-hidden="true">✓</span> Typically seen within 2–3 weeks</li>
            <li><span className="check" aria-hidden="true">✓</span> In-person &amp; telehealth options</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
