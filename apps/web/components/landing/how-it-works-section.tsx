import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  { n: 1, label: "Enter your link" },
  { n: 2, label: "Generate your QR code" },
  { n: 3, label: "Print or share, and track every scan" },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t bg-muted/30 px-4 sm:px-6 py-20"
    >
      <div className="mx-auto max-w-6xl text-center space-y-10">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          From idea to live QR in under 10 seconds
        </h2>

        <div className="grid gap-6 sm:grid-cols-3 max-w-3xl mx-auto">
          {STEPS.map(({ n, label }) => (
            <div key={n} className="flex flex-col items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary text-lg font-bold tabular-nums">
                {n}
              </div>
              <p className="text-base font-medium leading-snug">{label}</p>
            </div>
          ))}
        </div>

        <Button asChild size="lg" className="text-base px-8">
          <Link href="/sign-up">Try it now</Link>
        </Button>
      </div>
    </section>
  );
}
