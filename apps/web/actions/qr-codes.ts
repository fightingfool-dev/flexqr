"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateShortCode } from "@/lib/qr";
import { invalidateCachedEntry } from "@/lib/redis";
import { PLAN_LIMITS } from "@/lib/plans";

type State = { error?: string };

export async function createQRCode(
  _prev: State,
  formData: FormData
): Promise<State> {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0];
  if (!workspace) return { error: "No workspace found." };

  const name = (formData.get("name") as string).trim();
  const destinationUrl = (formData.get("destinationUrl") as string).trim();

  if (!name) return { error: "Name is required." };
  if (!destinationUrl) return { error: "Destination URL is required." };

  // Validate URL format
  try {
    new URL(destinationUrl);
  } catch {
    return { error: "Destination URL must be a valid URL (include https://)." };
  }

  // Enforce plan limits
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

  const shortCode = await generateShortCode();

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
  redirect("/dashboard/qr-codes");
}

export async function updateQRCode(
  id: string,
  _prev: State,
  formData: FormData
): Promise<State> {
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
  redirect("/dashboard/qr-codes");
}

// Used as a form action: deleteQRCode.bind(null, id)
export async function deleteQRCode(
  id: string,
  _formData: FormData
): Promise<void> {
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
}

// Called from a client-side startTransition — no FormData needed.
export async function toggleQRCode(
  id: string,
  currentlyActive: boolean
): Promise<void> {
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

  // Evict cache regardless of direction — next scan must see the live isActive value
  if (existing) await invalidateCachedEntry(existing.shortCode as string);
  revalidatePath("/dashboard/qr-codes");
  revalidatePath("/dashboard");
}
