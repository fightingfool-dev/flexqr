"use client";

import {
  Globe,
  FileText,
  Image,
  UserRound,
  Video,
  Smartphone,
  MessageCircle,
  Wifi,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import type { QRBuilderType } from "@/lib/qr-builder-types";

const TYPES: {
  type: QRBuilderType;
  label: string;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: React.ComponentType<any>;
  color: string;
}[] = [
  {
    type: "URL",
    label: "Website",
    description: "Link to any webpage",
    Icon: Globe,
    color: "#3b82f6",
  },
  {
    type: "PDF",
    label: "PDF",
    description: "Share a PDF document",
    Icon: FileText,
    color: "#ef4444",
  },
  {
    type: "IMAGE",
    label: "Image",
    description: "Display a photo or image",
    Icon: Image,
    color: "#a855f7",
  },
  {
    type: "VCARD",
    label: "vCard",
    description: "Share contact details",
    Icon: UserRound,
    color: "#14b8a6",
  },
  {
    type: "VIDEO",
    label: "Video",
    description: "Link to a video",
    Icon: Video,
    color: "#f97316",
  },
  {
    type: "APP_LINK",
    label: "App",
    description: "iOS & Android deep link",
    Icon: Smartphone,
    color: "#6366f1",
  },
  {
    type: "WHATSAPP",
    label: "WhatsApp",
    description: "Start a WhatsApp chat",
    Icon: MessageCircle,
    color: "#22c55e",
  },
  {
    type: "WIFI",
    label: "WiFi",
    description: "Connect to a network",
    Icon: Wifi,
    color: "#0ea5e9",
  },
  {
    type: "FEEDBACK",
    label: "Feedback",
    description: "Collect reviews & ratings",
    Icon: Star,
    color: "#f59e0b",
  },
  {
    type: "MENU",
    label: "Menu",
    description: "Hosted restaurant menu",
    Icon: UtensilsCrossed,
    color: "#d97706",
  },
];

export function TypeSelector({ onSelect }: { onSelect: (type: QRBuilderType) => void }) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {TYPES.map(({ type, label, description, Icon, color }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:border-primary hover:shadow-sm active:scale-[0.98]"
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{ backgroundColor: `${color}18` }}
          >
            <Icon className="h-5 w-5" style={{ color }} />
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight">{label}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
              {description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}

export function typeLabel(type: QRBuilderType): string {
  return TYPES.find((t) => t.type === type)?.label ?? type;
}
