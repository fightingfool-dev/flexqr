import { redirect } from "next/navigation";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { DashboardMobileHeader } from "@/components/dashboard/mobile-header";
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

  const workspace = workspaces[0]!;

  return (
    <SidebarProvider>
      <AppSidebar
        workspaceName={workspace.name}
        userEmail={user.email ?? ""}
      />
      <SidebarInset>
        <DashboardMobileHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
