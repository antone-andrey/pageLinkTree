import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function getDeviceType(userAgent: string | null): string | null {
  if (!userAgent) return null;
  const ua = userAgent.toLowerCase();
  if (
    /mobile|android|iphone|ipad|ipod|blackberry|windows phone|opera mini|iemobile/i.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
}

function cleanReferrer(referrer: string | null): string | null {
  if (!referrer) return null;
  try {
    const url = new URL(referrer);
    return url.hostname;
  } catch {
    return referrer;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const userAgent = req.headers.get("user-agent") || null;
    const rawReferrer = req.headers.get("referer") || null;
    const country = req.headers.get("x-vercel-ip-country") || null;
    const deviceType = getDeviceType(userAgent);
    const referrer = cleanReferrer(rawReferrer);

    await prisma.pageView.create({
      data: {
        userId,
        source: rawReferrer,
        referrer,
        userAgent,
        country,
        deviceType,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error" }, { status: 500 });
  }
}
