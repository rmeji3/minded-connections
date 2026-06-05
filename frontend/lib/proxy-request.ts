/**
 * Server-only helper used by Route Handlers to forward requests to the backend
 * API. The Supabase access token is read from the HttpOnly session cookie
 * server-side and attached as a Bearer header — the browser never sees it.
 */

import { type NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const API_URL = process.env.API_URL ?? "http://localhost:5050";

interface ProxyOptions {
  upstreamPath?: string;
}

export async function proxyToBackend(
  req: NextRequest,
  method: string,
  options: ProxyOptions = {},
): Promise<NextResponse> {
  const upstreamPath =
    options.upstreamPath ?? req.nextUrl.pathname.replace(/^\/api/, "");

  const forwardHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Read the access token from the HttpOnly session cookie (proxy.ts has already
  // refreshed it for this request) and forward it to the .NET API.
  const supabase = await createSupabaseServerClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    forwardHeaders["Authorization"] = `Bearer ${session.access_token}`;
  }

  let body: string | undefined;
  if (method !== "GET" && method !== "HEAD") {
    body = await req.text();
  }

  const upstream = await fetch(`${API_URL}${upstreamPath}`, {
    method,
    headers: forwardHeaders,
    body: body || undefined,
  });

  const responseBody = upstream.status === 204 ? null : await upstream.text();

  return new NextResponse(responseBody, {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
