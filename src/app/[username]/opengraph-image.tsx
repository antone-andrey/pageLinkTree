/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text */
import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const alt = "Profile on PageDrop";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    select: { name: true, bio: true, username: true },
  });

  const displayName = user?.name || user?.username || "User";
  const bio = user?.bio || "Check out my links on PageDrop";

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Gradient orbs */}
        <div
          style={{
            position: "absolute",
            top: -100,
            left: 100,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(99, 102, 241, 0.3)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -50,
            right: 150,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(139, 92, 246, 0.25)",
            filter: "blur(80px)",
          }}
        />

        {/* Initial avatar */}
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            color: "white",
            marginBottom: 24,
            border: "4px solid rgba(99, 102, 241, 0.5)",
          }}
        >
          {displayName[0]?.toUpperCase() || "?"}
        </div>

        {/* Name */}
        <div
          style={{
            fontSize: 48,
            fontWeight: 800,
            color: "white",
            letterSpacing: -1,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {displayName}
        </div>

        {/* Bio */}
        <div
          style={{
            fontSize: 22,
            color: "rgba(199, 210, 254, 0.9)",
            textAlign: "center",
            maxWidth: 700,
            lineHeight: 1.4,
            marginBottom: 40,
          }}
        >
          {bio.length > 120 ? bio.slice(0, 117) + "..." : bio}
        </div>

        {/* Branding */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            P
          </div>
          <span
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "rgba(156, 163, 175, 1)",
            }}
          >
            View my links on PageDrop
          </span>
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 14,
            color: "rgba(107, 114, 128, 1)",
          }}
        >
          linktreebooking.vercel.app/{params.username}
        </div>
      </div>
    ),
    { ...size }
  );
}
