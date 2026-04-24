"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = { isLoggedIn: boolean };

export function MobileStickyCta({ isLoggedIn }: Props) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm p-3 md:hidden shadow-[0_-1px_12px_rgba(0,0,0,0.06)]">
      <Button asChild className="w-full" size="lg">
        <Link href={isLoggedIn ? "/dashboard" : "/sign-up"}>
          {isLoggedIn ? "Go to Dashboard" : "Create Free QR Code →"}
        </Link>
      </Button>
    </div>
  );
}
