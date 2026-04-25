import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

type QRRow = {
  id: string;
  name: string;
  shortCode: string;
  destinationUrl: string;
  workspaceId: string;
};

export type AuthResult =
  | { ok: true; qr: QRRow; userId: string }
  | { ok: false; response: NextResponse };

export async function requireQRAccess(qrCodeId: string): Promise<AuthResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { data: qr } = await supabaseAdmin
    .from("qr_codes")
    .select("id, name, shortCode, destinationUrl, workspaceId")
    .eq("id", qrCodeId)
    .single();

  if (!qr) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Not found" }, { status: 404 }),
    };
  }

  const { data: membership } = await supabaseAdmin
    .from("workspace_members")
    .select("id")
    .eq("workspaceId", qr.workspaceId)
    .eq("userId", user.id)
    .single();

  if (!membership) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { ok: true, qr: qr as QRRow, userId: user.id };
}
