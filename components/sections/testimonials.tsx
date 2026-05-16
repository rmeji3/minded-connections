import { Reveal } from "@/components/reveal";

const quotes = [
  { q: "Michelle took the time to truly understand what our son was going through before offering any recommendations. That unhurried, thoughtful approach made all the difference.", c: "Parent, Menifee CA" },
  { q: "We'd been to two other evaluators before MindEd Connections. This was the first place where we actually felt heard and left with real answers.", c: "Parent, Riverside CA" },
  { q: "The evaluation changed how I understand myself. I didn't expect that — and honestly, it's been the biggest shift of all.", c: "Adult client, Perris CA" },
];

export function Testimonials() {
  return (
    <section className="section section--testimonials">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">What Patients Say</p>
          <h2>Care that patients <em>remember and trust.</em></h2>
        </Reveal>
        <div className="testimonials-grid">
          {quotes.map((t, i) => (
            <Reveal key={i}>
              <figure className="testimonial">
                <blockquote><p>&ldquo;{t.q}&rdquo;</p></blockquote>
                <figcaption>— {t.c}</figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <p className="testimonial-note">All testimonials are shared with permission. Identifying details may be altered to protect privacy.</p>
      </div>
    </section>
  );
}
