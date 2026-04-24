"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  QrCode,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { signOut } from "@/actions/auth";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "QR Codes", href: "/dashboard/qr-codes", icon: QrCode },
  { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

type Props = {
  workspaceName: string;
  userEmail: string;
};

export function AppSidebar({ workspaceName, userEmail }: Props) {
  const pathname = usePathname();
  const initials = workspaceName.slice(0, 2).toUpperCase();
  const userInitial = userEmail[0]?.toUpperCase() ?? "U";

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
            {initials}
          </div>
          <span className="font-semibold text-sm truncate">{workspaceName}</span>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === href || (href !== "/dashboard" && pathname.startsWith(href))}
                  >
                    <Link href={href} className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="px-2 py-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-xs">{userInitial}</AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-sm text-muted-foreground">
                {userEmail}
              </span>
              <form action={signOut}>
                <button
                  type="submit"
                  title="Sign out"
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded hover:bg-accent",
                    "text-muted-foreground hover:text-foreground transition-colors"
                  )}
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
