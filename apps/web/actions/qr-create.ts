"use server";

import { after } from "next/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateShortCode } from "@/lib/qr";
import { PLAN_LIMITS } from "@/lib/plans";
import { insertEvent } from "@/lib/tracking";
import { logError, isNextInternalError } from "@/lib/logger";
import { env } from "@/lib/env";
import { computeDestinationUrl, type QRBuilderType } from "@/lib/qr-builder-types";
import type { QRDesignSettings } from "@/lib/qr-design-types";

const APP_URL = env.APP_URL;

export async function createQRCodeWithType(
  name: string,
  type: QRBuilderType,
  contentJson: Record<string, unknown>,
  customShortCode: string | null,
  designSettings?: Partial<QRDesignSettings>
): Promise<{ error: string } | void> {
  try {
    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0];
    if (!workspace) return { error: "No workspace found." };

    if (!name.trim()) return { error: "Name is required." };

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

    let shortCode: string;
    const rawCustom = customShortCode?.trim().toLowerCase() ?? "";
    if (rawCustom && workspace.plan !== "FREE") {
      if (!/^[a-z0-9][a-z0-9-]{1,28}[a-z0-9]$/.test(rawCustom)) {
        return {
          error:
            "Short code must be 3–30 characters: lowercase letters, numbers, and hyphens.",
        };
      }
      const { data: taken } = await supabaseAdmin
        .from("qr_codes")
        .select("id")
        .eq("shortCode", rawCustom)
        .maybeSingle();
      if (taken) return { error: `Short code "${rawCustom}" is already taken.` };
      shortCode = rawCustom;
    } else {
      shortCode = await generateShortCode();
    }

    const destinationUrl = computeDestinationUrl(
      type,
      contentJson,
      APP_URL,
      shortCode
    );

    if (!destinationUrl) return { error: "Could not determine destination URL from content." };

    const { data: created, error: insertError } = await supabaseAdmin
      .from("qr_codes")
      .insert({
        workspaceId: workspace.id,
        shortCode,
        name: name.trim(),
        destinationUrl,
        type,
        tags: [],
        contentJson,
        updatedAt: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !created) {
      return { error: insertError?.message ?? "Failed to create QR code." };
    }

    if (designSettings) {
      await supabaseAdmin.from("qr_designs").upsert(
        {
          qrCodeId: created.id,
          fgColor: designSettings.fgColor ?? "#000000",
          bgColor: designSettings.bgColor ?? "#FFFFFF",
          dotStyle: designSettings.dotStyle ?? "square",
          cornerStyle: designSettings.cornerSquareStyle ?? "square",
          logoUrl: designSettings.logoUrl ?? null,
          logoSize: designSettings.logoSize ?? 0.25,
          errorCorrection: designSettings.errorCorrection ?? "M",
          settings: designSettings as unknown as Record<string, unknown>,
        },
        { onConflict: "qrCodeId" }
      );
    }

    revalidatePath("/dashboard/qr-codes");
    revalidatePath("/dashboard");
    after(() =>
      insertEvent("qr_created", { name, type, workspaceId: workspace.id }, { userId: user.id })
        .catch((err) => logError("tracking:qr_created", err))
    );
    redirect(`/dashboard/qr-codes/${created.id}?new=1`);
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createQRCodeWithType", err);
    return { error: "Something went wrong. Please try again." };
  }
}
