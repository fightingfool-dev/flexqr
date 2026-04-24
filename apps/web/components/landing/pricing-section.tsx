import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrackedButton } from "@/components/landing/tracked-button";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for getting started",
    features: ["5 QR codes", "Basic tracking"],
    cta: "Start Free",
    href: "/sign-up",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$9",
    per: "/month",
    description: "For individuals and small teams",
    features: ["More QR codes", "Full analytics"],
    cta: "Upgrade",
    href: "/sign-up",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "$29",
    per: "/month",
    description: "For serious users",
    features: ["Unlimited QR codes", "Advanced insights"],
    cta: "Go Pro",
    href: "/sign-up",
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="border-t px-4 sm:px-6 py-20">
      <div className="mx-auto max-w-6xl space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Simple, honest pricing
          </h2>
          <p className="text-muted-foreground">
            No credit card required to start.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative shadow-sm ${
                plan.highlighted
                  ? "border-primary ring-1 ring-primary"
                  : ""
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              )}
              <CardHeader className="pb-4 pt-6">
                <p className="font-semibold">{plan.name}</p>
                <div className="mt-1">
                  <span className="text-4xl font-bold tabular-nums">
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span className="text-muted-foreground text-sm">
                      {plan.per}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <TrackedButton
                  href={plan.href}
                  className="w-full"
                  variant={plan.highlighted ? "default" : "outline"}
                  trackEvent="cta_click"
                  trackProps={{ label: plan.cta, location: `pricing_${plan.name.toLowerCase()}` }}
                >
                  {plan.cta}
                </TrackedButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
