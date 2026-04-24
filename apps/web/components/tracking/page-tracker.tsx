"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { track } from "@/lib/track";

export function PageTracker() {
  const pathname = usePathname();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (pathname === lastTracked.current) return;
    lastTracked.current = pathname;
    track("page_view", { path: pathname });
  }, [pathname]);

  return null;
}
