"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useLogin } from "@/hooks/use-login";
import { useAuth } from "@/hooks/use-auth";
import { ApiError } from "@/lib/api-client";
import type { UserRole } from "@/lib/auth-api"; // used in ROLE_REDIRECT

// ─── Role → destination ───────────────────────────────────────────────────────

const ROLE_REDIRECT: Record<UserRole, string> = {
  Admin:    "/admin",
  Provider: "/portal/provider",
  Patient:  "/portal/patient",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function LeftPanel() {
  return (
    <aside
      className="hidden lg:flex flex-col bg-sage-700"
      style={{ padding: "clamp(2rem,6vw,4rem)" }}
    >
      <a
        href="/"
        style={{ display: "inline-flex", alignItems: "center", gap: "0.75rem", textDecoration: "none" }}
      >
        <Image
          src="/logo.svg"
          alt="MindEd Connections"
          width={140}
          height={51}
          style={{ filter: "brightness(0) invert(1)" }}
        />
      </a>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", paddingBlock: "3rem" }}>
        <span className="eyebrow" style={{ color: "var(--sage-300)" }}>Patient portal</span>
        <h1 style={{ color: "var(--warm-white)", fontSize: "clamp(2rem,3.5vw,3rem)", marginBottom: "1.5rem" }}>
          Continue your <em>care,<br />securely</em>.
        </h1>
        <p style={{ color: "rgba(228,235,226,.85)", fontSize: "1.0625rem", maxWidth: "38ch", margin: 0, lineHeight: 1.75 }}>
          Message your provider, review evaluation reports, complete check-ins,
          and join telehealth appointments — all in one private space.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "rgba(228,235,226,.7)", fontSize: "0.8125rem" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          HIPAA-compliant · 256-bit encryption
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "rgba(228,235,226,.7)", fontSize: "0.8125rem" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--sage-300)", display: "inline-block", flexShrink: 0 }} />
          Systems operating normally
        </div>
        <p style={{ color: "rgba(228,235,226,.55)", fontSize: "0.8125rem", margin: "0.5rem 0 0", maxWidth: "34ch", lineHeight: 1.7 }}>
          In crisis? Call or text{" "}
          <strong style={{ fontFamily: "var(--font-detail)", fontWeight: 400, color: "var(--warm-white)" }}>988</strong>{" "}
          for the Suicide &amp; Crisis Lifeline, or dial{" "}
          <strong style={{ fontFamily: "var(--font-detail)", fontWeight: 400, color: "var(--warm-white)" }}>911</strong>.{" "}
          This portal is not monitored for emergencies.
        </p>
      </div>
    </aside>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

function LoginForm() {
  const [showPw, setShowPw] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { mutate: login, isPending } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(
      { email, password },
      {
        onError: (err) => {
          const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
          toast.error("Sign-in failed", { description: message });
        },
      },
    );
  };

  return (
    <form
      style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      {/* Email */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>
          Email address
        </label>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--stone-500)", pointerEvents: "none" }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" />
          </svg>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="off"
            placeholder="you@email.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ paddingLeft: "2.75rem" }}
          />
        </div>
      </div>

      {/* Password */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <label htmlFor="password" style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--ink)" }}>
            Password
          </label>
          <a href="#" style={{ fontSize: "0.8125rem", color: "var(--sage-500)" }}>Forgot password?</a>
        </div>
        <div style={{ position: "relative" }}>
          <svg style={{ position: "absolute", left: "0.875rem", top: "50%", transform: "translateY(-50%)", color: "var(--stone-500)", pointerEvents: "none" }} width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          <input
            id="password"
            name="password"
            type={showPw ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ paddingLeft: "2.75rem", paddingRight: "4.5rem" }}
          />
          <button
            type="button"
            aria-label={showPw ? "Hide password" : "Show password"}
            onClick={() => setShowPw((v) => !v)}
            style={{ position: "absolute", right: "0.875rem", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", padding: "0.25rem 0.375rem", fontSize: "0.8125rem", color: "var(--sage-500)", cursor: "pointer", fontFamily: "var(--font-body)" }}
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Remember */}
      <label style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem", color: "var(--stone-700)", cursor: "pointer" }}>
        <input type="checkbox" name="remember" defaultChecked style={{ width: 16, height: 16, accentColor: "var(--sage-500)" }} />
        Keep me signed in
      </label>

      <button
        type="submit"
        className="btn-primary"
        disabled={isPending}
        style={{ width: "100%", justifyContent: "center" }}
      >
        {isPending ? "Signing in…" : "Sign in to portal"}
      </button>

      {/* Divider */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <span style={{ flex: 1, height: 1, background: "var(--linen)" }} />
        <span style={{ fontSize: "0.8125rem", color: "var(--stone-500)" }}>or</span>
        <span style={{ flex: 1, height: 1, background: "var(--linen)" }} />
      </div>

      {/* Magic link */}
      <button
        type="button"
        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.625rem", width: "100%", padding: "0.875rem 1.5rem", background: "var(--warm-white)", border: "1.5px solid var(--linen)", borderRadius: 5, color: "var(--stone-700)", fontSize: "0.9rem", fontFamily: "var(--font-body)", cursor: "pointer", minHeight: 48, transition: "border-color 180ms" }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="m22 2-7 20-4-9-9-4z" /><path d="M22 2 11 13" />
        </svg>
        Sign in with a one-time email link
      </button>
    </form>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoading } = useAuth();
  const hasRedirected = React.useRef(false);

  // Redirect once the user is authenticated. The ref guard ensures we navigate
  // exactly once — without it, re-renders re-fire router.push every frame and
  // each call preempts the in-flight navigation, so the target route never loads.
  React.useEffect(() => {
    if (isLoading || !user || hasRedirected.current) return;
    hasRedirected.current = true;
    const next = searchParams.get("next");
    router.replace(next || ROLE_REDIRECT[user.role]);
  }, [user, isLoading, router, searchParams]);

  return (
    <main className="min-h-screen lg:grid lg:grid-cols-[45fr_55fr]">
      <LeftPanel />

      {/* ── Right panel ── */}
      <section className="flex flex-col bg-warm-white min-h-screen lg:min-h-0">

        {/* Mobile brand */}
        <div className="flex lg:hidden items-center gap-3 px-6 py-4" style={{ borderBottom: "1px solid var(--linen)" }}>
          <Image src="/logo.svg" alt="MindEd Connections" width={140} height={51} />
        </div>

        {/* Top bar */}
        <div
          className="flex justify-end items-center gap-3 px-6 sm:px-10 pt-4 pb-2"
          style={{ fontSize: "0.875rem", color: "var(--stone-500)" }}
        >
          <span>New patient?</span>
          <a href="#" style={{ color: "var(--sage-500)" }}>Request an account</a>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-6 sm:px-10 py-8">
          <div style={{ width: "100%", maxWidth: 420 }}>
            <span className="eyebrow">Sign in</span>
            <h2 style={{ color: "var(--ink)", marginBottom: "0.5rem" }}>Welcome <em>back</em>.</h2>
            <p style={{ color: "var(--stone-500)", fontSize: "0.9375rem", marginBottom: "2rem", maxWidth: "none" }}>
              Use the email address you provided during intake.
            </p>

            <LoginForm />

            <p style={{ marginTop: "1.75rem", fontSize: "0.8125rem", color: "var(--stone-500)", lineHeight: 1.7, maxWidth: "none", marginBottom: 0 }}>
              Trouble accessing your account? Email{" "}
              <a href="mailto:hello@mindedconnections.com" style={{ color: "var(--sage-500)" }}>hello@mindedconnections.com</a>
              {" "}or call <span style={{ fontFamily: "var(--font-detail)" }}>(951) 338-8653</span>.
            </p>
          </div>
        </div>

        {/* Legal */}
        <div
          className="flex flex-wrap justify-between items-center gap-2 px-6 sm:px-10 py-4"
          style={{ fontSize: "0.8125rem", color: "var(--stone-500)", borderTop: "1px solid var(--linen)" }}
        >
          <span>© 2026 MindEd Connections · Michelle Hernandez, LEP4734</span>
          <span>
            <a href="#" style={{ color: "var(--stone-500)" }}>Privacy</a>&nbsp;·&nbsp;
            <a href="#" style={{ color: "var(--stone-500)" }}>Terms</a>&nbsp;·&nbsp;
            <a href="#" style={{ color: "var(--stone-500)" }}>HIPAA notice</a>
          </span>
        </div>
      </section>
    </main>
  );
}
