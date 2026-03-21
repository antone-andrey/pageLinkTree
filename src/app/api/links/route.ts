import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { isValidUrl, sanitizeString, sanitizeUrl } from "@/lib/validation";

const limiter = rateLimit({ interval: 60_000, uniqueTokenPerInterval: 500 });

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.link.findMany({
    where: { userId: session.user.id },
    orderBy: { position: "asc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "anonymous";
    await limiter.check(20, ip);
  } catch {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const data = linkSchema.parse(body);

    // Validate URL format
    const cleanUrl = sanitizeUrl(data.url);
    if (!isValidUrl(cleanUrl)) {
      return NextResponse.json(
        { error: "Invalid URL format. URL must start with http:// or https://" },
        { status: 400 }
      );
    }

    // Sanitize title field
    data.title = sanitizeString(data.title);
    data.url = cleanUrl;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    if (user?.plan === "FREE") {
      const count = await prisma.link.count({ where: { userId: session.user.id } });
      if (count >= 5) {
        return NextResponse.json(
          { error: "Free plan limited to 5 links. Upgrade to add more." },
          { status: 403 }
        );
      }
    }

    const maxPosition = await prisma.link.findFirst({
      where: { userId: session.user.id },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const link = await prisma.link.create({
      data: {
        ...data,
        iconUrl: data.iconUrl || null,
        userId: session.user.id,
        position: (maxPosition?.position ?? -1) + 1,
      },
    });

    return NextResponse.json(link, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
