import { Reveal } from "@/components/reveal";

const tags = [
  "Anxiety","Depression","Bipolar Disorder","ADHD","OCD","PTSD","Panic Disorder","Social Anxiety","Mood Disorders","Schizophrenia","Psychosis","Insomnia","Grief & Loss","Trauma","Substance Use","Personality Disorders","Burnout","Life Transitions",
];

export function Conditions() {
  return (
    <section id="conditions" className="section section--cream">
      <div className="container container--narrow conditions-head">
        <Reveal>
          <p className="eyebrow">Areas of Care</p>
          <h2>We treat a wide range of <em>psychiatric conditions.</em></h2>
          <p className="lead">
            Every person's presentation is unique. These are some of the most common areas we support — if you don't see your concern listed, reach out anyway.
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
