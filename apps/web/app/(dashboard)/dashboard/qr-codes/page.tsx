import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { shortCodeUrl } from "@/lib/qr";
import { QRCodeCard } from "@/components/qr/qr-code-card";
import { Button } from "@/components/ui/button";
import type { DbQRCode } from "@/lib/database.types";

export const metadata: Metadata = { title: "QR Codes" };

export default async function QRCodesPage() {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("workspaceId", workspace.id)
    .order("createdAt", { ascending: false });

  const qrCodes = (data ?? []) as DbQRCode[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">QR Codes</h1>
          <p className="text-sm text-muted-foreground">
            {qrCodes.length} code{qrCodes.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/qr-codes/new">
            <Plus className="mr-1.5 h-4 w-4" />
            Create QR code
          </Link>
        </Button>
      </div>

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
