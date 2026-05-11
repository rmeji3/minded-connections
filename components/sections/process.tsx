import { Reveal } from "@/components/reveal";

const steps = [
  { n: "01", title: "Lorem Ipsum", body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque." },
  { n: "02", title: "Dolor Sit", body: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit consequuntur." },
  { n: "03", title: "Amet Consectetur", body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit." },
  { n: "04", title: "Adipiscing Elit", body: "Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam aliquid." },
];

export function Process() {
  return (
    <section id="process" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Lorem Ipsum</p>
          <h2>From <em>dolor sit amet</em> to consectetur.</h2>
          <p className="lead">Sed do eiusmod tempor incididunt ut labore et dolore.</p>
        </Reveal>

        <ol className="process-steps">
          {steps.map((s) => (
            <li className="step" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h4>{s.title}</h4>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
