import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { CreateQRForm } from "@/components/qr/create-qr-form";

export const metadata: Metadata = { title: "Create QR code" };

export default async function NewQRCodePage({
  searchParams,
}: {
  searchParams: Promise<{ prefillUrl?: string }>;
}) {
  await requireUser();
  const { prefillUrl } = await searchParams;

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
        <h1 className="text-3xl font-semibold tracking-tight">
          Create QR code
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          A short code is generated automatically. You can update the
          destination URL at any time without reprinting.
        </p>
      </div>

      <CreateQRForm defaultDestinationUrl={prefillUrl} />
    </div>
  );
}
