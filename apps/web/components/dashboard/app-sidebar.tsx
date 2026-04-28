"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
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
      {/* Brand + workspace */}
      <SidebarHeader className="px-4 py-3 space-y-2.5">
        <Logo size="sm" />
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary/10 text-[10px] font-bold text-primary shrink-0">
            {initials}
          </div>
          <span className="text-sm text-muted-foreground truncate">{workspaceName}</span>
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
                    size="lg"
                    isActive={
                      pathname === href ||
                      (href !== "/dashboard" && pathname.startsWith(href))
                    }
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

      {/* User identity + sign-out */}
      <SidebarFooter className="px-3 py-3">
        <div className="rounded-lg border bg-muted/30 p-3 space-y-3">
          {/* Account info */}
          <div className="flex items-center gap-2.5">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                {userInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-[10px] text-muted-foreground leading-none mb-0.5">
                Signed in as
              </p>
              <p className="text-xs font-medium text-foreground truncate">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Sign-out: full-width, large tap target, destructive accent */}
          <form action={signOut} className="w-full">
            <button
              type="submit"
              className={cn(
                "w-full flex items-center justify-center gap-2 rounded-md px-3 py-2.5 min-h-[44px]",
                "text-sm font-semibold text-destructive",
                "border border-destructive/40 bg-transparent",
                "hover:bg-destructive hover:text-destructive-foreground",
                "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Sign out
            </button>
          </form>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
