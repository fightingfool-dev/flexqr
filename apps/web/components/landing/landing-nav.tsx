"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import {
  ChevronDown,
  Menu,
  Mail,
  Utensils,
  FileText,
  CreditCard,
  Calendar,
  Package,
  Globe,
  User,
  Wifi,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const QR_TYPES = [
  {
    label: "Website QR",
    description: "Link to any webpage",
    href: "/create?type=website",
    icon: Globe,
  },
  {
    label: "vCard QR",
    description: "Share contact details instantly",
    href: "/create?type=vcard",
    icon: User,
  },
  {
    label: "WiFi QR",
    description: "Connect to WiFi in one scan",
    href: "/create?type=wifi",
    icon: Wifi,
  },
  {
    label: "PDF QR",
    description: "Open and download a PDF",
    href: "/create?type=pdf",
    icon: FileText,
  },
];

const USE_CASES = [
  {
    label: "QR Code for Restaurant Menu",
    shortLabel: "Restaurant Menu",
    href: "/qr-code-for-restaurant-menu",
    icon: Utensils,
    tooltip: "Create editable QR menus for restaurants and cafés.",
  },
  {
    label: "QR Code for Flyer Tracking",
    shortLabel: "Flyer Tracking",
    href: "/qr-code-for-flyer-tracking",
    icon: FileText,
    tooltip: "Track scans from posters, flyers, and printed campaigns.",
  },
  {
    label: "QR Code for Business Card",
    shortLabel: "Business Card",
    href: "/qr-code-for-business-card",
    icon: CreditCard,
    tooltip: "Share contact details with a scannable digital card.",
  },
  {
    label: "QR Code for Events",
    shortLabel: "Events",
    href: "/qr-code-for-events",
    icon: Calendar,
    tooltip: "Create QR codes for tickets, schedules, and event pages.",
  },
  {
    label: "QR Code for Packaging",
    shortLabel: "Packaging",
    href: "/qr-code-for-packaging",
    icon: Package,
    tooltip: "Connect product packaging to pages, offers, and analytics.",
  },
  {
    label: "QR Code for Real Estate",
    shortLabel: "Real Estate",
    href: "/qr-code-for-real-estate",
    icon: Building2,
    tooltip: "Track buyer interest on listings, signs, and property flyers.",
  },
];

type Props = { isLoggedIn: boolean };

export function LandingNav({ isLoggedIn }: Props) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Logo size="md" className="shrink-0 mr-1" />

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 min-w-0">
          {/* Create dropdown — QR types + use cases */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 shrink-0 font-medium text-foreground/80 hover:text-foreground data-[state=open]:bg-muted data-[state=open]:text-foreground"
              >
                Create
                <ChevronDown className="h-3.5 w-3.5 opacity-60 transition-transform duration-150 [[data-state=open]_&]:rotate-180" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-72 min-w-[18rem] p-2">
              {/* QR Types */}
              <DropdownMenuLabel className="px-1 pb-1">QR Types</DropdownMenuLabel>
              {QR_TYPES.map(({ label, description, href, icon: Icon }) => (
                <DropdownMenuItem
                  key={href}
                  asChild
                  className="p-0 focus:bg-primary/10 focus:text-foreground rounded-lg group"
                >
                  <Link
                    href={href}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer w-full rounded-lg"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted shrink-0 group-focus:bg-primary/15 transition-colors">
                      <Icon className="h-4 w-4 text-muted-foreground group-focus:text-primary transition-colors" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium leading-none">{label}</p>
                      <p className="text-xs text-muted-foreground leading-snug mt-1">
                        {description}
                      </p>
                    </div>
                  </Link>
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator className="my-2" />

              {/* Use Cases */}
              <DropdownMenuLabel className="px-1 pb-1">Use Cases</DropdownMenuLabel>
              {USE_CASES.map(({ label, href, icon: Icon }) => (
                <DropdownMenuItem
                  key={href}
                  asChild
                  className="focus:bg-primary/10 focus:text-foreground rounded-md"
                >
                  <Link href={href} className="flex items-center gap-2.5 cursor-pointer px-2 py-1.5">
                    <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm">{label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Individual use-case links — xl+ only */}
          <div className="hidden xl:flex items-center">
            <div className="w-px h-3.5 bg-border mx-1.5 shrink-0" aria-hidden />
            {USE_CASES.map(({ shortLabel, href, tooltip }) => (
              <Tooltip key={href} delayDuration={300}>
                <TooltipTrigger asChild>
                  <Link
                    href={href}
                    className="px-2.5 py-1.5 text-sm font-semibold text-foreground/80 rounded-md hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    {shortLabel}
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="bottom"
                  sideOffset={8}
                  className="max-w-[200px] text-center leading-snug"
                >
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Contact link */}
          <Link
            href="/contact"
            className="hidden md:block px-2.5 py-1.5 text-sm font-semibold text-foreground/80 rounded-md hover:bg-muted hover:text-foreground transition-colors whitespace-nowrap shrink-0"
          >
            Contact
          </Link>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Auth buttons */}
          <div className="flex items-center gap-0.5 shrink-0">
            <div className="w-px h-4 bg-border mx-1 shrink-0" aria-hidden />
            {isLoggedIn ? (
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="font-medium text-foreground/80 hover:text-foreground"
                >
                  <Link href="/sign-in">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href="/sign-up">Get started</Link>
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile nav */}
        <div className="flex md:hidden items-center gap-1">
          {!isLoggedIn && (
            <Button asChild variant="ghost" size="sm">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" showCloseButton className="w-72 p-0 flex flex-col">
              {/* Sheet header */}
              <div className="flex items-center px-5 h-14 border-b shrink-0">
                <SheetClose asChild>
                  <Logo size="md" />
                </SheetClose>
              </div>

              <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
                {/* Create / QR Types */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                    Create
                  </p>
                  <div className="space-y-0.5">
                    {QR_TYPES.map(({ label, description, href, icon: Icon }) => (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 hover:bg-muted active:bg-muted transition-colors group"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted group-hover:bg-primary/10 transition-colors shrink-0">
                            <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground leading-none">
                              {label}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                              {description}
                            </p>
                          </div>
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                {/* Use Cases */}
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1.5">
                    Use Cases
                  </p>
                  <div className="space-y-0.5">
                    {USE_CASES.map(({ label, href, icon: Icon }) => (
                      <SheetClose asChild key={href}>
                        <Link
                          href={href}
                          className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted active:bg-muted transition-colors"
                        >
                          <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                          {label}
                        </Link>
                      </SheetClose>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <SheetClose asChild>
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted active:bg-muted transition-colors"
                  >
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    Contact us
                  </Link>
                </SheetClose>
              </div>

              {/* Footer CTAs */}
              <div className="border-t p-4 space-y-2 shrink-0">
                {isLoggedIn ? (
                  <SheetClose asChild>
                    <Button asChild className="w-full">
                      <Link href="/dashboard">Go to Dashboard</Link>
                    </Button>
                  </SheetClose>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Button asChild className="w-full">
                        <Link href="/sign-up">Get started free</Link>
                      </Button>
                    </SheetClose>
                    <SheetClose asChild>
                      <Button asChild variant="outline" className="w-full">
                        <Link href="/sign-in">Sign in</Link>
                      </Button>
                    </SheetClose>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
