export type TrackProperties = Record<string, unknown>;

export function track(event: string, properties?: TrackProperties): void {
  if (typeof window === "undefined") return;

  if (process.env.NODE_ENV === "development") {
    console.log("[FlexQR Analytics]", {
      event,
      properties: properties ?? {},
      timestamp: new Date().toISOString(),
    });
  }

  // TODO: call real provider here (PostHog, Segment, Plausible, etc.)
  // e.g. posthog.capture(event, properties)
}
