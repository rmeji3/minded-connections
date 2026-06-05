import { apiRequest } from "@/lib/api-client";

export type UserRole = "Admin" | "Provider" | "Patient";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  timezone?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Signs in server-side. On success the session is stored in HttpOnly cookies
 * by the Route Handler — no token is returned to the browser.
 */
export async function loginRequest(credentials: LoginCredentials): Promise<void> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    credentials: "include",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(data.error ?? "Invalid email or password.");
  }
}

export async function logoutRequest(): Promise<void> {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {
    // Best-effort — local state is cleared regardless.
  });
}

export async function getMeRequest(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}
