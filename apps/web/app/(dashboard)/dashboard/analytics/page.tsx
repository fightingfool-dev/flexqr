import type { Metadata } from "next";
import Link from "next/link";
import { BarChart2 } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getWorkspaceAnalytics } from "@/lib/analytics";
import { ScansChart } from "@/components/analytics/scans-chart";
import { BreakdownBar } from "@/components/analytics/breakdown-bar";
import type { DbQRCode } from "@/lib/database.types";

export const metadata: Metadata = { title: "Analytics" };

export default async function AnalyticsPage() {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;

  const [{ data: qrRows }, analytics] = await Promise.all([
    supabaseAdmin
      .from("qr_codes")
      .select("id, name, shortCode, scanCount, isActive")
      .eq("workspaceId", workspace.id)
      .order("scanCount", { ascending: false })
      .limit(20),
    getWorkspaceAnalytics(workspace.id),
  ]);

  const qrCodes = (qrRows ?? []) as Pick<
    DbQRCode,
    "id" | "name" | "shortCode" | "scanCount" | "isActive"
  >[];

  const totalScans = qrCodes.reduce((s, qr) => s + qr.scanCount, 0);
  const activeCount = qrCodes.filter((qr) => qr.isActive).length;
  const scansLast30 = analytics.last30Days.reduce((s, d) => s + d.scans, 0);

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {workspace.name}, all time
        </p>
      </div>

      {/* Top stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Total scans", value: totalScans },
          { label: "Scans (last 30 days)", value: scansLast30 },
          { label: "Active QR codes", value: activeCount },
        ].map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold tabular-nums">
              {value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Workspace time series */}
      <div className="rounded-xl border bg-card p-5 shadow-sm">
        <h2 className="text-sm font-medium mb-4">
          Scans across all codes, last 30 days
        </h2>
        <ScansChart data={analytics.last30Days} />
      </div>

      {/* Breakdowns */}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <BreakdownBar title="Device type" items={analytics.devices} />
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <BreakdownBar title="Country" items={analytics.countries} />
        </div>
      </div>

      {/* QR codes by performance */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b">
          <h2 className="text-sm font-medium">QR codes by scans</h2>
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
                className="flex items-center justify-between px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-muted/20 transition-colors duration-150 group"
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
    </div>
  );
}
