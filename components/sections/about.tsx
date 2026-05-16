import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";
import { OfficeGallery } from "@/components/sections/office-gallery";

export function About() {
  return (
    <section id="about" className="section section--about">
      <div className="container grid-split about-grid">
        <Reveal className="about-text">
          <p className="eyebrow">About Michelle Hernandez</p>
          <h2>An evaluator who <em>clarifies first,</em> then guides.</h2>
          <p className="lead">
            With 7 years of practice, Michelle Hernandez, LEP, Ed.S. brings both clinical rigor and genuine compassion to every evaluation.
          </p>
          <p>
            Families, students, and adults come to MindEd Connections seeking clarity — exploring autism, ADHD, learning disabilities, or emotional and behavioral concerns, or navigating 504 plans, IEPs, and school services. Michelle founded MindEd Connections to offer support that feels thorough, compassionate, and truly personalized.
          </p>
          <p>
            Whether you're seeking answers, guidance, or a partner in navigating the school system, Michelle walks with you every step of the way — helping you move forward with direction, skills, and confidence.
          </p>

          <div className="credentials">
            <p className="credentials-eyebrow">Education &amp; Credentials</p>
            <ul>
              <li><span>Ed.S.,</span> Educational Psychology / PPS Credential — California State University San Bernardino, 2019</li>
              <li><span>Certificate,</span> Board Certified Behavior Analyst — California State University San Marcos, 2024</li>
              <li><span>Licensed,</span> Educational Psychologist — State of California, LEP4734</li>
              <li><span>Licensed,</span> Board of Behavioral Sciences</li>
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
