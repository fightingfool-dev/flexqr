import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, BarChart2 } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { shortCodeUrl } from "@/lib/qr";
import { EditQRForm } from "@/components/qr/edit-qr-form";
import { QRCustomizer } from "@/components/qr/qr-customizer";
import { Button } from "@/components/ui/button";
import type { DbQRCode, DbQRDesign } from "@/lib/database.types";

export const metadata: Metadata = { title: "Edit QR code" };

export default async function EditQRCodePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireUser();
  const { id } = await params;

  const { data } = await supabaseAdmin
    .from("qr_codes")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) notFound();
  const qrCode = data as DbQRCode;
  const redirectUrl = shortCodeUrl(qrCode.shortCode);

  const { data: designData } = await supabaseAdmin
    .from("qr_designs")
    .select("fgColor, bgColor")
    .eq("qrCodeId", id)
    .maybeSingle();

  const design = designData as Pick<DbQRDesign, "fgColor" | "bgColor"> | null;

  const filename = qrCode.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "") || "qr-code";

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link
          href="/dashboard/qr-codes"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ChevronLeft className="h-4 w-4" />
          QR Codes
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">
              {qrCode.name}
            </h1>
            <p className="text-sm text-muted-foreground font-mono mt-0.5">
              {redirectUrl}
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href={`/dashboard/qr-codes/${qrCode.id}/analytics`}>
              <BarChart2 className="mr-1.5 h-3.5 w-3.5" />
              Analytics
            </Link>
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-8 sm:flex-row sm:items-start">
        {/* QR customizer (preview + design controls + download) */}
        <div className="sm:w-64 shrink-0">
          <QRCustomizer
            qrCodeId={qrCode.id}
            url={redirectUrl}
            filename={filename}
            scanCount={qrCode.scanCount}
            initialDesign={{
              fgColor: design?.fgColor ?? "#000000",
              bgColor: design?.bgColor ?? "#FFFFFF",
            }}
          />
        </div>

        {/* Edit form */}
        <div className="flex-1">
          <EditQRForm qrCode={qrCode} />
        </div>
      </div>
    </div>
  );
}
