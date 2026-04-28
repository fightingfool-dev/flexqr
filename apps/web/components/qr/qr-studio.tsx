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

type DownloadFormat = "png" | "jpg" | "svg" | "pdf";

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

      if (!qrRef.current.hasChildNodes()) {
        qrInstanceRef.current = new QRCodeStyling(options);
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
    const frameIsTop =
      settings.frameType === "simple-top" ||
      settings.frameType === "banner-top" ||
      settings.frameType === "rounded-top" ||
      settings.frameType === "speech-flipped";

    // --- SVG ---
    if (downloadFormat === "svg") {
      const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
      if (!hasFrame) {
        await qr.download({ name: filename, extension: "svg" });
        return;
      }
      // Framed SVG: embed QR SVG inside a wrapper SVG with text banner
      const svgBlob = await qr.getRawData("svg");
      if (!svgBlob) return;
      const svgText = await (svgBlob as Blob).text();
      const framedSvg = buildFramedSvg(svgText, settings, DOWNLOAD_SIZE, frameIsTop);
      const blob = new Blob([framedSvg], { type: "image/svg+xml" });
      triggerBlob(blob, `${filename}.svg`);
      return;
    }

    // --- PDF (print dialog → Save as PDF) ---
    if (downloadFormat === "pdf") {
      const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
      const rawBlob = await qr.getRawData("png");
      if (!rawBlob) return;
      const img = await loadImage(URL.createObjectURL(rawBlob as Blob));
      const canvas = await composeCanvas(img, settings, hasFrame, frameIsTop, "#FFFFFF");
      openPrintWindow(canvas.toDataURL("image/png"), filename);
      return;
    }

    // --- PNG (simple, no frame) ---
    if (!hasFrame && downloadFormat === "png") {
      const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
      await qr.download({ name: filename, extension: "png" });
      return;
    }

    // --- PNG / JPG with frame, or JPG no frame ---
    const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
    const rawBlob = await qr.getRawData("png");
    if (!rawBlob) return;
    const img = await loadImage(URL.createObjectURL(rawBlob as Blob));

    const bgColor = downloadFormat === "jpg" ? "#FFFFFF" : settings.bgColor;
    const canvas = await composeCanvas(img, settings, hasFrame, frameIsTop, bgColor);
    blobAndSave(canvas, filename, downloadFormat as "png" | "jpg");
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
        <QRFrameWrapper key={settings.frameType} settings={settings}>
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
            <div className="grid grid-cols-4 gap-1.5">
              {(["png", "jpg", "svg", "pdf"] as DownloadFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setDownloadFormat(fmt)}
                  className={cn(
                    "rounded-md border py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
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
              {downloadFormat === "jpg" && "JPG is ideal for sharing and printing"}
              {downloadFormat === "png" && "PNG preserves transparency and sharp edges"}
              {downloadFormat === "svg" && "SVG is infinitely scalable for print and design"}
              {downloadFormat === "pdf" && "PDF opens a print dialog — choose Save as PDF"}
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
              {downloadFormat === "pdf" ? "Print / Save PDF" : `Download ${downloadFormat.toUpperCase()}`}
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
  format: "png" | "jpg"
) {
  const mime = format === "jpg" ? "image/jpeg" : "image/png";
  const quality = format === "jpg" ? 0.95 : undefined;
  canvas.toBlob(
    (b) => {
      if (!b) return;
      triggerBlob(b, `${name}.${format}`);
    },
    mime,
    quality
  );
}

function triggerBlob(blob: Blob, name: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function composeCanvas(
  img: HTMLImageElement,
  settings: QRDesignSettings,
  hasFrame: boolean,
  frameIsTop: boolean,
  bgColor: string
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");

  if (!hasFrame) {
    canvas.width = DOWNLOAD_SIZE;
    canvas.height = DOWNLOAD_SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, DOWNLOAD_SIZE, DOWNLOAD_SIZE);
    ctx.drawImage(img, 0, 0);
    return canvas;
  }

  const frameHeight = 120;
  const totalHeight = DOWNLOAD_SIZE + frameHeight;
  canvas.width = DOWNLOAD_SIZE;
  canvas.height = totalHeight;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = bgColor;
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
  ctx.fillText(settings.frameText || "SCAN ME", DOWNLOAD_SIZE / 2, bannerY + frameHeight / 2);

  return canvas;
}

function buildFramedSvg(
  qrSvgText: string,
  settings: QRDesignSettings,
  size: number,
  frameIsTop: boolean
): string {
  const frameHeight = 120;
  const totalHeight = size + frameHeight;
  const qrY = frameIsTop ? frameHeight : 0;
  const bannerY = frameIsTop ? 0 : size;
  const qrDataUri = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(qrSvgText)))}`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${totalHeight}" viewBox="0 0 ${size} ${totalHeight}">
  <rect x="0" y="${bannerY}" width="${size}" height="${frameHeight}" fill="${settings.frameColor}"/>
  <image href="${qrDataUri}" x="0" y="${qrY}" width="${size}" height="${size}"/>
  <text x="${size / 2}" y="${bannerY + frameHeight / 2}" font-family="sans-serif" font-weight="bold" font-size="56" fill="${settings.frameTextColor}" text-anchor="middle" dominant-baseline="middle">${settings.frameText || "SCAN ME"}</text>
</svg>`;
}

function openPrintWindow(dataUrl: string, name: string) {
  const win = window.open("", "_blank", "width=700,height=700");
  if (!win) return;
  win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>${name}</title>
  <style>
    @page { margin: 0; }
    body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
    img { max-width: 100%; max-height: 100vh; display: block; }
  </style>
</head>
<body><img src="${dataUrl}" alt="${name}" /></body>
</html>`);
  win.document.close();
  win.addEventListener("load", () => win.print());
}
