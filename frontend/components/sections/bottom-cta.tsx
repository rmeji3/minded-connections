import { Reveal } from "@/components/reveal";

export function BottomCta() {
  return (
    <section className="bottom-cta" aria-label="Final call to action">
      <Reveal>
        <div className="container bottom-cta-inner">
          <p className="eyebrow eyebrow--on-dark">Free 15-minute consultation</p>
          <h2 className="bottom-cta-headline">When you&rsquo;re ready, we&rsquo;d be <em>honored to help.</em></h2>
          <p className="bottom-cta-sub">Call or email MindEd Connections to take the next step toward clarity and growth.</p>
          <div className="bottom-cta-actions">
            <a href="#book" className="btn-light">Book a Consultation</a>
            <a href="tel:9513388653" className="btn-phone">Or call <span className="phone-num">(951) 338-8653</span></a>
          </div>
          <ul className="bottom-cta-points" role="list">
            <li><span className="check" aria-hidden="true">✓</span> No referral required</li>
            <li><span className="check" aria-hidden="true">✓</span> Individuals, families, and groups</li>
            <li><span className="check" aria-hidden="true">✓</span> In-person &amp; telehealth available</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
