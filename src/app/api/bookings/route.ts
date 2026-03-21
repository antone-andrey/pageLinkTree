import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { bookingSchema } from "@/lib/validations";
import { sendBookingConfirmationEmail, sendBookingNotificationToHost } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";
import { isValidEmail, sanitizeString } from "@/lib/validation";

const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    include: { service: { select: { name: true, durationMins: true, price: true } } },
    orderBy: { startTime: "asc" },
  });

  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    await limiter.check(10, ip);
  } catch {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const data = bookingSchema.parse(body);

    // Validate guest email format
    if (!isValidEmail(data.guestEmail)) {
      return NextResponse.json(
        { error: "Invalid email format for guest email" },
        { status: 400 }
      );
    }

    // Sanitize guest name
    data.guestName = sanitizeString(data.guestName);
    if (!data.guestName) {
      return NextResponse.json(
        { error: "Guest name is required" },
        { status: 400 }
      );
    }

    // Sanitize notes if present
    if (data.notes) {
      data.notes = sanitizeString(data.notes);
    }

    // Validate date is in the future
    const bookingDate = new Date(data.startTime);
    if (bookingDate <= new Date()) {
      return NextResponse.json(
        { error: "Booking date must be in the future" },
        { status: 400 }
      );
    }

    const service = await prisma.service.findUnique({
      where: { id: data.serviceId },
      include: { user: { select: { id: true } } },
    });

    if (!service || !service.isActive) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    const startTime = new Date(data.startTime);
    const endTime = new Date(startTime.getTime() + service.durationMins * 60000);

    // Check for conflicts
    const conflict = await prisma.booking.findFirst({
      where: {
        userId: service.user.id,
        status: { in: ["PENDING", "CONFIRMED"] },
        OR: [
          { startTime: { lt: endTime }, endTime: { gt: startTime } },
        ],
      },
    });

    if (conflict) {
      return NextResponse.json({ error: "Slot no longer available" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: service.user.id,
        serviceId: data.serviceId,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        startTime,
        endTime,
        status: "CONFIRMED",
        notes: data.notes,
      },
      include: { service: { select: { name: true, price: true } } },
    });

    // Send confirmation emails (don't block response)
    const host = await prisma.user.findUnique({
      where: { id: service.user.id },
      select: { name: true, email: true },
    });

    Promise.allSettled([
      sendBookingConfirmationEmail({
        guestEmail: data.guestEmail,
        guestName: data.guestName,
        serviceName: service.name,
        hostName: host?.name || "Host",
        startTime,
        duration: service.durationMins,
      }),
      host?.email ? sendBookingNotificationToHost({
        hostEmail: host.email,
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        serviceName: service.name,
        startTime,
        duration: service.durationMins,
      }) : Promise.resolve(),
    ]).catch(console.error);

    return NextResponse.json(booking, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Validation error" }, { status: 422 });
    }
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
