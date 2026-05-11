import { Reveal } from "@/components/reveal";

const quotes = [
  { q: "Dr. Hernandez took the time to truly understand what I was going through before offering any recommendations. That unhurried, thoughtful approach made all the difference.", c: "Patient, Corona CA" },
  { q: "I'd seen two other providers before Minded Connections. This was the first place where I actually wanted to come back.", c: "Patient, Riverside CA" },
  { q: "The sessions changed how I understand myself. I didn't expect that — and honestly, it's been the biggest shift of all.", c: "Patient, Corona CA" },
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
