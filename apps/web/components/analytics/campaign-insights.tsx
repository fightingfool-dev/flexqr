import { Calendar, Clock, Globe, Smartphone, RefreshCw } from "lucide-react";

function fmtDay(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function fmtHour(h: number | null): string {
  if (h === null) return "—";
  if (h === 0) return "12am";
  if (h < 12) return `${h}am`;
  if (h === 12) return "12pm";
  return `${h - 12}pm`;
}

interface Props {
  bestDay: string | null;
  bestHour: number | null;
  topCountry: string | null;
  topDevice: string | null;
  repeatRate: number;
}

const ITEMS = [
  {
    key: "bestDay",
    label: "Best day",
    Icon: Calendar,
    fmt: (p: Props) => fmtDay(p.bestDay),
  },
  {
    key: "bestHour",
    label: "Best hour",
    Icon: Clock,
    fmt: (p: Props) => fmtHour(p.bestHour),
  },
  {
    key: "topCountry",
    label: "Top country",
    Icon: Globe,
    fmt: (p: Props) => p.topCountry ?? "—",
  },
  {
    key: "topDevice",
    label: "Top device",
    Icon: Smartphone,
    fmt: (p: Props) =>
      p.topDevice
        ? p.topDevice.charAt(0).toUpperCase() + p.topDevice.slice(1)
        : "—",
  },
  {
    key: "repeatRate",
    label: "Repeat rate",
    Icon: RefreshCw,
    fmt: (p: Props) => `${p.repeatRate}%`,
  },
];

export function CampaignInsights(props: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {ITEMS.map(({ key, label, Icon, fmt }) => (
        <div
          key={key}
          className="flex flex-col gap-1 rounded-xl border bg-card px-4 py-3 shadow-sm"
        >
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Icon className="h-3.5 w-3.5" />
            <span className="text-xs">{label}</span>
          </div>
          <p className="text-base font-semibold">{fmt(props)}</p>
        </div>
      ))}
    </div>
  );
}
