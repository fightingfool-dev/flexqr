import Stripe from "stripe";
import { env } from "@/lib/env";

// Returns null when STRIPE_SECRET_KEY is absent — billing features degrade gracefully.
export const stripe: Stripe | null = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2026-04-22.dahlia" })
  : null;
