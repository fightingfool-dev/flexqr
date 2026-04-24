import { supabaseAdmin } from "./supabase/admin";

export async function insertEvent(
  event: string,
  properties: Record<string, unknown>,
  ids: { sessionId?: string | null; userId?: string | null } = {}
): Promise<void> {
  await supabaseAdmin.from("events").insert({
    event,
    properties,
    sessionId: ids.sessionId ?? null,
    userId: ids.userId ?? null,
  });
}
