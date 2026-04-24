import type { BreakdownItem } from "@/lib/analytics";

type Props = {
  title: string;
  items: BreakdownItem[];
};

export function BreakdownBar({ title, items }: Props) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium">{title}</h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No data yet</p>
      ) : (
        <div className="space-y-2.5">
          {items.map(({ label, count, pct }) => (
            <div key={label}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm truncate">{label}</span>
                <span className="ml-3 shrink-0 text-xs text-muted-foreground tabular-nums">
                  {count.toLocaleString()} · {pct}%
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
