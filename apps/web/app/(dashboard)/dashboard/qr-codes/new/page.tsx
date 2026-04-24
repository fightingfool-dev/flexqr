import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PLAN_LIMITS } from "@/lib/plans";
import { CreateQRForm } from "@/components/qr/create-qr-form";
import { PlanLimitPrompt } from "@/components/dashboard/plan-limit-prompt";

export const metadata: Metadata = { title: "Create QR code" };

export default async function NewQRCodePage({
  searchParams,
}: {
  searchParams: Promise<{ prefillUrl?: string }>;
}) {
  const user = await requireUser();
  const { prefillUrl } = await searchParams;

  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;

  const { count } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("workspaceId", workspace.id);

  const limit = PLAN_LIMITS[workspace.plan];
  const used = count ?? 0;
  const atLimit = limit !== Infinity && used >= limit;
  const isPaidPlan = workspace.plan !== "FREE";

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <Link
          href="/dashboard/qr-codes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          QR Codes
        </Link>
        {!atLimit && (
          <>
            <h1 className="text-3xl font-semibold tracking-tight">
              Create QR code
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              A short code is generated automatically. You can update the
              destination URL at any time without reprinting.
            </p>
          </>
        )}
      </div>

      {atLimit ? (
        <PlanLimitPrompt plan={workspace.plan} used={used} />
      ) : (
        <CreateQRForm defaultDestinationUrl={prefillUrl} isPaidPlan={isPaidPlan} />
      )}
    </div>
  );
}
