// Types and utilities for the multi-type QR builder.
// No React imports — safe to use in server actions and client components.

export type QRBuilderType =
  | "URL"
  | "PDF"
  | "IMAGE"
  | "VCARD"
  | "VIDEO"
  | "APP_LINK"
  | "WHATSAPP"
  | "WIFI"
  | "FEEDBACK"
  | "MENU";

export interface WebsiteContent {
  url: string;
}

export interface PdfContent {
  fileUrl: string;
}

export interface ImageContent {
  imageUrl: string;
}

export interface VCardContent {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  company?: string;
  title?: string;
  website?: string;
  address?: string;
}

export interface VideoContent {
  videoUrl: string;
}

export interface AppLinkContent {
  iosUrl: string;
  androidUrl?: string;
  webUrl: string;
}

export interface WhatsAppContent {
  phone: string;
  message?: string;
}

export interface WifiContent {
  ssid: string;
  security: "WPA" | "WEP" | "nopass";
  password?: string;
  hidden?: boolean;
}

export interface FeedbackContent {
  url: string;
  platform?: string;
}

export interface MenuItemEntry {
  name: string;
  price?: string;
  description?: string;
  imageUrl?: string;
}

export interface MenuSectionEntry {
  name: string;
  items: MenuItemEntry[];
}

export interface MenuContent {
  restaurantName: string;
  tagline?: string;
  phone?: string;
  address?: string;
  coverImageUrl?: string;
  sections: MenuSectionEntry[];
}

export type QRContent =
  | WebsiteContent
  | PdfContent
  | ImageContent
  | VCardContent
  | VideoContent
  | AppLinkContent
  | WhatsAppContent
  | WifiContent
  | FeedbackContent
  | MenuContent;

export function computeDestinationUrl(
  type: QRBuilderType,
  contentJson: Record<string, unknown>,
  appUrl: string,
  shortCode?: string
): string {
  switch (type) {
    case "URL":
      return (contentJson.url as string) ?? "";
    case "PDF":
      return (contentJson.fileUrl as string) ?? "";
    case "IMAGE":
      return (contentJson.imageUrl as string) ?? "";
    case "VIDEO":
      return (contentJson.videoUrl as string) ?? "";
    case "FEEDBACK":
      return (contentJson.url as string) ?? "";
    case "WHATSAPP": {
      const phone = ((contentJson.phone as string) ?? "").replace(/\D/g, "");
      const msg = contentJson.message
        ? `?text=${encodeURIComponent(contentJson.message as string)}`
        : "";
      return `https://wa.me/${phone}${msg}`;
    }
    case "WIFI": {
      const ssid = contentJson.ssid as string ?? "";
      const security = (contentJson.security as string) || "WPA";
      const password = (contentJson.password as string) ?? "";
      const hidden = contentJson.hidden ? "H:true;" : "";
      return `WIFI:S:${ssid};T:${security};P:${password};${hidden};`;
    }
    case "APP_LINK":
      return (contentJson.webUrl as string) ?? "";
    case "VCARD":
      if (shortCode) return `${appUrl}/card/${shortCode}`;
      return "";
    case "MENU":
      if (shortCode) return `${appUrl}/menu/${shortCode}`;
      return "";
    default:
      return "";
  }
}

// For the builder preview in step 3 (before QR is actually created).
export function computeBuilderPreviewUrl(
  type: QRBuilderType,
  destinationUrl: string,
  appUrl: string
): string {
  if (type === "WIFI") return destinationUrl;
  const previewCode = _previewCode(destinationUrl);
  const base = appUrl.replace(/\/$/, "");
  return `${base}/r/${previewCode}`;
}

function _previewCode(seed: string): string {
  const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";
  let hash = 5381;
  for (let i = 0; i < seed.length; i++) {
    hash = (Math.imul(31, hash) + seed.charCodeAt(i)) | 0;
  }
  let n = (hash >>> 0) || 1;
  let code = "";
  for (let i = 0; i < 6; i++) {
    n = ((Math.imul(1664525, n) + 1013904223) >>> 0);
    code += ALPHABET[n % ALPHABET.length];
  }
  return code;
}
