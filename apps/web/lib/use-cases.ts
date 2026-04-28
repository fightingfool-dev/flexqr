// Single source of truth for all use-case configuration.
// Used by: SEO pages, /create page, confirm flow, nav links.

export type UseCaseSlug =
  | "restaurant-menu"
  | "flyer-tracking"
  | "business-card"
  | "events"
  | "packaging"
  | "real-estate";

export interface UseCaseConfig {
  slug: UseCaseSlug;
  /** h1 on the context URL-input step */
  heading: string;
  /** helper copy below heading */
  helper: string;
  /** URL input placeholder */
  placeholder: string;
  /** default QR name pre-filled in dashboard */
  suggestedName: string;
  /** type param used in /create?type=<qrType> */
  qrType: "website" | "vcard" | "wifi" | "pdf";
  /** href of the SEO landing page */
  pageHref: string;
  /** full CTA href with type+usecase params */
  ctaHref: string;
}

export const USE_CASES: Record<UseCaseSlug, UseCaseConfig> = {
  "restaurant-menu": {
    slug: "restaurant-menu",
    heading: "Create a restaurant menu QR code",
    helper:
      "Upload or link your menu, then generate a QR code customers can scan at the table.",
    placeholder: "Paste your menu link or restaurant page URL",
    suggestedName: "Restaurant Menu QR",
    qrType: "website",
    pageHref: "/qr-code-for-restaurant-menu",
    ctaHref: "/create?type=website&usecase=restaurant-menu",
  },
  "flyer-tracking": {
    slug: "flyer-tracking",
    heading: "Create a flyer tracking QR code",
    helper:
      "Add a QR code to posters, flyers, or printed campaigns and track every scan.",
    placeholder: "Paste the campaign landing page URL",
    suggestedName: "Flyer Tracking QR",
    qrType: "website",
    pageHref: "/qr-code-for-flyer-tracking",
    ctaHref: "/create?type=website&usecase=flyer-tracking",
  },
  "business-card": {
    slug: "business-card",
    heading: "Create a business card QR code",
    helper:
      "Share your contact details with a scannable digital business card.",
    placeholder: "Paste your portfolio, LinkedIn, or personal website URL",
    suggestedName: "Business Card QR",
    qrType: "vcard",
    pageHref: "/qr-code-for-business-card",
    ctaHref: "/create?type=vcard&usecase=business-card",
  },
  events: {
    slug: "events",
    heading: "Create an event QR code",
    helper:
      "Send attendees to tickets, schedules, maps, registration pages, or event updates.",
    placeholder: "Paste your event page or registration link",
    suggestedName: "Event QR",
    qrType: "website",
    pageHref: "/qr-code-for-events",
    ctaHref: "/create?type=website&usecase=events",
  },
  packaging: {
    slug: "packaging",
    heading: "Create a packaging QR code",
    helper:
      "Connect product packaging to instructions, offers, videos, reviews, or tracking analytics.",
    placeholder: "Paste your product page, offer, or support URL",
    suggestedName: "Packaging QR",
    qrType: "website",
    pageHref: "/qr-code-for-packaging",
    ctaHref: "/create?type=website&usecase=packaging",
  },
  "real-estate": {
    slug: "real-estate",
    heading: "Create a real estate QR code",
    helper:
      "Link property listings, virtual tours, or agent pages to yard signs, flyers, and brochures.",
    placeholder: "Paste your property listing or agent profile URL",
    suggestedName: "Real Estate QR",
    qrType: "website",
    pageHref: "/qr-code-for-real-estate",
    ctaHref: "/create?type=website&usecase=real-estate",
  },
};

export function getUseCaseConfig(slug: string): UseCaseConfig | null {
  return (USE_CASES as Record<string, UseCaseConfig>)[slug] ?? null;
}

export function isValidUseCase(slug: string): slug is UseCaseSlug {
  return slug in USE_CASES;
}

export function getSuggestedQRName(slug: string): string {
  return getUseCaseConfig(slug)?.suggestedName ?? "My QR Code";
}

export function getUseCasePlaceholder(slug: string): string {
  return getUseCaseConfig(slug)?.placeholder ?? "https://your-link.com";
}

export function getUseCaseHelper(slug: string): string {
  return getUseCaseConfig(slug)?.helper ?? "";
}

export function getUseCaseHeading(slug: string): string {
  return getUseCaseConfig(slug)?.heading ?? "Create a QR code";
}

export function getQRTypeFromUseCase(slug: string): string {
  return getUseCaseConfig(slug)?.qrType ?? "website";
}

export function getUseCaseCreateUrl(slug: UseCaseSlug): string {
  return USE_CASES[slug].ctaHref;
}
