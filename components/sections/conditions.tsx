import { Reveal } from "@/components/reveal";

const tags = [
  "Anxiety","ADHD","Depression","Autism Spectrum","OCD","PTSD","Behavioral Challenges","Mood Disorders","Sleep Difficulties","Eating Concerns","School Refusal","Social Anxiety","Panic Disorder","Oppositional Defiance","Selective Mutism","Trauma","Grief & Loss","Self-Harm",
];

export function Conditions() {
  return (
    <section id="conditions" className="section section--cream">
      <div className="container container--narrow conditions-head">
        <Reveal>
          <p className="eyebrow">Areas of Care</p>
          <h2>We treat a wide range of <em>childhood conditions.</em></h2>
          <p className="lead">
            Every child's presentation is unique. These are some of the most common areas we support — if you don't see your child's concern listed, reach out anyway.
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
