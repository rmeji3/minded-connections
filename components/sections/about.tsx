import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/reveal";

export function About() {
  return (
    <section id="about" className="section section--about">
      <div className="container grid-split about-grid">
        <Reveal className="about-text">
          <p className="eyebrow">About Lorem</p>
          <h2>Lorem ipsum dolor sit <em>amet consectetur.</em></h2>
          <p className="lead">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
          </p>
          <p>
            Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
          </p>
          <p>
            Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
          </p>

          <div className="credentials">
            <p className="credentials-eyebrow">Lorem &amp; Ipsum</p>
            <ul>
              <li><span>Lorem,</span> Ipsum Dolor Sit Amet</li>
              <li><span>Consectetur,</span> Adipiscing Elit — Sed Do Eiusmod</li>
              <li><span>Tempor Incididunt,</span> Ut Labore Et Dolore Magna</li>
              <li><span>Member,</span> Aliqua Ut Enim Ad Minim Veniam</li>
            </ul>
          </div>

          <Button asChild><a href="#book">Lorem Ipsum</a></Button>
        </Reveal>

        <Reveal className="about-photo">
          <div className="about-photo-offset" aria-hidden="true" />
          <div className="placeholder-photo placeholder-photo--portrait">
            <span className="ph-label">PORTRAIT</span>
            <span className="ph-detail">natural light · no white coat · 4:5</span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
