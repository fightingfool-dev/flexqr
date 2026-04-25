"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DayScan } from "@/lib/analytics";

function fmtHour(h: string): string {
  const n = parseInt(h, 10);
  if (n === 0) return "12am";
  if (n < 12) return `${n}am`;
  if (n === 12) return "12pm";
  return `${n - 12}pm`;
}

interface Props {
  data: DayScan[];
  height?: number;
  xFormatter?: (v: string) => string;
  emptyMessage?: string;
  color?: string;
}

export function SimpleBarChart({
  data,
  height = 120,
  xFormatter,
  emptyMessage = "No data yet",
  color = "var(--primary)",
}: Props) {
  const hasData = data.some((d) => d.scans > 0);

  if (!hasData) {
    return (
      <div
        className="flex items-center justify-center rounded-lg border border-dashed"
        style={{ height }}
      >
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  const fmt = xFormatter ?? ((v: string) => v);
  const interval = Math.max(0, Math.floor(data.length / 8) - 1);

  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
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
          width={28}
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
        <Bar
          dataKey="scans"
          fill={color}
          radius={[3, 3, 0, 0]}
          maxBarSize={32}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export { fmtHour };
