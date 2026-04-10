import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validations";
import { getPlanLimits } from "@/lib/plan-limits";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let page = await prisma.page.findUnique({
    where: { userId: session.user.id },
  });

  if (!page) {
    page = await prisma.page.create({
      data: { userId: session.user.id },
    });
  }

  return NextResponse.json(page);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = pageSchema.parse(body);

    // Enforce social links limit
    if (data.socialLinks) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true },
      });
      const limits = getPlanLimits(user?.plan || "FREE");
      if (limits.socialLinks !== Infinity) {
        try {
          const parsed = JSON.parse(data.socialLinks);
          const filledCount = Object.values(parsed).filter((v) => v && (v as string).trim()).length;
          if (filledCount > limits.socialLinks) {
            return NextResponse.json(
              { error: `Free plan limited to ${limits.socialLinks} social links. Upgrade to add more.` },
              { status: 403 }
            );
          }
        } catch { /* not valid JSON, let it pass to normal validation */ }
      }
    }

    // Enforce pay button limit for free plan
    if (data.payButtonActive) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { plan: true },
      });
      const limits = getPlanLimits(user?.plan || "FREE");
      if (limits.payButtons !== Infinity) {
        // Free plan gets 1 pay button — already the case since there's only one, so just allow it
      }
    }

    const page = await prisma.page.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { userId: session.user.id, ...data },
    });

    return NextResponse.json(page);
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }
}
