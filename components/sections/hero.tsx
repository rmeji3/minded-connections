import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="hero-text-panel">
        <div className="hero-inner">
          <p className="hero-credential">Licensed Educational Psychologist · LEP, Ed.S.</p>
          <h1 id="hero-heading">
            Clarity for every learner, at every <em>stage of life.</em>
          </h1>
          <p className="lead hero-lead">
            MindEd Connections provides comprehensive psychological and educational evaluations — helping children, teens, and adults understand their strengths and move forward with confidence.
          </p>
          <div className="hero-cta-row">
            <Button asChild><a href="#book">Book a Consultation</a></Button>
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
          src="/office_3.jpeg"
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
