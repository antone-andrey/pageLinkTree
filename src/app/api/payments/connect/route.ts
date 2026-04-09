import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "", {
    apiVersion: "2026-02-25.clover",
  });
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const s = getStripe();

    // Check if user already has a Stripe Connect account
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeConnectId: true },
    });

    let accountId = user?.stripeConnectId;

    // Create new account if none exists
    if (!accountId) {
      const account = await s.accounts.create({ type: "express" });
      accountId = account.id;

      // Save the account ID immediately
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeConnectId: accountId },
      });
    }

    const accountLink = await s.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXTAUTH_URL}/dashboard/payments`,
      return_url: `${process.env.NEXTAUTH_URL}/api/payments/connect/callback?userId=${session.user.id}`,
      type: "account_onboarding",
    });

    return NextResponse.json({ url: accountLink.url });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error("Stripe connect error:", errMsg);
    return NextResponse.json({ error: `Failed to create Stripe link: ${errMsg}` }, { status: 500 });
  }
}
