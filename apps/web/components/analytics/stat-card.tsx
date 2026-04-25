import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trendPct?: number | null;
}

function fmt(v: string | number): string {
  if (typeof v === "number") return v.toLocaleString();
  return v;
}

export function StatCard({ label, value, sub, trendPct }: StatCardProps) {
  const hasTrend = trendPct !== null && trendPct !== undefined;
  const positive = hasTrend && trendPct! > 0;
  const negative = hasTrend && trendPct! < 0;

  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <p className="text-sm text-muted-foreground">{label}</p>
      <div className="mt-1 flex items-end gap-2">
        <p className="text-3xl font-bold tabular-nums leading-none">
          {fmt(value)}
        </p>
        {hasTrend && (
          <span
            className={`mb-0.5 inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-xs font-medium ${
              positive
                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : negative
                ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                : "bg-muted text-muted-foreground"
            }`}
          >
            {positive ? (
              <TrendingUp className="h-3 w-3" />
            ) : negative ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <Minus className="h-3 w-3" />
            )}
            {Math.abs(trendPct!)}%
          </span>
        )}
      </div>
      {sub && (
        <p className="mt-1 text-xs text-muted-foreground">{sub}</p>
      )}
    </div>
  );
}
