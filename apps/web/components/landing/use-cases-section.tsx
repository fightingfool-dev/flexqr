import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const USE_CASES = [
  {
    emoji: "🍽️",
    who: "Restaurants",
    what: "Hosted digital menu, no website needed",
    href: "/qr-code-for-restaurant-menu",
    badge: "Hosted",
  },
  {
    emoji: "💼",
    who: "Professionals",
    what: "Digital business card, no website needed",
    href: "/qr-code-for-business-card",
    badge: "Hosted",
  },
  {
    emoji: "🏠",
    who: "Real estate",
    what: "Track buyer interest per listing",
    href: "/qr-code-for-real-estate",
    badge: null,
  },
  {
    emoji: "🎟️",
    who: "Events",
    what: "Drive registrations, measure engagement",
    href: "/qr-code-for-events",
    badge: null,
  },
  {
    emoji: "✍️",
    who: "Marketers",
    what: "Prove print campaign ROI with scan data",
    href: "/qr-code-for-flyer-tracking",
    badge: null,
  },
  {
    emoji: "🏢",
    who: "Businesses",
    what: "Connect every package to a live page",
    href: "/qr-code-for-packaging",
    badge: null,
  },
];

export function UseCasesSection() {
  return (
    <section className="border-t px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-14">

        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Use cases</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            Built for every surface.
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed">
            Restaurants and professionals get a fully hosted page with no website required.
            Everyone else gets real-time analytics that prove what is working.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {USE_CASES.map(({ emoji, who, what, href, badge }) => (
            <Link
              key={who}
              href={href}
              className="group flex items-center gap-4 rounded-2xl border border-border/70 bg-card px-5 py-4 shadow-sm hover:border-primary/30 hover:shadow-md hover:bg-zinc-50/80 transition-all duration-200"
            >
              <span className="text-2xl shrink-0 select-none">{emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm tracking-[-0.01em]">{who}</p>
                  {badge && (
                    <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 leading-none border border-indigo-100">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-0.5 truncate">{what}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
            </Link>
          ))}
        </div>

        <div className="text-center space-y-2">
          <Button asChild size="lg" className="h-12 px-8 text-sm font-semibold shadow-md shadow-primary/20">
            <Link href="/sign-up">Start free, no card needed</Link>
          </Button>
          <p className="text-xs text-muted-foreground">Set up in under 60 seconds</p>
        </div>
      </div>
    </section>
  );
}
