"use client";

import { AlertTriangle } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  DOT_STYLES,
  CORNER_SQUARE_STYLES,
  CORNER_DOT_STYLES,
  getContrastRatio,
  type QRDesignSettings,
} from "@/lib/qr-design-types";
import { cn } from "@/lib/utils";

type Props = {
  settings: QRDesignSettings;
  onChange: (patch: Partial<QRDesignSettings>) => void;
};

export function StylePanel({ settings, onChange }: Props) {
  const contrast = getContrastRatio(settings.fgColor, settings.bgColor);
  const lowContrast = contrast < 3;

  return (
    <div className="space-y-5">
      {/* Colors */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Colors
        </Label>
        <div className="grid grid-cols-2 gap-3">
          <ColorPicker
            id="fg-color"
            label="Foreground"
            value={settings.fgColor}
            onChange={(v) => onChange({ fgColor: v })}
          />
          <ColorPicker
            id="bg-color"
            label="Background"
            value={settings.bgColor}
            onChange={(v) => onChange({ bgColor: v })}
          />
        </div>
        {lowContrast && (
          <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-600">
            <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
            Low contrast. QR may not scan reliably (ratio {contrast.toFixed(1)}:1)
          </div>
        )}
      </div>

      {/* Dot style */}
      <ShapeSelector
        label="Dot Style"
        options={DOT_STYLES}
        value={settings.dotStyle}
        onChange={(v) => onChange({ dotStyle: v as QRDesignSettings["dotStyle"] })}
      />

      {/* Corner square */}
      <ShapeSelector
        label="Corner Style"
        options={CORNER_SQUARE_STYLES}
        value={settings.cornerSquareStyle}
        onChange={(v) => onChange({ cornerSquareStyle: v as QRDesignSettings["cornerSquareStyle"] })}
      />

      {/* Corner dot */}
      <ShapeSelector
        label="Corner Dot"
        options={CORNER_DOT_STYLES}
        value={settings.cornerDotStyle}
        onChange={(v) => onChange({ cornerDotStyle: v as QRDesignSettings["cornerDotStyle"] })}
      />
    </div>
  );
}

function ColorPicker({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-xs">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 w-9 cursor-pointer rounded border border-input p-0.5 bg-transparent"
        />
        <span className="text-xs font-mono text-muted-foreground uppercase">
          {value}
        </span>
      </div>
    </div>
  );
}

function ShapeSelector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
        {label}
      </Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md border px-2.5 py-1 text-xs transition-colors",
              value === opt.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input bg-background hover:bg-muted"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
