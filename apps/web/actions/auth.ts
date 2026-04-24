"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/auth";

type AuthState = { error?: string; message?: string };

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rawNext = (formData.get("next") as string | null) ?? "";
  const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error: error.message };

  if (data.user) {
    await syncUser(data.user);
  }

  redirect(next);
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rawPrefill = (formData.get("prefillUrl") as string | null)?.trim() ?? "";

  const postSignUpPath = rawPrefill
    ? `/dashboard/qr-codes/new?prefillUrl=${encodeURIComponent(rawPrefill)}`
    : "/dashboard";

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const emailRedirectTo = `${appUrl}/auth/callback?next=${encodeURIComponent(postSignUpPath)}`;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { emailRedirectTo },
  });

  if (error) return { error: error.message };

  // If email confirmation is disabled in Supabase, a session is returned immediately.
  if (data.session && data.user) {
    await syncUser(data.user);
    redirect(postSignUpPath);
  }

  // Email confirmation is required — tell user to check inbox.
  return { message: "Check your email to confirm your account." };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/sign-in");
}
