import { Check } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrackedButton } from "@/components/landing/tracked-button";
import { ENTERPRISE_MAILTO } from "@/lib/plans";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    description: "Try it out, no card needed",
    features: ["1 QR code", "Basic analytics", "Dynamic redirects"],
    cta: "Start Free",
    href: "/sign-up",
    highlighted: false,
    enterprise: false,
  },
  {
    name: "Starter",
    price: "$10",
    per: "per month",
    description: "For individuals and freelancers",
    features: [
      "5 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom QR colors",
      "Logo on QR code",
      "API access",
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
    per: "per month",
    description: "For growing teams",
    features: [
      "50 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom QR colors",
      "Logo on QR code",
      "Custom domains",
      "Team invites",
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
      "Advanced analytics and exports",
      "Custom domains",
      "Team management",
      "API access",
      "SSO and SAML",
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
    <section id="pricing" className="border-t bg-zinc-50/60 px-4 sm:px-6 py-24">
      <div className="mx-auto max-w-6xl space-y-14">

        <div className="text-center space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">Pricing</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-[-0.03em]">
            Simple, honest pricing.
          </h2>
          <p className="text-muted-foreground text-base">
            Start free. Upgrade when you need more. Cancel anytime.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`relative shadow-sm flex flex-col transition-shadow duration-200 ${
                plan.enterprise
                  ? "bg-foreground text-background border-foreground shadow-xl"
                  : plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10 ring-1 ring-primary/50"
                  : "hover:shadow-md"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-[10px] font-bold px-3 py-1 rounded-full tracking-wide uppercase shadow-sm shadow-primary/30">
                    Most popular
                  </span>
                </div>
              )}
              {plan.enterprise && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-3 py-1 rounded-full tracking-wide uppercase">
                    Enterprise
                  </span>
                </div>
              )}
              <CardHeader className="pb-4 pt-7">
                <p className={`text-xs font-bold uppercase tracking-[0.1em] ${plan.enterprise ? "text-background/60" : "text-muted-foreground"}`}>
                  {plan.name}
                </p>
                <div className="mt-2 flex items-end gap-1">
                  <span className={`text-4xl font-bold tabular-nums tracking-[-0.04em] ${plan.enterprise ? "text-background" : ""}`}>
                    {plan.price}
                  </span>
                  {plan.per && (
                    <span className={`text-sm pb-0.5 ${plan.enterprise ? "text-background/50" : "text-muted-foreground"}`}>
                      {plan.per}
                    </span>
                  )}
                </div>
                <p className={`text-xs mt-1 ${plan.enterprise ? "text-background/50" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-5 flex flex-col flex-1 pt-0">
                <div className="h-px bg-border opacity-30" />
                <ul className="space-y-2.5 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <Check className={`h-3.5 w-3.5 shrink-0 ${plan.enterprise ? "text-amber-400" : "text-primary"}`} />
                      <span className={plan.enterprise ? "text-background/80" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>
                <TrackedButton
                  href={plan.href}
                  className={`w-full mt-auto font-semibold ${
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
          All plans include dynamic redirects and scan analytics. No hidden fees. Cancel anytime.
        </p>
      </div>
    </section>
  );
}
