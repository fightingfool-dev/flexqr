"use server";

import { redirect } from "next/navigation";
import { requireUser, getUserWorkspaces } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { logError, isNextInternalError } from "@/lib/logger";

export async function createCheckoutSession(
  priceId: string,
  _formData: FormData
): Promise<void> {
  try {
    if (!stripe) throw new Error("Stripe is not configured.");

    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0]!;

    const { data: existingSub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripeCustomerId")
      .eq("workspaceId", workspace.id)
      .maybeSingle();

    let customerId: string;
    if (existingSub?.stripeCustomerId) {
      customerId = existingSub.stripeCustomerId as string;
    } else {
      const customer = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { workspaceId: workspace.id },
      });
      customerId = customer.id;
    }

    const appUrl = new URL(env.APP_URL).origin;

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard/settings?billing=success`,
      cancel_url: `${appUrl}/dashboard/settings?billing=cancelled`,
      metadata: { workspaceId: workspace.id },
      subscription_data: { metadata: { workspaceId: workspace.id } },
      allow_promotion_codes: true,
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL.");
    redirect(session.url);
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createCheckoutSession", err, { priceId });
    throw err;
  }
}

export async function createPortalSession(_formData: FormData): Promise<void> {
  try {
    if (!stripe) throw new Error("Stripe is not configured.");

    const user = await requireUser();
    const workspaces = await getUserWorkspaces(user.id);
    const workspace = workspaces[0]!;

    const { data: sub } = await supabaseAdmin
      .from("subscriptions")
      .select("stripeCustomerId")
      .eq("workspaceId", workspace.id)
      .single();

    if (!sub) redirect("/dashboard/settings");

    const appUrl = new URL(env.APP_URL).origin;

    const session = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId as string,
      return_url: `${appUrl}/dashboard/settings`,
    });

    redirect(session.url);
  } catch (err) {
    if (isNextInternalError(err)) throw err;
    logError("action:createPortalSession", err);
    throw err;
  }
}
