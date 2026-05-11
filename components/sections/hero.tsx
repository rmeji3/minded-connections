import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="hero-text-panel">
        <div className="hero-inner">
          <p className="hero-credential">Board-Certified Child &amp; Adolescent Psychiatrist</p>
          <h1 id="hero-heading">
            Thoughtful mental health care for children and teens — <em>because growing up is hard.</em>
          </h1>
          <p className="lead hero-lead">
            Minded Connections offers evidence-based psychiatric care for ages 4–18, in a warm, unhurried practice built around your family's needs.
          </p>
          <div className="hero-cta-row">
            <Button asChild><a href="#book">Book a Free Consultation</a></Button>
            <a href="#about" className="btn-text">Learn how we can help <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-trust">
            <span className="hero-trust-dot" aria-hidden="true" />
            <span>Accepting new patients · In-person &amp; telehealth available</span>
          </div>
        </div>
      </div>

      <div className="hero-image" role="img" aria-label="A bright, plant-filled reading and seating area with bookshelves and natural light">
        <Image
          className="hero-image-photo"
          src="/office.png"
          alt=""
          fill
          priority
          sizes="45vw"
        />
        <div className="hero-image-tint" aria-hidden="true" />
        <div className="hero-image-fade" aria-hidden="true" />
      </div>
    </section>
  );
}
