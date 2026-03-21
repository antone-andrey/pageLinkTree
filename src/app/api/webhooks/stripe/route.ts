import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.payment_intent && typeof session.payment_intent === "string") {
          const existing = await prisma.transaction.findUnique({
            where: { stripePaymentId: session.payment_intent },
          });
          if (!existing && session.metadata?.userId) {
            await prisma.transaction.create({
              data: {
                userId: session.metadata.userId,
                stripePaymentId: session.payment_intent,
                amount: session.amount_total || 0,
                fee: 0,
                currency: session.currency || "usd",
                status: "completed",
                description: session.metadata?.label,
              },
            });
          }
        }

        // Handle branding removal payment
        if (session.metadata?.type === "branding_removal" && session.metadata?.userId) {
          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: { brandingRemoved: true },
          });
          await prisma.page.update({
            where: { userId: session.metadata.userId },
            data: { showBranding: false },
          });
        }

        // Handle booking payment
        if (session.metadata?.bookingId) {
          await prisma.booking.update({
            where: { id: session.metadata.bookingId },
            data: {
              paymentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
              status: "CONFIRMED",
            },
          });
        }
        break;
      }

      case "account.updated": {
        const account = event.data.object as Stripe.Account;
        if (account.id) {
          await prisma.user.updateMany({
            where: { stripeConnectId: account.id },
            data: { stripeConnectActive: account.charges_enabled ?? false },
          });
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const priceId = subscription.items.data[0]?.price.id;
        let plan: "FREE" | "PRO" | "BUSINESS" = "FREE";
        if (priceId === process.env.STRIPE_PRO_PRICE_ID) plan = "PRO";
        if (priceId === process.env.STRIPE_BUSINESS_PRICE_ID) plan = "BUSINESS";

        if (subscription.metadata?.userId) {
          await prisma.user.update({
            where: { id: subscription.metadata.userId },
            data: { plan },
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        if (subscription.metadata?.userId) {
          await prisma.user.update({
            where: { id: subscription.metadata.userId },
            data: { plan: "FREE" },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
  }

  return NextResponse.json({ received: true });
}
