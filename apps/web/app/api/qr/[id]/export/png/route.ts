import { type NextRequest } from "next/server";
import QRCode from "qrcode";
import { requireQRAccess } from "@/lib/analytics-auth";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireQRAccess(id);
  if (!auth.ok) return auth.response;

  const redirectUrl = `${APP_URL.replace(/\/$/, "")}/r/${auth.qr.shortCode}`;
  const safeName = auth.qr.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);

  const buffer = await QRCode.toBuffer(redirectUrl, {
    type: "png",
    width: 1200,
    margin: 2,
    color: { dark: "#000000", light: "#FFFFFF" },
  });

  return new Response(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${safeName}.png"`,
      "Cache-Control": "no-store",
    },
  });
}
