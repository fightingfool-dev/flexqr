import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { verifyApiKey } from "@/actions/api-keys";
import { generateShortCode } from "@/lib/qr";
import { PLAN_LIMITS } from "@/lib/plans";
import { normalizeUrl } from "@/lib/url";
import type { Plan } from "@/lib/database.types";

function bearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7);
}

function err(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req: NextRequest) {
  const raw = bearerToken(req);
  if (!raw) return err("Missing Authorization header", 401);

  const ctx = await verifyApiKey(raw);
  if (!ctx) return err("Invalid or revoked API key", 401);

  const url = new URL(req.url);
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") ?? "20", 10)));
  const offset = (page - 1) * limit;

  const { data, count } = await supabaseAdmin
    .from("qr_codes")
    .select("id, shortCode, name, destinationUrl, type, isActive, scanCount, createdAt", { count: "exact" })
    .eq("workspaceId", ctx.workspaceId)
    .order("createdAt", { ascending: false })
    .range(offset, offset + limit - 1);

  return NextResponse.json({
    data: data ?? [],
    pagination: { page, limit, total: count ?? 0 },
  });
}

export async function POST(req: NextRequest) {
  const raw = bearerToken(req);
  if (!raw) return err("Missing Authorization header", 401);

  const ctx = await verifyApiKey(raw);
  if (!ctx) return err("Invalid or revoked API key", 401);

  let body: { name?: string; destinationUrl?: string };
  try {
    body = await req.json();
  } catch {
    return err("Invalid JSON body", 400);
  }

  const name = (body.name ?? "").trim();
  const rawUrl = (body.destinationUrl ?? "").trim();

  if (!name) return err("name is required", 400);
  if (!rawUrl) return err("destinationUrl is required", 400);

  const destinationUrl = normalizeUrl(rawUrl);
  try {
    new URL(destinationUrl);
  } catch {
    return err("destinationUrl must be a valid URL", 400);
  }

  // Enforce plan limit
  const { count } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("workspaceId", ctx.workspaceId);

  const limit = PLAN_LIMITS[ctx.plan as Plan] ?? 1;
  if ((count ?? 0) >= limit) {
    return err(`Plan limit reached (${limit} QR codes). Upgrade your plan.`, 402);
  }

  const shortCode = await generateShortCode();
  const { data, error } = await supabaseAdmin
    .from("qr_codes")
    .insert({
      workspaceId: ctx.workspaceId,
      shortCode,
      name,
      destinationUrl,
      type: "URL",
      tags: [],
      updatedAt: new Date().toISOString(),
    })
    .select("id, shortCode, name, destinationUrl, type, isActive, scanCount, createdAt")
    .single();

  if (error || !data) return err(error?.message ?? "Failed to create QR code", 500);

  return NextResponse.json({ data }, { status: 201 });
}
