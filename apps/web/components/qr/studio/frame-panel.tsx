"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { type QRDesignSettings, type FrameType } from "@/lib/qr-design-types";
import { cn } from "@/lib/utils";

type Props = {
  settings: QRDesignSettings;
  onChange: (patch: Partial<QRDesignSettings>) => void;
};

const FRAME_OPTIONS: {
  value: FrameType;
  label: string;
  direction?: "up" | "down";
}[] = [
  { value: "none", label: "None" },
  { value: "simple-bottom", label: "Label", direction: "down" },
  { value: "simple-top", label: "Label", direction: "up" },
  { value: "banner-bottom", label: "Banner", direction: "down" },
  { value: "banner-top", label: "Banner", direction: "up" },
  { value: "rounded-bottom", label: "Rounded", direction: "down" },
  { value: "rounded-top", label: "Rounded", direction: "up" },
  { value: "speech", label: "Speech", direction: "down" },
  { value: "speech-flipped", label: "Speech", direction: "up" },
  { value: "badge", label: "Badge" },
  { value: "circle", label: "Circle" },
  { value: "box", label: "Box" },
];

export function FramePanel({ settings, onChange }: Props) {
  const hasFrame = settings.frameType !== "none";

  function handleSelect(value: FrameType) {
    console.log("frameType:", value);
    onChange({ frameType: value });
  }

  return (
    <div className="space-y-4">
      {/* Frame type grid */}
      <div>
        <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2.5 block">
          Frame Type
        </Label>
        <div className="grid grid-cols-3 gap-2">
          {FRAME_OPTIONS.map((ft) => {
            const isSelected = settings.frameType === ft.value;
            return (
              <button
                key={ft.value}
                type="button"
                onClick={() => handleSelect(ft.value)}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground shadow-md"
                    : "border-input bg-background text-foreground hover:bg-muted hover:border-primary/50"
                )}
              >
                <span>{ft.label}</span>
                {ft.direction === "down" && (
                  <ArrowDown className="h-3.5 w-3.5 shrink-0" />
                )}
                {ft.direction === "up" && (
                  <ArrowUp className="h-3.5 w-3.5 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Controls — only when a frame is active */}
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
