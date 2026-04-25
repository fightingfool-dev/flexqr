import { type NextRequest, NextResponse } from "next/server";
import { requireQRAccess } from "@/lib/analytics-auth";
import { getQRAnalytics } from "@/lib/analytics";
import type { QRRange } from "@/lib/analytics";

const VALID_RANGES: QRRange[] = ["24h", "7d", "30d", "90d", "all"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const auth = await requireQRAccess(id);
  if (!auth.ok) return auth.response;

  const rawRange = request.nextUrl.searchParams.get("range") ?? "30d";
  const range: QRRange = VALID_RANGES.includes(rawRange as QRRange)
    ? (rawRange as QRRange)
    : "30d";

  const analytics = await getQRAnalytics(id, range);
  const date = new Date().toISOString().slice(0, 10);
  const safeName = auth.qr.name.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 40);

  const payload = {
    qr: {
      id: auth.qr.id,
      name: auth.qr.name,
      shortCode: auth.qr.shortCode,
    },
    exportedAt: new Date().toISOString(),
    range,
    analytics: {
      totalScans: analytics.totalScans,
      uniqueScans: analytics.uniqueScans,
      scansToday: analytics.scansToday,
      scansLast7: analytics.scansLast7,
      scansLast30: analytics.scansLast30,
      lastScanAt: analytics.lastScanAt,
      trendPct: analytics.trendPct,
      repeatRate: analytics.repeatRate,
      bestDay: analytics.bestDay,
      bestHour: analytics.bestHour,
      topCountry: analytics.topCountry,
      topDevice: analytics.topDevice,
      timeSeries: analytics.timeSeries,
      devices: analytics.devices,
      browsers: analytics.browsers,
      operatingSystems: analytics.operatingSystems,
      countries: analytics.countries,
      referrers: analytics.referrers,
      hourlyDistribution: analytics.hourlyDistribution,
      weekdayDistribution: analytics.weekdayDistribution,
    },
  };

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": `attachment; filename="${safeName}_analytics_${date}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
