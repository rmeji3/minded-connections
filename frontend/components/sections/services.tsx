import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Psychological Evaluations",
    body: "Psychological and educational evaluations including cognitive and neuropsychological testing, academic achievement, processing, and diagnostic assessments.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 8h20M6 14h20M6 20h14M6 26h10" /><circle cx="26" cy="22" r="3" /></svg>,
  },
  {
    title: "ADHD & Autism Assessments",
    body: "Evaluations for ADHD, autism spectrum disorder, and Asperger's syndrome, with clear findings to help families understand next steps.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="6" y="10" width="20" height="14" rx="3" /><path d="M16 4v6M11 4v6M21 4v6M11 17h10" /></svg>,
  },
  {
    title: "Learning Disability Testing",
    body: "Testing for learning disabilities including dyslexia and processing disorders so students receive the right support at school and beyond.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M16 28s-10-6-10-14a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 8-10 14-10 14z" /></svg>,
  },
  {
    title: "IEP & 504 Advocacy",
    body: "School advocacy and consultation to help families navigate IEPs, 504 plans, and school services so students get what they need.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="4" y="7" width="24" height="16" rx="2" /><path d="M12 27h8M16 23v4" /></svg>,
  },
  {
    title: "Behavioral Health Services",
    body: "Behavioral consultation, parent psychoeducation, and school advocacy to support meaningful progress at home, school, and work.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 26V8h24v18" /><path d="M4 26h24M11 14h10M11 20h6" /></svg>,
  },
  {
    title: "In-Person & Telehealth",
    body: "Available in Menifee, CA and online throughout California. Evaluations are scheduled throughout the week including weekdays, weekends, mornings, afternoons, and evenings.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="16" cy="16" r="11"/><path d="M16 10v6l4 2"/></svg>,
  },
];

export function Services() {
  return (
    <section id="services" className="section section--cream">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">What We Offer</p>
          <h2>What we <em>offer.</em></h2>
          <p className="lead">We specialize in psychological and educational evaluations, behavioral health services, parent psychoeducation, school advocacy, and consultation.</p>
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
