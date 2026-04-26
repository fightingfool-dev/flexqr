import { type NextRequest, NextResponse } from "next/server";

// Next.js 16: file is proxy.ts, export must be named `proxy`.
//
// Session cookie refresh and full user validation happen in the layout via
// the Supabase server client (lib/supabase/server.ts). The proxy does only
// lightweight, optimistic checks — no network calls.

// Derive the canonical host from NEXT_PUBLIC_APP_URL so we never hardcode it.
// In dev this is "localhost:3000"; in prod it is "www.analogqr.com".
const _appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
let CANONICAL_HOST = "";
try {
  CANONICAL_HOST = new URL(_appUrl).host; // e.g. "www.analogqr.com"
} catch {
  // malformed APP_URL — skip www redirect
}

// The bare domain (no www prefix) that should be redirected to the canonical host.
// e.g. "analogqr.com" → "www.analogqr.com"
const BARE_HOST =
  CANONICAL_HOST.startsWith("www.") ? CANONICAL_HOST.slice(4) : "";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get("host") ?? "";

  // ── 1. Canonical domain redirect ──────────────────────────────────────────
  // If a request arrives on the bare domain (analogqr.com) redirect it to the
  // www canonical domain before any auth logic runs. This guarantees the entire
  // OAuth flow — including the PKCE code-verifier cookie — stays on one domain.
  if (BARE_HOST && host === BARE_HOST) {
    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;
    // 308 preserves the HTTP method (important for POST form submissions).
    return NextResponse.redirect(url, { status: 308 });
  }

  // ── 2. Optimistic session detection ───────────────────────────────────────
  // Supabase @supabase/ssr stores the session in cookies named:
  //   sb-<ref>-auth-token          (single cookie, fits in one chunk)
  //   sb-<ref>-auth-token.0        (first chunk when JWT is too large)
  //   sb-<ref>-auth-token.1 …      (subsequent chunks)
  //
  // Google OAuth sessions carry full user profile metadata, so the JWT
  // regularly exceeds MAX_CHUNK_SIZE (3180 bytes) and is always split into
  // -auth-token.0 / .1 chunks. The old endsWith("-auth-token") check missed
  // every chunked session, causing the proxy to treat logged-in users as
  // anonymous and redirect them to sign-in.
  const AUTH_TOKEN_RE = /^sb-.+-auth-token(\.\d+)?$/;
  const hasSession = request.cookies
    .getAll()
    .some((c) => AUTH_TOKEN_RE.test(c.name));

  // ── 3. Protect /dashboard/** and /onboarding ──────────────────────────────
  if (
    !hasSession &&
    (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // ── 4. Redirect authenticated users away from auth pages ──────────────────
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
