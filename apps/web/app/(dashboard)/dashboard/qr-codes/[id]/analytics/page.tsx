import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getQRAnalytics } from "@/lib/analytics";
import { ScansChart } from "@/components/analytics/scans-chart";
import { BreakdownBar } from "@/components/analytics/breakdown-bar";
import type { DbQRCode } from "@/lib/database.types";

export const metadata: Metadata = { title: "Analytics" };

function StatCard({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}

export default async function QRAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("id, name, scanCount, shortCode, isActive")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const qr = data as Pick<DbQRCode, "id" | "name" | "scanCount" | "shortCode" | "isActive">;

  const analytics = await getQRAnalytics(id);

  const scansLast30 = analytics.last30Days.reduce((s, d) => s + d.scans, 0);

  return (
    <div className="max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/dashboard/qr-codes/${id}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          {qr.name}
        </Link>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5 font-mono">
          /r/{qr.shortCode}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total scans" value={qr.scanCount} />
        <StatCard label="Unique scans" value={analytics.uniqueScans} />
        <StatCard label="Last 30 days" value={scansLast30} />
      </div>

      {/* Time series */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium mb-4">Scans over time, last 30 days</h2>
        <ScansChart data={analytics.last30Days} />
      </div>

      {/* Breakdowns */}
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

      {/* Recent scans table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-medium">Recent scans</h2>
        </div>

        {analytics.recentScans.length === 0 ? (
          <p className="px-5 py-8 text-center text-sm text-muted-foreground">
            No scans recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  {["Time", "Device", "Browser", "OS", "Country"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {analytics.recentScans.map((scan) => (
                  <tr
                    key={scan.id}
                    className="hover:bg-slate-50 dark:hover:bg-muted/20 transition-colors duration-150"
                  >
                    <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                      {new Date(scan.scannedAt).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-5 py-3 capitalize">
                      {scan.deviceType ?? <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {scan.browser ?? <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {scan.os ?? <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="px-5 py-3">
                      {scan.country ?? <span className="text-muted-foreground">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
