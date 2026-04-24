"use server";

import { insertEvent } from "@/lib/tracking";
import { logError } from "@/lib/logger";

export async function trackEvent(
  sessionId: string,
  event: string,
  properties: Record<string, unknown> = {}
): Promise<void> {
  try {
    await insertEvent(event, properties, { sessionId });
  } catch (err) {
    // Tracking must never crash the caller — swallow and log
    logError("action:trackEvent", err);
  }
}
