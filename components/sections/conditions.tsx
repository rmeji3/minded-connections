import { Reveal } from "@/components/reveal";

const tags = [
  "Lorem","Ipsum Dolor","Sit Amet","Consectetur","Adipiscing Elit","Sed Do","Eiusmod Tempor","Incididunt","Ut Labore","Et Dolore","Magna Aliqua","Ut Enim","Ad Minim Veniam","Quis Nostrud",
];

export function Conditions() {
  return (
    <section id="conditions" className="section section--cream">
      <div className="container container--narrow conditions-head">
        <Reveal>
          <p className="eyebrow">Lorem Ipsum</p>
          <h2>Dolor sit amet <em>consectetur.</em></h2>
          <p className="lead">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.
          </p>
        </Reveal>
      </div>
      <div className="container">
        <Reveal>
          <ul className="conditions-list" role="list">
            {tags.map((t) => (
              <li key={t}><a href="#" className="condition-tag">{t}</a></li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
