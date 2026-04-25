"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayScan, TimeGranularity, QRRange } from "@/lib/analytics";

function makeFormatter(
  granularity: TimeGranularity,
  range: QRRange
): (v: string) => string {
  if (granularity === "hour") {
    return (iso: string) => {
      const d = new Date(iso);
      const h = d.getUTCHours();
      if (h === 0) return "12am";
      if (h < 12) return `${h}am`;
      if (h === 12) return "12pm";
      return `${h - 12}pm`;
    };
  }
  if (granularity === "week" || granularity === "day") {
    return (iso: string) => {
      const d = new Date(iso + "T00:00:00Z");
      if (range === "7d") {
        return d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
      }
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      });
    };
  }
  return (v: string) => v;
}

export function ScansChart({
  data,
  granularity = "day",
  range = "30d",
}: {
  data: DayScan[];
  granularity?: TimeGranularity;
  range?: QRRange;
}) {
  const hasData = data.some((d) => d.scans > 0);
  const fmt = makeFormatter(granularity, range);

  const interval =
    data.length <= 7
      ? 0
      : data.length <= 24
      ? Math.floor(data.length / 6)
      : Math.floor(data.length / 8);

  if (!hasData) {
    return (
      <div className="flex h-[160px] items-center justify-center rounded-lg border border-dashed">
        <p className="text-sm text-muted-foreground">No scans in this period</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={160}>
      <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="scanGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          vertical={false}
          strokeDasharray="3 3"
          stroke="var(--border)"
        />
        <XAxis
          dataKey="date"
          tickFormatter={fmt}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          interval={interval}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={30}
        />
        <Tooltip
          formatter={(v) => [(v as number).toLocaleString(), "Scans"]}
          labelFormatter={(label) => fmt(String(label))}
          contentStyle={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            fontSize: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,.08)",
          }}
          itemStyle={{ color: "var(--foreground)" }}
          labelStyle={{ color: "var(--muted-foreground)", marginBottom: 2 }}
        />
        <Area
          type="monotone"
          dataKey="scans"
          stroke="var(--primary)"
          fill="url(#scanGrad)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: "var(--primary)" }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
