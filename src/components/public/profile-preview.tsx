import Image from "next/image";
import { Theme } from "@/lib/themes";

interface ProfilePreviewProps {
  user: { name: string; bio: string; avatarUrl: string; username: string };
  links: { id: string; title: string; url: string; isActive: boolean }[];
  theme: Theme;
  showBranding?: boolean;
  customBgUrl?: string;
}

export function ProfilePreview({ user, links, theme, showBranding = true, customBgUrl }: ProfilePreviewProps) {
  const activeLinks = links.filter((l) => l.isActive);

  const pageStyle: React.CSSProperties = {
    minHeight: 600,
    background: theme.page.background,
    backgroundImage: customBgUrl
      ? `url(${customBgUrl})`
      : theme.page.backgroundImage,
    backgroundSize: customBgUrl ? "cover" : undefined,
    backgroundPosition: customBgUrl ? "center" : undefined,
    backgroundRepeat: customBgUrl ? "no-repeat" : undefined,
    color: theme.page.color,
    fontFamily: theme.page.fontFamily,
    padding: 24,
    position: "relative",
  };

  return (
    <div style={pageStyle}>
      {/* Overlay for custom BG */}
      {customBgUrl && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.35)",
            borderRadius: "inherit",
            pointerEvents: "none",
          }}
        />
      )}

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Avatar + Name + Bio */}
        <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 24 }}>
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.name}
              width={80}
              height={80}
              unoptimized={user.avatarUrl.startsWith("data:")}
              style={{
                borderRadius: "50%",
                objectFit: "cover",
                margin: "0 auto 12px",
                display: "block",
                border: customBgUrl ? "3px solid rgba(255,255,255,0.5)" : undefined,
              }}
            />
          ) : (
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                margin: "0 auto 12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
                fontWeight: 700,
                backgroundColor: theme.accent + "20",
                color: theme.accent,
              }}
            >
              {user.name?.[0]?.toUpperCase() || "?"}
            </div>
          )}
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: customBgUrl ? "#fff" : undefined }}>
            {user.name || "Your Name"}
          </h1>
          {user.bio && (
            <p style={{
              fontSize: 13,
              opacity: 0.8,
              marginTop: 6,
              maxWidth: 280,
              marginLeft: "auto",
              marginRight: "auto",
              color: customBgUrl ? "rgba(255,255,255,0.85)" : undefined,
            }}>
              {user.bio}
            </p>
          )}
        </div>

        {/* Links */}
        <div style={{ maxWidth: 340, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
          {activeLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block",
                width: "100%",
                textAlign: "center",
                padding: "12px 16px",
                background: customBgUrl ? "rgba(255,255,255,0.15)" : theme.button.background,
                color: customBgUrl ? "#fff" : theme.button.color,
                border: customBgUrl ? "1px solid rgba(255,255,255,0.25)" : theme.button.border,
                borderRadius: theme.button.borderRadius,
                backdropFilter: customBgUrl ? "blur(12px)" : theme.button.backdropFilter,
                boxShadow: theme.button.boxShadow,
                textDecoration: "none",
                fontSize: 14,
                fontWeight: 500,
                transition: "transform 0.15s ease",
                cursor: "pointer",
              }}
            >
              {link.title}
            </a>
          ))}

          {activeLinks.length === 0 && (
            <p style={{ textAlign: "center", fontSize: 13, opacity: 0.5, padding: "32px 0" }}>
              No links yet
            </p>
          )}
        </div>

        {/* Branding */}
        {showBranding && (
          <div style={{ textAlign: "center", marginTop: 48, paddingBottom: 16 }}>
            <span style={{ fontSize: 11, opacity: 0.4, color: customBgUrl ? "#fff" : undefined }}>
              Powered by PageDrop
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
