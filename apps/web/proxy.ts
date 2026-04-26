import { type NextRequest, NextResponse } from "next/server";

// Next.js 16: file is proxy.ts, export must be named `proxy`.
//
// Session cookie refresh and full user validation happen in the layout via
// the Supabase server client (lib/supabase/server.ts). The proxy does only
// lightweight, optimistic checks — no network calls.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Supabase @supabase/ssr stores the session in cookies named:
  //   sb-<ref>-auth-token          (fits in one cookie)
  //   sb-<ref>-auth-token.0        (first chunk when JWT exceeds 3180 bytes)
  //   sb-<ref>-auth-token.1 …      (subsequent chunks)
  //
  // Google OAuth JWTs include full user profile metadata and regularly exceed
  // the 3180-byte chunk threshold, so they are always stored as .0/.1 chunks.
  // The previous endsWith("-auth-token") check never matched those chunks,
  // causing the proxy to treat every Google-authenticated user as anonymous.
  const AUTH_TOKEN_RE = /^sb-.+-auth-token(\.\d+)?$/;
  const hasSession = request.cookies
    .getAll()
    .some((c) => AUTH_TOKEN_RE.test(c.name));

  // Protect /dashboard/** and /onboarding.
  if (
    !hasSession &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages.
  if (hasSession && (pathname === "/sign-in" || pathname === "/sign-up")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all paths except Next.js internals, static assets,
    // the /r/ redirect handler (must stay fast), and webhook endpoints.
    "/((?!_next/static|_next/image|favicon.ico|r/|api/webhooks/).*)",
  ],
};
