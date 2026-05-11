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
            With over 12 years in psychiatry, Dr. Michelle Hernandez brings both clinical rigor and genuine warmth to every appointment.
          </p>
          <p>
            Mental health care works best when the relationship between patient and provider is built on trust, time, and honest communication. Dr. Hernandez founded Minded Connections to offer a practice that moves at the right pace: thorough evaluations, collaborative treatment plans, and real availability between sessions.
          </p>
          <p>
            Whether you're navigating anxiety, a mood disorder, a difficult life transition, or something harder to name, Dr. Hernandez works alongside you to build understanding and lasting skills — not just symptom management.
          </p>

          <div className="credentials">
            <p className="credentials-eyebrow">Education &amp; Credentials</p>
            <ul>
              <li><span>Fellowship,</span> Psychiatry — Harvard Medical School / Massachusetts General Hospital</li>
              <li><span>Residency,</span> General Psychiatry — Massachusetts General Hospital</li>
              <li><span>Board Certified,</span> American Board of Psychiatry &amp; Neurology</li>
              <li><span>Member,</span> American Psychiatric Association (APA)</li>
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
