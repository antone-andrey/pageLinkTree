import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

export async function POST(req: NextRequest) {
  try {
    const { userId, label, amount, currency = "usd" } = await req.json();

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeConnectId: true, plan: true },
    });

    if (!user?.stripeConnectId) {
      return NextResponse.json({ error: "Stripe not connected" }, { status: 400 });
    }

    const feePercent = user.plan === "FREE" ? 0.03 : 0;
    const applicationFee = Math.round(amount * feePercent);

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency,
            product_data: { name: label },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: { destination: user.stripeConnectId },
      },
      success_url: `${process.env.NEXTAUTH_URL}/payment/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/payment/cancel`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
