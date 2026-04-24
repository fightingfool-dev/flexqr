"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";

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
  const user = await requireUser();
  const name = (formData.get("name") as string).trim();

  if (!name) return { error: "Workspace name is required." };

  // Insert workspace — DB generates the id via DEFAULT gen_random_uuid()::text.
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

  // Insert owner membership — DB generates its own id too.
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

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
