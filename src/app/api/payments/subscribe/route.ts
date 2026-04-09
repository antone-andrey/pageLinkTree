import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { plan } = await req.json();
    const s = getStripe();

    const priceId = plan === "PRO"
      ? process.env.STRIPE_PRO_PRICE_ID
      : plan === "BUSINESS"
        ? process.env.STRIPE_BUSINESS_PRICE_ID
        : null;

    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
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
    const errType = error instanceof Error ? error.constructor.name : typeof error;
    console.error("Subscription checkout error:", errType, errMsg);
    console.error("STRIPE_SECRET_KEY set:", !!process.env.STRIPE_SECRET_KEY);
    console.error("STRIPE_PRO_PRICE_ID:", process.env.STRIPE_PRO_PRICE_ID);
    console.error("STRIPE_BUSINESS_PRICE_ID:", process.env.STRIPE_BUSINESS_PRICE_ID);
    return NextResponse.json({ error: `Failed to create checkout: ${errMsg}` }, { status: 500 });
  }
}
