import Link from "next/link";
import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <>
      <section className="border-t bg-foreground text-background px-4 sm:px-6 py-24">
        <div className="mx-auto max-w-2xl text-center space-y-6">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">
            Stop guessing. Start tracking.
          </h2>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base px-8 bg-transparent text-background border-background/40 hover:bg-background/10 hover:text-background"
          >
            <Link href="/sign-up">Create Your First QR Code</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t px-4 sm:px-6 py-8">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">AnalogQR</span>
          <span>© {new Date().getFullYear()} AnalogQR. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
