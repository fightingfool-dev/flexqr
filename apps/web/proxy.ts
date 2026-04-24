import { type NextRequest, NextResponse } from "next/server";

// Next.js 16: file is proxy.ts, export must be named `proxy`.
//
// Session cookie refresh and full user validation happen in the layout via
// the Supabase server client (lib/supabase/server.ts). The proxy does only
// lightweight, optimistic checks — no network calls.

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard/** routes using the presence of a Supabase session cookie.
  // Supabase @supabase/ssr stores the session in a cookie prefixed "sb-" ending "-auth-token".
  const hasSession = request.cookies
    .getAll()
    .some((c) => c.name.startsWith("sb-") && c.name.endsWith("-auth-token"));

  if (!hasSession && (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding"))) {
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
