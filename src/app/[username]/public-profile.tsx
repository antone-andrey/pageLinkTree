"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Theme } from "@/lib/themes";
import { formatCurrency } from "@/lib/utils";

interface Service {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  price: number;
  currency: string;
}

interface SocialLinks {
  [key: string]: string | undefined;
}

const SOCIAL_ICONS: Record<string, { icon: string; color: string }> = {
  instagram: { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z", color: "#E4405F" },
  tiktok: { icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z", color: "#000000" },
  x: { icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z", color: "#000000" },
  facebook: { icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z", color: "#1877F2" },
  youtube: { icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z", color: "#FF0000" },
  onlyfans: { icon: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.6a6.6 6.6 0 110-13.2 6.6 6.6 0 010 13.2zm0-10.2a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2z", color: "#00AFF0" },
  linkedin: { icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z", color: "#0A66C2" },
  pinterest: { icon: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z", color: "#BD081C" },
  snapchat: { icon: "M12.017.512a6.452 6.452 0 014.863 2.028 7.627 7.627 0 011.89 5.07c-.01.38-.04.77-.09 1.17.51.16 1.01.24 1.51.24.36 0 .71-.06.99-.19.14-.06.35-.14.58-.14.2 0 .47.07.64.28.22.26.2.6.04.89-.43.78-1.52 1.23-1.77 1.33-.08.03-.2.08-.24.11.01.08.04.2.07.3a11.45 11.45 0 002.54 4.27c.43.44.96.82 1.55 1.12.33.16.66.28.62.62-.04.32-.4.52-.65.63-.66.28-1.38.42-2.12.46-.11.01-.22.05-.29.17-.09.15-.07.39-.26.7-.16.25-.48.45-1.02.45-.22 0-.47-.03-.75-.09a5.41 5.41 0 00-1.16-.15c-.31 0-.62.03-.92.13a4.56 4.56 0 00-1.57 1.03c-.72.65-1.52 1.02-2.38 1.02s-1.65-.37-2.37-1.02a4.56 4.56 0 00-1.57-1.03c-.3-.1-.61-.13-.92-.13a5.41 5.41 0 00-1.16.15c-.28.06-.53.09-.75.09-.54 0-.86-.2-1.02-.45-.19-.31-.17-.55-.26-.7-.07-.12-.18-.16-.29-.17a5.82 5.82 0 01-2.12-.46c-.25-.11-.61-.31-.65-.63-.04-.34.29-.46.62-.62.59-.3 1.12-.68 1.55-1.12a11.45 11.45 0 002.54-4.27c.03-.1.06-.22.07-.3-.04-.03-.16-.08-.24-.11-.25-.1-1.34-.55-1.77-1.33-.16-.29-.18-.63.04-.89.17-.21.44-.28.64-.28.23 0 .44.08.58.14.28.13.63.19.99.19.5 0 1-.08 1.51-.24-.05-.4-.08-.79-.09-1.17a7.627 7.627 0 011.89-5.07A6.452 6.452 0 0112.017.512z", color: "#FFFC00" },
  threads: { icon: "M16.556 12.346c-.07-.035-.144-.068-.217-.1a7.288 7.288 0 00-.246-.937c-.607-1.768-1.848-2.74-3.497-2.74-.05 0-.101.001-.152.003-1.06.036-1.908.496-2.397 1.263l1.122.764c.353-.528.917-.636 1.299-.649.028-.001.057-.001.085-.001.5 0 .878.187 1.123.556.178.268.295.64.351 1.109a7.992 7.992 0 00-1.59-.086c-2.093.12-3.443 1.356-3.38 3.093.032.871.446 1.62 1.166 2.11.607.413 1.39.612 2.205.56.996-.063 1.776-.438 2.32-1.117.413-.515.677-1.172.799-1.99.478.288.835.667 1.04 1.124.347.775.367 2.048-.658 3.073-.898.899-1.978 1.288-3.6 1.3-1.8-.014-3.162-.594-4.048-1.724-.82-1.047-1.243-2.549-1.258-4.464.015-1.915.439-3.417 1.258-4.464.886-1.13 2.248-1.71 4.048-1.724 1.815.015 3.199.598 4.11 1.733.44.548.775 1.236 1.002 2.049l1.332-.357a7.83 7.83 0 00-1.24-2.542c-1.174-1.465-2.884-2.212-5.084-2.233l-.12-.001c-2.187.021-3.876.775-5.02 2.235C7.454 7.5 6.94 9.295 6.922 11.5l-.001.083c.018 2.205.532 4 1.527 5.332 1.143 1.46 2.832 2.215 5.019 2.235l.12.001c1.944-.015 3.36-.55 4.586-1.735 1.587-1.587 1.535-3.582 1.018-4.737a4.24 4.24 0 00-2.635-2.333zm-2.604 3.859c-.835.052-1.704-.328-1.733-1.122-.021-.578.405-1.224 1.976-1.314.173-.01.343-.015.51-.015.435 0 .843.042 1.218.126-.139 1.823-1.034 2.272-1.971 2.325z", color: "#000000" },
};

// PageDrop drop icon (inline SVG path data for the logo mark)
function PageDropMark({ size = 20, color = "#6366f1" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs>
        <linearGradient id="pd-mark" x1="10%" y1="0%" x2="90%" y2="100%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="40%" stopColor="#c084fc" />
          <stop offset="100%" stopColor={color} />
        </linearGradient>
      </defs>
      <path
        d="M24 7C24 7 12 19 12 27C12 33.627 17.373 39 24 39C30.627 39 36 33.627 36 27C36 19 24 7 24 7Z"
        fill="url(#pd-mark)"
      />
      <ellipse cx="19" cy="22" rx="3" ry="4" fill="white" opacity="0.15" transform="rotate(-20 19 22)" />
    </svg>
  );
}

interface PublicProfileProps {
  user: {
    id: string;
    name: string;
    username: string;
    bio: string;
    avatarUrl: string;
    plan: string;
  };
  links: { id: string; title: string; url: string; isActive: boolean }[];
  services: Service[];
  socialLinks?: SocialLinks;
  theme: Theme;
  showBranding?: boolean;
  customBgUrl?: string;
  isOwner?: boolean;
  payButton?: { label: string; amount: number };
}

export function PublicProfile({ user, links, services, socialLinks, theme, showBranding = true, customBgUrl, isOwner = false, payButton }: PublicProfileProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/analytics/pageview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id }),
    }).catch(() => {});
  }, [user.id]);

  function trackClick(linkId: string) {
    fetch(`/api/links/${linkId}/click`, { method: "POST" }).catch(() => {});
  }

  async function handleShare() {
    const url = `${window.location.origin}/${user.username}`;
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (typeof navigator.share === "function") {
      try {
        await navigator.share({ title: `${user.name} — PageDrop`, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const pageStyle: React.CSSProperties = {
    minHeight: "100vh",
    background: theme.page.background,
    backgroundImage: customBgUrl
      ? `url(${customBgUrl})`
      : theme.page.backgroundImage,
    backgroundSize: customBgUrl ? "cover" : undefined,
    backgroundPosition: customBgUrl ? "center" : undefined,
    backgroundRepeat: customBgUrl ? "no-repeat" : undefined,
    color: theme.page.color,
    fontFamily: theme.page.fontFamily,
    position: "relative",
    display: "flex",
    flexDirection: "column",
  };

  const isDark = customBgUrl || (theme.page.background && (
    theme.page.background.includes("#0") ||
    theme.page.background.includes("#1") ||
    theme.page.background.includes("#2") ||
    theme.page.background.includes("rgb(0") ||
    theme.page.background.includes("rgb(1") ||
    theme.page.background.includes("linear-gradient")
  ));

  const subtleColor = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)";
  const subtleHover = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)";
  const btnBg = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)";
  const btnBgHover = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)";
  const btnBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: user.name,
      description: user.bio || undefined,
      url: `https://page-drop.com/${user.username}`,
      image: user.avatarUrl || undefined,
    },
  };

  return (
    <div style={pageStyle}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Owner admin bar ──────────────────────────── */}
      {isOwner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            padding: "10px 16px",
            background: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(12px)",
          }}
        >
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.7)" }}>
            You are viewing your live page
          </span>
          <a
            href="/dashboard/page"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 14px",
              fontSize: 13,
              fontWeight: 600,
              color: "#fff",
              background: "#6366f1",
              borderRadius: 8,
              textDecoration: "none",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to editor
          </a>
        </div>
      )}

      {/* ── Top bar: PageDrop logo (left) + Share (right) ── */}
      {!isOwner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
          }}
        >
          {/* PageDrop logo / claim button */}
          <a
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: "6px 12px",
              borderRadius: 999,
              background: btnBg,
              border: `1px solid ${btnBorder}`,
              backdropFilter: "blur(12px)",
              textDecoration: "none",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = btnBgHover)}
            onMouseLeave={(e) => (e.currentTarget.style.background = btnBg)}
          >
            <PageDropMark size={18} />
            <span style={{ fontSize: 12, fontWeight: 600, color: subtleHover, letterSpacing: "-0.01em" }}>
              PageDrop
            </span>
          </a>

          {/* Share button */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => {
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (typeof navigator.share === "function") {
                  handleShare();
                } else {
                  setShowShareMenu(!showShareMenu);
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 36,
                height: 36,
                borderRadius: 999,
                background: btnBg,
                border: `1px solid ${btnBorder}`,
                backdropFilter: "blur(12px)",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = btnBgHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = btnBg)}
              aria-label="Share this page"
            >
              <svg width="16" height="16" fill="none" stroke={subtleHover} viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8M16 6l-4-4-4 4M12 2v13" />
              </svg>
            </button>

            {/* Share dropdown (non-native fallback) */}
            {showShareMenu && (
              <>
                <div
                  style={{ position: "fixed", inset: 0, zIndex: 41 }}
                  onClick={() => setShowShareMenu(false)}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "calc(100% + 8px)",
                    right: 0,
                    zIndex: 42,
                    minWidth: 180,
                    padding: 6,
                    borderRadius: 12,
                    background: isDark ? "rgba(30,30,40,0.95)" : "rgba(255,255,255,0.98)",
                    border: `1px solid ${btnBorder}`,
                    backdropFilter: "blur(20px)",
                    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",
                  }}
                >
                  <button
                    onClick={() => {
                      handleShare();
                      setShowShareMenu(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      width: "100%",
                      padding: "10px 12px",
                      border: "none",
                      background: "transparent",
                      borderRadius: 8,
                      cursor: "pointer",
                      fontSize: 13,
                      color: isDark ? "#fff" : "#1a1a1a",
                      textAlign: "left",
                    }}
                  >
                    <svg width="15" height="15" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    {copied ? "Copied!" : "Copy link"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Overlay for readability when custom BG is used */}
      {customBgUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* ── Main content ─────────────────────────────── */}
      <div style={{ flex: 1, maxWidth: 512, margin: "0 auto", padding: `${isOwner ? 64 : 60}px 16px 24px`, position: "relative", zIndex: 1, width: "100%" }}>
        {/* Avatar + Name + Bio */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={96}
              height={96}
              unoptimized={user.avatarUrl.startsWith("data:")}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 16px",
                display: "block",
                border: customBgUrl ? "3px solid rgba(255,255,255,0.5)" : undefined,
              }}
            />
          ) : (
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                margin: "0 auto 16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 32,
                fontWeight: 700,
                backgroundColor: theme.accent + "20",
                color: theme.accent,
              }}
            >
              {user.name[0]?.toUpperCase() || "?"}
            </div>
          )}
          <h1 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: customBgUrl ? "#fff" : undefined }}>
            {user.name}
          </h1>
          {user.bio && (
            <p style={{
              fontSize: 14,
              opacity: 0.8,
              marginTop: 8,
              maxWidth: 380,
              marginLeft: "auto",
              marginRight: "auto",
              color: customBgUrl ? "rgba(255,255,255,0.85)" : undefined,
            }}>
              {user.bio}
            </p>
          )}
        </div>

        {/* Social Links */}
        {socialLinks && Object.entries(socialLinks).some(([, v]) => v) && (
          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 24, flexWrap: "wrap" }}>
            {Object.entries(socialLinks).map(([platform, url]) => {
              if (!url) return null;
              const meta = SOCIAL_ICONS[platform];
              if (!meta) return null;
              const href = url.startsWith("http") ? url : `https://${url}`;
              return (
                <a
                  key={platform}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={platform}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: customBgUrl ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.06)",
                    backdropFilter: customBgUrl ? "blur(8px)" : undefined,
                    border: customBgUrl ? "1px solid rgba(255,255,255,0.2)" : "1px solid transparent",
                    transition: "transform 0.15s ease, background 0.15s ease",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill={customBgUrl ? "#fff" : meta.color}>
                    <path d={meta.icon} />
                  </svg>
                </a>
              );
            })}
          </div>
        )}

        {/* Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackClick(link.id)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "14px 16px",
                background: customBgUrl ? "rgba(255,255,255,0.15)" : theme.button.background,
                color: customBgUrl ? "#fff" : theme.button.color,
                border: customBgUrl ? "1px solid rgba(255,255,255,0.25)" : theme.button.border,
                borderRadius: theme.button.borderRadius,
                backdropFilter: customBgUrl ? "blur(12px)" : theme.button.backdropFilter,
                boxShadow: theme.button.boxShadow,
                textDecoration: "none",
                fontWeight: 500,
                transition: "transform 0.15s ease",
              }}
            >
              {link.title}
            </a>
          ))}
        </div>

        {/* Services / Booking section */}
        {services.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2
              style={{
                textAlign: "center",
                fontSize: 12,
                fontWeight: 600,
                opacity: 0.6,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                marginBottom: 16,
                color: customBgUrl ? "rgba(255,255,255,0.7)" : undefined,
              }}
            >
              Book a Session
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {services.map((service) => (
                <a
                  key={service.id}
                  href={`/${user.username}/book/${service.id}`}
                  style={{
                    display: "block",
                    width: "100%",
                    padding: 16,
                    background: customBgUrl ? "rgba(255,255,255,0.15)" : theme.button.background,
                    border: customBgUrl ? "1px solid rgba(255,255,255,0.25)" : theme.button.border,
                    borderRadius: theme.button.borderRadius,
                    backdropFilter: customBgUrl ? "blur(12px)" : theme.button.backdropFilter,
                    boxShadow: theme.button.boxShadow,
                    textDecoration: "none",
                    transition: "transform 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontWeight: 500, color: customBgUrl ? "#fff" : theme.button.color, margin: 0 }}>
                        {service.name}
                      </p>
                      <p style={{ fontSize: 12, opacity: 0.6, marginTop: 2, color: customBgUrl ? "rgba(255,255,255,0.7)" : undefined }}>
                        {service.durationMins} min
                        {service.description && ` — ${service.description}`}
                      </p>
                    </div>
                    <span style={{ fontWeight: 600, color: customBgUrl ? "#fff" : theme.button.color }}>
                      {service.price === 0 ? "Free" : formatCurrency(service.price, service.currency)}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Payment Button */}
        {payButton && (
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <button
              onClick={async () => {
                const res = await fetch("/api/payments/checkout", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    userId: user.id,
                    label: payButton.label,
                    amount: payButton.amount,
                    currency: "usd",
                  }),
                });
                const data = await res.json();
                if (data.checkoutUrl) {
                  window.location.href = data.checkoutUrl;
                }
              }}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 28px",
                fontSize: 14,
                fontWeight: 600,
                color: "#fff",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                border: "none",
                borderRadius: 12,
                cursor: "pointer",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                boxShadow: "0 4px 14px rgba(99,102,241,0.3)",
              }}
            >
              <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {payButton.label} — {formatCurrency(payButton.amount, "usd")}
            </button>
          </div>
        )}

        {/* ── Join on PageDrop CTA ──────────────────── */}
        {showBranding && <div style={{ textAlign: "center", marginTop: 40, marginBottom: 24 }}>
          <a
            href="/signup"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "12px 24px",
              borderRadius: 999,
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.06)",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)"}`,
              backdropFilter: "blur(12px)",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: 13,
              color: isDark ? "#fff" : "#1a1a1a",
              transition: "background 0.2s, transform 0.15s",
            }}
          >
            <PageDropMark size={20} />
            Join {user.username} on PageDrop
          </a>
        </div>}
      </div>

      {/* ── Page footer: Cookie Preferences · Report · Privacy ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          padding: "16px",
          flexWrap: "wrap",
        }}
      >
        <a href="/cookies" style={{ fontSize: 11, color: subtleColor, textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = subtleHover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = subtleColor)}
        >
          Cookie Preferences
        </a>
        <span style={{ fontSize: 11, color: subtleColor }}>·</span>
        <a href="mailto:report@page-drop.com?subject=Report%20page%20@{user.username}" style={{ fontSize: 11, color: subtleColor, textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = subtleHover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = subtleColor)}
        >
          Report
        </a>
        <span style={{ fontSize: 11, color: subtleColor }}>·</span>
        <a href="/privacy" style={{ fontSize: 11, color: subtleColor, textDecoration: "none", transition: "color 0.15s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = subtleHover)}
          onMouseLeave={(e) => (e.currentTarget.style.color = subtleColor)}
        >
          Privacy
        </a>
      </div>
    </div>
  );
}
