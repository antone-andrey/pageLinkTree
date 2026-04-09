import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

const PRICE_MAP: Record<string, string | undefined> = {
  PRO_MONTHLY: process.env.STRIPE_PRO_MONTHLY_PRICE_ID,
  PRO_ANNUAL: process.env.STRIPE_PRO_ANNUAL_PRICE_ID,
  BUSINESS_MONTHLY: process.env.STRIPE_BUSINESS_MONTHLY_PRICE_ID,
  BUSINESS_ANNUAL: process.env.STRIPE_BUSINESS_ANNUAL_PRICE_ID,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan, billing = "monthly" } = await req.json();
    const s = getStripe();

    if (!["PRO", "BUSINESS"].includes(plan) || !["monthly", "annual"].includes(billing)) {
      return NextResponse.json({ error: "Invalid plan or billing period" }, { status: 400 });
    }

    const key = `${plan}_${billing.toUpperCase()}`;
    const priceId = PRICE_MAP[key];

    if (!priceId) {
      return NextResponse.json({ error: `Price not configured for ${plan} ${billing}` }, { status: 400 });
    }

    // Get or create Stripe customer
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true, email: true },
    });

    let customerId = user?.stripeCustomerId;

    if (!customerId) {
      const customer = await s.customers.create({
        email: user?.email || session.user.email!,
        metadata: { userId: session.user.id },
      });
      customerId = customer.id;

      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const checkoutSession = await s.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      subscription_data: {
        metadata: { userId: session.user.id },
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/settings?upgraded=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/settings`,
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Subscription checkout error:", errMsg);
    return NextResponse.json({ error: `Failed to create checkout: ${errMsg}` }, { status: 500 });
  }
}
