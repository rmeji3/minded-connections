import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function About() {
  return (
    <section id="about" className="section section--about">
      <div className="container grid-split about-grid">
        <Reveal className="about-text">
          <p className="eyebrow">About Dr. Hernandez</p>
          <h2>A psychiatrist who <em>listens first,</em> then acts.</h2>
          <p className="lead">
            With over 12 years in child and adolescent psychiatry, Dr. Michelle Hernandez brings both clinical rigor and genuine warmth to every appointment.
          </p>
          <p>
            Growing up has always been complicated — but today's children and teens are navigating pressures that previous generations never faced. Dr. Hernandez founded Minded Connections to offer families a practice that moves at the right pace: thorough evaluations, collaborative treatment plans, and real availability between sessions.
          </p>
          <p>
            Whether your child is struggling with anxiety, attention challenges, mood difficulties, or something harder to name, Dr. Hernandez works alongside the whole family to build understanding and lasting skills — not just symptom management.
          </p>

          <div className="credentials">
            <p className="credentials-eyebrow">Education &amp; Credentials</p>
            <ul>
              <li><span>Fellowship,</span> Child &amp; Adolescent Psychiatry — Harvard Medical School / Boston Children's Hospital</li>
              <li><span>Residency,</span> General Psychiatry — Massachusetts General Hospital</li>
              <li><span>Board Certified,</span> American Board of Psychiatry &amp; Neurology</li>
              <li><span>Member,</span> American Academy of Child &amp; Adolescent Psychiatry (AACAP)</li>
            </ul>
          </div>

          <Button asChild><a href="#book">Book a Consultation</a></Button>
        </Reveal>

        <Reveal className="about-photo">
          <div className="about-photo-offset" aria-hidden="true" />
          <div className="placeholder-photo placeholder-photo--portrait">
            <span className="ph-label">PORTRAIT</span>
            <span className="ph-detail">natural light · no white coat · 4:5</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
