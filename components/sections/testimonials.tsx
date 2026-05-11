import { Reveal } from "@/components/reveal";

const quotes = [
  { q: "Dr. Hernandez took the time to truly understand our daughter before offering any recommendations. That unhurried, thoughtful approach made all the difference for our family.", c: "Parent of a 9-year-old" },
  { q: "We'd seen three other providers before Minded Connections. This was the first place where our son actually wanted to come back.", c: "Parent of a 14-year-old" },
  { q: "The family sessions changed how we talk to each other at home. I didn't expect that — and honestly, it's been the biggest shift of all.", c: "Parent of an 11-year-old" },
];

export function Testimonials() {
  return (
    <section className="section section--testimonials">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">What Families Say</p>
          <h2>Care that families <em>remember and trust.</em></h2>
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
