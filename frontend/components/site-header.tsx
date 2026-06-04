"use client";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const state = scrolled ? "scrolled" : "hero-dark";

  return (
    <>
      <header id="site-header" data-state={state}>
        <nav className="container nav" aria-label="Main navigation">
          <Link href="#" className="nav-brand">
            <Image src="/logo.svg" alt="MindEd Connections" width={110} height={40} priority loading="eager" />
          </Link>

          <ul className="nav-links" id="nav-links">
            <li><a href="#about">About</a></li>
            <li className="has-menu">
              <button
                className="nav-menu-trigger"
                aria-haspopup="true"
                aria-expanded={menuOpen}
                aria-controls="services-menu"
                onClick={() => setMenuOpen((v) => !v)}
              >
                Services
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M2 3.5 L5 6.5 L8 3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="nav-menu" id="services-menu" role="menu">
                <a href="#services" role="menuitem">Psychological Evaluations</a>
                <a href="#services" role="menuitem">ADHD &amp; Autism Assessments</a>
                <a href="#services" role="menuitem">Learning Disability Testing</a>
                <a href="#services" role="menuitem">IEP &amp; 504 Advocacy</a>
                <a href="#services" role="menuitem">Behavioral Health Services</a>
              </div>
            </li>
            <li><a href="#conditions">Conditions</a></li>
            <li><a href="#process">How It Works</a></li>
            <li><a href="#faq">FAQs</a></li>
          </ul>

          <div className="nav-cta">
            <Link href="/login" className="nav-portal">Patient Portal</Link>
            <Button asChild size="sm"><a href="#book">Book a Consultation <span aria-hidden="true">→</span></a></Button>
          </div>

          <button
            className="nav-hamburger"
            id="hamburger"
            aria-expanded={open}
            aria-controls="nav-drawer"
            aria-label="Open navigation menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span /><span /><span />
          </button>
        </nav>
      </header>

      {open && (
        <div
          className="drawer-overlay is-open"
          id="drawer-overlay"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`nav-drawer ${open ? "is-open" : ""}`}
        id="nav-drawer"
        hidden={!open}
        aria-label="Mobile navigation"
      >
        <div className="drawer-head">
          <span className="drawer-brand">MindEd Connections</span>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">×</button>
        </div>
        <nav>
          <a href="#about" onClick={() => setOpen(false)}>About Michelle Hernandez</a>
          <a href="#services" onClick={() => setOpen(false)}>Services</a>
          <a href="#conditions" onClick={() => setOpen(false)}>Conditions</a>
          <a href="#process" onClick={() => setOpen(false)}>How It Works</a>
          <a href="#faq" onClick={() => setOpen(false)}>FAQs</a>
          <Link href="/login" className="drawer-portal" onClick={() => setOpen(false)}>Patient Portal</Link>
        </nav>
        <Button asChild className="drawer-cta"><a href="#book" onClick={() => setOpen(false)}>Book a Consultation</a></Button>
      </aside>
    </>
  );
}
