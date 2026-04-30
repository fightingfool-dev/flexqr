"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logError, isNextInternalError } from "@/lib/logger";
import { sendWelcomeEmail } from "@/lib/email";

type WorkspaceState = { error?: string };

function toSlug(name: string): string {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export async function createWorkspace(
  _prevState: WorkspaceState,
  formData: FormData
): Promise<WorkspaceState> {
  try {
    const user = await requireUser();
    const name = (formData.get("name") as string).trim();
    const rawNext = (formData.get("next") as string | null)?.trim() ?? "";
    const next = rawNext.startsWith("/") ? rawNext : "/dashboard";

    if (!name) return { error: "Workspace name is required." };

    const { data: wsData, error: wsError } = await supabaseAdmin
      .from("workspaces")
      .insert({
        slug: toSlug(name),
        name,
        plan: "FREE",
        updatedAt: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (wsError) return { error: wsError.message };

    const { error: memberError } = await supabaseAdmin
      .from("workspace_members")
      .insert({
        workspaceId: wsData.id,
        userId: user.id,
        role: "OWNER",
      });

    if (memberError) {
      await supabaseAdmin.from("workspaces").delete().eq("id", wsData.id);
      return { error: memberError.message };
    }

    if (user.email) sendWelcomeEmail(user.email, user.user_metadata?.full_name ?? user.email).catch(() => {});

    revalidatePath("/dashboard");
    redirect(next);
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createWorkspace", err);
    return { error: "Something went wrong. Please try again." };
  }
}
