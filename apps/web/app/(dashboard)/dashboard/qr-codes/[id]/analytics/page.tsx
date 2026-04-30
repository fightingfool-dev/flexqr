import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getQRAnalytics } from "@/lib/analytics";
import type { QRRange } from "@/lib/analytics";
import { ScansChart } from "@/components/analytics/scans-chart";
import { BreakdownBar } from "@/components/analytics/breakdown-bar";
import { StatCard } from "@/components/analytics/stat-card";
import { DateRangeSelector } from "@/components/analytics/date-range-selector";
import { CampaignInsights } from "@/components/analytics/campaign-insights";
import { SimpleBarChart, fmtHour } from "@/components/analytics/bar-chart";
import { RecentScansTable } from "@/components/analytics/recent-scans-table";
import { ExportDropdown } from "@/components/analytics/export-dropdown";

export const metadata: Metadata = { title: "Analytics" };

const VALID_RANGES: QRRange[] = ["24h", "7d", "30d", "90d", "all"];

function fmtDate(iso: string | null): string {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function QRAnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const { range: rawRange } = await searchParams;
  const range: QRRange = VALID_RANGES.includes(rawRange as QRRange)
    ? (rawRange as QRRange)
    : "30d";

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("id, name, scanCount, shortCode, isActive")
    .eq("id", id)
    .single();

  if (!data) notFound();

  const analytics = await getQRAnalytics(id, range);

  const rangeLabel: Record<QRRange, string> = {
    "24h": "last 24 hours",
    "7d": "last 7 days",
    "30d": "last 30 days",
    "90d": "last 90 days",
    all: "all time",
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/qr-codes/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          {data.name}
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
            <p className="text-sm text-muted-foreground mt-0.5 font-mono">
              /r/{data.shortCode}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <DateRangeSelector current={range} />
            <ExportDropdown
              qrCodeId={id}
              showAnalytics
              showImage
            />
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={`Total scans (${rangeLabel[range]})`}
          value={analytics.totalScans}
          trendPct={analytics.trendPct}
        />
        <StatCard label="Unique scans" value={analytics.uniqueScans} />
        <StatCard
          label="Last scan"
          value={fmtDate(analytics.lastScanAt)}
        />
        <StatCard label="Scans today" value={analytics.scansToday} />
        <StatCard label="Last 7 days" value={analytics.scansLast7} />
        <StatCard label="Last 30 days" value={analytics.scansLast30} />
      </div>

      {/* Time series */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium mb-4">
          Scans over time · {rangeLabel[range]}
        </h2>
        <ScansChart
          data={analytics.timeSeries}
          granularity={analytics.granularity}
          range={range}
        />
      </div>

      {/* Campaign insights */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Campaign insights</h2>
        <CampaignInsights
          bestDay={analytics.bestDay}
          bestHour={analytics.bestHour}
          topCountry={analytics.topCountry}
          topDevice={analytics.topDevice}
          repeatRate={analytics.repeatRate}
        />
      </div>

      {/* Breakdown charts */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Audience breakdown</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <BreakdownBar title="Device type" items={analytics.devices} />
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <BreakdownBar title="Browser" items={analytics.browsers} />
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <BreakdownBar title="Operating system" items={analytics.operatingSystems} />
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <BreakdownBar title="Country" items={analytics.countries} />
          </div>
        </div>

        {analytics.referrers.length > 0 && (
          <div className="mt-5 rounded-xl border bg-card p-5 shadow-sm">
            <BreakdownBar title="Traffic source" items={analytics.referrers} />
          </div>
        )}
      </div>

      {/* Distribution charts */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-medium mb-4">Scans by hour (UTC)</h3>
          <SimpleBarChart
            data={analytics.hourlyDistribution}
            xFormatter={fmtHour}
            emptyMessage="No scan data"
            height={130}
          />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <h3 className="text-sm font-medium mb-4">Scans by weekday</h3>
          <SimpleBarChart
            data={analytics.weekdayDistribution}
            emptyMessage="No scan data"
            height={130}
          />
        </div>
      </div>

      {/* Recent scans */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 className="text-sm font-medium">Recent scans</h2>
          <span className="text-xs text-muted-foreground">Last 50</span>
        </div>
        <RecentScansTable scans={analytics.recentScans} />
      </div>
    </div>
  );
}
