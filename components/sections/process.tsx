import { Reveal } from "@/components/reveal";

const steps = [
  { n: "01", title: "Submit an Inquiry", body: "Fill out a brief form with your name and the main concern. We read every submission personally — no automated filtering." },
  { n: "02", title: "Intake Call", body: "Within one business day, our care coordinator calls to learn more about you, answer your questions, and schedule your first appointment." },
  { n: "03", title: "First Appointment", body: "A relaxed, 90-minute evaluation with Dr. Hernandez. You are seen. You are heard. A written treatment plan follows within one week." },
  { n: "04", title: "Ongoing Care", body: "Regular sessions, medication check-ins, or both — continuously adjusted to match your progress and your evolving goals." },
];

export function Process() {
  return (
    <section id="process" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">How It Works</p>
          <h2>From first call to <em>lasting change.</em></h2>
          <p className="lead">We keep our intake process simple and human — no long waits, no impersonal portals.</p>
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
