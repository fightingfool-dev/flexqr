import Link from "next/link";
import { Check, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS, formatPrice } from "@/lib/plans";
import type { Plan } from "@/lib/database.types";

const PLAN_ORDER: Plan[] = ["FREE", "STARTER", "PRO", "ENTERPRISE"];

type Props = {
  plan: Plan;
  used: number;
};

export function PlanLimitPrompt({ plan, used }: Props) {
  const meta = PLANS[plan];
  const limit = meta.qrLimit;

  const nextPlanKey = PLAN_ORDER[PLAN_ORDER.indexOf(plan) + 1] as Plan | undefined;
  const nextPlan = nextPlanKey ? PLANS[nextPlanKey] : null;

  return (
    <div className="max-w-lg mx-auto space-y-6 py-8 px-4">
      {/* Usage badge */}
      <div className="rounded-xl border bg-destructive/5 border-destructive/20 p-5 text-center space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
          <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
          Limit reached
        </div>
        <p className="text-lg font-semibold">
          You&apos;ve used {used} of {limit} QR code{limit !== 1 ? "s" : ""}
        </p>
        <p className="text-sm text-muted-foreground">
          Upgrade your plan to create more QR codes and unlock advanced features.
        </p>
      </div>

      {/* Next plan card */}
      {nextPlan && nextPlanKey && (
        <div className="rounded-xl border border-primary/40 bg-primary/5 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-lg font-bold">{nextPlan.label}</p>
                {nextPlanKey === "PRO" && (
                  <span className="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    <Zap className="h-2.5 w-2.5" />
                    Popular
                  </span>
                )}
              </div>
              <p className="text-2xl font-extrabold">
                {nextPlan.contactSales ? "Custom" : formatPrice(nextPlan.priceMonthly)}
              </p>
            </div>
          </div>

          <ul className="space-y-2">
            {nextPlan.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-primary shrink-0" />
                {f}
              </li>
            ))}
          </ul>

          {nextPlan.contactSales ? (
            <Button asChild className="w-full gap-2">
              <a href={`mailto:sales@analogqr.com?subject=Enterprise plan inquiry`}>
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          ) : (
            <Button asChild className="w-full gap-2">
              <Link href="/dashboard/settings">
                Upgrade to {nextPlan.label}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      )}

      {/* Show all plans link */}
      <div className="text-center space-y-2">
        <Button asChild variant="ghost" size="sm">
          <Link href="/dashboard/settings">View all plans</Link>
        </Button>
        <div>
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/qr-codes">
              <ArrowRight className="h-3.5 w-3.5 mr-1 rotate-180" />
              Back to QR codes
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
