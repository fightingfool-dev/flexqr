import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Check, Upload } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { shortCodeUrl } from "@/lib/qr";
import { PLAN_LIMITS, PLANS } from "@/lib/plans";
import { QRCodeCard } from "@/components/qr/qr-code-card";
import { Button } from "@/components/ui/button";
import type { DbQRCode } from "@/lib/database.types";

export const metadata: Metadata = { title: "QR Codes" };

export default async function QRCodesPage({
  searchParams,
}: {
  searchParams: Promise<{ created?: string }>;
}) {
  const { created } = await searchParams;
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("workspaceId", workspace.id)
    .order("createdAt", { ascending: false });

  const qrCodes = (data ?? []) as DbQRCode[];

  const limit = PLAN_LIMITS[workspace.plan];
  const atLimit = limit !== Infinity && qrCodes.length >= limit;
  const planLabel = PLANS[workspace.plan].label;

  return (
    <div className="space-y-6">
      {created === "1" && (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
          <Check className="h-4 w-4 shrink-0" />
          Your QR code is now saved and being tracked.
        </div>
      )}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">QR Codes</h1>
          <p className="text-sm text-muted-foreground">
            {limit === Infinity
              ? `${qrCodes.length} code${qrCodes.length !== 1 ? "s" : ""}`
              : `${qrCodes.length} of ${limit} on ${planLabel}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {!atLimit && (
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/qr-codes/import">
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Import CSV
              </Link>
            </Button>
          )}
          {atLimit ? (
            <Button asChild variant="outline">
              <Link href="/dashboard/settings">Upgrade to create more</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/dashboard/qr-codes/new">
                <Plus className="mr-1.5 h-4 w-4" />
                Create QR code
              </Link>
            </Button>
          )}
        </div>
      </div>

      {atLimit && qrCodes.length > 0 && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          You&apos;ve reached the {limit}-QR limit on the {planLabel} plan.{" "}
          <Link href="/dashboard/settings" className="font-medium underline underline-offset-2">
            Upgrade
          </Link>{" "}
          to create more.
        </div>
      )}

      {qrCodes.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <p className="text-muted-foreground text-sm">No QR codes yet.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/qr-codes/new">Create your first one</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {qrCodes.map((qr) => (
            <QRCodeCard
              key={qr.id}
              qrCode={qr}
              shortUrl={shortCodeUrl(qr.shortCode)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
