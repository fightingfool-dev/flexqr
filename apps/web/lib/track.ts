import { getSessionId } from "./session-id";
import { trackEvent } from "@/actions/tracking";

export type TrackProperties = Record<string, unknown>;

export function track(event: string, properties?: TrackProperties): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.log("[AnalogQR Analytics]", {
      event,
      properties: properties ?? {},
      timestamp: new Date().toISOString(),
    });
  }

  const sessionId = getSessionId();
  trackEvent(sessionId, event, properties ?? {}).catch(() => {});
}
