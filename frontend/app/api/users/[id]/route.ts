import { type NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/proxy-request";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(req, "GET", { upstreamPath: `/users/${id}` });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyToBackend(req, "DELETE", { upstreamPath: `/users/${id}` });
}
