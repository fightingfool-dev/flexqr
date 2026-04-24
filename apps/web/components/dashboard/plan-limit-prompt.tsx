import Link from "next/link";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PLANS } from "@/lib/plans";
import type { Plan } from "@/lib/database.types";

type Props = {
  plan: Plan;
  used: number;
};

export function PlanLimitPrompt({ plan, used }: Props) {
  const meta = PLANS[plan];
  const limit = meta.qrLimit;

  return (
    <div className="rounded-xl border bg-card p-8 text-center space-y-4">
      <div className="flex justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-5 w-5 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">QR code limit reached</h2>
        <p className="text-sm text-muted-foreground">
          You&apos;ve used {used} of {limit} QR codes on the{" "}
          <span className="font-medium text-foreground">{meta.label}</span> plan.
          Upgrade to create more.
        </p>
      </div>
      <div className="flex justify-center gap-3">
        <Button asChild>
          <Link href="/dashboard/settings">Upgrade plan</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard/qr-codes">Back to QR Codes</Link>
        </Button>
      </div>
    </div>
  );
}
