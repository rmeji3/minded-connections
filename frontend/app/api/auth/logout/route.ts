import { type NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/proxy-request";

export async function POST(req: NextRequest) {
  const res = await proxyToBackend(req, "POST", { upstreamPath: "/auth/logout" });
  // Clear the sentinel cookie on logout
  (res as NextResponse).headers.append(
    "Set-Cookie",
    "has_session=1; Path=/; SameSite=Strict; Max-Age=0",
  );
  return res;
}
