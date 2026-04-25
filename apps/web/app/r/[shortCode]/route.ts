import { createHash } from "crypto";
import { type NextRequest, NextResponse, after } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getCachedEntry, setCachedEntry } from "@/lib/redis";
import { parseUA } from "@/lib/ua";
import { logError } from "@/lib/logger";

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
      await supabaseAdmin
        .from("qr_codes")
        .update({
          scanCount: ((qr.scanCount as number) ?? 0) + 1,
          updatedAt: new Date().toISOString(),
        })
        .eq("id", qrCodeId);
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
        .select("id, destinationUrl, isActive")
        .eq("shortCode", shortCode)
        .single();

      if (!data || !data.isActive) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      entry = { id: data.id as string, url: data.destinationUrl as string };
      await setCachedEntry(shortCode, entry);
    }

    const capturedEntry = entry;
    after(() => logScan(capturedEntry.id, request));

    return NextResponse.redirect(capturedEntry.url, { status: 307 });
  } catch (err) {
    logError("redirect:GET", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
