"use client";

import { useRef, useEffect, useState, useTransition } from "react";
import { Download, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { saveQRDesignSettings } from "@/actions/qr-design";
import {
  DEFAULT_SETTINGS,
  buildQROptions,
  type QRDesignSettings,
} from "@/lib/qr-design-types";
import { cn } from "@/lib/utils";
import { AccordionSection } from "./studio/accordion-section";
import { StylePanel } from "./studio/style-panel";
import { LogoPanel } from "./studio/logo-panel";
import { FramePanel } from "./studio/frame-panel";
import { QRFrameWrapper } from "./studio/frame-wrapper";

const PREVIEW_SIZE = 240;
const DOWNLOAD_SIZE = 1200;

type DownloadFormat = "png" | "jpg";

type Props = {
  qrCodeId?: string;
  url: string;
  filename: string;
  scanCount?: number;
  initialSettings: Partial<QRDesignSettings>;
  onSettingsChange?: (settings: QRDesignSettings) => void;
};

export function QRStudio({
  qrCodeId,
  url,
  filename,
  scanCount = 0,
  initialSettings,
  onSettingsChange,
}: Props) {
  const qrRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const qrInstanceRef = useRef<any>(null);
  const [settings, setSettings] = useState<QRDesignSettings>({
    ...DEFAULT_SETTINGS,
    ...initialSettings,
  });
  const [saved, setSaved] = useState(false);
  const [saving, startSave] = useTransition();
  const [openSection, setOpenSection] = useState<string | null>("style");
  const [downloadFormat, setDownloadFormat] = useState<DownloadFormat>("png");

  function updateSettings(patch: Partial<QRDesignSettings>) {
    setSaved(false);
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      onSettingsChange?.(next);
      return next;
    });
  }

  function toggleSection(name: string) {
    setOpenSection((prev) => (prev === name ? null : name));
  }

  // Initialize / update qr-code-styling preview
  useEffect(() => {
    let cancelled = false;

    async function render() {
      const { default: QRCodeStyling } = await import("qr-code-styling");
      if (cancelled || !qrRef.current) return;

      const options = buildQROptions(url, settings, PREVIEW_SIZE);

      if (!qrInstanceRef.current) {
        qrInstanceRef.current = new QRCodeStyling(options);
        qrRef.current.innerHTML = "";
        qrInstanceRef.current.append(qrRef.current);
      } else {
        qrInstanceRef.current.update(options);
      }
    }

    render().catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [url, settings]);

  async function handleDownload() {
    const { default: QRCodeStyling } = await import("qr-code-styling");
    const hasFrame = settings.frameType !== "none";

    // Simple PNG, no frame — fastest path via library download
    if (!hasFrame && downloadFormat === "png") {
      const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
      await qr.download({ name: filename, extension: "png" });
      return;
    }

    // All other cases (JPG, or any framed variant): composite via canvas
    const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
    const rawBlob = await qr.getRawData("png");
    if (!rawBlob) return;

    const img = await loadImage(URL.createObjectURL(rawBlob as Blob));

    if (!hasFrame) {
      // JPG-only, no frame: flatten onto solid-background canvas
      const canvas = document.createElement("canvas");
      canvas.width = DOWNLOAD_SIZE;
      canvas.height = DOWNLOAD_SIZE;
      const ctx = canvas.getContext("2d")!;
      // JPEG has no alpha channel — fill bg colour first so there's no black bleed
      ctx.fillStyle = settings.bgColor || "#FFFFFF";
      ctx.fillRect(0, 0, DOWNLOAD_SIZE, DOWNLOAD_SIZE);
      ctx.drawImage(img, 0, 0);
      blobAndSave(canvas, filename, "jpg");
      return;
    }

    // Framed compositing
    const frameHeight = 120;
    const frameIsTop =
      settings.frameType === "simple-top" ||
      settings.frameType === "banner-top" ||
      settings.frameType === "rounded-top" ||
      settings.frameType === "speech-flipped";
    const totalHeight = DOWNLOAD_SIZE + frameHeight;

    const canvas = document.createElement("canvas");
    canvas.width = DOWNLOAD_SIZE;
    canvas.height = totalHeight;
    const ctx = canvas.getContext("2d")!;

    // For JPG pre-fill white so transparent areas don't become black
    ctx.fillStyle = downloadFormat === "jpg" ? "#FFFFFF" : settings.bgColor;
    ctx.fillRect(0, 0, DOWNLOAD_SIZE, totalHeight);

    const qrY = frameIsTop ? frameHeight : 0;
    ctx.drawImage(img, 0, qrY, DOWNLOAD_SIZE, DOWNLOAD_SIZE);

    const bannerY = frameIsTop ? 0 : DOWNLOAD_SIZE;
    ctx.fillStyle = settings.frameColor;
    ctx.fillRect(0, bannerY, DOWNLOAD_SIZE, frameHeight);

    ctx.font = `bold 56px sans-serif`;
    ctx.fillStyle = settings.frameTextColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      settings.frameText || "SCAN ME",
      DOWNLOAD_SIZE / 2,
      bannerY + frameHeight / 2
    );

    blobAndSave(canvas, filename, downloadFormat);
  }

  function handleSave() {
    setSaved(false);
    startSave(async () => {
      await saveQRDesignSettings(qrCodeId!, settings);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left: preview + download controls */}
      <div className="flex flex-col items-center gap-4 lg:w-64 lg:shrink-0">
        <QRFrameWrapper settings={settings}>
          <div ref={qrRef} className="leading-none block" />
        </QRFrameWrapper>

        <p className="text-xs text-muted-foreground">
          {scanCount} scan{scanCount !== 1 ? "s" : ""}
        </p>

        {/* Download section */}
        <div className="w-full space-y-3">
          <div className="space-y-1.5">
            <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
              File Type
            </p>
            <div className="flex gap-1.5">
              {(["png", "jpg"] as DownloadFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDownloadFormat(fmt)}
                  className={cn(
                    "flex-1 rounded-md border py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                    downloadFormat === fmt
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-input bg-background text-foreground hover:bg-muted hover:border-primary/50"
                  )}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-muted-foreground leading-snug">
              {downloadFormat === "jpg"
                ? "JPG is ideal for sharing and printing"
                : "PNG preserves transparency and sharp edges"}
            </p>
          </div>

          <div className="flex gap-2">
            {qrCodeId && (
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                ) : saved ? (
                  <Check className="h-3.5 w-3.5 mr-1" />
                ) : null}
                {saving ? "Saving…" : saved ? "Saved" : "Save"}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex-1"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download {downloadFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </div>

      {/* Right: accordions */}
      <div className="flex-1 space-y-2">
        <AccordionSection
          title="Style"
          open={openSection === "style"}
          onToggle={() => toggleSection("style")}
        >
          <StylePanel settings={settings} onChange={updateSettings} />
        </AccordionSection>

        <AccordionSection
          title="Logo"
          open={openSection === "logo"}
          onToggle={() => toggleSection("logo")}
        >
          <LogoPanel settings={settings} onChange={updateSettings} />
        </AccordionSection>

        <AccordionSection
          title="Frame"
          open={openSection === "frame"}
          onToggle={() => toggleSection("frame")}
        >
          <FramePanel settings={settings} onChange={updateSettings} />
        </AccordionSection>
      </div>
    </div>
  );
}

function blobAndSave(
  canvas: HTMLCanvasElement,
  name: string,
  format: DownloadFormat
) {
  const mime = format === "jpg" ? "image/jpeg" : "image/png";
  const quality = format === "jpg" ? 0.95 : undefined;
  canvas.toBlob(
    (b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `${name}.${format}`;
      a.click();
      URL.revokeObjectURL(a.href);
    },
    mime,
    quality
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
