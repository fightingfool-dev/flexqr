import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbScan } from "@/lib/database.types";

export type DayScan = { date: string; scans: number };
export type BreakdownItem = { label: string; count: number; pct: number };

type ScanRow = Pick<DbScan, "scannedAt" | "country" | "deviceType" | "os" | "browser" | "ipHash">;
export type RecentScan = Pick<DbScan, "id" | "scannedAt" | "country" | "deviceType" | "os" | "browser">;

export type QRAnalytics = {
  uniqueScans: number;
  last30Days: DayScan[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  operatingSystems: BreakdownItem[];
  countries: BreakdownItem[];
  recentScans: RecentScan[];
};

function toBreakdown(scans: ScanRow[], key: keyof ScanRow): BreakdownItem[] {
  const map = new Map<string, number>();
  for (const scan of scans) {
    const val = scan[key] as string | null;
    if (val) map.set(val, (map.get(val) ?? 0) + 1);
  }
  const total = Array.from(map.values()).reduce((s, n) => s + n, 0);
  return Array.from(map.entries())
    .map(([label, count]) => ({
      label,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getQRAnalytics(qrCodeId: string): Promise<QRAnalytics> {
  const [{ data: scanRows }, { data: recentRows }, { data: uniqueCount }] =
    await Promise.all([
      // Last 30 days + breakdown data (capped for in-memory aggregation)
      supabaseAdmin
        .from("scans")
        .select("scannedAt, country, deviceType, os, browser, ipHash")
        .eq("qrCodeId", qrCodeId)
        .order("scannedAt", { ascending: false })
        .limit(5000),
      // Recent 25 rows for the table
      supabaseAdmin
        .from("scans")
        .select("id, scannedAt, country, deviceType, os, browser")
        .eq("qrCodeId", qrCodeId)
        .order("scannedAt", { ascending: false })
        .limit(25),
      // Postgres-side distinct IP hash count (accurate even beyond the 5k cap)
      supabaseAdmin.rpc("get_unique_scan_count", { qr_id: qrCodeId }),
    ]);

  const scans = (scanRows ?? []) as ScanRow[];

  // Build last-30-days buckets
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const scan of scans) {
    const day = new Date(scan.scannedAt).toISOString().slice(0, 10);
    const cur = dayMap.get(day);
    if (cur !== undefined) dayMap.set(day, cur + 1);
  }

  return {
    uniqueScans: (uniqueCount as number) ?? 0,
    last30Days: Array.from(dayMap.entries()).map(([date, scans]) => ({
      date,
      scans,
    })),
    devices: toBreakdown(scans, "deviceType"),
    browsers: toBreakdown(scans, "browser"),
    operatingSystems: toBreakdown(scans, "os"),
    countries: toBreakdown(scans, "country"),
    recentScans: (recentRows ?? []) as RecentScan[],
  };
}

export type WorkspaceAnalytics = {
  last30Days: DayScan[];
  devices: BreakdownItem[];
  countries: BreakdownItem[];
};

export async function getWorkspaceAnalytics(
  workspaceId: string
): Promise<WorkspaceAnalytics> {
  const thirtyDaysAgo = new Date(
    Date.now() - 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  // Step 1: get all QR code IDs belonging to this workspace.
  const { data: qrRows } = await supabaseAdmin
    .from("qr_codes")
    .select("id")
    .eq("workspaceId", workspaceId);

  const qrIds = (qrRows ?? []).map((r) => r.id as string);

  if (qrIds.length === 0) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const empty: DayScan[] = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      empty.push({ date: d.toISOString().slice(0, 10), scans: 0 });
    }
    return { last30Days: empty, devices: [], countries: [] };
  }

  // Step 2: query scans for those IDs only.
  const { data: scanRows } = await supabaseAdmin
    .from("scans")
    .select("scannedAt, country, deviceType")
    .in("qrCodeId", qrIds)
    .gte("scannedAt", thirtyDaysAgo)
    .order("scannedAt", { ascending: false })
    .limit(10000);

  const scans = (scanRows ?? []) as Array<
    Pick<DbScan, "scannedAt" | "country" | "deviceType">
  >;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayMap = new Map<string, number>();
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const scan of scans) {
    const day = new Date(scan.scannedAt).toISOString().slice(0, 10);
    const cur = dayMap.get(day);
    if (cur !== undefined) dayMap.set(day, cur + 1);
  }

  return {
    last30Days: Array.from(dayMap.entries()).map(([date, scans]) => ({
      date,
      scans,
    })),
    devices: toBreakdown(scans as ScanRow[], "deviceType"),
    countries: toBreakdown(scans as ScanRow[], "country"),
  };
}
