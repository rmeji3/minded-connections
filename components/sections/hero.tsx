import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section id="hero" aria-labelledby="hero-heading">
      <div className="hero-text-panel">
        <div className="hero-inner">
          <p className="hero-credential">Lorem Ipsum Dolor Sit Amet Consectetur</p>
          <h1 id="hero-heading">
            Lorem ipsum dolor sit amet consectetur <em>adipiscing elit.</em>
          </h1>
          <p className="lead hero-lead">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua — ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
          <div className="hero-cta-row">
            <Button asChild><a href="#book">Lorem Ipsum</a></Button>
            <a href="#about" className="btn-text">Dolor sit amet <span aria-hidden="true">→</span></a>
          </div>
          <div className="hero-trust">
            <span className="hero-trust-dot" aria-hidden="true" />
            <span>Lorem ipsum dolor · Sit amet consectetur</span>
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
