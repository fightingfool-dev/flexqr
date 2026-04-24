import QRCode from "qrcode";
import { supabaseAdmin } from "./supabase/admin";

// Short code alphabet: lowercase alphanumeric, no ambiguous chars (0/O, 1/l/I).
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789";

function randomCode(length = 6): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes)
    .map((b) => ALPHABET[b % ALPHABET.length]!)
    .join("");
}

// Generates a short code guaranteed unique in qr_codes.shortCode.
export async function generateShortCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = randomCode();
    const { data } = await supabaseAdmin
      .from("qr_codes")
      .select("id")
      .eq("shortCode", code)
      .maybeSingle();
    if (!data) return code;
  }
  throw new Error("Failed to generate a unique short code after 10 attempts.");
}

// Returns the full redirect URL for a given short code.
export function shortCodeUrl(shortCode: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/r/${shortCode}`;
}

// Generates a QR code as an inline SVG string.
export async function generateQRSvg(url: string): Promise<string> {
  return QRCode.toString(url, {
    type: "svg",
    margin: 1,
    color: { dark: "#000000", light: "#FFFFFF" },
  });
}
