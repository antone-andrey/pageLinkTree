import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, usernameSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      username: true,
      bio: true,
      avatarUrl: true,
      plan: true,
      stripeConnectActive: true,
      onboardingComplete: true,
      brandingRemoved: true,
      createdAt: true,
    },
  });

  return NextResponse.json(user);
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined || body.bio !== undefined || body.avatarUrl !== undefined) {
      const profile = profileSchema.parse({
        name: body.name,
        bio: body.bio,
        avatarUrl: body.avatarUrl,
      });
      Object.assign(data, profile);
    }

    if (body.username !== undefined) {
      const username = usernameSchema.parse(body.username);
      const existing = await prisma.user.findUnique({ where: { username } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Username taken" }, { status: 409 });
      }
      data.username = username;
    }

    if (body.onboardingComplete !== undefined) {
      data.onboardingComplete = body.onboardingComplete;
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        plan: true,
        onboardingComplete: true,
      },
    });

    return NextResponse.json(user);
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Delete all related data first, then the user
    await prisma.$transaction([
      prisma.booking.deleteMany({ where: { userId: session.user.id } }),
      prisma.service.deleteMany({ where: { userId: session.user.id } }),
      prisma.link.deleteMany({ where: { userId: session.user.id } }),
      prisma.availability.deleteMany({ where: { userId: session.user.id } }),
      prisma.transaction.deleteMany({ where: { userId: session.user.id } }),
      prisma.page.deleteMany({ where: { userId: session.user.id } }),
      prisma.account.deleteMany({ where: { userId: session.user.id } }),
      prisma.session.deleteMany({ where: { userId: session.user.id } }),
      prisma.user.delete({ where: { id: session.user.id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete account error:", error);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
