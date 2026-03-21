import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { themes } from "@/lib/themes";
import { auth } from "@/lib/auth";
import { PublicProfile } from "./public-profile";

interface Props {
  params: { username: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, bio: true, username: true },
  });

  if (!user) return {};

  return {
    title: `${user.name || user.username} — PageDrop`,
    description: user.bio || `Check out ${user.name || user.username}'s page on PageDrop`,
    openGraph: {
      title: `${user.name || user.username} — PageDrop`,
      description: user.bio || `Check out ${user.name || user.username}'s page on PageDrop`,
      type: "profile",
    },
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
