"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FRAME_TYPES, type QRDesignSettings, type FrameType } from "@/lib/qr-design-types";
import { cn } from "@/lib/utils";

type Props = {
  settings: QRDesignSettings;
  onChange: (patch: Partial<QRDesignSettings>) => void;
};

export function FramePanel({ settings, onChange }: Props) {
  const hasFrame = settings.frameType !== "none";

  return (
    <div className="space-y-4">
      {/* Frame type selector */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2 block">
          Frame Type
        </Label>
        <div className="grid grid-cols-4 gap-1.5 max-h-40 overflow-y-auto pr-1">
          {FRAME_TYPES.map((ft) => (
            <button
              key={ft.value}
              type="button"
              onClick={() => onChange({ frameType: ft.value as FrameType })}
              className={cn(
                "rounded-md border px-2 py-1.5 text-xs transition-colors text-center",
                settings.frameType === ft.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-input bg-background hover:bg-muted"
              )}
            >
              {ft.label}
            </button>
          ))}
        </div>
      </div>

      {/* Frame text + colors — only shown when a frame is active */}
      {hasFrame && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="frame-text" className="text-xs">
              Label text
            </Label>
            <Input
              id="frame-text"
              value={settings.frameText}
              onChange={(e) => onChange({ frameText: e.target.value })}
              placeholder="SCAN ME"
              maxLength={30}
              className="h-8 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="frame-color" className="text-xs">
                Frame color
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="frame-color"
                  type="color"
                  value={settings.frameColor}
                  onChange={(e) => onChange({ frameColor: e.target.value })}
                  className="h-8 w-9 cursor-pointer rounded border border-input p-0.5 bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {settings.frameColor}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor="frame-text-color" className="text-xs">
                Text color
              </Label>
              <div className="flex items-center gap-2">
                <input
                  id="frame-text-color"
                  type="color"
                  value={settings.frameTextColor}
                  onChange={(e) => onChange({ frameTextColor: e.target.value })}
                  className="h-8 w-9 cursor-pointer rounded border border-input p-0.5 bg-transparent"
                />
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {settings.frameTextColor}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
