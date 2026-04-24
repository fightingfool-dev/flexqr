import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { getDashboardStats } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

type TrendResult =
  | { icon: "up" | "down"; text: string }
  | { icon: "flat"; text: string }
  | null;

function computeTrend(
  last7: number,
  prev7: number,
  totalScans: number
): TrendResult {
  if (last7 === 0 && prev7 === 0) {
    return totalScans > 0 ? { icon: "flat", text: "No recent scans" } : null;
  }
  if (prev7 === 0) {
    return { icon: "up", text: `+${last7} this week` };
  }
  const pct = Math.round((Math.abs(last7 - prev7) / prev7) * 100);
  if (last7 >= prev7) return { icon: "up", text: `+${pct}% vs prev 7 days` };
  return { icon: "down", text: `-${pct}% vs prev 7 days` };
}

function Trend({ result }: { result: TrendResult }) {
  if (!result) return null;
  if (result.icon === "flat") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
        <Minus className="h-3 w-3" />
        {result.text}
      </span>
    );
  }
  const up = result.icon === "up";
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium ${
        up ? "text-emerald-600 dark:text-emerald-400" : "text-red-500 dark:text-red-400"
      }`}
    >
      {up ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {result.text}
    </span>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;
  const stats = await getDashboardStats(workspace.id);
  const trend = computeTrend(stats.scansLast7, stats.scansPrev7, stats.totalScans);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to {workspace.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Total scans */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Total scans</p>
          <p className="mt-1 mb-2 text-3xl font-bold tabular-nums">
            {stats.totalScans.toLocaleString()}
          </p>
          <Trend result={trend} />
        </div>

        {/* Unique scans */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Unique scans</p>
          <p className="mt-1 mb-2 text-3xl font-bold tabular-nums">
            {stats.uniqueScans30d.toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground">last 30 days</span>
        </div>

        {/* Active QRs */}
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground">Active QR codes</p>
          <p className="mt-1 mb-2 text-3xl font-bold tabular-nums">
            {stats.activeQR.toLocaleString()}
          </p>
          <span className="text-xs text-muted-foreground">
            of {stats.totalQR} total
          </span>
        </div>
      </div>

      {stats.totalQR === 0 && (
        <div className="rounded-xl border bg-card p-8 text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            No QR codes yet. Create your first dynamic QR code.
          </p>
          <Button asChild>
            <Link href="/dashboard/qr-codes/new">Create QR code</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
