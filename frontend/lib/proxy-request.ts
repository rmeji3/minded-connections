/**
 * Server-only helper used by Route Handlers to forward requests to the
 * backend API and transparently pass through Set-Cookie headers.
 *
 * Next.js rewrites strip Set-Cookie, so we use Route Handlers instead.
 */

import { type NextRequest, NextResponse } from "next/server";

const API_URL = process.env.API_URL ?? "http://localhost:5050";

interface ProxyOptions {
  /**
   * Override the upstream path. Defaults to stripping the leading /api prefix
   * from the incoming request pathname.
   */
  upstreamPath?: string;
}

export async function proxyToBackend(
  req: NextRequest,
  method: string,
  options: ProxyOptions = {},
): Promise<NextResponse> {
  const upstreamPath =
    options.upstreamPath ??
    req.nextUrl.pathname.replace(/^\/api/, "");

  const upstreamUrl = `${API_URL}${upstreamPath}`;

  const forwardHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Forward the Authorization header (access token) if present
  const auth = req.headers.get("authorization");
  if (auth) forwardHeaders["Authorization"] = auth;

  // Forward incoming cookies so the backend receives the refresh_token
  const incomingCookies = req.headers.get("cookie");
  if (incomingCookies) forwardHeaders["Cookie"] = incomingCookies;

  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await req.text();
  }

  const upstream = await fetch(upstreamUrl, {
    method,
    headers: forwardHeaders,
    body: body || undefined,
  });

  const responseBody = upstream.status === 204 ? null : await upstream.text();

  const res = new NextResponse(responseBody, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });

  // ── Forward Set-Cookie so the browser stores it on the Next.js origin ──
  // Rewrite Path=/auth → Path=/ so the middleware can read the cookie on
  // all routes (e.g. when protecting /admin or /portal).
  const setCookie = upstream.headers.get("set-cookie");
  if (setCookie) {
    const rewritten = setCookie.replace(/;\s*path=\/auth/i, "; Path=/");
    res.headers.append("Set-Cookie", rewritten);
    // Also set a non-HttpOnly sentinel cookie so client-side code can
    // cheaply check whether a session exists before attempting a refresh.
    res.headers.append(
      "Set-Cookie",
      "has_session=1; Path=/; SameSite=Strict; Max-Age=604800",
    );
  }

  return res;
}
