import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { OfficeGallery } from "@/components/sections/office-gallery";

export function About() {
  return (
    <section id="about" className="section section--about">
      <div className="container grid-split about-grid">
        <Reveal className="about-text">
          <p className="eyebrow">About Michelle Hernandez</p>
          <h2>Michelle Hernandez, <em>LEP, Ed.S.</em></h2>
          <p className="lead">
            I support children, teens, and adults facing learning, behavioral, or developmental challenges.
          </p>
          <p>
            Families, students, and adults come to us seeking clarity in their learning or behavioral health journey. Many are exploring autism, ADHD, learning disabilities, or emotional and behavioral concerns, or need support with 504 plans, IEPs, and school services.
          </p>
          <p>
            You deserve support that feels thorough, compassionate, and truly personalized. Whether you're seeking answers, guidance, or a partner in navigating the school system, we're here to walk with you every step of the way.
          </p>

          <div className="credentials">
            <p className="credentials-eyebrow">Education &amp; Credentials</p>
            <ul>
              <li><span>Ed.S.</span> Educational Psychology, PPS Credential, Cal State San Bernardino, 2019</li>
              <li><span>Certificate</span> of Advanced Study, Board Certified Behavior Analyst, Cal State San Marcos, 2024</li>
              <li><span>Licensed</span> Educational Psychologist, State of California, LEP4734</li>
              <li><span>Licensed,</span> Board of Behavioral Sciences, LEP4734 / 2025</li>
            </ul>
          </div>

          <Button asChild><a href="#book">Book a Consultation</a></Button>
        </Reveal>

        <Reveal className="about-photo">
          <OfficeGallery />
        </Reveal>
      </div>
    </section>
  );
}
