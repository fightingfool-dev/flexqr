"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateShortCode } from "@/lib/qr";
import { invalidateCachedEntry } from "@/lib/redis";
import { PLAN_LIMITS } from "@/lib/plans";
import { insertEvent } from "@/lib/tracking";
import { logError, isNextInternalError } from "@/lib/logger";

type State = { error?: string };

export async function createQRCode(
  _prev: State,
  formData: FormData
): Promise<State> {
  try {
    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0];
    if (!workspace) return { error: "No workspace found." };

    const name = (formData.get("name") as string).trim();
    const destinationUrl = (formData.get("destinationUrl") as string).trim();

    if (!name) return { error: "Name is required." };
    if (!destinationUrl) return { error: "Destination URL is required." };

    try {
      new URL(destinationUrl);
    } catch {
      return { error: "Destination URL must be a valid URL (include https://)." };
    }

    const { count } = await supabaseAdmin
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .eq("workspaceId", workspace.id);

    const limit = PLAN_LIMITS[workspace.plan];
    if (count !== null && count >= limit) {
      return {
        error: `Your ${workspace.plan} plan allows up to ${limit} QR codes. Upgrade to create more.`,
      };
    }

    const rawCustom =
      (formData.get("customShortCode") as string | null)
        ?.trim()
        .toLowerCase() ?? "";

    let shortCode: string;
    if (rawCustom && workspace.plan !== "FREE") {
      if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(rawCustom)) {
        return {
          error:
            "Short code must be 3–30 characters: lowercase letters, numbers, and hyphens, not starting or ending with a hyphen.",
        };
      }
      const { data: taken } = await supabaseAdmin
        .from("qr_codes")
        .select("id")
        .eq("shortCode", rawCustom)
        .maybeSingle();
      if (taken) {
        return {
          error: `Short code "${rawCustom}" is already taken. Try another.`,
        };
      }
      shortCode = rawCustom;
    } else {
      shortCode = await generateShortCode();
    }

    const { error } = await supabaseAdmin.from("qr_codes").insert({
      workspaceId: workspace.id,
      shortCode,
      name,
      destinationUrl,
      type: "URL",
      tags: [],
      updatedAt: new Date().toISOString(),
    });

    if (error) return { error: error.message };

    revalidatePath("/dashboard/qr-codes");
    revalidatePath("/dashboard");
    after(() =>
      insertEvent("qr_created", { name, workspaceId: workspace.id }, { userId: user.id })
        .catch((err) => logError("tracking:qr_created", err))
    );
    redirect("/dashboard/qr-codes");
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createQRCode", err);
    return { error: "Something went wrong. Please try again." };
  }
}

export async function updateQRCode(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
  try {
    await requireUser();

    const name = (formData.get("name") as string).trim();
    const destinationUrl = (formData.get("destinationUrl") as string).trim();

    if (!name) return { error: "Name is required." };
    if (!destinationUrl) return { error: "Destination URL is required." };

    try {
      new URL(destinationUrl);
    } catch {
      return { error: "Destination URL must be a valid URL (include https://)." };
    }

    const { data: existing } = await supabaseAdmin
      .from("qr_codes")
      .select("shortCode")
      .eq("id", id)
      .single();

    const { error } = await supabaseAdmin
      .from("qr_codes")
      .update({ name, destinationUrl, updatedAt: new Date().toISOString() })
      .eq("id", id);

    if (error) return { error: error.message };

    if (existing) await invalidateCachedEntry(existing.shortCode as string);

    revalidatePath("/dashboard/qr-codes");
    revalidatePath(`/dashboard/qr-codes/${id}`);
    revalidatePath(`/dashboard/qr-codes/${id}/analytics`);
    return {};
  } catch (err) {
    logError("action:updateQRCode", err, { id });
    return { error: "Something went wrong. Please try again." };
  }
}

export async function deleteQRCode(
  id: string,
  _formData: FormData
): Promise<void> {
  try {
    await requireUser();

    const { data: existing } = await supabaseAdmin
      .from("qr_codes")
      .select("shortCode")
      .eq("id", id)
      .single();

    await supabaseAdmin.from("qr_codes").delete().eq("id", id);

    if (existing) await invalidateCachedEntry(existing.shortCode as string);
    revalidatePath("/dashboard/qr-codes");
    revalidatePath("/dashboard");
  } catch (err) {
    logError("action:deleteQRCode", err, { id });
    throw err;
  }
}

export async function toggleQRCode(
  id: string,
  currentlyActive: boolean
): Promise<void> {
  try {
    await requireUser();

    const { data: existing } = await supabaseAdmin
      .from("qr_codes")
      .select("shortCode")
      .eq("id", id)
      .single();

    await supabaseAdmin
      .from("qr_codes")
      .update({ isActive: !currentlyActive, updatedAt: new Date().toISOString() })
      .eq("id", id);

    if (existing) await invalidateCachedEntry(existing.shortCode as string);
    revalidatePath("/dashboard/qr-codes");
    revalidatePath("/dashboard");
  } catch (err) {
    logError("action:toggleQRCode", err, { id });
    throw err;
  }
}
