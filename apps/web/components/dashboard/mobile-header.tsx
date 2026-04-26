"use client";

import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function DashboardMobileHeader() {
  return (
    <header className="sticky top-0 z-40 flex items-center gap-3 border-b bg-background/95 backdrop-blur-sm px-4 h-14 md:hidden">
      <SidebarTrigger className="h-9 w-9 shrink-0" />
      <Link href="/" className="font-bold text-lg tracking-tight leading-none">
        <span className="text-foreground">Analog</span>
        <span className="text-primary">QR</span>
      </Link>
    </header>
  );
}
