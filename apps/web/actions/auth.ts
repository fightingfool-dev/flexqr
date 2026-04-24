"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { syncUser } from "@/lib/auth";
import { logError, isNextInternalError } from "@/lib/logger";

type AuthState = { error?: string; message?: string };

export async function signIn(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
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
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:signIn", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function signUp(
  _prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rawNext = (formData.get("next") as string | null)?.trim() ?? "";
    const rawPrefill =
      (formData.get("prefillUrl") as string | null)?.trim() ?? "";

    const postSignUpPath = rawNext.startsWith("/")
      ? rawNext
      : rawPrefill
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

    if (data.session && data.user) {
      await syncUser(data.user);
      redirect(postSignUpPath);
    }

    return { message: "Check your email to confirm your account." };
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:signUp", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function signOut(): Promise<void> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
  } catch (err) {
    logError("action:signOut", err);
  }
  redirect("/sign-in");
}
