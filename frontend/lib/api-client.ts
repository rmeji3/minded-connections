/**
 * Base fetch wrapper for calling our Next.js Route Handlers (the /api proxy).
 *
 * Auth is carried by the HttpOnly session cookie, which the browser sends
 * automatically on same-origin requests — there is no token in JavaScript.
 * The Route Handlers read the cookie server-side and forward a Bearer token
 * to the .NET API.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

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

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const json = await res.json() as Record<string, unknown>;
      if (typeof json?.error === "string") {
        message = json.error;
      } else if (typeof json?.message === "string") {
        message = json.message;
      } else if (Array.isArray(json?.errors)) {
        message = (json.errors as string[]).join(" ");
      } else if (json?.errors && typeof json.errors === "object") {
        message = Object.values(json.errors as Record<string, string[]>)
          .flat()
          .join(" ");
      }
    } catch {
      // non-JSON body — keep statusText
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}
