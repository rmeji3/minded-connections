import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function MidCta() {
  return (
    <section className="mid-cta-band" aria-label="Schedule a consultation">
      <Reveal>
        <div className="container mid-cta-inner">
          <div>
            <p className="eyebrow">Lorem ipsum?</p>
            <h3 className="mid-cta-headline">Dolor sit amet consectetur adipiscing elit sed do.</h3>
          </div>
          <Button asChild><a href="#book">Lorem Ipsum</a></Button>
        </div>
      </Reveal>
    </section>
  );
}
