"use client";

import { useState, useTransition } from "react";
import { Loader2, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "./step-indicator";
import { TypeSelector, typeLabel } from "./type-selector";
import { WebsiteForm } from "./forms/website-form";
import { PdfForm } from "./forms/pdf-form";
import { ImageForm } from "./forms/image-form";
import { VCardForm } from "./forms/vcard-form";
import { VideoForm } from "./forms/video-form";
import { AppLinkForm } from "./forms/app-link-form";
import { WhatsAppForm } from "./forms/whatsapp-form";
import { WifiForm } from "./forms/wifi-form";
import { FeedbackForm } from "./forms/feedback-form";
import { MenuForm } from "./forms/menu-form";
import { QRStudio } from "@/components/qr/qr-studio";
import { createQRCodeWithType } from "@/actions/qr-create";
import { type QRBuilderType, computeBuilderPreviewUrl } from "@/lib/qr-builder-types";
import { DEFAULT_SETTINGS, type QRDesignSettings } from "@/lib/qr-design-types";

type Step = "type" | "content" | "design";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export function QRBuilder({ isPaidPlan }: { isPaidPlan?: boolean }) {
  const [step, setStep] = useState<Step>("type");
  const [qrType, setQrType] = useState<QRBuilderType | null>(null);
  const [name, setName] = useState("");
  const [contentJson, setContentJson] = useState<Record<string, unknown>>({});
  const [destinationUrl, setDestinationUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [designSettings, setDesignSettings] = useState<QRDesignSettings>(DEFAULT_SETTINGS);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSelectType(type: QRBuilderType) {
    setQrType(type);
    setStep("content");
  }

  function handleContentNext(
    json: Record<string, unknown>,
    url: string
  ) {
    if (!name.trim()) return;
    setContentJson(json);
    setDestinationUrl(url);
    setStep("design");
  }

  function handleCreate() {
    setError(null);
    startTransition(async () => {
      const result = await createQRCodeWithType(
        name,
        qrType!,
        contentJson,
        isPaidPlan ? (customCode || null) : null,
        designSettings
      );
      if (result?.error) setError(result.error);
    });
  }

  const previewUrl = qrType
    ? computeBuilderPreviewUrl(qrType, destinationUrl || "https://analogqr.com", APP_URL)
    : "https://analogqr.com";

  const stepNumber: 1 | 2 | 3 =
    step === "type" ? 1 : step === "content" ? 2 : 3;

  return (
    <div className="space-y-8">
      <StepIndicator current={stepNumber} />

      {step === "type" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">What type of QR code?</h2>
            <p className="text-sm text-muted-foreground">
              Choose the content your QR code will display.
            </p>
          </div>
          <TypeSelector onSelect={handleSelectType} />
        </div>
      )}

      {step === "content" && qrType && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("type")}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <span className="text-sm font-medium">{typeLabel(qrType)}</span>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="qr-name">Name</Label>
            <Input
              id="qr-name"
              placeholder="Summer campaign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Internal label — not visible to scanners.
            </p>
          </div>

          {name.trim() === "" && (
            <p className="text-xs text-muted-foreground -mt-2">
              Enter a name above to continue.
            </p>
          )}

          <div className={name.trim() === "" ? "pointer-events-none opacity-50" : ""}>
            <ContentFormForType
              type={qrType}
              onNext={handleContentNext}
              onBack={() => setStep("type")}
            />
          </div>
        </div>
      )}

      {step === "design" && qrType && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStep("content")}
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              Back
            </button>
            <span className="text-sm font-medium">Design your QR code</span>
          </div>

          <QRStudio
            url={previewUrl}
            filename={name || "qr-code"}
            initialSettings={designSettings}
            onSettingsChange={setDesignSettings}
          />

          {isPaidPlan && (
            <div className="space-y-1.5">
              <Label htmlFor="customCode">
                Custom short code{" "}
                <span className="text-xs font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Input
                id="customCode"
                placeholder="my-brand"
                value={customCode}
                onChange={(e) =>
                  setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))
                }
                maxLength={30}
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          )}

          {error && (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          )}

          <Button
            onClick={handleCreate}
            disabled={isPending}
            className="w-full sm:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                Creating…
              </>
            ) : (
              "Create QR code"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}

function ContentFormForType({
  type,
  onNext,
  onBack,
}: {
  type: QRBuilderType;
  onNext: (contentJson: Record<string, unknown>, destinationUrl: string) => void;
  onBack: () => void;
}) {
  switch (type) {
    case "URL":
      return <WebsiteForm onNext={onNext} onBack={onBack} />;
    case "PDF":
      return <PdfForm onNext={onNext} onBack={onBack} />;
    case "IMAGE":
      return <ImageForm onNext={onNext} onBack={onBack} />;
    case "VCARD":
      return <VCardForm onNext={onNext} onBack={onBack} />;
    case "VIDEO":
      return <VideoForm onNext={onNext} onBack={onBack} />;
    case "APP_LINK":
      return <AppLinkForm onNext={onNext} onBack={onBack} />;
    case "WHATSAPP":
      return <WhatsAppForm onNext={onNext} onBack={onBack} />;
    case "WIFI":
      return <WifiForm onNext={onNext} onBack={onBack} />;
    case "FEEDBACK":
      return <FeedbackForm onNext={onNext} onBack={onBack} />;
    case "MENU":
      return <MenuForm onNext={onNext} onBack={onBack} />;
    default:
      return null;
  }
}
