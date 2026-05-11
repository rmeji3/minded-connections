import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Psychiatric Evaluation",
    body: "A comprehensive, 90-minute assessment covering developmental history, behavioral patterns, school functioning, and family dynamics — so the full picture comes first.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 8h20M6 14h20M6 20h14M6 26h10" /><circle cx="26" cy="22" r="3" /></svg>,
  },
  {
    title: "Medication Management",
    body: "When medication is part of the plan, Dr. Hernandez prescribes conservatively, monitors closely, and always explains the reasoning in plain language you can trust.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="6" y="10" width="20" height="14" rx="3" /><path d="M16 4v6M11 4v6M21 4v6M11 17h10" /></svg>,
  },
  {
    title: "Individual Therapy",
    body: "Weekly or biweekly sessions drawing on CBT, DBT, and play-based approaches — tailored to your child's age, temperament, and goals.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M16 28s-10-6-10-14a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 8-10 14-10 14z" /></svg>,
  },
  {
    title: "Family Therapy",
    body: "Stronger family communication often changes everything. Sessions help parents and children build new language for difficult feelings and lasting connection.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="4" y="7" width="24" height="16" rx="2" /><path d="M12 27h8M16 23v4" /></svg>,
  },
  {
    title: "School Consultation",
    body: "Dr. Hernandez collaborates with teachers, counselors, and IEP teams to advocate for accommodations and support your child's success in the classroom.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 26V8h24v18" /><path d="M4 26h24M11 14h10M11 20h6" /></svg>,
  },
];

export function Services() {
  return (
    <section id="services" className="section section--cream">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">What We Offer</p>
          <h2>Care that meets your child <em>where they are.</em></h2>
          <p className="lead">Every service is designed around the whole child — not just a diagnosis or a checklist.</p>
        </Reveal>

        <ul className="services-grid" role="list">
          {services.map((s) => (
            <li className="service-card" key={s.title}>
              <Reveal>
                <span className="service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a href="#book" className="card-link">Get started <span aria-hidden="true">→</span><span className="sr-only"> with {s.title}</span></a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
