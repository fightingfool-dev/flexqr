import { type NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import type { VCardContent } from "@/lib/qr-builder-types";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ shortCode: string }> }
) {
  const { shortCode } = await params;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("contentJson, isActive, name")
    .eq("shortCode", shortCode)
    .eq("type", "VCARD")
    .single();

  if (!data || !data.isActive) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const c = data.contentJson as VCardContent;
  const fn = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();

  const lines: string[] = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fn}`,
    `N:${c.lastName ?? ""};${c.firstName ?? ""};;;`,
  ];
  if (c.email) lines.push(`EMAIL:${c.email}`);
  if (c.phone) lines.push(`TEL:${c.phone}`);
  if (c.company) lines.push(`ORG:${c.company}`);
  if (c.title) lines.push(`TITLE:${c.title}`);
  if (c.website) lines.push(`URL:${c.website}`);
  if (c.address) lines.push(`ADR:;;${c.address};;;;`);
  lines.push("END:VCARD");

  const vcf = lines.join("\r\n");
  const safeName = fn.replace(/[^a-zA-Z0-9_-]/g, "_") || "contact";

  return new Response(vcf, {
    headers: {
      "Content-Type": "text/vcard;charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeName}.vcf"`,
      "Cache-Control": "no-store",
    },
  });
}
