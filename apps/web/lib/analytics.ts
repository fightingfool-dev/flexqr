import { supabaseAdmin } from "@/lib/supabase/admin";
import type { DbScan } from "@/lib/database.types";

// ─── Types ────────────────────────────────────────────────────────────────────

export type QRRange = "24h" | "7d" | "30d" | "90d" | "all";
export type TimeGranularity = "hour" | "day" | "week";

export type DayScan = { date: string; scans: number };
export type BreakdownItem = { label: string; count: number; pct: number };

type ScanRow = Pick<
  DbScan,
  "scannedAt" | "country" | "deviceType" | "os" | "browser" | "referer" | "ipHash"
>;

export type RecentScan = {
  id: string;
  scannedAt: string;
  country: string | null;
  deviceType: string | null;
  os: string | null;
  browser: string | null;
  referer: string | null;
  isRepeat: boolean;
};

export type QRAnalytics = {
  range: QRRange;
  granularity: TimeGranularity;
  totalScans: number;
  uniqueScans: number;
  scansToday: number;
  scansLast7: number;
  scansLast30: number;
  lastScanAt: string | null;
  trendPct: number | null;
  repeatRate: number;
  timeSeries: DayScan[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  operatingSystems: BreakdownItem[];
  countries: BreakdownItem[];
  referrers: BreakdownItem[];
  hourlyDistribution: DayScan[];
  weekdayDistribution: DayScan[];
  bestDay: string | null;
  bestHour: number | null;
  topCountry: string | null;
  topDevice: string | null;
  recentScans: RecentScan[];
};

export type WorkspaceActivity = {
  id: string;
  scannedAt: string;
  country: string | null;
  deviceType: string | null;
  qrCodeId: string;
  qrCodeName: string;
  qrShortCode: string;
};

export type WorkspaceAnalytics = {
  range: QRRange;
  granularity: TimeGranularity;
  timeSeries: DayScan[];
  totalScans: number;
  uniqueScans: number;
  scansToday: number;
  scansLast7: number;
  scansLast30: number;
  trendPct: number | null;
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  countries: BreakdownItem[];
  recentActivity: WorkspaceActivity[];
};

export type DashboardStats = {
  totalScans: number;
  uniqueScans30d: number;
  activeQR: number;
  totalQR: number;
  scansLast7: number;
  scansPrev7: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function fetchWindowStart(range: QRRange, now: number): Date | null {
  switch (range) {
    case "24h": return new Date(now - 30 * 86400_000);   // 30d window for stats
    case "7d":  return new Date(now - 30 * 86400_000);   // 30d window for stats
    case "30d": return new Date(now - 60 * 86400_000);   // 2x for trend
    case "90d": return new Date(now - 180 * 86400_000);  // 2x for trend
    case "all": return null;
  }
}

function rowLimit(range: QRRange): number {
  switch (range) {
    case "24h": return 10000;
    case "7d":  return 10000;
    case "30d": return 15000;
    case "90d": return 25000;
    case "all": return 50000;
  }
}

function rangeStart(range: QRRange, now: number): Date | null {
  switch (range) {
    case "24h": return new Date(now - 86400_000);
    case "7d":  return new Date(now - 7 * 86400_000);
    case "30d": return new Date(now - 30 * 86400_000);
    case "90d": return new Date(now - 90 * 86400_000);
    case "all": return null;
  }
}

function prevRangeStart(range: QRRange, now: number): Date | null {
  switch (range) {
    case "24h": return new Date(now - 2 * 86400_000);
    case "7d":  return new Date(now - 14 * 86400_000);
    case "30d": return new Date(now - 60 * 86400_000);
    case "90d": return new Date(now - 180 * 86400_000);
    case "all": return null;
  }
}

function weekStartStr(d: Date): string {
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const monday = new Date(d);
  monday.setUTCDate(d.getUTCDate() + diff);
  return monday.toISOString().slice(0, 10);
}

function buildTimeSeries(
  range: QRRange,
  scans: ScanRow[],
  now: number
): { timeSeries: DayScan[]; granularity: TimeGranularity } {
  if (range === "24h") {
    const buckets = new Map<string, number>();
    for (let i = 23; i >= 0; i--) {
      const slotMs = Math.floor((now - i * 3600_000) / 3600_000) * 3600_000;
      buckets.set(new Date(slotMs).toISOString(), 0);
    }
    for (const s of scans) {
      const slotMs = Math.floor(new Date(s.scannedAt).getTime() / 3600_000) * 3600_000;
      const key = new Date(slotMs).toISOString();
      if (buckets.has(key)) buckets.set(key, buckets.get(key)! + 1);
    }
    return {
      granularity: "hour",
      timeSeries: Array.from(buckets.entries()).map(([date, scans]) => ({
        date,
        scans,
      })),
    };
  }

  if (range === "all") {
    const buckets = new Map<string, number>();
    for (const s of scans) {
      const key = weekStartStr(new Date(s.scannedAt));
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
    return {
      granularity: "week",
      timeSeries: Array.from(buckets.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, scans]) => ({ date, scans })),
    };
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const today = new Date(now);
  today.setUTCHours(0, 0, 0, 0);
  const dayMap = new Map<string, number>();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    dayMap.set(d.toISOString().slice(0, 10), 0);
  }
  for (const s of scans) {
    const day = s.scannedAt.slice(0, 10);
    if (dayMap.has(day)) dayMap.set(day, dayMap.get(day)! + 1);
  }
  return {
    granularity: "day",
    timeSeries: Array.from(dayMap.entries()).map(([date, scans]) => ({
      date,
      scans,
    })),
  };
}

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

function computeTrend(current: number, previous: number): number | null {
  if (current === 0 && previous === 0) return null;
  if (previous === 0) return 100;
  return Math.round(((current - previous) / previous) * 100);
}

// ─── Per-QR analytics ────────────────────────────────────────────────────────

export async function getQRAnalytics(
  qrCodeId: string,
  range: QRRange = "30d"
): Promise<QRAnalytics> {
  const now = Date.now();
  const windowStart = fetchWindowStart(range, now);
  const limit = rowLimit(range);

  let baseQuery = supabaseAdmin
    .from("scans")
    .select("scannedAt, country, deviceType, os, browser, referer, ipHash")
    .eq("qrCodeId", qrCodeId)
    .order("scannedAt", { ascending: false })
    .limit(limit);

  if (windowStart) {
    baseQuery = baseQuery.gte("scannedAt", windowStart.toISOString());
  }

  const [{ data: scanData }, { data: recentData }] = await Promise.all([
    baseQuery,
    supabaseAdmin
      .from("scans")
      .select("id, scannedAt, country, deviceType, os, browser, referer, ipHash")
      .eq("qrCodeId", qrCodeId)
      .order("scannedAt", { ascending: false })
      .limit(50),
  ]);

  const allFetched = (scanData ?? []) as ScanRow[];

  // Filter to selected range and previous range
  const rStart = rangeStart(range, now);
  const pStart = prevRangeStart(range, now);

  const inRange = rStart
    ? allFetched.filter(
        (s) => new Date(s.scannedAt).getTime() >= rStart.getTime()
      )
    : allFetched;

  const inPrev =
    rStart && pStart
      ? allFetched.filter((s) => {
          const t = new Date(s.scannedAt).getTime();
          return t >= pStart.getTime() && t < rStart.getTime();
        })
      : [];

  // Absolute stats (always from full fetch window ≥ 30d)
  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const ago7 = new Date(now - 7 * 86400_000);
  const ago30 = new Date(now - 30 * 86400_000);

  const scansToday = allFetched.filter(
    (s) => new Date(s.scannedAt) >= todayStart
  ).length;
  const scansLast7 = allFetched.filter(
    (s) => new Date(s.scannedAt) >= ago7
  ).length;
  const scansLast30 = allFetched.filter(
    (s) => new Date(s.scannedAt) >= ago30
  ).length;

  // Unique scans in range
  const uniqueSet = new Set<string>();
  for (const s of inRange) if (s.ipHash) uniqueSet.add(s.ipHash as string);
  const uniqueScans = uniqueSet.size;

  // Trend
  const trendPct = range !== "all" ? computeTrend(inRange.length, inPrev.length) : null;

  // Repeat rate
  const ipFreq = new Map<string, number>();
  for (const s of inRange) {
    if (s.ipHash)
      ipFreq.set(s.ipHash as string, (ipFreq.get(s.ipHash as string) ?? 0) + 1);
  }
  const repeats = Array.from(ipFreq.values()).filter((c) => c > 1).reduce(
    (sum, c) => sum + c,
    0
  );
  const repeatRate =
    inRange.length > 0 ? Math.round((repeats / inRange.length) * 100) : 0;

  // Last scan
  const lastScanAt = inRange.length > 0 ? inRange[0].scannedAt : null;

  // Time series
  const { timeSeries, granularity } = buildTimeSeries(range, inRange, now);

  // Breakdowns
  const devices = toBreakdown(inRange, "deviceType");
  const browsers = toBreakdown(inRange, "browser");
  const operatingSystems = toBreakdown(inRange, "os");
  const countries = toBreakdown(inRange, "country");
  const referrers = toBreakdown(inRange, "referer");

  // Best day
  const dayMap2 = new Map<string, number>();
  for (const s of inRange) {
    const day = s.scannedAt.slice(0, 10);
    dayMap2.set(day, (dayMap2.get(day) ?? 0) + 1);
  }
  let bestDay: string | null = null;
  let bestDayCount = 0;
  for (const [day, count] of dayMap2) {
    if (count > bestDayCount) {
      bestDayCount = count;
      bestDay = day;
    }
  }

  // Hourly distribution
  const hourMap = new Map<number, number>();
  for (let h = 0; h < 24; h++) hourMap.set(h, 0);
  for (const s of inRange) {
    const h = new Date(s.scannedAt).getUTCHours();
    hourMap.set(h, (hourMap.get(h) ?? 0) + 1);
  }
  const hourlyDistribution = Array.from(hourMap.entries()).map(
    ([hour, scans]) => ({ date: String(hour), scans })
  );

  let bestHour: number | null = null;
  let bestHourCount = 0;
  for (const [h, count] of hourMap) {
    if (count > bestHourCount) {
      bestHourCount = count;
      bestHour = h;
    }
  }
  if (bestHourCount === 0) bestHour = null;

  // Weekday distribution
  const wdMap = new Map<string, number>();
  for (const lbl of WEEKDAY_LABELS) wdMap.set(lbl, 0);
  for (const s of inRange) {
    const lbl = WEEKDAY_LABELS[new Date(s.scannedAt).getUTCDay()]!;
    wdMap.set(lbl, (wdMap.get(lbl) ?? 0) + 1);
  }
  const weekdayDistribution = WEEKDAY_LABELS.map((d) => ({
    date: d,
    scans: wdMap.get(d) ?? 0,
  }));

  // Top country / device
  const topCountry = countries[0]?.label ?? null;
  const topDevice = devices[0]?.label ?? null;

  // Recent scans with isRepeat
  type RawRecent = {
    id: string;
    scannedAt: string;
    country: string | null;
    deviceType: string | null;
    os: string | null;
    browser: string | null;
    referer: string | null;
    ipHash: string | null;
  };
  const rawRecent = (recentData ?? []) as RawRecent[];
  const recentFreq = new Map<string, number>();
  for (const s of rawRecent) {
    if (s.ipHash)
      recentFreq.set(s.ipHash, (recentFreq.get(s.ipHash) ?? 0) + 1);
  }
  const recentScans: RecentScan[] = rawRecent.map((s) => ({
    id: s.id,
    scannedAt: s.scannedAt,
    country: s.country,
    deviceType: s.deviceType,
    os: s.os,
    browser: s.browser,
    referer: s.referer,
    isRepeat: !!s.ipHash && (recentFreq.get(s.ipHash) ?? 0) > 1,
  }));

  return {
    range,
    granularity,
    totalScans: inRange.length,
    uniqueScans,
    scansToday,
    scansLast7,
    scansLast30,
    lastScanAt,
    trendPct,
    repeatRate,
    timeSeries,
    devices,
    browsers,
    operatingSystems,
    countries,
    referrers,
    hourlyDistribution,
    weekdayDistribution,
    bestDay,
    bestHour,
    topCountry,
    topDevice,
    recentScans,
  };
}

// ─── Workspace analytics ─────────────────────────────────────────────────────

export async function getWorkspaceAnalytics(
  workspaceId: string,
  range: QRRange = "30d"
): Promise<WorkspaceAnalytics> {
  const now = Date.now();

  const { data: qrRows } = await supabaseAdmin
    .from("qr_codes")
    .select("id")
    .eq("workspaceId", workspaceId);

  const qrIds = (qrRows ?? []).map((r) => r.id as string);

  if (qrIds.length === 0) {
    const days = range === "7d" ? 7 : range === "90d" ? 90 : 30;
    const today = new Date(now);
    today.setUTCHours(0, 0, 0, 0);
    const empty: DayScan[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setUTCDate(d.getUTCDate() - i);
      empty.push({ date: d.toISOString().slice(0, 10), scans: 0 });
    }
    return {
      range,
      granularity: "day",
      timeSeries: empty,
      totalScans: 0,
      uniqueScans: 0,
      scansToday: 0,
      scansLast7: 0,
      scansLast30: 0,
      trendPct: null,
      devices: [],
      browsers: [],
      countries: [],
      recentActivity: [],
    };
  }

  const windowStart = fetchWindowStart(range, now);
  const limit = rowLimit(range);

  let query = supabaseAdmin
    .from("scans")
    .select("scannedAt, country, deviceType, browser, ipHash, qrCodeId")
    .in("qrCodeId", qrIds)
    .order("scannedAt", { ascending: false })
    .limit(limit);

  if (windowStart) query = query.gte("scannedAt", windowStart.toISOString());

  const [{ data: scanData }, { data: recentScanData }] = await Promise.all([
    query,
    supabaseAdmin
      .from("scans")
      .select("id, scannedAt, country, deviceType, qrCodeId")
      .in("qrCodeId", qrIds)
      .order("scannedAt", { ascending: false })
      .limit(20),
  ]);

  const allFetched = (scanData ?? []) as (ScanRow & { qrCodeId: string })[];

  const rStart = rangeStart(range, now);
  const pStart = prevRangeStart(range, now);

  const inRange = rStart
    ? allFetched.filter(
        (s) => new Date(s.scannedAt).getTime() >= rStart.getTime()
      )
    : allFetched;
  const inPrev =
    rStart && pStart
      ? allFetched.filter((s) => {
          const t = new Date(s.scannedAt).getTime();
          return t >= pStart.getTime() && t < rStart.getTime();
        })
      : [];

  const todayStart = new Date(now);
  todayStart.setUTCHours(0, 0, 0, 0);
  const scansToday = allFetched.filter(
    (s) => new Date(s.scannedAt) >= todayStart
  ).length;
  const scansLast7 = allFetched.filter(
    (s) => new Date(s.scannedAt) >= new Date(now - 7 * 86400_000)
  ).length;
  const scansLast30 = allFetched.filter(
    (s) => new Date(s.scannedAt) >= new Date(now - 30 * 86400_000)
  ).length;

  const uniqueSet = new Set<string>();
  for (const s of inRange) if (s.ipHash) uniqueSet.add(s.ipHash as string);

  const trendPct =
    range !== "all" ? computeTrend(inRange.length, inPrev.length) : null;

  const { timeSeries, granularity } = buildTimeSeries(range, inRange, now);

  // Build recent activity
  const recentQrIds = [
    ...new Set(
      (recentScanData ?? []).map((s) => s.qrCodeId as string)
    ),
  ];
  let qrNameMap = new Map<string, { name: string; shortCode: string }>();
  if (recentQrIds.length > 0) {
    const { data: qrDetails } = await supabaseAdmin
      .from("qr_codes")
      .select("id, name, shortCode")
      .in("id", recentQrIds);
    for (const qr of qrDetails ?? []) {
      qrNameMap.set(qr.id as string, {
        name: qr.name as string,
        shortCode: qr.shortCode as string,
      });
    }
  }

  const recentActivity: WorkspaceActivity[] = (recentScanData ?? []).map(
    (s) => ({
      id: s.id as string,
      scannedAt: s.scannedAt as string,
      country: s.country as string | null,
      deviceType: s.deviceType as string | null,
      qrCodeId: s.qrCodeId as string,
      qrCodeName: qrNameMap.get(s.qrCodeId as string)?.name ?? "Unknown",
      qrShortCode: qrNameMap.get(s.qrCodeId as string)?.shortCode ?? "",
    })
  );

  return {
    range,
    granularity,
    timeSeries,
    totalScans: inRange.length,
    uniqueScans: uniqueSet.size,
    scansToday,
    scansLast7,
    scansLast30,
    trendPct,
    devices: toBreakdown(inRange as ScanRow[], "deviceType"),
    browsers: toBreakdown(inRange as ScanRow[], "browser"),
    countries: toBreakdown(inRange as ScanRow[], "country"),
    recentActivity,
  };
}

// ─── Dashboard stats (homepage cards) ────────────────────────────────────────

export async function getDashboardStats(
  workspaceId: string
): Promise<DashboardStats> {
  const { data: qrRows } = await supabaseAdmin
    .from("qr_codes")
    .select("id, scanCount, isActive")
    .eq("workspaceId", workspaceId);

  const qrs = (qrRows ?? []) as Array<{
    id: string;
    scanCount: number;
    isActive: boolean;
  }>;
  const totalScans = qrs.reduce((s, r) => s + (r.scanCount ?? 0), 0);
  const activeQR = qrs.filter((r) => r.isActive).length;
  const totalQR = qrs.length;

  if (totalQR === 0) {
    return {
      totalScans: 0,
      uniqueScans30d: 0,
      activeQR: 0,
      totalQR: 0,
      scansLast7: 0,
      scansPrev7: 0,
    };
  }

  const qrIds = qrs.map((r) => r.id);
  const now = Date.now();
  const sevenDaysAgo = new Date(now - 7 * 86400_000).toISOString();
  const fourteenDaysAgo = new Date(now - 14 * 86400_000).toISOString();
  const thirtyDaysAgo = new Date(now - 30 * 86400_000).toISOString();

  const [{ data: trendRows }, { data: uniqueRows }] = await Promise.all([
    supabaseAdmin
      .from("scans")
      .select("scannedAt")
      .in("qrCodeId", qrIds)
      .gte("scannedAt", fourteenDaysAgo)
      .limit(5000),
    supabaseAdmin
      .from("scans")
      .select("ipHash")
      .in("qrCodeId", qrIds)
      .gte("scannedAt", thirtyDaysAgo)
      .limit(10000),
  ]);

  const scansLast7 = (trendRows ?? []).filter(
    (r) => r.scannedAt >= sevenDaysAgo
  ).length;
  const scansPrev7 = (trendRows ?? []).filter(
    (r) => r.scannedAt < sevenDaysAgo
  ).length;

  const uniqueSet = new Set<string>();
  for (const row of uniqueRows ?? []) {
    if (row.ipHash) uniqueSet.add(row.ipHash as string);
  }

  return {
    totalScans,
    uniqueScans30d: uniqueSet.size,
    activeQR,
    totalQR,
    scansLast7,
    scansPrev7,
  };
}

// ─── CSV export helper (used by API route) ───────────────────────────────────

export async function getQRScansForExport(
  qrCodeId: string
): Promise<
  Pick<
    DbScan,
    "scannedAt" | "country" | "deviceType" | "os" | "browser" | "referer"
  >[]
> {
  const { data } = await supabaseAdmin
    .from("scans")
    .select("scannedAt, country, deviceType, os, browser, referer")
    .eq("qrCodeId", qrCodeId)
    .order("scannedAt", { ascending: false })
    .limit(100000);
  return (data ?? []) as Pick<
    DbScan,
    "scannedAt" | "country" | "deviceType" | "os" | "browser" | "referer"
  >[];
}
