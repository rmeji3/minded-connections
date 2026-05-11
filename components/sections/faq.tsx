"use client";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Does Dr. Hernandez accept insurance?",
    a: "Minded Connections is an out-of-network provider. We provide detailed superbills after each appointment that you can submit to your insurance for reimbursement. Reimbursement varies by plan — we're happy to help you understand your benefits before you commit.",
  },
  {
    q: "How long does the initial evaluation take?",
    a: "The initial evaluation is a 90-minute appointment. In some cases — particularly for complex or multi-faceted presentations — a second session may be recommended before a treatment plan is finalized.",
  },
  {
    q: "Do you offer telehealth appointments?",
    a: "Yes. We offer secure telehealth appointments for established patients and for anyone in California who prefers remote care. Whenever possible, we recommend the initial evaluation be conducted in person.",
  },
  {
    q: "How quickly can I be seen?",
    a: "New patient appointments are typically available within 2–3 weeks. We maintain a small cancellation list for patients with more urgent needs — please mention this when you reach out.",
  },
  {
    q: "What should I bring to the first appointment?",
    a: "Any prior evaluations, records from previous providers, or a list of current medications are helpful but not required. Dr. Hernandez will guide you through what information is most useful during your intake call — there's no pressure to arrive with everything figured out.",
  },
  {
    q: "Do I need a referral?",
    a: "No referral is required to book an appointment at Minded Connections. You can reach out directly through the form below or by phone.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section section--cream">
      <div className="container container--narrow">
        <Reveal className="section-head">
          <p className="eyebrow">Common Questions</p>
          <h2>Everything you <em>want to know.</em></h2>
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
