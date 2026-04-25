"use client";

import { Upload, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  LOGO_PRESETS,
  makePresetDataUrl,
  type QRDesignSettings,
} from "@/lib/qr-design-types";
import { cn } from "@/lib/utils";

type Props = {
  settings: QRDesignSettings;
  onChange: (patch: Partial<QRDesignSettings>) => void;
};

export function LogoPanel({ settings, onChange }: Props) {
  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) =>
      onChange({ logoUrl: ev.target?.result as string });
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-4">
      {/* Current logo / upload */}
      <div className="space-y-1.5">
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide block">
          Logo
        </Label>
        {settings.logoUrl ? (
          <div className="flex items-center gap-3">
            <img
              src={settings.logoUrl}
              alt="Logo"
              className="h-10 w-10 rounded border bg-white object-contain p-0.5"
            />
            <button
              type="button"
              onClick={() => onChange({ logoUrl: null })}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
            >
              <X className="h-3 w-3" />
              Remove
            </button>
          </div>
        ) : (
          <label className="flex h-8 w-fit cursor-pointer items-center gap-1.5 rounded-lg border border-dashed border-input px-3 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-primary">
            <Upload className="h-3.5 w-3.5" />
            Upload logo
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleUpload}
            />
          </label>
        )}
        <p className="text-xs text-muted-foreground">
          PNG, SVG, or JPEG. Centered in QR.
        </p>
      </div>

      {/* Presets */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Presets
        </Label>
        <div className="grid grid-cols-6 gap-1.5">
          {LOGO_PRESETS.map((preset) => {
            const dataUrl = makePresetDataUrl(preset);
            const active = settings.logoUrl === dataUrl;
            return (
              <button
                key={preset.id}
                type="button"
                title={preset.label}
                onClick={() =>
                  onChange({ logoUrl: active ? null : dataUrl })
                }
                className={cn(
                  "flex flex-col items-center gap-0.5 rounded-lg p-1 transition-colors",
                  active
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-muted"
                )}
              >
                <img
                  src={dataUrl}
                  alt={preset.label}
                  className="h-7 w-7 rounded-full"
                />
                <span className="text-[9px] text-muted-foreground leading-tight truncate w-full text-center">
                  {preset.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Size slider */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Size — {Math.round(settings.logoSize * 100)}%
        </Label>
        <input
          type="range"
          min={0.1}
          max={0.4}
          step={0.01}
          value={settings.logoSize}
          onChange={(e) =>
            onChange({ logoSize: parseFloat(e.target.value) })
          }
          className="w-full"
        />
      </div>
    </div>
  );
}
