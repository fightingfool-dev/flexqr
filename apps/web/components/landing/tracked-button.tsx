"use client";

import Link from "next/link";
import { type VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { track, type TrackProperties } from "@/lib/track";

type Props = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    href: string;
    trackEvent: string;
    trackProps?: TrackProperties;
    children: React.ReactNode;
  };

export function TrackedButton({
  href,
  trackEvent,
  trackProps,
  children,
  ...rest
}: Props) {
  return (
    <Button asChild {...rest}>
      <Link href={href} onClick={() => track(trackEvent, trackProps)}>
        {children}
      </Link>
    </Button>
  );
}
