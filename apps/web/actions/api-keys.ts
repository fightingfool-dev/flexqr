"use server";

import { createHash, randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logError, isNextInternalError } from "@/lib/logger";

type State = { error?: string; newKey?: string };

export async function createApiKey(
  _prev: State,
  formData: FormData
): Promise<State> {
  try {
    const authUser = await requireUser();
    const workspaces = await getUserWorkspaces(authUser.id);
    const workspace = workspaces[0];
    if (!workspace) return { error: "No workspace found." };

    // API keys available on STARTER+
    if (workspace.plan === "FREE") {
      return { error: "API access requires a Starter plan or higher." };
    }

    const name = (formData.get("name") as string).trim();
    if (!name) return { error: "Key name is required." };

    // Check limit (max 10 active keys)
    const { count } = await supabaseAdmin
      .from("api_keys")
      .select("*", { count: "exact", head: true })
      .eq("workspaceId", workspace.id)
      .is("revokedAt", null);

    if ((count ?? 0) >= 10) return { error: "Maximum of 10 active API keys per workspace." };

    const rawKey = `aqr_${randomBytes(24).toString("hex")}`;
    const keyHash = createHash("sha256").update(rawKey).digest("hex");
    const keyPrefix = rawKey.slice(0, 12); // "aqr_" + 8 chars

    const { error } = await supabaseAdmin.from("api_keys").insert({
      workspaceId: workspace.id,
      name,
      keyHash,
      keyPrefix,
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/settings");
    // Return the raw key once — it's never shown again
    return { newKey: rawKey };
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createApiKey", err);
    return { error: "Something went wrong." };
  }
}

export async function revokeApiKey(keyId: string): Promise<void> {
  try {
    await requireUser();
    await supabaseAdmin
      .from("api_keys")
      .update({ revokedAt: new Date().toISOString() })
      .eq("id", keyId);
    revalidatePath("/dashboard/settings");
  } catch (err) {
    logError("action:revokeApiKey", err, { keyId });
  }
}

export async function verifyApiKey(rawKey: string): Promise<{ workspaceId: string; plan: string } | null> {
  if (!rawKey.startsWith("aqr_")) return null;
  const keyHash = createHash("sha256").update(rawKey).digest("hex");

  const { data } = await supabaseAdmin
    .from("api_keys")
    .select("workspaceId, revokedAt")
    .eq("keyHash", keyHash)
    .is("revokedAt", null)
    .maybeSingle();

  if (!data) return null;

  // Update lastUsedAt (fire-and-forget)
  void supabaseAdmin
    .from("api_keys")
    .update({ lastUsedAt: new Date().toISOString() })
    .eq("keyHash", keyHash)
    .then(() => {}, () => {});

  const { data: workspace } = await supabaseAdmin
    .from("workspaces")
    .select("id, plan")
    .eq("id", data.workspaceId)
    .single();

  if (!workspace) return null;
  return { workspaceId: workspace.id as string, plan: workspace.plan as string };
}
