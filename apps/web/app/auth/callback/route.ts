import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { syncUser } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  console.log("[auth/callback] received", {
    hasCode: !!code,
    next,
    cookieNames: request.cookies.getAll().map((c) => c.name),
  });

  if (!code) {
    // No code means the OAuth flow was cancelled or an error occurred upstream.
    const errorParam = searchParams.get("error") ?? "no_code";
    console.error("[auth/callback] missing code param, error:", errorParam);
    return NextResponse.redirect(
      new URL(`/sign-in?error=${encodeURIComponent(errorParam)}`, origin)
    );
  }

  // Build a Supabase client that reads cookies from the request and writes
  // session cookies directly onto the redirect response (not next/headers,
  // which is read-only in route handlers and doesn't propagate to the response).
  const response = NextResponse.redirect(new URL(next, origin));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(
          cookiesToSet: { name: string; value: string; options: CookieOptions }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", {
      message: error.message,
      status: error.status,
    });
    return NextResponse.redirect(
      new URL(
        `/sign-in?error=${encodeURIComponent(error.message)}`,
        origin
      )
    );
  }

  if (!data.user) {
    console.error("[auth/callback] exchangeCodeForSession returned no user");
    return NextResponse.redirect(
      new URL("/sign-in?error=no_user", origin)
    );
  }

  console.log("[auth/callback] session established for user:", data.user.id);

  try {
    await syncUser(data.user);
    console.log("[auth/callback] syncUser ok");
  } catch (err) {
    // syncUser failure means the DB upsert failed. Log it, but don't abort —
    // the Supabase session is already established and the user can still log in.
    console.error("[auth/callback] syncUser failed (non-fatal):", err);
  }

  console.log("[auth/callback] redirecting to", next);
  return response;
}
