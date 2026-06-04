import { apiRequest, setAccessToken } from "@/lib/api-client";

export type UserRole = "Admin" | "Provider" | "Patient";

export interface AuthUser {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: UserRole;
  timezone?: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ─────────────────────────────────────────────────────────────────────────────

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResponse> {
  const data = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: credentials,
  });
  setAccessToken(data.accessToken);
  return data;
}

export async function logoutRequest(): Promise<void> {
  await apiRequest<void>("/auth/logout", { method: "POST" });
  setAccessToken(null);
}

/**
 * Attempt a silent token refresh.
 * We check for a non-HttpOnly "has_session" cookie first to avoid a
 * guaranteed 401 round-trip when the user is simply not logged in.
 */
export async function refreshSession(): Promise<AuthUser | null> {
  // Quick bail-out: no session indicator → skip the network call entirely
  if (!document.cookie.includes("has_session=1")) return null;

  try {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "/api";
    const res = await fetch(`${base}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) return null;

    const data = await res.json() as { access_token: string };
    setAccessToken(data.access_token);

    return apiRequest<AuthUser>("/auth/me");
  } catch {
    return null;
  }
}

export async function getMeRequest(): Promise<AuthUser> {
  return apiRequest<AuthUser>("/auth/me");
}
