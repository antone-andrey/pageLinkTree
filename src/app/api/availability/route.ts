import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const availability = await prisma.availability.findMany({
    where: { userId: session.user.id },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json(availability);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { dayOfWeek, startTime, endTime, bufferMins = 0, timezone = "UTC" } = body;

  const availability = await prisma.availability.create({
    data: {
      userId: session.user.id,
      dayOfWeek,
      startTime,
      endTime,
      bufferMins,
      timezone,
    },
  });

  return NextResponse.json(availability, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slots } = body;

  // Delete existing and recreate
  await prisma.availability.deleteMany({ where: { userId: session.user.id } });

  if (slots && slots.length > 0) {
    await prisma.availability.createMany({
      data: slots.map((slot: { dayOfWeek: number; startTime: string; endTime: string; bufferMins?: number; timezone?: string }) => ({
        userId: session.user.id,
        dayOfWeek: slot.dayOfWeek,
        startTime: slot.startTime,
        endTime: slot.endTime,
        bufferMins: slot.bufferMins || 0,
        timezone: slot.timezone || "UTC",
      })),
    });
  }

  const availability = await prisma.availability.findMany({
    where: { userId: session.user.id },
    orderBy: { dayOfWeek: "asc" },
  });

  return NextResponse.json(availability);
}
