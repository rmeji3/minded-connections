import { Reveal } from "@/components/reveal";

const tags = [
  "ADHD","Autism Spectrum Disorder","Asperger's Syndrome","Learning Disabilities","Dyslexia","Intellectual Disability","Developmental Disorders","Emotional Disturbance","Behavioral Issues","Coping Skills","Peer Relationships","School Issues","IEP & 504 Advocacy","Parent Psychoeducation","Cognitive & Neuropsychological Testing",
];

export function Conditions() {
  return (
    <section id="conditions" className="section section--cream">
      <div className="container container--narrow conditions-head">
        <Reveal>
          <p className="eyebrow">Areas of Care</p>
          <h2>Evaluations across a wide range of <em>learning & behavioral needs.</em></h2>
          <p className="lead">
            Every person's profile is unique. These are the core areas we assess and support — if you don't see your concern listed, reach out anyway.
          </p>
        </Reveal>
      </div>
      <div className="container">
        <Reveal>
          <ul className="conditions-list" role="list">
            {tags.map((t) => (
              <li key={t}><a href="#book" className="condition-tag">{t}</a></li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
