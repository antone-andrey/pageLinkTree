import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { plan: true, brandingRemoved: true, stripeCustomerId: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.plan !== "FREE") {
    return NextResponse.json({ error: "Not applicable for paid plans" }, { status: 400 });
  }

  if (user.brandingRemoved) {
    return NextResponse.json({ error: "Branding already removed" }, { status: 400 });
  }

  try {
    const s = getStripe();

    // Get or create customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await s.customers.create({
        email: user.email!,
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
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: { name: "Remove PageDrop branding" },
            unit_amount: 500, // $5.00
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: session.user.id,
        type: "branding_removal",
      },
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/page?branding=removed`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/page`,
    });

    return NextResponse.json({ checkoutUrl: checkoutSession.url });
  } catch (error) {
    console.error("Branding removal checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
