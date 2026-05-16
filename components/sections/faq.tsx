"use client";
import { Reveal } from "@/components/reveal";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

const faqs = [
  {
    q: "Does MindEd Connections accept insurance?",
    a: "We accept ACH bank transfer, Apple Cash, cash, check, Mastercard, PayPal, Venmo, Visa, and Zelle. Please check with us directly about fees — we're happy to discuss your options before you commit.",
  },
  {
    q: "How long does an evaluation take?",
    a: "Evaluation length varies depending on the referral question and what areas are being assessed. We'll give you a clear estimate during your free 15-minute consultation so you know what to expect.",
  },
  {
    q: "Do you offer telehealth?",
    a: "Yes. We're available both in-person in Menifee, CA and online throughout California. Evaluations and assessments are scheduled throughout the week — weekdays, weekends, mornings, afternoons, and evenings.",
  },
  {
    q: "What ages do you work with?",
    a: "We work with toddlers, children (6–10), preteens, teens, and adults. Whether you're a parent seeking answers for your child or an adult looking for clarity on your own learning or behavioral profile, we can help.",
  },
  {
    q: "What should I bring to the first appointment?",
    a: "Any prior evaluations, school records, or relevant reports are helpful but not required. Michelle will guide you through what's most useful during your free intake consultation — there's no pressure to arrive with everything figured out.",
  },
  {
    q: "Do I need a referral?",
    a: "No referral is required. You can reach out directly through the form below, by phone at (951) 338-8653, or schedule a free 15-minute consultation to get started.",
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
