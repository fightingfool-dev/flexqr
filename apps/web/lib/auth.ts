import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";
import { supabaseAdmin } from "./supabase/admin";
import type { DbUser, DbWorkspace } from "./database.types";

export async function getUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// Redirects to /sign-in if no active session. Use in server components/actions.
export async function requireUser() {
  const user = await getUser();
  if (!user) redirect("/sign-in");
  return user;
}

// Returns the public.users row for the given Supabase auth user ID.
export async function getDbUser(authUserId: string): Promise<DbUser | null> {
  const { data } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("id", authUserId)
    .single();
  return data as DbUser | null;
}

// Upserts auth user into public.users. Called after sign-in / email confirmation.
export async function syncUser(authUser: {
  id: string;
  email?: string;
  user_metadata?: { full_name?: string; avatar_url?: string; name?: string };
}): Promise<void> {
  if (!authUser.email) return;
  await supabaseAdmin.from("users").upsert(
    {
      id: authUser.id,
      email: authUser.email,
      name: authUser.user_metadata?.full_name ?? authUser.user_metadata?.name ?? null,
      avatarUrl: authUser.user_metadata?.avatar_url ?? null,
    },
    { onConflict: "id" }
  );
}

// Returns all workspaces the user is a member of.
export async function getUserWorkspaces(userId: string): Promise<DbWorkspace[]> {
  const { data } = await supabaseAdmin
    .from("workspace_members")
    .select("workspaces(*)")
    .eq("userId", userId);

  if (!data) return [];
  return (data as unknown as { workspaces: DbWorkspace | null }[])
    .map((row) => row.workspaces)
    .filter((w): w is DbWorkspace => w !== null);
}
