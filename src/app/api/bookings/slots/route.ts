import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId");
  const date = req.nextUrl.searchParams.get("date");

  if (!serviceId || !date) {
    return NextResponse.json({ error: "serviceId and date required" }, { status: 400 });
  }

  const service = await prisma.service.findUnique({
    where: { id: serviceId },
    include: { user: { select: { id: true } } },
  });

  if (!service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }

  const targetDate = new Date(date);
  const dayOfWeek = targetDate.getUTCDay();

  const availability = await prisma.availability.findMany({
    where: {
      userId: service.user.id,
      dayOfWeek,
      isActive: true,
    },
  });

  if (availability.length === 0) {
    return NextResponse.json({ slots: [] });
  }

  const existingBookings = await prisma.booking.findMany({
    where: {
      userId: service.user.id,
      status: { in: ["PENDING", "CONFIRMED"] },
      startTime: {
        gte: new Date(`${date}T00:00:00Z`),
        lt: new Date(`${date}T23:59:59Z`),
      },
    },
  });

  const slots: string[] = [];

  for (const avail of availability) {
    const [startH, startM] = avail.startTime.split(":").map(Number);
    const [endH, endM] = avail.endTime.split(":").map(Number);

    let current = new Date(`${date}T${String(startH).padStart(2, "0")}:${String(startM).padStart(2, "0")}:00Z`);
    const end = new Date(`${date}T${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}:00Z`);

    while (current.getTime() + service.durationMins * 60000 <= end.getTime()) {
      const slotEnd = new Date(current.getTime() + service.durationMins * 60000);

      const hasConflict = existingBookings.some(
        (b) => b.startTime < slotEnd && b.endTime > current
      );

      if (!hasConflict) {
        slots.push(current.toISOString());
      }

      current = new Date(current.getTime() + (service.durationMins + (avail.bufferMins || 0)) * 60000);
    }
  }

  return NextResponse.json({ slots });
}
