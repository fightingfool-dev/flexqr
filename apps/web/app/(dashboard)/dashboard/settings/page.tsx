import type { Metadata } from "next";
import Link from "next/link";
import { Check, Zap, Lock, Users, Key, Building2, UserX } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PLANS, formatPrice, ENTERPRISE_MAILTO } from "@/lib/plans";
import { createCheckoutSession } from "@/actions/billing";
import { Button } from "@/components/ui/button";
import { BillingSuccessRefresh } from "@/components/billing/billing-success-refresh";
import { ManageSubscriptionButton } from "@/components/billing/manage-subscription-button";
import { InviteForm } from "@/components/settings/invite-form";
import { ApiKeyManager } from "@/components/settings/api-key-manager";
import { removeMember, revokeInvitation } from "@/actions/invitations";
import type { DbSubscription, Plan } from "@/lib/database.types";

export const metadata: Metadata = { title: "Settings" };

const PLAN_ORDER: Plan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

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

  const [{ count: qrCount }, { data: subData }, { data: membersData }, { data: invitesData }, { data: apiKeysData }] = await Promise.all([
    supabaseAdmin
      .from("qr_codes")
      .select("*", { count: "exact", head: true })
      .eq("workspaceId", workspace.id),
    supabaseAdmin
      .from("subscriptions")
      .select("*")
      .eq("workspaceId", workspace.id)
      .maybeSingle(),
    supabaseAdmin
      .from("workspace_members")
      .select("id, role, userId, users(email, name)")
      .eq("workspaceId", workspace.id),
    supabaseAdmin
      .from("invitations")
      .select("id, email, role, expiresAt")
      .eq("workspaceId", workspace.id)
      .is("acceptedAt", null)
      .gt("expiresAt", new Date().toISOString()),
    supabaseAdmin
      .from("api_keys")
      .select("id, name, keyPrefix, createdAt, lastUsedAt")
      .eq("workspaceId", workspace.id)
      .is("revokedAt", null)
      .order("createdAt", { ascending: false }),
  ]);

  const currentPlan = workspace.plan as Plan;
  const currentMeta = PLANS[currentPlan];
  const usedQR = qrCount ?? 0;
  const limitQR = currentMeta.qrLimit;
  const usagePct =
    limitQR === Infinity ? 0 : Math.min((usedQR / limitQR) * 100, 100);
  const sub = subData as DbSubscription | null;

  const isPaid = currentPlan !== "FREE" && currentPlan !== "ENTERPRISE";
  const isEnterprise = currentPlan === "ENTERPRISE";
  const hasTeamAccess = currentPlan === "PRO" || isEnterprise;
  const hasApiAccess = currentPlan !== "FREE";

  type MemberRow = { id: string; role: string; userId: string; users: { email: string; name: string | null } | null };
  type InviteRow = { id: string; email: string; role: string; expiresAt: string };
  type ApiKeyRow = { id: string; name: string; keyPrefix: string; createdAt: string; lastUsedAt: string | null };

  const members = (membersData ?? []) as unknown as MemberRow[];
  const invites = (invitesData ?? []) as unknown as InviteRow[];
  const apiKeys = (apiKeysData ?? []) as unknown as ApiKeyRow[];

  // Plans the user can upgrade to (higher than current, excluding current)
  const upgradePlans = PLAN_ORDER.filter(
    (p) => PLAN_ORDER.indexOf(p) > PLAN_ORDER.indexOf(currentPlan)
  );

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your workspace and billing.
        </p>
      </div>

      {/* Flash banner + race-condition poller */}
      {billing === "success" && (
        <>
          <BillingSuccessRefresh currentPlan={currentPlan} />
          <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
            <Check className="h-4 w-4 shrink-0" />
            {currentPlan === "FREE"
              ? "Payment received. Activating your plan…"
              : "Subscription activated. Thank you!"}
          </div>
        </>
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
              {isEnterprise && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  Managed by your enterprise agreement
                </p>
              )}
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
            <div className="flex items-center gap-2">
              {isPaid && <ManageSubscriptionButton />}
              {isEnterprise && (
                <Button asChild variant="outline" size="sm">
                  <a href={ENTERPRISE_MAILTO}>Contact support</a>
                </Button>
              )}
            </div>
          </div>

          {/* QR usage meter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">QR codes used</span>
              <span className="font-medium tabular-nums">
                {usedQR.toLocaleString()}
                {limitQR === Infinity ? " (unlimited)" : ` / ${limitQR}`}
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
              const isEnt = plan === "ENTERPRISE";
              return (
                <div
                  key={plan}
                  className={`rounded-xl border p-5 space-y-4 ${
                    isEnt
                      ? "bg-foreground text-background border-foreground shadow-lg"
                      : isHighlighted
                      ? "border-primary shadow-sm ring-1 ring-primary"
                      : "bg-card shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-semibold ${isEnt ? "text-background" : ""}`}>
                        {meta.label}
                      </p>
                      <p className={`text-2xl font-bold mt-0.5 ${isEnt ? "text-background" : ""}`}>
                        {meta.contactSales ? "Custom pricing" : formatPrice(meta.priceMonthly)}
                      </p>
                    </div>
                    {isHighlighted && (
                      <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                        <Zap className="h-3 w-3" />
                        Popular
                      </span>
                    )}
                    {isEnt && (
                      <span className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-400/10 px-2 py-1 rounded-full">
                        <Building2 className="h-3 w-3" />
                        Enterprise
                      </span>
                    )}
                  </div>

                  <ul className="space-y-1.5">
                    {meta.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm">
                        <Check className={`h-4 w-4 shrink-0 ${isEnt ? "text-amber-400" : "text-primary"}`} />
                        <span className={isEnt ? "text-background/80" : ""}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {meta.contactSales ? (
                    <Button
                      asChild
                      className="w-full bg-amber-400 text-amber-950 hover:bg-amber-300 border-0"
                    >
                      <a href={ENTERPRISE_MAILTO}>Contact Sales</a>
                    </Button>
                  ) : (
                    <form action={createCheckoutSession.bind(null, meta.priceId!)}>
                      <Button
                        type="submit"
                        className="w-full"
                        variant={isHighlighted ? "default" : "outline"}
                      >
                        Upgrade to {meta.label}
                      </Button>
                    </form>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Team section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">Team</h2>
          {!hasTeamAccess && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-950 px-2 py-0.5 rounded-full">
              <Lock className="h-3 w-3" />
              Pro
            </span>
          )}
        </div>

        {hasTeamAccess ? (
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-5">
            {/* Member list */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Members ({members.length})</span>
              </div>
              <div className="divide-y rounded-lg border overflow-hidden">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center gap-3 px-4 py-2.5">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{m.users?.name ?? m.users?.email ?? "Unknown"}</p>
                      <p className="text-xs text-muted-foreground truncate">{m.users?.email}</p>
                    </div>
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">
                      {m.role.toLowerCase()}
                    </span>
                    {m.role !== "OWNER" && m.userId !== user.id && (
                      <form action={removeMember.bind(null, m.id)}>
                        <button type="submit" className="text-muted-foreground hover:text-destructive transition-colors" title="Remove member">
                          <UserX className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Pending invitations */}
            {invites.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending invitations</p>
                <div className="divide-y rounded-lg border overflow-hidden">
                  {invites.map((inv) => (
                    <div key={inv.id} className="flex items-center gap-3 px-4 py-2.5">
                      <p className="flex-1 text-sm text-muted-foreground truncate">{inv.email}</p>
                      <span className="text-xs bg-muted px-2 py-0.5 rounded-full capitalize">{inv.role.toLowerCase()}</span>
                      <form action={revokeInvitation.bind(null, inv.id)}>
                        <button type="submit" className="text-muted-foreground hover:text-destructive transition-colors text-xs">
                          Revoke
                        </button>
                      </form>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Invite form */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Invite a team member</p>
              <InviteForm />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 opacity-50">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Invite teammates and manage roles</span>
            </div>
            <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 px-4 py-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-violet-900 dark:text-violet-200">Unlock team invites with Pro</p>
                <p className="text-xs text-violet-700 dark:text-violet-400 mt-0.5">Invite teammates and manage permissions.</p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/dashboard/settings#upgrade">Upgrade</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* API Keys section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold">API access</h2>
          {!hasApiAccess && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-950 px-2 py-0.5 rounded-full">
              <Lock className="h-3 w-3" />
              Starter+
            </span>
          )}
        </div>

        {hasApiAccess ? (
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">API keys ({apiKeys.length}/10)</span>
            </div>
            <ApiKeyManager existingKeys={apiKeys} />
          </div>
        ) : (
          <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 opacity-50">
              <Key className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Automate QR creation with the REST API</span>
            </div>
            <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950/30 px-4 py-3 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-violet-900 dark:text-violet-200">Unlock API access with Starter</p>
                <p className="text-xs text-violet-700 dark:text-violet-400 mt-0.5">Create and manage QR codes programmatically.</p>
              </div>
              <Button asChild size="sm" className="shrink-0">
                <Link href="/dashboard/settings#upgrade">Upgrade</Link>
              </Button>
            </div>
          </div>
        )}
      </section>

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
            <span className="text-muted-foreground">Plan</span>
            <PlanBadge plan={currentPlan} />
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
