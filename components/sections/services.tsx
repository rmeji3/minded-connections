import { Reveal } from "@/components/reveal";

const services = [
  {
    title: "Lorem Ipsum",
    body: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M6 8h20M6 14h20M6 20h14M6 26h10" /><circle cx="26" cy="22" r="3" /></svg>,
  },
  {
    title: "Dolor Sit Amet",
    body: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit consequuntur magni dolores eos.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="6" y="10" width="20" height="14" rx="3" /><path d="M16 4v6M11 4v6M21 4v6M11 17h10" /></svg>,
  },
  {
    title: "Consectetur Elit",
    body: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet consectetur adipisci velit sed quia.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M16 28s-10-6-10-14a6 6 0 0 1 10-4 6 6 0 0 1 10 4c0 8-10 14-10 14z" /></svg>,
  },
  {
    title: "Adipiscing Sed",
    body: "Ut enim ad minima veniam quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid commodi.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><rect x="4" y="7" width="24" height="16" rx="2" /><path d="M12 27h8M16 23v4" /></svg>,
  },
  {
    title: "Tempor Incididunt",
    body: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.",
    icon: <svg viewBox="0 0 32 32" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M4 26V8h24v18" /><path d="M4 26h24M11 14h10M11 20h6" /></svg>,
  },
];

export function Services() {
  return (
    <section id="services" className="section section--cream">
      <div className="container">
        <Reveal className="section-head">
          <p className="eyebrow">Lorem Ipsum</p>
          <h2>Dolor sit amet, <em>consectetur</em> adipiscing.</h2>
          <p className="lead">Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim.</p>
        </Reveal>

        <ul className="services-grid" role="list">
          {services.map((s) => (
            <li className="service-card" key={s.title}>
              <Reveal>
                <span className="service-icon" aria-hidden="true">{s.icon}</span>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
                <a href="#" className="card-link">Learn more <span aria-hidden="true">——→</span><span className="sr-only"> about {s.title}</span></a>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
