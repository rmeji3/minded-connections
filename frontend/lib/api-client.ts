/**
 * Base fetch wrapper.
 *
 * - Attaches the in-memory access token to every request.
 * - On 401, attempts a single silent refresh then retries.
 * - The refresh token lives in an HttpOnly cookie — the browser
 *   sends it automatically; we never touch it in JS.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

// Access token is kept in module memory (never localStorage / sessionStorage).
let _accessToken: string | null = null;

export function setAccessToken(token: string | null) {
  _accessToken = token;
}

export function getAccessToken() {
  return _accessToken;
}

// ─────────────────────────────────────────────────────────────────────────────

async function silentRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      _accessToken = null;
      return false;
    }

    const data = await res.json() as { access_token: string };
    _accessToken = data.access_token;
    return true;
  } catch {
    _accessToken = null;
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, headers: extraHeaders, ...rest } = options;

  const makeRequest = (token: string | null) =>
    fetch(`${API_BASE}${path}`, {
      ...rest,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...extraHeaders,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

  let res = await makeRequest(_accessToken);

  // Silent refresh on 401 then retry once
  if (res.status === 401) {
    const refreshed = await silentRefresh();
    if (!refreshed) throw new ApiError(401, "Session expired");
    res = await makeRequest(_accessToken);
  }

  if (!res.ok) {
    let message = res.statusText;
    try {
      const json = await res.json() as Record<string, unknown>;
      if (typeof json?.error === "string") {
        message = json.error;
      } else if (typeof json?.message === "string") {
        message = json.message;
      } else if (Array.isArray(json?.errors)) {
        // ASP.NET Identity returns { errors: ["Password too short", ...] }
        message = (json.errors as string[]).join(" ");
      } else if (json?.errors && typeof json.errors === "object") {
        // Model validation returns { errors: { field: ["msg"] } }
        message = Object.values(json.errors as Record<string, string[]>)
          .flat()
          .join(" ");
      }
    } catch {
      // non-JSON body — keep statusText
    }
    throw new ApiError(res.status, message);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
