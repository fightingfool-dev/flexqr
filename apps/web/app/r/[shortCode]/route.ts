import { createHash } from "crypto";
import { type NextRequest, NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCachedEntry, setCachedEntry, redis } from "@/lib/redis";
import { parseUA } from "@/lib/ua";
import { logError } from "@/lib/logger";
import { sendScanMilestoneEmail } from "@/lib/email";

const MILESTONES = [10, 50, 100, 500, 1000, 5000, 10000];

async function checkMilestone(qrCodeId: string, newCount: number): Promise<void> {
  const milestone = MILESTONES.find((m) => newCount === m);
  if (!milestone) return;

  // Use Redis to avoid duplicate notifications (fall back gracefully if no Redis)
  if (redis) {
    const key = `notif:${qrCodeId}:${milestone}`;
    const already = await redis.get(key).catch(() => null);
    if (already) return;
    await redis.set(key, "1", { ex: 60 * 60 * 24 * 365 }).catch(() => {});
  }

  // Get QR code name + workspace owner email
  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("name, workspaceId")
    .eq("id", qrCodeId)
    .single();

  if (!data) return;

  const { data: ownerRow } = await supabaseAdmin
    .from("workspace_members")
    .select("users(email)")
    .eq("workspaceId", data.workspaceId)
    .eq("role", "OWNER")
    .maybeSingle();

  const ownerEmail = (ownerRow as unknown as { users: { email: string } | null } | null)?.users?.email;
  if (!ownerEmail) return;

  await sendScanMilestoneEmail(ownerEmail, data.name as string, milestone, qrCodeId);
}

async function logScan(qrCodeId: string, request: NextRequest) {
  try {
    const ua = request.headers.get("user-agent") ?? "";
    const { deviceType, os, browser } = parseUA(ua);

    const country =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry") ??
      null;

    const rawIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      null;
    const ipHash = rawIp
      ? createHash("sha256").update(rawIp).digest("hex")
      : null;

    await supabaseAdmin.from("scans").insert({
      qrCodeId,
      deviceType,
      os,
      browser,
      country,
      ipHash,
    });

    // Increment denormalized scan counter directly — no RPC required.
    const { data: qr } = await supabaseAdmin
      .from("qr_codes")
      .select("scanCount")
      .eq("id", qrCodeId)
      .single();

    if (qr) {
      const newCount = ((qr.scanCount as number) ?? 0) + 1;
      await supabaseAdmin
        .from("qr_codes")
        .update({ scanCount: newCount, updatedAt: new Date().toISOString() })
        .eq("id", qrCodeId);
      await checkMilestone(qrCodeId, newCount).catch(() => {});
    }
  } catch (err) {
    logError("redirect:logScan", err, { qrCodeId });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  try {
    const { shortCode } = await params;

    let entry = await getCachedEntry(shortCode);

    if (!entry) {
      const { data } = await supabaseAdmin
        .from("qr_codes")
        .select("id, destinationUrl, isActive, type, contentJson")
        .eq("shortCode", shortCode)
        .single();

      if (!data || !data.isActive) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      entry = {
        id: data.id as string,
        url: data.destinationUrl as string,
        type: data.type as string,
        contentJson: data.contentJson as Record<string, unknown> | undefined,
      };
      await setCachedEntry(shortCode, entry);
    }

    const capturedEntry = entry;
    after(() => logScan(capturedEntry.id, request));

    let target = capturedEntry.url;
    if (capturedEntry.type === "APP_LINK" && capturedEntry.contentJson) {
      const ua = request.headers.get("user-agent") ?? "";
      const { iosUrl, androidUrl } = capturedEntry.contentJson as {
        iosUrl?: string;
        androidUrl?: string;
      };
      if (/iphone|ipad|ipod/i.test(ua) && iosUrl) target = iosUrl;
      else if (/android/i.test(ua) && androidUrl) target = androidUrl;
    }

    return NextResponse.redirect(target, { status: 307 });
  } catch (err) {
    logError("redirect:GET", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
