"use client";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    q: "What payment methods do you accept?",
    a: "We accept ACH bank transfer, Apple Cash, cash, check, Mastercard, PayPal, Venmo, Visa, and Zelle. Contact us directly to discuss fees.",
  },
  {
    q: "How long does an evaluation take?",
    a: "It depends on the referral question and what areas are being assessed. We'll give you an estimate during your free 15-minute consultation.",
  },
  {
    q: "Do you offer telehealth?",
    a: "Yes. We're available both in-person in Menifee, CA and online throughout California. Evaluations and assessments are scheduled throughout the week including weekdays, weekends, mornings, afternoons, and evenings.",
  },
  {
    q: "What ages do you work with?",
    a: "We work with toddlers, children (6 to 10), preteens, teens, and adults. We see individuals, families, and groups.",
  },
  {
    q: "What should I bring to the first appointment?",
    a: "Any prior evaluations, school records, or relevant reports are helpful but not required. Michelle will guide you through what's most useful during your intake consultation.",
  },
  {
    q: "Do I need a referral?",
    a: "No referral is required. You can reach out directly through the form below or by phone at (951) 338-8653.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="section section--cream">
      <div className="container container--narrow">
        <Reveal className="section-head">
          <p className="eyebrow">Common Questions</p>
          <h2>Common <em>questions.</em></h2>
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
