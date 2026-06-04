import { type NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy-request";

export async function GET(req: NextRequest) {
  return proxyToBackend(req, "GET", { upstreamPath: "/auth/me" });
}
