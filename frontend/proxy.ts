import { type NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/admin", "/portal"];
const LOGIN_PATH = "/login";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  if (!isProtected) return NextResponse.next();

  // The refresh token is HttpOnly so middleware can read it server-side.
  // Its presence is used as the auth signal — the API enforces real validity.
  const hasSession = req.cookies.has("refresh_token");

  if (!hasSession) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/portal/patient/:path*", "/portal/provider/:path*"],
};
