import { type NextRequest, NextResponse } from "next/server";
import { requireQRAccess } from "@/lib/analytics-auth";
import { getQRScansForExport } from "@/lib/analytics";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireQRAccess(id);
  if (!auth.ok) return auth.response;

  const scans = await getQRScansForExport(id);

  const header = "Timestamp,Country,Device,Browser,OS,Source\r\n";
  const rows = scans
    .map((s) =>
      [
        s.scannedAt,
        s.country ?? "",
        s.deviceType ?? "",
        s.browser ?? "",
        s.os ?? "",
        s.referer ?? "",
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    )
    .join("\r\n");

  const csv = header + rows;
  const date = new Date().toISOString().slice(0, 10);
  const safeName = auth.qr.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv;charset=utf-8",
      "Content-Disposition": `attachment; filename="${safeName}_scans_${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
