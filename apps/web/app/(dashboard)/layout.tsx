import { redirect } from "next/navigation";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const workspaces = await getUserWorkspaces(user.id);

  if (workspaces.length === 0) {
    redirect("/onboarding");
  }

  // Use the first workspace for now; multi-workspace switching comes later.
  const workspace = workspaces[0]!;

  return (
    <SidebarProvider>
      <AppSidebar
        workspaceName={workspace.name}
        userEmail={user.email ?? ""}
      />
      <SidebarInset>
        <main className="flex flex-1 flex-col gap-4 p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
