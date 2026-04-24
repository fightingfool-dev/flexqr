import type { Metadata } from "next";
import { Check, Zap } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PLANS, formatPrice } from "@/lib/plans";
import { createCheckoutSession, createPortalSession } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import type { DbQRCode, DbSubscription, Plan } from "@/lib/database.types";

export const metadata: Metadata = { title: "Settings" };

const PLAN_ORDER: Plan[] = ["FREE", "STARTER", "PRO"];

function PlanBadge({ plan }: { plan: Plan }) {
  const colors: Record<Plan, string> = {
    FREE: "bg-muted text-muted-foreground",
    STARTER: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    PRO: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300",
    ENTERPRISE: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[plan]}`}>
      {PLANS[plan].label}
    </span>
  );
}

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ billing?: string }>;
}) {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;
  const { billing } = await searchParams;

  const [{ count: qrCount }, { data: subData }] = await Promise.all([
    supabaseAdmin
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .eq("workspaceId", workspace.id),
    supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("workspaceId", workspace.id)
      .maybeSingle(),
  ]);

  const currentPlan = workspace.plan as Plan;
  const currentMeta = PLANS[currentPlan];
  const usedQR = qrCount ?? 0;
  const limitQR = currentMeta.qrLimit;
  const usagePct =
    limitQR === Infinity ? 0 : Math.min((usedQR / limitQR) * 100, 100);
  const sub = subData as DbSubscription | null;

  const isPaid = currentPlan !== "FREE" && currentPlan !== "ENTERPRISE";
  const upgradePlans = PLAN_ORDER.filter(
    (p) => PLAN_ORDER.indexOf(p) > PLAN_ORDER.indexOf(currentPlan) && PLANS[p].priceId
  );

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your workspace and billing.
        </p>
      </div>

      {/* Flash banner */}
      {billing === "success" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <Check className="h-4 w-4 shrink-0" />
          Subscription activated. Thank you!
        </div>
      )}

      {/* Current plan */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Billing</h2>

        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <p className="font-medium">Current plan</p>
                <PlanBadge plan={currentPlan} />
              </div>
              {sub?.currentPeriodEnd && isPaid && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Renews{" "}
                  {new Date(sub.currentPeriodEnd).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              )}
            </div>
            {isPaid && (
              <form action={createPortalSession}>
                <Button type="submit" variant="outline" size="sm">
                  Manage subscription
                </Button>
              </form>
            )}
          </div>

          {/* QR usage meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">QR codes used</span>
              <span className="font-medium tabular-nums">
                {usedQR.toLocaleString()}
                {limitQR === Infinity ? "" : ` / ${limitQR}`}
                {limitQR === Infinity && " (unlimited)"}
              </span>
            </div>
            {limitQR !== Infinity && (
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    usagePct >= 90
                      ? "bg-destructive"
                      : usagePct >= 70
                        ? "bg-amber-500"
                        : "bg-primary"
                  }`}
                  style={{ width: `${usagePct}%` }}
                />
              </div>
            )}
            {limitQR !== Infinity && usagePct >= 90 && (
              <p className="text-xs text-destructive">
                You&apos;re near your limit. Upgrade to add more QR codes.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Upgrade plans */}
      {upgradePlans.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-base font-semibold">Upgrade your plan</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {upgradePlans.map((plan) => {
              const meta = PLANS[plan];
              const isHighlighted = plan === "PRO";
              return (
                <div
                  key={plan}
                  className={`rounded-xl border p-5 space-y-4 ${
                    isHighlighted
                      ? "border-primary shadow-sm ring-1 ring-primary"
                      : "bg-card shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{meta.label}</p>
                      <p className="text-2xl font-bold mt-0.5">
                        {formatPrice(meta.priceMonthly)}
                      </p>
                    </div>
                    {isHighlighted && (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <Zap className="h-3 w-3" />
                        Popular
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5">
                    {meta.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <form action={createCheckoutSession.bind(null, meta.priceId!)}>
                    <Button
                      type="submit"
                      className="w-full"
                      variant={isHighlighted ? "default" : "outline"}
                    >
                      Upgrade to {meta.label}
                    </Button>
                  </form>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Workspace info */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold">Workspace</h2>
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Name</span>
            <span className="font-medium">{workspace.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Account</span>
            <span className="font-medium">{user.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Member since</span>
            <span className="font-medium">
              {new Date(workspace.createdAt).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
