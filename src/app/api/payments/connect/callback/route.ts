import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.redirect(new URL("/dashboard/payments", req.url));
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { stripeConnectId: true },
    });

    if (user?.stripeConnectId) {
      // Check account status with Stripe
      const account = await getStripe().accounts.retrieve(user.stripeConnectId);

      await prisma.user.update({
        where: { id: userId },
        data: {
          stripeConnectActive: account.charges_enabled ?? false,
        },
      });
    }
  } catch (error) {
    console.error("Stripe callback error:", error);
  }

  return NextResponse.redirect(new URL("/dashboard/payments?connected=true", req.url));
}
