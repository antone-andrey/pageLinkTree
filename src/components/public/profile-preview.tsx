import Image from "next/image";
import { Theme } from "@/lib/themes";
import { formatCurrency } from "@/lib/utils";

interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  x?: string;
  youtube?: string;
  onlyfans?: string;
  linkedin?: string;
  pinterest?: string;
  snapchat?: string;
  threads?: string;
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

interface ProfilePreviewProps {
  user: { name: string; bio: string; avatarUrl: string; username: string };
  links: { id: string; title: string; url: string; isActive: boolean }[];
  services?: { id: string; name: string; durationMins: number; price: number; currency: string }[];
  socialLinks?: SocialLinks;
  theme: Theme;
  showBranding?: boolean;
  customBgUrl?: string;
}

function SocialIconRow({ socialLinks, customBgUrl }: { socialLinks: SocialLinks; customBgUrl?: string }) {
  const entries = Object.entries(socialLinks).filter(([, url]) => url && url.trim());
  if (entries.length === 0) return null;

  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
      {entries.map(([key, url]) => {
        const social = SOCIAL_ICONS[key];
        if (!social) return null;
        return (
          <a
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: 36,
              height: 36,
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
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill={customBgUrl ? "#fff" : social.color}
            >
              <path d={social.icon} />
            </svg>
          </a>
        );
      })}
    </div>
  );
}

export function ProfilePreview({ user, links, services = [], socialLinks = {}, theme, showBranding = true, customBgUrl }: ProfilePreviewProps) {
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
        <div style={{ textAlign: "center", paddingTop: 32, paddingBottom: 16 }}>
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
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                color: "#fff",
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

        {/* Social Links */}
        <SocialIconRow socialLinks={socialLinks} customBgUrl={customBgUrl} />

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

          {activeLinks.length === 0 && services.length === 0 && (
            <p style={{ textAlign: "center", fontSize: 13, opacity: 0.5, padding: "32px 0" }}>
              No links yet
            </p>
          )}
        </div>

        {/* Services / Book a Session */}
        {services.length > 0 && (
          <div style={{ maxWidth: 340, margin: "16px auto 0" }}>
            <p style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              opacity: 0.5,
              marginBottom: 10,
              color: customBgUrl ? "rgba(255,255,255,0.6)" : undefined,
            }}>
              Book a Session
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {services.map((service) => (
                <div
                  key={service.id}
                  style={{
                    padding: "12px 14px",
                    background: customBgUrl ? "rgba(255,255,255,0.15)" : theme.button.background,
                    border: customBgUrl ? "1px solid rgba(255,255,255,0.25)" : theme.button.border,
                    borderRadius: theme.button.borderRadius,
                    backdropFilter: customBgUrl ? "blur(12px)" : theme.button.backdropFilter,
                    boxShadow: theme.button.boxShadow,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 13, color: customBgUrl ? "#fff" : theme.button.color }}>
                      {service.name}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: 11, opacity: 0.6, color: customBgUrl ? "rgba(255,255,255,0.7)" : undefined }}>
                      {service.durationMins} min
                    </p>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 13, color: customBgUrl ? "#fff" : theme.button.color }}>
                    {service.price === 0 ? "Free" : formatCurrency(service.price, service.currency)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

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
