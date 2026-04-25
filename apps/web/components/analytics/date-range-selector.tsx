"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { QRRange } from "@/lib/analytics";

const OPTIONS: { value: QRRange; label: string }[] = [
  { value: "24h", label: "24h" },
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
  { value: "all", label: "All" },
];

export function DateRangeSelector({ current }: { current: QRRange }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function select(range: QRRange) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", range);
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="inline-flex items-center rounded-lg border bg-card p-0.5 shadow-sm">
      {OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          onClick={() => select(value)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            current === value
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
