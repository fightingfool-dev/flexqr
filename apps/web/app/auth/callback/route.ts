import { type NextRequest, NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { syncUser } from "@/lib/auth";

// Handles Supabase email confirmation and OAuth redirects.
// Supabase appends ?code=... after verifying the token.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  // Only allow relative paths — prevent open-redirect to external URLs.
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  // Create the redirect response first so we can attach cookies to it.
  const response = NextResponse.redirect(new URL(next, origin));

  if (code) {
    // Build a Supabase client whose setAll writes cookies onto the redirect
    // response — NOT onto next/headers (which is read-only in route handlers
    // and doesn't propagate to NextResponse objects).
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options);
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      try {
        await syncUser(data.user);
      } catch {
        // syncUser failure is non-fatal — the session is already established
      }
    }
  }

  return response;
}
