import Link from "next/link";
import { Button } from "@/components/ui/button";

const USE_CASES = [
  { emoji: "🍽️", who: "Restaurants", what: "Update menus instantly" },
  { emoji: "🏠", who: "Real estate", what: "Track property interest" },
  { emoji: "🎟️", who: "Events", what: "Measure engagement" },
  { emoji: "✍️", who: "Creators", what: "Track audience behavior" },
  { emoji: "🏢", who: "Businesses", what: "Connect offline to online" },
];

export function UseCasesSection() {
  return (
    <section className="border-t bg-muted/30 px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Built for people who need results, not just QR codes
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 max-w-3xl mx-auto lg:max-w-none">
          {USE_CASES.map(({ emoji, who, what }) => (
            <div
              key={who}
              className="flex items-center gap-4 rounded-xl border bg-card px-5 py-4 shadow-sm"
            >
              <span className="text-2xl shrink-0">{emoji}</span>
              <div>
                <p className="font-semibold text-sm">{who}</p>
                <p className="text-sm text-muted-foreground">{what}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/sign-up">Get started free</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
