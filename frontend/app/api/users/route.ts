import { type NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy-request";

export async function GET(req: NextRequest) {
  const search = req.nextUrl.search;
  return proxyToBackend(req, "GET", { upstreamPath: `/users${search}` });
}
