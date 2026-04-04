import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { themes } from "@/lib/themes";
import { auth } from "@/lib/auth";
import { PublicProfile } from "./public-profile";

// ISR: revalidate every hour so popular profiles stay fresh
export const revalidate = 3600;

// Pre-render the top 100 published profiles at build time
export async function generateStaticParams() {
  try {
    const pages = await prisma.page.findMany({
      where: { isPublished: true },
      select: { user: { select: { username: true } } },
      take: 100,
    });
    return pages.map((page) => ({ username: page.user.username }));
  } catch {
    // DB unreachable at build time — fall back to on-demand rendering
    return [];
  }
}

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, bio: true, username: true, page: { select: { isPublished: true } } },
  });

  if (!user) return {};

  const displayName = user.name || user.username;
  const description = user.bio || `Check out ${displayName}'s page on PageDrop`;
  const canonicalUrl = `https://linktreebooking.vercel.app/${user.username}`;
  const isPublished = user.page?.isPublished ?? false;

  return {
    title: `${displayName} — PageDrop`,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${displayName} — PageDrop`,
      description,
      type: "profile",
      url: canonicalUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: `${displayName} — PageDrop`,
      description,
    },
    robots: isPublished
      ? { index: true, follow: true }
      : { index: false },
  };
}

export default async function UserProfilePage({ params }: Props) {
  const [user, session] = await Promise.all([
    prisma.user.findUnique({
      where: { username: params.username },
      select: {
        id: true,
        name: true,
        username: true,
        bio: true,
        avatarUrl: true,
        plan: true,
        page: { select: { themeId: true, isPublished: true, showBranding: true, customBgUrl: true } },
        links: {
          where: { isActive: true },
          orderBy: { position: "asc" },
          select: { id: true, title: true, url: true, isActive: true },
        },
        services: {
          where: { isActive: true },
          select: { id: true, name: true, description: true, durationMins: true, price: true, currency: true },
        },
      },
    }),
    auth(),
  ]);

  if (!user || !user.page?.isPublished) {
    notFound();
  }

  const theme = themes[user.page.themeId] || themes.default;
  const isOwner = session?.user?.id === user.id;

  return (
    <PublicProfile
      user={{
        id: user.id,
        name: user.name || user.username,
        username: user.username,
        bio: user.bio || "",
        avatarUrl: user.avatarUrl || "",
        plan: user.plan,
      }}
      links={user.links}
      services={user.services}
      theme={theme}
      showBranding={user.page.showBranding}
      customBgUrl={user.page.customBgUrl || undefined}
      isOwner={isOwner}
    />
  );
}
