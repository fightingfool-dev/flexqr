import type { Metadata } from "next";
import Link from "next/link";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);
  const workspace = workspaces[0]!;

  const { count: totalQR } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("workspaceId", workspace.id);

  const { count: activeQR } = await supabaseAdmin
    .from("qr_codes")
    .select("*", { count: "exact", head: true })
    .eq("workspaceId", workspace.id)
    .eq("isActive", true);

  const { data: scanSum } = await supabaseAdmin
    .from("qr_codes")
    .select("scanCount")
    .eq("workspaceId", workspace.id);

  const totalScans = (scanSum ?? []).reduce(
    (sum, row) => sum + ((row as { scanCount: number }).scanCount ?? 0),
    0
  );

  const stats = [
    { label: "Total QR codes", value: totalQR ?? 0 },
    { label: "Active codes", value: activeQR ?? 0 },
    { label: "Total scans", value: totalScans },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome to {workspace.name}.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ label, value }) => (
          <div key={label} className="rounded-xl border bg-card p-5 shadow-sm">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-1 text-3xl font-bold">{value}</p>
          </div>
        ))}
      </div>

      {(totalQR ?? 0) === 0 && (
        <div className="rounded-xl border bg-card p-8 text-center space-y-3">
          <p className="text-muted-foreground text-sm">
            No QR codes yet. Create your first dynamic QR code.
          </p>
          <Button asChild>
            <Link href="/dashboard/qr-codes/new">Create QR code</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
