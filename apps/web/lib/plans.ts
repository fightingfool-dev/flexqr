import type { Plan } from "@/lib/database.types";

export type PlanMeta = {
  label: string;
  qrLimit: number;        // Infinity = unlimited
  priceMonthly: number;   // USD cents, 0 = free or contact-sales
  priceId: string | null;
  contactSales: boolean;  // true = no Stripe checkout, show "Contact Sales"
  features: string[];
};

export const PLANS: Record<Plan, PlanMeta> = {
  FREE: {
    label: "Free",
    qrLimit: 1,
    priceMonthly: 0,
    priceId: null,
    contactSales: false,
    features: [
      "1 QR code",
      "Basic analytics",
      "Dynamic redirects",
    ],
  },
  STARTER: {
    label: "Starter",
    qrLimit: 5,
    priceMonthly: 1000,
    priceId: process.env.STRIPE_PRICE_STARTER_MONTHLY ?? null,
    contactSales: false,
    features: [
      "5 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom QR colors",
      "Logo on QR code",
      "Priority support",
    ],
  },
  PRO: {
    label: "Pro",
    qrLimit: 50,
    priceMonthly: 2900,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY ?? null,
    contactSales: false,
    features: [
      "50 QR codes",
      "Full analytics",
      "Dynamic redirects",
      "Custom QR colors",
      "Logo on QR code",
      "Custom domains",
      "Priority support",
    ],
  },
  ENTERPRISE: {
    label: "Enterprise",
    qrLimit: Infinity,
    priceMonthly: 0,
    priceId: null,
    contactSales: true,
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
  },
};

// Map used in createQRCode to enforce limits.
export const PLAN_LIMITS: Record<Plan, number> = Object.fromEntries(
  Object.entries(PLANS).map(([plan, meta]) => [plan, meta.qrLimit])
) as Record<Plan, number>;

export function planFromPriceId(priceId: string | null | undefined): Plan {
  if (!priceId) return "FREE";
  for (const [plan, meta] of Object.entries(PLANS) as [Plan, PlanMeta][]) {
    if (meta.priceId && meta.priceId === priceId) return plan;
  }
  return "FREE";
}

export function formatPrice(cents: number): string {
  if (cents === 0) return "Free";
  return `$${(cents / 100).toFixed(0)}/mo`;
}

export const SALES_EMAIL = "sales@analogqr.com";
export const ENTERPRISE_SUBJECT = "Enterprise plan inquiry";
export const ENTERPRISE_MAILTO = `mailto:${SALES_EMAIL}?subject=${encodeURIComponent(ENTERPRISE_SUBJECT)}`;
