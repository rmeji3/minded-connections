import { Reveal } from "@/components/reveal";

const quotes = [
  { q: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo.", c: "Lorem ipsum, dolor" },
  { q: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione.", c: "Sit amet, consectetur" },
  { q: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur adipisci velit, sed quia non numquam eius modi tempora incidunt.", c: "Adipiscing, elit" },
];

export function Testimonials() {
  return (
    <section className="section section--testimonials">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Lorem Ipsum</p>
          <h2>Dolor sit <em>amet consectetur.</em></h2>
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
        <p className="testimonial-note">Lorem ipsum dolor sit amet consectetur.</p>
      </div>
    </section>
  );
}
