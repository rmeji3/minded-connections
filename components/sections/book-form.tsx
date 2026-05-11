"use client";
import * as React from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function BookForm() {
  const [status, setStatus] = React.useState<{ kind: "" | "error" | "success"; msg: string }>({ kind: "", msg: "" });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get("child") || !fd.get("parent") || !fd.get("email") || !fd.get("age")) {
      setStatus({ kind: "error", msg: "Please complete the required fields." });
      return;
    }
    setStatus({ kind: "success", msg: "Thank you — we'll be in touch within one business day." });
    (e.currentTarget as HTMLFormElement).reset();
  };

  return (
    <section id="book" className="section section--book" aria-labelledby="book-heading">
      <div className="container grid-wide-text book-grid">
        <Reveal>
          <p className="eyebrow">Lorem Ipsum</p>
          <h2 id="book-heading">Dolor sit amet <em>consectetur.</em></h2>
          <p className="lead">
            Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua ut enim ad minim.
          </p>
          <div className="privacy-well">
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit — see our <a href="#">Privacy Policy</a>. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
        </Reveal>

        <Reveal>
          <form className="book-form" id="book-form" noValidate onSubmit={onSubmit}>
            <div className="form-row form-row--two">
              <div className="form-field">
                <label htmlFor="f-child">Lorem ipsum <span className="req">(required)</span></label>
                <input id="f-child" name="child" type="text" autoComplete="given-name" aria-required="true" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-age">Dolor sit <span className="req">(required)</span></label>
                <input id="f-age" name="age" type="number" min={2} max={17} aria-required="true" required />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="f-parent">Amet consectetur <span className="req">(required)</span></label>
              <input id="f-parent" name="parent" type="text" autoComplete="name" aria-required="true" required />
            </div>

            <div className="form-row form-row--two">
              <div className="form-field">
                <label htmlFor="f-email">Adipiscing email <span className="req">(required)</span></label>
                <input id="f-email" name="email" type="email" autoComplete="email" aria-required="true" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-phone">Sed do phone</label>
                <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="f-hear">Eiusmod tempor incididunt?</label>
              <select id="f-hear" name="hear" defaultValue="">
                <option value="">Select one…</option>
                <option>Lorem ipsum</option>
                <option>Dolor sit amet</option>
                <option>Consectetur elit</option>
                <option>Adipiscing sed</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="f-note">Ut labore et dolore?</label>
              <textarea id="f-note" name="note" rows={4} placeholder="Lorem ipsum dolor sit amet." />
            </div>

            <fieldset className="form-field form-radio">
              <legend>Magna aliqua method</legend>
              <label className="radio"><input type="radio" name="contact" value="email" defaultChecked /> <span>Email</span></label>
              <label className="radio"><input type="radio" name="contact" value="phone" /> <span>Phone</span></label>
            </fieldset>

            <Button type="submit" className="form-submit">Lorem Ipsum</Button>
            <p className={`form-status ${status.kind}`} role="status" aria-live="polite">{status.msg}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
