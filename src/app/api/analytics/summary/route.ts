import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const days = parseInt(searchParams.get("days") || "30", 10);
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  let from: Date;
  let to: Date;

  if (fromParam && toParam) {
    from = new Date(fromParam);
    to = new Date(toParam);
  } else {
    to = new Date();
    from = new Date();
    from.setDate(from.getDate() - days);
  }

  // Set time boundaries
  from.setHours(0, 0, 0, 0);
  to.setHours(23, 59, 59, 999);

  const userId = session.user.id;
  const dateFilter = { userId, createdAt: { gte: from, lte: to } };

  const [
    totalViews,
    periodViews,
    totalClicks,
    totalBookings,
    totalRevenue,
    topLinks,
    pageViews,
  ] = await Promise.all([
    prisma.pageView.count({ where: { userId } }),
    prisma.pageView.count({ where: dateFilter }),
    prisma.link.aggregate({
      where: { userId },
      _sum: { clicks: true },
    }),
    prisma.booking.count({
      where: { userId, status: { not: "CANCELLED" } },
    }),
    prisma.transaction.aggregate({
      where: { userId },
      _sum: { amount: true },
    }),
    prisma.link.findMany({
      where: { userId },
      orderBy: { clicks: "desc" },
      take: 10,
      select: { id: true, title: true, url: true, clicks: true },
    }),
    prisma.pageView.findMany({
      where: dateFilter,
      select: { createdAt: true, referrer: true, deviceType: true, country: true },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Build daily breakdown
  const dailyMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const deviceMap = new Map<string, number>();
  const countryMap = new Map<string, number>();
  const uniqueVisitorDays = new Set<string>();

  for (const pv of pageViews) {
    const dateKey = pv.createdAt.toISOString().slice(0, 10);
    dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);

    // Track unique by day (approximation using date granularity)
    uniqueVisitorDays.add(dateKey);

    if (pv.referrer) {
      referrerMap.set(pv.referrer, (referrerMap.get(pv.referrer) || 0) + 1);
    }

    if (pv.deviceType) {
      deviceMap.set(pv.deviceType, (deviceMap.get(pv.deviceType) || 0) + 1);
    }

    if (pv.country) {
      countryMap.set(pv.country, (countryMap.get(pv.country) || 0) + 1);
    }
  }

  // Fill missing days with 0
  const dailyBreakdown: { date: string; views: number }[] = [];
  const current = new Date(from);
  while (current <= to) {
    const key = current.toISOString().slice(0, 10);
    dailyBreakdown.push({ date: key, views: dailyMap.get(key) || 0 });
    current.setDate(current.getDate() + 1);
  }

  // Sort maps into ranked arrays
  const topReferrers = Array.from(referrerMap.entries())
    .map(([referrer, count]) => ({ referrer, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const deviceBreakdown = Array.from(deviceMap.entries())
    .map(([device, count]) => ({ device, count }))
    .sort((a, b) => b.count - a.count);

  const countryBreakdown = Array.from(countryMap.entries())
    .map(([country, count]) => ({ country, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  return NextResponse.json({
    totalViews,
    recentViews: periodViews,
    totalClicks: totalClicks._sum.clicks || 0,
    totalBookings,
    totalRevenue: totalRevenue._sum.amount || 0,
    topLinks,
    dailyBreakdown,
    topReferrers,
    deviceBreakdown,
    countryBreakdown,
    uniqueDays: uniqueVisitorDays.size,
  });
}
