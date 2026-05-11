import { Reveal } from "@/components/reveal";

export function BottomCta() {
  return (
    <section className="bottom-cta" aria-label="Final call to action">
      <Reveal>
        <div className="container bottom-cta-inner">
          <p className="eyebrow eyebrow--on-dark">You&rsquo;re in the right place.</p>
          <h2 className="bottom-cta-headline">The first step is the <em>hardest part.</em></h2>
          <p className="bottom-cta-sub">Many families feel relief just from reaching out. Let us take it from here.</p>
          <div className="bottom-cta-actions">
            <a href="#book" className="btn-light">Book a Consultation</a>
            <a href="tel:6175550142" className="btn-phone">Or call <span className="phone-num">(617) 555-0142</span></a>
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
