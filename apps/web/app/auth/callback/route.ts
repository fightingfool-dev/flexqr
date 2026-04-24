import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/auth";

// Handles Supabase email confirmation and OAuth redirects.
// Supabase appends ?code=... after verifying the token.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/dashboard";
  // Only allow relative paths — prevent open-redirect to external URLs.
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      await syncUser(data.user);
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return NextResponse.redirect(new URL(next, appUrl));
}
