"use client";

import { useRef, useEffect, useState, useTransition } from "react";
import QRCode from "qrcode";
import { Download, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { saveQRDesign, getQRDesignSvg } from "@/actions/qr-design";

const PREVIEW_SIZE = 256;
const DOWNLOAD_SIZE = 1200;
const LOGO_FRACTION = 0.22;

type Props = {
  qrCodeId: string;
  url: string;
  filename: string;
  scanCount: number;
  initialDesign: {
    fgColor: string;
    bgColor: string;
  };
};

async function renderToCanvas(
  canvas: HTMLCanvasElement,
  url: string,
  size: number,
  fgColor: string,
  bgColor: string,
  logoDataUrl: string | null
): Promise<void> {
  await QRCode.toCanvas(canvas, url, {
    width: size,
    margin: 2,
    color: { dark: fgColor, light: bgColor },
    errorCorrectionLevel: "H",
  });

  if (!logoDataUrl) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  await new Promise<void>((resolve) => {
    const img = new Image();
    img.onload = () => {
      const logoSize = Math.floor(size * LOGO_FRACTION);
      const x = Math.floor((size - logoSize) / 2);
      const y = Math.floor((size - logoSize) / 2);
      const pad = Math.max(4, Math.floor(size * 0.006));
      ctx.fillStyle = bgColor;
      ctx.fillRect(x - pad, y - pad, logoSize + pad * 2, logoSize + pad * 2);
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve();
    };
    img.onerror = () => resolve();
    img.src = logoDataUrl;
  });
}

function triggerDownload(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function QRCustomizer({
  qrCodeId,
  url,
  filename,
  scanCount,
  initialDesign,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fgColor, setFgColor] = useState(initialDesign.fgColor);
  const [bgColor, setBgColor] = useState(initialDesign.bgColor);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Redraw preview whenever design state changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    renderToCanvas(canvas, url, PREVIEW_SIZE, fgColor, bgColor, logoDataUrl).catch(
      console.error
    );
  }, [url, fgColor, bgColor, logoDataUrl]);

  function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogoDataUrl(ev.target?.result as string);
    reader.readAsDataURL(file);
    // Reset input so the same file can be re-selected after removal
    e.target.value = "";
  }

  async function handlePngDownload() {
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = DOWNLOAD_SIZE;
    tempCanvas.height = DOWNLOAD_SIZE;
    await renderToCanvas(tempCanvas, url, DOWNLOAD_SIZE, fgColor, bgColor, logoDataUrl);
    tempCanvas.toBlob((blob) => {
      if (blob) triggerDownload(blob, `${filename}.png`);
    }, "image/png");
  }

  async function handleSvgDownload() {
    const svg = await getQRDesignSvg(qrCodeId);
    if (!svg) return;
    triggerDownload(new Blob([svg], { type: "image/svg+xml" }), `${filename}.svg`);
  }

  function handleSave() {
    setSaved(false);
    startTransition(async () => {
      await saveQRDesign(qrCodeId, fgColor, bgColor);
      setSaved(true);
    });
  }

  return (
    <div className="space-y-5">
      {/* Live preview */}
      <div className="flex flex-col items-center gap-1.5">
        <canvas
          ref={canvasRef}
          width={PREVIEW_SIZE}
          height={PREVIEW_SIZE}
          className="rounded-xl border bg-white shadow-sm"
        />
        <p className="text-xs text-muted-foreground">
          {scanCount} scan{scanCount !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="qr-fg">Foreground</Label>
          <div className="flex items-center gap-2">
            <input
              id="qr-fg"
              type="color"
              value={fgColor}
              onChange={(e) => { setFgColor(e.target.value); setSaved(false); }}
              className="h-8 w-9 cursor-pointer rounded border border-input p-0.5 bg-transparent"
            />
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {fgColor}
            </span>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="qr-bg">Background</Label>
          <div className="flex items-center gap-2">
            <input
              id="qr-bg"
              type="color"
              value={bgColor}
              onChange={(e) => { setBgColor(e.target.value); setSaved(false); }}
              className="h-8 w-9 cursor-pointer rounded border border-input p-0.5 bg-transparent"
            />
            <span className="text-xs font-mono text-muted-foreground uppercase">
              {bgColor}
            </span>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-1.5">
        <Label>Logo (optional)</Label>
        {logoDataUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={logoDataUrl}
              alt="Logo"
              className="h-9 w-9 rounded border bg-white object-contain p-0.5"
            />
            <button
              onClick={() => setLogoDataUrl(null)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors duration-150"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : (
          <label className="flex h-8 w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-input px-3 text-sm text-muted-foreground transition-colors duration-150 hover:border-primary hover:text-primary">
            <Upload className="h-3.5 w-3.5" />
            Upload logo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleLogoUpload}
            />
          </label>
        )}
        <p className="text-xs text-muted-foreground">
          Centered in QR. Included in PNG download only.
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-t">
        <Button size="sm" onClick={handleSave} disabled={isPending}>
          {isPending ? "Saving…" : saved ? "Saved" : "Save colors"}
        </Button>
        <Button variant="outline" size="sm" onClick={handlePngDownload}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          PNG
        </Button>
        <Button variant="outline" size="sm" onClick={handleSvgDownload}>
          <Download className="mr-1.5 h-3.5 w-3.5" />
          SVG
        </Button>
      </div>
    </div>
  );
}
