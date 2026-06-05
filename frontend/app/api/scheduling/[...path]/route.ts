import { type NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy-request";

const SCHEDULING_API_URL = process.env.SCHEDULING_API_URL ?? "http://localhost:5020";

export async function GET(req: NextRequest) {
  const upstreamPath = req.nextUrl.pathname.replace(/^\/api\/scheduling/, "");
  return proxyToBackend(req, "GET", {
    apiUrl: SCHEDULING_API_URL,
    upstreamPath: upstreamPath + req.nextUrl.search
  });
}

export async function POST(req: NextRequest) {
  const upstreamPath = req.nextUrl.pathname.replace(/^\/api\/scheduling/, "");
  return proxyToBackend(req, "POST", {
    apiUrl: SCHEDULING_API_URL,
    upstreamPath: upstreamPath + req.nextUrl.search
  });
}

export async function PATCH(req: NextRequest) {
  const upstreamPath = req.nextUrl.pathname.replace(/^\/api\/scheduling/, "");
  return proxyToBackend(req, "PATCH", {
    apiUrl: SCHEDULING_API_URL,
    upstreamPath: upstreamPath + req.nextUrl.search
  });
}

export async function DELETE(req: NextRequest) {
  const upstreamPath = req.nextUrl.pathname.replace(/^\/api\/scheduling/, "");
  return proxyToBackend(req, "DELETE", {
    apiUrl: SCHEDULING_API_URL,
    upstreamPath: upstreamPath + req.nextUrl.search
  });
}
