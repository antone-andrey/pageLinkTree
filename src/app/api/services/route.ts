import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serviceSchema } from "@/lib/validations";
import { sanitizeString } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await prisma.service.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(services);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = serviceSchema.parse(body);

    // Validate price is a positive number
    if (typeof data.price !== "number" || data.price < 0) {
      return NextResponse.json(
        { error: "Price must be a positive number" },
        { status: 400 }
      );
    }

    // Validate duration is between 5 and 480 minutes
    if (typeof data.durationMins !== "number" || data.durationMins < 5 || data.durationMins > 480) {
      return NextResponse.json(
        { error: "Duration must be between 5 and 480 minutes" },
        { status: 400 }
      );
    }

    // Sanitize name and description fields
    data.name = sanitizeString(data.name);
    if (data.description) {
      data.description = sanitizeString(data.description);
    }

    const service = await prisma.service.create({
      data: { ...data, userId: session.user.id },
    });

    return NextResponse.json(service, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }
}
