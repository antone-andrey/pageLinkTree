import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { linkSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { isValidUrl, sanitizeString, sanitizeUrl } from "@/lib/validation";
import { getPlanLimits } from "@/lib/plan-limits";

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

    // Sanitize fields
    data.title = sanitizeString(data.title);
    data.url = sanitizeUrl(data.url);

    // Validate URL format after sanitization
    if (!isValidUrl(data.url)) {
      return NextResponse.json(
        { error: "Invalid URL format. URL must start with http:// or https://" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    });

    const limits = getPlanLimits(user?.plan || "FREE");
    if (limits.links !== Infinity) {
      const count = await prisma.link.count({ where: { userId: session.user.id } });
      if (count >= limits.links) {
        return NextResponse.json(
          { error: `Free plan limited to ${limits.links} links. Upgrade to add more.` },
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
      const zodError = error as { errors?: { message: string; path: string[] }[] };
      const message = zodError.errors?.[0]?.message || "Invalid input";
      return NextResponse.json({ error: message }, { status: 422 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
