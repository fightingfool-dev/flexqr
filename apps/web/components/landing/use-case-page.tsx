import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingNav } from "@/components/landing/landing-nav";
import { getUser } from "@/lib/auth";

export type UseCaseStep = { title: string; body: string };
export type RelatedPage = { label: string; href: string };

export type UseCasePageProps = {
  headline: string;
  subheadline: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
  benefits: string[];
  steps: UseCaseStep[];
  relatedPages: RelatedPage[];
};

export async function UseCasePageLayout({
  headline,
  subheadline,
  description,
  ctaHref,
  ctaLabel,
  benefits,
  steps,
  relatedPages,
}: UseCasePageProps) {
  const user = await getUser();

  return (
    <>
      <LandingNav isLoggedIn={!!user} />
      <main className="pb-16">
        {/* Hero */}
        <section className="px-4 sm:px-6 py-16 sm:py-24 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            {headline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {subheadline}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button asChild size="lg" className="text-base px-8">
              <Link href={ctaHref}>
                {ctaLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base px-8">
              <Link href="/sign-up">Create free account</Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Free to start · No credit card required
          </p>
        </section>

        {/* Description band */}
        <section className="border-t bg-muted/30 px-4 sm:px-6 py-12">
          <p className="mx-auto max-w-3xl text-center text-base sm:text-lg text-foreground/80 leading-relaxed">
            {description}
          </p>
        </section>

        {/* Benefits */}
        <section className="px-4 sm:px-6 py-14 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
            Why AnalogQR?
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {benefits.map((b) => (
              <div
                key={b}
                className="flex items-start gap-3 rounded-xl border bg-card px-4 py-3.5 shadow-sm"
              >
                <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm leading-snug">{b}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section className="border-t bg-muted/30 px-4 sm:px-6 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
              How it works
            </h2>
            <div className="grid sm:grid-cols-3 gap-8">
              {steps.map((step, i) => (
                <div key={step.title} className="text-center space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    {i + 1}
                  </div>
                  <h3 className="font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-4 sm:px-6 py-16 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold">Ready to get started?</h2>
          <p className="text-muted-foreground text-sm">
            It takes less than 60 seconds.
          </p>
          <Button asChild size="lg" className="text-base px-10">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        </section>

        {/* Internal links for SEO */}
        {relatedPages.length > 0 && (
          <section className="border-t px-4 sm:px-6 py-8">
            <div className="mx-auto max-w-4xl">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                More use cases
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {relatedPages.map((p) => (
                  <Link
                    key={p.href}
                    href={p.href}
                    className="text-sm text-primary hover:underline underline-offset-4 transition-colors"
                  >
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
