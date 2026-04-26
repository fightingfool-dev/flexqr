import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(request: NextRequest) {
  const rawNext = request.nextUrl.searchParams.get("next") ?? "/dashboard";
  // Only allow relative paths — prevent open-redirect to external URLs.
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${APP_URL}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      new URL("/sign-in?error=oauth", APP_URL)
    );
  }

  return NextResponse.redirect(data.url);
}
