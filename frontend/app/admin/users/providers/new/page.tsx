"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useCreateProvider } from "@/hooks/use-users";
import { FormField } from "@/components/admin/form-field";
import { PasswordInput } from "@/components/ui/password-input";
import { ApiError } from "@/lib/api-client";
import { parseIdentityErrors } from "@/lib/identity-errors";

interface Fields {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  title: string;
  specialty: string;
  bio: string;
  phone: string;
}

const EMPTY: Fields = {
  email: "", password: "", firstName: "", lastName: "",
  title: "", specialty: "", bio: "", phone: "",
};

function validatePassword(pw: string): string | undefined {
  if (!pw)            return "Password is required.";
  if (pw.length < 10) return "Minimum 10 characters.";
  if (!/[A-Z]/.test(pw)) return "Must include an uppercase letter.";
  if (!/[a-z]/.test(pw)) return "Must include a lowercase letter.";
  if (!/[0-9]/.test(pw)) return "Must include a number.";
  if (!/[^A-Za-z0-9]/.test(pw)) return "Must include a symbol (e.g. ! @ # $).";
  return undefined;
}

function validate(f: Fields): Partial<Record<keyof Fields, string>> {
  const e: Partial<Record<keyof Fields, string>> = {};
  if (!f.email)     e.email     = "Email is required.";
  else if (!/\S+@\S+\.\S+/.test(f.email)) e.email = "Enter a valid email.";
  const pwErr = validatePassword(f.password);
  if (pwErr) e.password = pwErr;
  if (!f.firstName) e.firstName = "First name is required.";
  if (!f.lastName)  e.lastName  = "Last name is required.";
  if (!f.title)     e.title     = "Title is required.";
  return e;
}

export default function NewProviderPage() {
  const router = useRouter();
  const { mutate: create, isPending, error } = useCreateProvider();

  const [fields, setFields] = React.useState<Fields>(EMPTY);
  const [errors, setErrors] = React.useState<Partial<Record<keyof Fields, string>>>({});
  const [serverError, setServerError] = React.useState<string | null>(null);

  const set = (key: keyof Fields) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);
    const errs = validate(fields);
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    create(
      {
        email:     fields.email,
        password:  fields.password,
        firstName: fields.firstName,
        lastName:  fields.lastName,
        title:     fields.title,
        specialty: fields.specialty || undefined,
        bio:       fields.bio       || undefined,
        phone:     fields.phone     || undefined,
      },
      {
        onSuccess: (user) => {
          toast.success(`Provider created`, {
            description: `${user.firstName} ${user.lastName} (${user.email}) has been added.`,
          });
          router.push("/admin/users?role=Provider");
        },
        onError: (err) => {
          if (!(err instanceof ApiError)) {
            setServerError("Something went wrong. Please try again.");
            return;
          }
          const { fieldErrors, formError } = parseIdentityErrors(err.message, {
            email:    "email",
            password: "password",
          });
          if (Object.keys(fieldErrors).length > 0) {
            setErrors((prev) => ({ ...prev, ...fieldErrors }));
          }
          setServerError(formError);
        },
      },
    );
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <header style={{ marginBottom: "2rem" }}>
        <span className="eyebrow">Providers</span>
        <h1 style={{ color: "var(--ink)", margin: "0.25rem 0 0" }}>Add provider</h1>
      </header>

      {serverError && (
        <div role="alert" style={{ padding: "0.75rem 1rem", background: "rgba(166,60,46,.06)", border: "1px solid rgba(166,60,46,.25)", borderRadius: 6, fontSize: "0.875rem", color: "var(--color-error)", marginBottom: "1.5rem" }}>
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label="First name" required error={errors.firstName}>
            <input type="text" value={fields.firstName} onChange={set("firstName")} autoComplete="off" />
          </FormField>
          <FormField id="lastName" label="Last name" required error={errors.lastName}>
            <input type="text" value={fields.lastName} onChange={set("lastName")} autoComplete="off" />
          </FormField>
        </div>

        <FormField id="email" label="Email address" required error={errors.email}>
          <input type="email" value={fields.email} onChange={set("email")} autoComplete="off" />
        </FormField>

        <FormField id="password" label="Temporary password" required error={errors.password} hint="Min 10 chars · must include uppercase, lowercase, number, and symbol (e.g. !@#$).">
          <PasswordInput value={fields.password} onChange={set("password")} autoComplete="new-password" />
        </FormField>

        <FormField id="title" label="Title" required error={errors.title} hint='e.g. "Licensed Educational Psychologist"'>
          <input type="text" value={fields.title} onChange={set("title")} autoComplete="off" />
        </FormField>

        <FormField id="specialty" label="Specialty" error={errors.specialty}>
          <input type="text" value={fields.specialty} onChange={set("specialty")} autoComplete="off" placeholder="e.g. ADHD, Autism, Learning disabilities" />
        </FormField>

        <FormField id="bio" label="Bio">
          <textarea
            value={fields.bio}
            onChange={set("bio")}
            rows={4}
            style={{ fontFamily: "var(--font-body)", fontSize: "0.9375rem", resize: "vertical" }}
          />
        </FormField>

        <FormField id="phone" label="Phone">
          <input type="tel" value={fields.phone} onChange={set("phone")} autoComplete="off" placeholder="(000) 000-0000" />
        </FormField>

        <div className="flex gap-3 flex-wrap" style={{ paddingTop: "0.5rem" }}>
          <button type="submit" className="btn-primary" disabled={isPending}>
            {isPending ? "Creating…" : "Create provider"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "1.5px solid var(--linen)", borderRadius: 5, color: "var(--stone-600)", fontSize: "0.9375rem", fontFamily: "var(--font-body)", cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
