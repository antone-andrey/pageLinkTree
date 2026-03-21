import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "PageDrop — Link-in-bio with booking and payments";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
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

        {/* Logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "white",
              letterSpacing: -1,
            }}
          >
            PageDrop
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 32,
            fontWeight: 700,
            background: "linear-gradient(90deg, #818cf8, #c084fc, #f472b6)",
            backgroundClip: "text",
            color: "transparent",
            textAlign: "center",
            lineHeight: 1.3,
            marginBottom: 20,
          }}
        >
          Your brand. One link. Zero limits.
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(156, 163, 175, 1)",
            textAlign: "center",
            maxWidth: 600,
            lineHeight: 1.5,
          }}
        >
          Link-in-bio with built-in booking & payments.
          Replace Linktree + Calendly + Stripe with one link.
        </div>

        {/* Features pills */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 40,
          }}
        >
          {["Links", "Booking", "Payments", "Analytics"].map((f) => (
            <div
              key={f}
              style={{
                padding: "8px 20px",
                borderRadius: 999,
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(199, 210, 254, 1)",
                fontSize: 16,
                fontWeight: 600,
              }}
            >
              {f}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 30,
            fontSize: 14,
            color: "rgba(107, 114, 128, 1)",
          }}
        >
          linktreebooking.vercel.app · Free to start
        </div>
      </div>
    ),
    { ...size }
  );
}
