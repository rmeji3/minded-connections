import { Reveal } from "@/components/reveal";

const steps = [
  { n: "01", title: "Submit an Inquiry", body: "Fill out the form below with your name and what you're looking for. We'll get back to you personally." },
  { n: "02", title: "Free 15-Minute Consultation", body: "We'll call to learn more, answer your questions, and schedule your evaluation appointment." },
  { n: "03", title: "Evaluation", body: "A thorough evaluation with Michelle. A written report with findings and recommendations follows." },
  { n: "04", title: "Ongoing Support", body: "Follow-up consultation, school advocacy, parent psychoeducation, or behavioral services as needed." },
];

export function Process() {
  return (
    <section id="process" className="section">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">How It Works</p>
          <h2>How it <em>works.</em></h2>
          <p className="lead">Call or email us for a free 15-minute consultation. No referral needed.</p>
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
