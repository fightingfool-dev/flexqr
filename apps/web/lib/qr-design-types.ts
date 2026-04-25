import type { DotType, CornerSquareType, CornerDotType } from "qr-code-styling";

export type FrameType =
  | "none"
  | "simple-bottom"
  | "simple-top"
  | "banner-bottom"
  | "banner-top"
  | "rounded-bottom"
  | "rounded-top"
  | "badge"
  | "circle"
  | "box"
  | "speech"
  | "speech-flipped";

export interface QRDesignSettings {
  fgColor: string;
  bgColor: string;
  dotStyle: DotType;
  cornerSquareStyle: CornerSquareType;
  cornerDotStyle: CornerDotType;
  logoUrl: string | null;
  logoSize: number;
  errorCorrection: "L" | "M" | "Q" | "H";
  frameType: FrameType;
  frameText: string;
  frameColor: string;
  frameTextColor: string;
}

export const DEFAULT_SETTINGS: QRDesignSettings = {
  fgColor: "#000000",
  bgColor: "#FFFFFF",
  dotStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  logoUrl: null,
  logoSize: 0.25,
  errorCorrection: "M",
  frameType: "none",
  frameText: "SCAN ME",
  frameColor: "#000000",
  frameTextColor: "#FFFFFF",
};

export const DOT_STYLES: { value: DotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dots", label: "Dots" },
  { value: "rounded", label: "Rounded" },
  { value: "extra-rounded", label: "Extra" },
  { value: "classy", label: "Classy" },
  { value: "classy-rounded", label: "Classy +" },
];

export const CORNER_SQUARE_STYLES: { value: CornerSquareType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Circle" },
  { value: "extra-rounded", label: "Rounded" },
];

export const CORNER_DOT_STYLES: { value: CornerDotType; label: string }[] = [
  { value: "square", label: "Square" },
  { value: "dot", label: "Circle" },
];

export const FRAME_TYPES: { value: FrameType; label: string }[] = [
  { value: "none", label: "None" },
  { value: "simple-bottom", label: "Label ↓" },
  { value: "simple-top", label: "Label ↑" },
  { value: "banner-bottom", label: "Banner ↓" },
  { value: "banner-top", label: "Banner ↑" },
  { value: "rounded-bottom", label: "Round ↓" },
  { value: "rounded-top", label: "Round ↑" },
  { value: "badge", label: "Badge" },
  { value: "circle", label: "Circle" },
  { value: "box", label: "Box" },
  { value: "speech", label: "Speech ↓" },
  { value: "speech-flipped", label: "Speech ↑" },
];

export type LogoPreset = {
  id: string;
  label: string;
  color: string;
  path: string;
};

export const LOGO_PRESETS: LogoPreset[] = [
  {
    id: "globe",
    label: "Website",
    color: "#3B82F6",
    path: "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  },
  {
    id: "phone",
    label: "Phone",
    color: "#10B981",
    path: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21 16z",
  },
  {
    id: "mail",
    label: "Email",
    color: "#8B5CF6",
    path: "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6",
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    color: "#F59E0B",
    path: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  },
  {
    id: "cart",
    label: "Shop",
    color: "#EF4444",
    path: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",
  },
  {
    id: "play",
    label: "Video",
    color: "#EC4899",
    path: "M5 3l14 9-14 9V3z",
  },
  {
    id: "music",
    label: "Music",
    color: "#14B8A6",
    path: "M9 18V5l12-2v13M9 18c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-2c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2z",
  },
  {
    id: "map-pin",
    label: "Location",
    color: "#F97316",
    path: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2z",
  },
  {
    id: "user",
    label: "Profile",
    color: "#6366F1",
    path: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  },
  {
    id: "star",
    label: "Review",
    color: "#EAB308",
    path: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  },
  {
    id: "heart",
    label: "Social",
    color: "#F43F5E",
    path: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z",
  },
  {
    id: "link",
    label: "Link",
    color: "#64748B",
    path: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  },
];

export function makePresetDataUrl(preset: LogoPreset): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48"><circle cx="12" cy="12" r="12" fill="${preset.color}"/><path d="${preset.path}" fill="none" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function buildQROptions(
  url: string,
  settings: QRDesignSettings,
  size: number
) {
  return {
    width: size,
    height: size,
    data: url,
    margin: Math.round(size * 0.04),
    image: settings.logoUrl ?? undefined,
    qrOptions: {
      errorCorrectionLevel: (settings.logoUrl ? "H" : settings.errorCorrection) as "L" | "M" | "Q" | "H",
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: settings.logoSize,
      margin: Math.round(size * 0.01),
      crossOrigin: "anonymous",
    },
    dotsOptions: {
      type: settings.dotStyle,
      color: settings.fgColor,
    },
    backgroundOptions: {
      color: settings.bgColor,
    },
    cornersSquareOptions: {
      type: settings.cornerSquareStyle,
      color: settings.fgColor,
    },
    cornersDotOptions: {
      type: settings.cornerDotStyle,
      color: settings.fgColor,
    },
  };
}

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.substring(0, 2), 16) / 255;
  const g = parseInt(clean.substring(2, 4), 16) / 255;
  const b = parseInt(clean.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function linearize(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const [r1, g1, b1] = hexToRgb(hex1).map(linearize);
  const [r2, g2, b2] = hexToRgb(hex2).map(linearize);
  const l1 = 0.2126 * r1 + 0.7152 * g1 + 0.0722 * b1;
  const l2 = 0.2126 * r2 + 0.7152 * g2 + 0.0722 * b2;
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}
