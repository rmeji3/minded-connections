import { Reveal } from "@/components/reveal";

export function BottomCta() {
  return (
    <section className="bottom-cta" aria-label="Final call to action">
      <Reveal>
        <div className="container bottom-cta-inner">
          <p className="eyebrow eyebrow--on-dark">Lorem Ipsum</p>
          <h2 className="bottom-cta-headline">Dolor sit amet <em>consectetur?</em></h2>
          <p className="bottom-cta-sub">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          <div className="bottom-cta-actions">
            <a href="#book" className="btn-light">Lorem Ipsum</a>
            <a href="tel:5550000000" className="btn-phone">Or call <span className="phone-num">(555) 000-0000</span></a>
          </div>
          <ul className="bottom-cta-points" role="list">
            <li><span className="check" aria-hidden="true">✓</span> Lorem ipsum dolor sit amet</li>
            <li><span className="check" aria-hidden="true">✓</span> Consectetur adipiscing elit sed</li>
            <li><span className="check" aria-hidden="true">✓</span> Do eiusmod tempor incididunt</li>
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
