import type { Metadata } from "next";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus, Building2 } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { getDashboardStats } from "@/lib/analytics";
import { PLANS, ENTERPRISE_MAILTO } from "@/lib/plans";
import { Button } from "@/components/ui/button";
import type { Plan } from "@/lib/database.types";

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

const PLAN_BADGE: Record<Plan, { label: string; className: string }> = {
  FREE: { label: "Free", className: "bg-muted text-muted-foreground" },
  STARTER: { label: "Starter", className: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
  PRO: { label: "Pro", className: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
  ENTERPRISE: { label: "Enterprise", className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" },
};

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;
  const stats = await getDashboardStats(workspace.id);
  const trend = computeTrend(stats.scansLast7, stats.scansPrev7, stats.totalScans);

  const currentPlan = workspace.plan as Plan;
  const planMeta = PLANS[currentPlan];
  const badge = PLAN_BADGE[currentPlan];
  const isEnterprise = currentPlan === "ENTERPRISE";

  return (
    <div className="space-y-6">
      {/* Header with plan badge */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome to {workspace.name}.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
            {badge.label}
          </span>
          {!isEnterprise && (
            <Link
              href="/dashboard/settings"
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Upgrade
            </Link>
          )}
        </div>
      </div>

      {/* Stats grid */}
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
            {planMeta.qrLimit === Infinity
              ? "unlimited"
              : `of ${planMeta.qrLimit} allowed`}
          </span>
        </div>
      </div>

      {/* Empty state */}
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

      {/* Enterprise upsell — only for non-enterprise users */}
      {!isEnterprise && (
        <div className="rounded-xl border bg-foreground text-background p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-400/10">
              <Building2 className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-background">Upgrade to Enterprise</p>
              <p className="text-sm text-background/60 mt-0.5">
                Unlimited QR codes, team management, API access, SSO, and a dedicated support line.
              </p>
            </div>
          </div>
          <Button
            asChild
            size="sm"
            className="shrink-0 bg-amber-400 text-amber-950 hover:bg-amber-300 border-0"
          >
            <a href={ENTERPRISE_MAILTO}>Contact Sales</a>
          </Button>
        </div>
      )}
    </div>
  );
}
