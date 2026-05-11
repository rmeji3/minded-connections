"use client";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  { q: "Lorem ipsum dolor sit amet consectetur?", a: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto." },
  { q: "Nemo enim ipsam voluptatem quia voluptas?", a: "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt neque porro quisquam est." },
  { q: "Quis autem vel eum iure reprehenderit qui in ea?", a: "Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur vel illum qui dolorem eum fugiat quo voluptas nulla pariatur." },
  { q: "Ut enim ad minima veniam quis nostrum exercitationem?", a: "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam nisi ut aliquid ex ea commodi consequatur. Quis autem vel eum iure reprehenderit qui in ea voluptate." },
  { q: "At vero eos et accusamus et iusto odio dignissimos?", a: "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate." },
  { q: "Et harum quidem rerum facilis est et expedita?", a: "Et harum quidem rerum facilis est et expedita distinctio nam libero tempore cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere." },
];

export function Faq() {
  return (
    <section id="faq" className="section section--cream">
      <div className="container container--narrow">
        <Reveal className="section-head">
          <p className="eyebrow">Lorem Ipsum</p>
          <h2>Dolor sit amet <em>consectetur.</em></h2>
        </Reveal>
        <Reveal>
          <Accordion type="single" collapsible className="accordion">
            {faqs.map((f, i) => (
              <AccordionItem value={`faq-${i}`} key={i}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
