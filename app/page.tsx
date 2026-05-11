import { SiteHeader } from "@/components/site-header";
import { Hero } from "@/components/sections/hero";
import { TrustBar } from "@/components/sections/trust-bar";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Conditions } from "@/components/sections/conditions";
import { MidCta } from "@/components/sections/mid-cta";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { BookForm } from "@/components/sections/book-form";
import { BottomCta } from "@/components/sections/bottom-cta";
import { SiteFooter } from "@/components/sections/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <Process />
        <Conditions />
        <MidCta />
        <Testimonials />
        <Faq />
        <BookForm />
        <BottomCta />
      </main>
      <SiteFooter />
    </>
  );
}
