"use server";

import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateQRSvg, shortCodeUrl } from "@/lib/qr";
import { logError } from "@/lib/logger";

export async function saveQRDesign(
  qrCodeId: string,
  fgColor: string,
  bgColor: string
): Promise<{ error?: string }> {
  try {
    await requireUser();

    const { error } = await supabaseAdmin.from("qr_designs").upsert(
      { qrCodeId, fgColor, bgColor },
      { onConflict: "qrCodeId" }
    );

    if (error) return { error: error.message };
    return {};
  } catch (err) {
    logError("action:saveQRDesign", err, { qrCodeId });
    return { error: "Something went wrong. Please try again." };
  }
}

export async function getQRDesignSvg(qrCodeId: string): Promise<string | null> {
  try {
    await requireUser();

    const [{ data: qr }, { data: design }] = await Promise.all([
      supabaseAdmin
        .from("qr_codes")
        .select("shortCode")
        .eq("id", qrCodeId)
        .single(),
      supabaseAdmin
        .from("qr_designs")
        .select("fgColor, bgColor")
        .eq("qrCodeId", qrCodeId)
        .maybeSingle(),
    ]);

    if (!qr) return null;

    return generateQRSvg(
      shortCodeUrl(qr.shortCode as string),
      design?.fgColor ?? "#000000",
      design?.bgColor ?? "#FFFFFF"
    );
  } catch (err) {
    logError("action:getQRDesignSvg", err, { qrCodeId });
    return null;
  }
}
