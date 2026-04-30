import { type NextRequest, NextResponse } from "next/server";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateShortCode } from "@/lib/qr";
import { PLAN_LIMITS } from "@/lib/plans";
import { normalizeUrl } from "@/lib/url";
import type { Plan } from "@/lib/database.types";

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0];
    if (!workspace) return NextResponse.json({ error: "No workspace found." }, { status: 400 });

    const body = await req.json() as { rows: { name: string; url: string }[] };
    const rows = (body.rows ?? []).slice(0, 100); // max 100 at once

    if (rows.length === 0) return NextResponse.json({ error: "No rows provided." }, { status: 400 });

    // Check available capacity
    const { count } = await supabaseAdmin
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .eq("workspaceId", workspace.id);

    const limit = PLAN_LIMITS[workspace.plan as Plan] ?? 1;
    const available = limit === Infinity ? rows.length : Math.max(0, limit - (count ?? 0));

    if (available === 0) {
      return NextResponse.json(
        { error: `QR code limit reached (${limit}). Upgrade your plan to import more.` },
        { status: 402 }
      );
    }

    const toInsert = rows.slice(0, available);
    const errors: string[] = [];
    let created = 0;

    for (const row of toInsert) {
      const destinationUrl = normalizeUrl(row.url);
      try {
        new URL(destinationUrl);
      } catch {
        errors.push(`Invalid URL: ${row.url}`);
        continue;
      }

      const shortCode = await generateShortCode();
      const { error } = await supabaseAdmin.from("qr_codes").insert({
        workspaceId: workspace.id,
        shortCode,
        name: row.name,
        destinationUrl,
        type: "URL",
        tags: [],
        updatedAt: new Date().toISOString(),
      });

      if (error) {
        errors.push(`Failed to create "${row.name}": ${error.message}`);
      } else {
        created++;
      }
    }

    return NextResponse.json({ created, errors });
  } catch {
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
