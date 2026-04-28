import { type NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { revalidatePath } from "next/cache";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { planFromPriceId } from "@/lib/plans";
import { env } from "@/lib/env";

function stripeStatusToSubStatus(
  status: Stripe.Subscription.Status
): "ACTIVE" | "INACTIVE" | "PAST_DUE" | "CANCELED" {
  switch (status) {
    case "active":
      return "ACTIVE";
    case "past_due":
      return "PAST_DUE";
    case "canceled":
      return "CANCELED";
    default:
      return "INACTIVE";
  }
}

async function handleSubscriptionUpsert(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id ?? null;
  const plan = planFromPriceId(priceId);
  const status = stripeStatusToSubStatus(subscription.status);
  const workspaceId =
    subscription.metadata.workspaceId ??
    // Fallback: look up from existing subscription row
    (
      await supabaseAdmin
        .from("subscriptions")
        .select("workspaceId")
        .eq("stripeCustomerId", customerId)
        .maybeSingle()
    ).data?.workspaceId;

  if (!workspaceId) return;

  await Promise.all([
    supabaseAdmin.from("subscriptions").upsert(
      {
        workspaceId,
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        status,
        currentPeriodEnd: (() => {
          const ts = subscription.items.data[0]?.current_period_end;
          return ts ? new Date(ts * 1000).toISOString() : null;
        })(),
      },
      { onConflict: "workspaceId" }
    ),
    supabaseAdmin
      .from("workspaces")
      .update({ plan, updatedAt: new Date().toISOString() })
      .eq("id", workspaceId),
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/qr-codes");
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  const { data: existing } = await supabaseAdmin
    .from("subscriptions")
    .select("workspaceId")
    .eq("stripeCustomerId", customerId)
    .maybeSingle();

  await supabaseAdmin
    .from("subscriptions")
    .update({
      status: "CANCELED",
      stripeSubscriptionId: null,
      stripePriceId: null,
    })
    .eq("stripeCustomerId", customerId);

  if (existing?.workspaceId) {
    await supabaseAdmin
      .from("workspaces")
      .update({ plan: "FREE", updatedAt: new Date().toISOString() })
      .eq("id", existing.workspaceId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/qr-codes");
}

export async function POST(request: NextRequest) {
  if (!stripe || !env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 501 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
          );
          await handleSubscriptionUpsert(subscription);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated": {
        await handleSubscriptionUpsert(
          event.data.object as Stripe.Subscription
        );
        break;
      }
      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(
          event.data.object as Stripe.Subscription
        );
        break;
      }
      // Belt-and-suspenders: fires on every successful payment including the
      // first charge. Guarantees the plan is set even if checkout.session.completed
      // was missed (e.g. webhook not subscribed to that event).
      case "invoice.paid": {
        const invoice = event.data.object as Stripe.Invoice;
        // SDK v18+: subscription id is nested under parent.subscription_details.
        // The field type is string | Stripe.Subscription, so narrow to the id string.
        const subRef = invoice.parent?.subscription_details?.subscription;
        const subId = typeof subRef === "string" ? subRef : subRef?.id ?? null;
        if (subId) {
          const subscription = await stripe.subscriptions.retrieve(subId);
          await handleSubscriptionUpsert(subscription);
        }
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;
        await supabaseAdmin
          .from("subscriptions")
          .update({ status: "PAST_DUE" })
          .eq("stripeCustomerId", customerId);
        break;
      }
    }
  } catch (err) {
    console.error(`Webhook handler error for ${event.type}:`, err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
