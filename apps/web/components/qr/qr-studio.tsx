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
import { AccordionSection } from "./studio/accordion-section";
import { StylePanel } from "./studio/style-panel";
import { LogoPanel } from "./studio/logo-panel";
import { FramePanel } from "./studio/frame-panel";
import { QRFrameWrapper } from "./studio/frame-wrapper";

const PREVIEW_SIZE = 240;
const DOWNLOAD_SIZE = 1200;

type Props = {
  qrCodeId: string;
  url: string;
  filename: string;
  scanCount: number;
  initialSettings: Partial<QRDesignSettings>;
};

export function QRStudio({
  qrCodeId,
  url,
  filename,
  scanCount,
  initialSettings,
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

  function updateSettings(patch: Partial<QRDesignSettings>) {
    setSaved(false);
    setSettings((prev) => ({ ...prev, ...patch }));
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

    if (!hasFrame) {
      const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
      await qr.download({ name: filename, extension: "png" });
      return;
    }

    // Frame compositing
    const qr = new QRCodeStyling(buildQROptions(url, settings, DOWNLOAD_SIZE));
    const blob = await qr.getRawData("png");
    if (!blob) return;

    const img = await loadImage(URL.createObjectURL(blob as Blob));
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

    // Background
    ctx.fillStyle = settings.bgColor;
    ctx.fillRect(0, 0, DOWNLOAD_SIZE, totalHeight);

    const qrY = frameIsTop ? frameHeight : 0;

    // QR image
    ctx.drawImage(img, 0, qrY, DOWNLOAD_SIZE, DOWNLOAD_SIZE);

    // Frame banner
    const bannerY = frameIsTop ? 0 : DOWNLOAD_SIZE;
    ctx.fillStyle = settings.frameColor;
    ctx.fillRect(0, bannerY, DOWNLOAD_SIZE, frameHeight);

    // Text
    const fontSize = 56;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.fillStyle = settings.frameTextColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(
      settings.frameText || "SCAN ME",
      DOWNLOAD_SIZE / 2,
      bannerY + frameHeight / 2
    );

    canvas.toBlob((b) => {
      if (!b) return;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = `${filename}.png`;
      a.click();
    }, "image/png");
  }

  function handleSave() {
    setSaved(false);
    startSave(async () => {
      await saveQRDesignSettings(qrCodeId, settings);
      setSaved(true);
    });
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
      {/* Left: preview */}
      <div className="flex flex-col items-center gap-3 lg:w-60 lg:shrink-0">
        <QRFrameWrapper settings={settings}>
          <div ref={qrRef} className="leading-none block" />
        </QRFrameWrapper>

        <p className="text-xs text-muted-foreground">
          {scanCount} scan{scanCount !== 1 ? "s" : ""}
        </p>

        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
            ) : saved ? (
              <Check className="h-3.5 w-3.5 mr-1" />
            ) : null}
            {saving ? "Saving…" : saved ? "Saved" : "Save design"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-3.5 w-3.5 mr-1" />
            PNG
          </Button>
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

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
