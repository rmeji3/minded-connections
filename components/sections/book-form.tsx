"use client";
import * as React from "react";
import { Reveal } from "@/components/reveal";
import { Button } from "@/components/ui/button";

export function BookForm() {
  const [status, setStatus] = React.useState<{ kind: "" | "error" | "success"; msg: string }>({ kind: "", msg: "" });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (!fd.get("name") || !fd.get("email")) {
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
          <p className="eyebrow">Request a Consultation</p>
          <h2 id="book-heading">Let's find the right <em>path forward.</em></h2>
          <p className="lead">
            Fill out the form and we'll be in touch within one business day. There's no obligation — just a conversation.
          </p>
          <div className="privacy-well">
            <p>All information is kept strictly confidential in accordance with HIPAA. See our <a href="#">Privacy Policy</a> for details. We will never share your information without your written consent.</p>
          </div>
        </Reveal>

        <Reveal>
          <form className="book-form" id="book-form" noValidate onSubmit={onSubmit}>
            <div className="form-row form-row--two">
              <div className="form-field">
                <label htmlFor="f-name">Your name <span className="req">(required)</span></label>
                <input id="f-name" name="name" type="text" autoComplete="name" aria-required="true" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-dob">Date of birth</label>
                <input id="f-dob" name="dob" type="date" />
              </div>
            </div>

            <div className="form-row form-row--two">
              <div className="form-field">
                <label htmlFor="f-email">Your email <span className="req">(required)</span></label>
                <input id="f-email" name="email" type="email" autoComplete="email" aria-required="true" required />
              </div>
              <div className="form-field">
                <label htmlFor="f-phone">Your phone</label>
                <input id="f-phone" name="phone" type="tel" autoComplete="tel" />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="f-hear">How did you hear about us?</label>
              <select id="f-hear" name="hear" defaultValue="">
                <option value="">Select one…</option>
                <option>Psychology Today</option>
                <option>Doctor referral</option>
                <option>Friend or family member</option>
                <option>Google search</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="f-note">What brings you in?</label>
              <textarea id="f-note" name="note" rows={4} placeholder="No pressure to have the right words — just share what's on your mind." />
            </div>

            <fieldset className="form-field form-radio">
              <legend>Preferred contact method</legend>
              <label className="radio"><input type="radio" name="contact" value="email" defaultChecked /> <span>Email</span></label>
              <label className="radio"><input type="radio" name="contact" value="phone" /> <span>Phone</span></label>
            </fieldset>

            <Button type="submit" className="form-submit">Request a Consultation</Button>
            <p className={`form-status ${status.kind}`} role="status" aria-live="polite">{status.msg}</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
