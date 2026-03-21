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
    const { bookingId } = await req.json();

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: true,
        user: { select: { stripeConnectId: true, plan: true, name: true } },
      },
    });

    if (!booking || !booking.service.price || booking.service.price === 0) {
      return NextResponse.json({ error: "No payment required" }, { status: 400 });
    }

    if (!booking.user.stripeConnectId) {
      return NextResponse.json({ error: "Host has not connected Stripe" }, { status: 400 });
    }

    const feePercent = booking.user.plan === "FREE" ? 0.03 : 0;
    const applicationFee = Math.round(booking.service.price * feePercent);

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: booking.service.currency,
            product_data: {
              name: booking.service.name,
              description: `Booking with ${booking.user.name || "Host"}`,
            },
            unit_amount: booking.service.price,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: applicationFee,
        transfer_data: { destination: booking.user.stripeConnectId },
      },
      metadata: {
        bookingId: booking.id,
        userId: booking.userId,
        label: booking.service.name,
      },
      success_url: `${process.env.NEXTAUTH_URL}/booking/success?id=${booking.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/booking/cancel`,
    });

    return NextResponse.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Booking checkout error:", error);
    return NextResponse.json({ error: "Failed to create checkout" }, { status: 500 });
  }
}
