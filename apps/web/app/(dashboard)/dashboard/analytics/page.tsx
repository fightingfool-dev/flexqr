import type { Metadata } from "next";
import Link from "next/link";
import { BarChart2, Smartphone, Globe } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getWorkspaceAnalytics } from "@/lib/analytics";
import type { QRRange } from "@/lib/analytics";
import { ScansChart } from "@/components/analytics/scans-chart";
import { BreakdownBar } from "@/components/analytics/breakdown-bar";
import { StatCard } from "@/components/analytics/stat-card";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import type { DbQRCode } from "@/lib/database.types";

export const metadata: Metadata = { title: "Analytics" };

const VALID_RANGES: QRRange[] = ["7d", "30d", "90d", "all"];

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;
  const { range: rawRange } = await searchParams;
  const range: QRRange = VALID_RANGES.includes(rawRange as QRRange)
    ? (rawRange as QRRange)
    : "30d";

  const [{ data: qrRows }, analytics] = await Promise.all([
    supabaseAdmin
      .from("qr_codes")
      .select("id, name, shortCode, scanCount, isActive")
      .eq("workspaceId", workspace.id)
      .order("scanCount", { ascending: false })
      .limit(20),
    getWorkspaceAnalytics(workspace.id, range),
  ]);

  const qrCodes = (qrRows ?? []) as Pick<
    DbQRCode,
    "id" | "name" | "shortCode" | "scanCount" | "isActive"
  >[];
  const activeCount = qrCodes.filter((qr) => qr.isActive).length;

  const rangeLabel: Record<QRRange, string> = {
    "24h": "last 24h",
    "7d": "last 7d",
    "30d": "last 30d",
    "90d": "last 90d",
    all: "all time",
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{workspace.name}</p>
        </div>
        <DateRangeSelector current={range} />
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={`Total scans (${rangeLabel[range]})`}
          value={analytics.totalScans}
          trendPct={analytics.trendPct}
        />
        <StatCard label="Unique scans" value={analytics.uniqueScans} />
        <StatCard label="Active QR codes" value={activeCount} />
        <StatCard label="Scans today" value={analytics.scansToday} />
        <StatCard label="Last 7 days" value={analytics.scansLast7} />
        <StatCard label="Last 30 days" value={analytics.scansLast30} />
      </div>

      {/* Time series */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium mb-4">
          Scans across all codes — {rangeLabel[range]}
        </h2>
        <ScansChart
          data={analytics.timeSeries}
          granularity={analytics.granularity}
          range={range}
        />
      </div>

      {/* Breakdowns */}
      <div className="grid gap-5 sm:grid-cols-3">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <BreakdownBar title="Device type" items={analytics.devices} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <BreakdownBar title="Browser" items={analytics.browsers} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <BreakdownBar title="Country" items={analytics.countries} />
        </div>
      </div>

      {/* Top QR codes */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-medium">Top QR codes by scans</h2>
        </div>
        {qrCodes.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No QR codes yet.
          </p>
        ) : (
          <div className="divide-y">
            {qrCodes.map((qr) => (
              <Link
                key={qr.id}
                href={`/dashboard/qr-codes/${qr.id}/analytics`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/20 transition-colors duration-150 group"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {qr.name}
                  </p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    /r/{qr.shortCode}
                  </p>
                </div>
                <div className="ml-4 flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      qr.isActive
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {qr.isActive ? "Active" : "Inactive"}
                  </span>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">
                      {qr.scanCount.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">scans</p>
                  </div>
                  <BarChart2 className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent activity feed */}
      {analytics.recentActivity.length > 0 && (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="text-sm font-medium">Recent activity</h2>
          </div>
          <div className="divide-y">
            {analytics.recentActivity.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between px-5 py-3"
              >
                <div className="min-w-0">
                  <Link
                    href={`/dashboard/qr-codes/${event.qrCodeId}/analytics`}
                    className="text-sm font-medium truncate hover:text-primary transition-colors"
                  >
                    {event.qrCodeName}
                  </Link>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    {event.country && (
                      <span className="inline-flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        {event.country}
                      </span>
                    )}
                    {event.deviceType && (
                      <span className="inline-flex items-center gap-1">
                        <Smartphone className="h-3 w-3" />
                        {event.deviceType}
                      </span>
                    )}
                  </div>
                </div>
                <p className="ml-4 shrink-0 text-xs text-muted-foreground">
                  {fmtTime(event.scannedAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
