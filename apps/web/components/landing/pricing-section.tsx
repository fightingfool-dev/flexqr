import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrackedButton } from "@/components/landing/tracked-button";
import { ENTERPRISE_MAILTO } from "@/lib/plans";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Try it out",
    features: ["1 QR code", "Basic analytics", "Dynamic redirects"],
    cta: "Start Free",
    href: "/sign-up",
    highlighted: false,
    enterprise: false,
  },
  {
    name: "Starter",
    price: "$10",
    per: "/month",
    description: "For individuals",
    features: [
      "5 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom QR colors",
      "Logo on QR code",
      "Priority support",
    ],
    cta: "Get Started",
    href: "/sign-up",
    highlighted: true,
    enterprise: false,
  },
  {
    name: "Pro",
    price: "$29",
    per: "/month",
    description: "For growing teams",
    features: [
      "50 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom QR colors",
      "Logo on QR code",
      "Custom domains",
      "Priority support",
    ],
    cta: "Go Pro",
    href: "/sign-up",
    highlighted: false,
    enterprise: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For organisations at scale",
    features: [
      "Unlimited QR codes",
      "Advanced analytics & exports",
      "Custom domains",
      "Team management",
      "API access",
      "SSO / SAML",
      "SLA guarantee",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    href: ENTERPRISE_MAILTO,
    highlighted: false,
    enterprise: true,
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
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative shadow-sm flex flex-col ${
                plan.enterprise
                  ? "bg-foreground text-background border-foreground"
                  : plan.highlighted
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
              {plan.enterprise && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-950 text-xs font-semibold px-3 py-1 rounded-full">
                    Enterprise
                  </span>
                </div>
              )}
              <CardHeader className="pb-4 pt-6">
                <p className={`font-semibold ${plan.enterprise ? "text-background" : ""}`}>
                  {plan.name}
                </p>
                <div className="mt-1">
                  <span className={`text-4xl font-bold tabular-nums ${plan.enterprise ? "text-background" : ""}`}>
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span className={`text-sm ${plan.enterprise ? "text-background/60" : "text-muted-foreground"}`}>
                      {plan.per}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.enterprise ? "text-background/60" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-5 flex flex-col flex-1">
                <ul className="space-y-2 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className={`h-4 w-4 shrink-0 ${plan.enterprise ? "text-amber-400" : "text-primary"}`} />
                      <span className={plan.enterprise ? "text-background/80" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <TrackedButton
                  href={plan.href}
                  className={`w-full mt-auto ${
                    plan.enterprise
                      ? "bg-amber-400 text-amber-950 hover:bg-amber-300 border-0"
                      : ""
                  }`}
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

        <p className="text-center text-xs text-muted-foreground">
          All plans include dynamic redirects and scan analytics · No hidden fees · Cancel anytime
        </p>
      </div>
    </section>
  );
}
