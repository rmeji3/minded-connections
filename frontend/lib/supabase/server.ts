import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Auth cookies are forced HttpOnly so client-side JavaScript can never read the
// session token (XSS-resistant). The browser never uses a Supabase client — all
// token access happens server-side in Route Handlers and proxy.ts.
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/**
 * Supabase server client for use inside Route Handlers and Server Components.
 * Reads/writes the session from HttpOnly cookies via next/headers.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, { ...options, ...COOKIE_OPTIONS }),
          );
        } catch {
          // setAll throws when called from a Server Component (read-only cookies).
          // The proxy refreshes the session, so this is safe to ignore here.
        }
      },
    },
  });
}
