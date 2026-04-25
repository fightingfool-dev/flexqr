import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, BarChart2, Palette } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { shortCodeUrl } from "@/lib/qr";
import { EditQRForm } from "@/components/qr/edit-qr-form";
import { QRStudio } from "@/components/qr/qr-studio";
import { Button } from "@/components/ui/button";
import { ExportDropdown } from "@/components/analytics/export-dropdown";
import { DEFAULT_SETTINGS } from "@/lib/qr-design-types";
import type { DbQRCode, DbQRDesign } from "@/lib/database.types";
import type { QRDesignSettings } from "@/lib/qr-design-types";

export const metadata: Metadata = { title: "Edit QR code" };

export default async function EditQRCodePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ new?: string }>;
}) {
  await requireUser();
  const { id } = await params;
  const { new: isNew } = await searchParams;

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
    .select("fgColor, bgColor, settings")
    .eq("qrCodeId", id)
    .maybeSingle();

  const design = designData as Pick<DbQRDesign, "fgColor" | "bgColor" | "settings"> | null;

  // Merge legacy top-level columns into settings for backward compat
  const savedSettings = design?.settings as Partial<QRDesignSettings> | null;
  const initialSettings: Partial<QRDesignSettings> = {
    fgColor: design?.fgColor ?? DEFAULT_SETTINGS.fgColor,
    bgColor: design?.bgColor ?? DEFAULT_SETTINGS.bgColor,
    ...savedSettings,
  };

  const filename =
    qrCode.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "qr-code";

  return (
    <div className="max-w-4xl space-y-8">
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
          <div className="flex items-center gap-2 shrink-0">
            <ExportDropdown qrCodeId={qrCode.id} showImage />
            <Button asChild variant="outline" size="sm">
              <Link href={`/dashboard/qr-codes/${qrCode.id}/analytics`}>
                <BarChart2 className="mr-1.5 h-3.5 w-3.5" />
                Analytics
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {isNew === "1" && (
        <div className="flex items-start gap-3 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary">
          <Palette className="h-4 w-4 mt-0.5 shrink-0" />
          <span>
            Your QR code is ready. Customize colors, dot shapes, a logo, and a
            frame below — then hit <strong>Save design</strong> to apply.
          </span>
        </div>
      )}

      {/* QR Studio */}
      <section>
        <h2 className="text-base font-semibold mb-4">Design</h2>
        <QRStudio
          qrCodeId={qrCode.id}
          url={redirectUrl}
          filename={filename}
          scanCount={qrCode.scanCount}
          initialSettings={initialSettings}
        />
      </section>

      {/* Edit form */}
      <section>
        <h2 className="text-base font-semibold mb-4">Settings</h2>
        <div className="max-w-lg">
          <EditQRForm qrCode={qrCode} />
        </div>
      </section>
    </div>
  );
}
