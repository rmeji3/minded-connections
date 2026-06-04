import { type NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy-request";

export async function POST(req: NextRequest) {
  return proxyToBackend(req, "POST", { upstreamPath: "/auth/login" });
}
