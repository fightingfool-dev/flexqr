import type { RecentScan } from "@/lib/analytics";

function fmtTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Dash() {
  return <span className="text-muted-foreground">—</span>;
}

export function RecentScansTable({ scans }: { scans: RecentScan[] }) {
  if (scans.length === 0) {
    return (
      <p className="px-5 py-8 text-center text-sm text-muted-foreground">
        No scans recorded yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/40">
            {["Time", "Device", "Browser", "OS", "Country", "Source", ""].map(
              (h) => (
                <th
                  key={h}
                  className="px-4 py-2.5 text-left text-xs font-medium text-muted-foreground uppercase tracking-wide whitespace-nowrap"
                >
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody className="divide-y">
          {scans.map((scan) => (
            <tr
              key={scan.id}
              className="hover:bg-muted/20 transition-colors duration-100"
            >
              <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                {fmtTime(scan.scannedAt)}
              </td>
              <td className="px-4 py-3 capitalize">
                {scan.deviceType ?? <Dash />}
              </td>
              <td className="px-4 py-3">{scan.browser ?? <Dash />}</td>
              <td className="px-4 py-3">{scan.os ?? <Dash />}</td>
              <td className="px-4 py-3">{scan.country ?? <Dash />}</td>
              <td className="px-4 py-3 max-w-[140px] truncate text-xs text-muted-foreground">
                {scan.referer ? (
                  <span title={scan.referer}>
                    {scan.referer.replace(/^https?:\/\//, "").split("/")[0]}
                  </span>
                ) : (
                  <Dash />
                )}
              </td>
              <td className="px-4 py-3">
                {scan.isRepeat && (
                  <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-950 dark:text-amber-400">
                    repeat
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
