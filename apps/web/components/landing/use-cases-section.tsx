import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const USE_CASES = [
  {
    emoji: "🍽️",
    who: "Restaurants",
    what: "Hosted menu — no website needed",
    href: "/qr-code-for-restaurant-menu",
    badge: "Hosted",
  },
  {
    emoji: "💼",
    who: "Professionals",
    what: "Digital business card — no website needed",
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
    <section className="border-t bg-muted/30 px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for people who need results, not just QR codes
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Restaurants and professionals get a fully hosted page — no website required.
            Everyone else gets real-time scan analytics that prove what's working.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto lg:max-w-none">
          {USE_CASES.map(({ emoji, who, what, href, badge }) => (
            <Link
              key={who}
              href={href}
              className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm hover:border-primary/50 hover:shadow-md transition-all group"
            >
              <span className="text-2xl shrink-0">{emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-sm">{who}</p>
                  {badge && (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary leading-none">
                      {badge}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{what}</p>
              </div>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
            </Link>
          ))}
        </div>

        <div className="text-center space-y-2">
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/sign-up">Start for free, no card needed</Link>
          </Button>
          <p className="text-xs text-muted-foreground">
            Takes less than 60 seconds to set up
          </p>
        </div>
      </div>
    </section>
  );
}
