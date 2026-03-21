"use client";

import { useEffect } from "react";
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
  theme: Theme;
  showBranding?: boolean;
  customBgUrl?: string;
  isOwner?: boolean;
}

export function PublicProfile({ user, links, services, theme, showBranding = true, customBgUrl, isOwner = false }: PublicProfileProps) {
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
  };

  return (
    <div style={pageStyle}>
      {/* Owner admin bar */}
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
              transition: "background 0.15s ease",
            }}
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to editor
          </a>
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

      <div style={{ maxWidth: 512, margin: "0 auto", padding: `${isOwner ? 64 : 48}px 16px 48px`, position: "relative", zIndex: 1 }}>
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

        {/* Branding */}
        {showBranding && (
          <div style={{ textAlign: "center", marginTop: 64 }}>
            <a href="/" style={{ fontSize: 12, opacity: 0.3, textDecoration: "none", color: customBgUrl ? "#fff" : "inherit" }}>
              Powered by PageDrop
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
