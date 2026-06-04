import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function MidCta() {
  return (
    <section className="mid-cta-band" aria-label="Schedule a consultation">
      <Reveal>
        <div className="container mid-cta-inner">
          <div>
            <p className="eyebrow">Ready to get started?</p>
            <h3 className="mid-cta-headline">You don't have to navigate this alone.</h3>
          </div>
          <Button asChild><a href="#book">Book a Consultation</a></Button>
        </div>
      </Reveal>
    </section>
  );
}
