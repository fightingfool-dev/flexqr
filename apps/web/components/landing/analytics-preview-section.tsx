import Link from "next/link";
import { Button } from "@/components/ui/button";

const SPARKLINE = [38, 52, 44, 71, 93, 61, 85, 72, 90, 67, 55, 88, 96, 78];
const MAX = 96;

export function AnalyticsPreviewSection() {
  return (
    <section className="border-t bg-foreground text-background px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Text */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
              Don&apos;t just generate QR codes. Understand them.
            </h2>
            <p className="text-lg opacity-70 leading-relaxed">
              See exactly who scanned, where they came from, and what device
              they used, all in one place.
            </p>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-base px-7 bg-transparent text-background border-background/40 hover:bg-background/10 hover:text-background"
            >
              <Link href="/sign-up">Start tracking for free</Link>
            </Button>
          </div>

          {/* Mock analytics panel */}
          <div className="rounded-2xl border border-background/10 bg-background/5 p-6 space-y-5 text-background">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide opacity-50">
                Scans over time
              </span>
              <span className="text-xs opacity-50">Last 14 days</span>
            </div>

            {/* Sparkline */}
            <div className="flex items-end gap-1 h-16">
              {SPARKLINE.map((v, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-background"
                  style={{
                    height: `${(v / MAX) * 100}%`,
                    opacity: 0.3 + (v / MAX) * 0.7,
                  }}
                />
              ))}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 border-t border-background/10 pt-5">
              {[
                { label: "Total scans", value: "3,841" },
                { label: "Unique visitors", value: "2,107" },
                { label: "Countries", value: "24" },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-2xl font-bold tabular-nums">{value}</p>
                  <p className="text-xs opacity-50 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="space-y-2 border-t border-background/10 pt-4">
              {[
                { label: "Mobile", pct: 68 },
                { label: "Desktop", pct: 28 },
                { label: "Tablet", pct: 4 },
              ].map(({ label, pct }) => (
                <div key={label} className="flex items-center gap-3 text-sm">
                  <span className="w-14 opacity-70 text-xs">{label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-background/15 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-background"
                      style={{ width: `${pct}%`, opacity: 0.7 }}
                    />
                  </div>
                  <span className="text-xs opacity-50 tabular-nums w-7 text-right">
                    {pct}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
