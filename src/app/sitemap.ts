import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://page-drop.com";

  // Fetch all published user pages
  const publishedPages = await prisma.page.findMany({
    where: { isPublished: true },
    select: {
      user: { select: { username: true } },
      updatedAt: true,
    },
  });

  const userProfileEntries: MetadataRoute.Sitemap = publishedPages
    .filter((page) => page.user.username)
    .map((page) => ({
      url: `${baseUrl}/${page.user.username}`,
      lastModified: page.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...userProfileEntries,
  ];
}
