import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Psychological Evaluations",
    body: "Comprehensive assessments covering cognitive ability, academic achievement, processing, and behavioral functioning — so the full picture comes first.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 8h20M6 14h20M6 20h14M6 26h10" /><circle cx="26" cy="22" r="3" /></svg>,
  },
  {
    title: "ADHD & Autism Assessments",
    body: "Thorough diagnostic evaluations for ADHD, autism spectrum disorder, Asperger's, and related developmental concerns — with clear, actionable findings.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="6" y="10" width="20" height="14" rx="3" /><path d="M16 4v6M11 4v6M21 4v6M11 17h10" /></svg>,
  },
  {
    title: "Learning Disability Testing",
    body: "Identifying dyslexia, dyscalculia, processing disorders, and other learning differences so students get the right support at school and beyond.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M16 28s-10-6-10-14a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 8-10 14-10 14z" /></svg>,
  },
  {
    title: "IEP & 504 Advocacy",
    body: "Guidance and advocacy to help families navigate school systems, understand evaluation results, and secure the services and accommodations students deserve.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="4" y="7" width="24" height="16" rx="2" /><path d="M12 27h8M16 23v4" /></svg>,
  },
  {
    title: "Behavioral Health Services",
    body: "Behavioral consultation and parent psychoeducation to address emotional disturbance, coping skills, peer relationships, and school behavior.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 26V8h24v18" /><path d="M4 26h24M11 14h10M11 20h6" /></svg>,
  },
  {
    title: "Telehealth & Consultation",
    body: "Available in-person and online throughout California. Evaluations and assessments are offered weekdays, weekends, mornings, afternoons, and evenings.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="16" cy="16" r="11"/><path d="M16 10v6l4 2"/></svg>,
  },
];

export function Services() {
  return (
    <section id="services" className="section section--cream">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">What We Offer</p>
          <h2>Care that meets you <em>where you are.</em></h2>
          <p className="lead">Every evaluation is thorough, compassionate, and personalized — designed to provide clarity and open doors, not just check boxes.</p>
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
