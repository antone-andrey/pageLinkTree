"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { themes, themeList } from "@/lib/themes";
import { LinkEditor } from "@/components/dashboard/link-editor";
import { ProfilePreview } from "@/components/public/profile-preview";
import toast from "react-hot-toast";

interface Link {
  id: string;
  title: string;
  url: string;
  position: number;
  isActive: boolean;
  clicks: number;
}

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

interface PageData {
  themeId: string;
  isPublished: boolean;
  showBranding: boolean;
  customBgUrl: string | null;
  socialLinks: SocialLinks;
}

interface UserData {
  name: string;
  bio: string;
  avatarUrl: string;
  username: string;
  plan: string;
  brandingRemoved: boolean;
}

export default function PageBuilderPage() {
  const { data: session } = useSession();
  const [links, setLinks] = useState<Link[]>([]);
  const [pageData, setPageData] = useState<PageData>({
    themeId: "default",
    isPublished: false,
    showBranding: true,
    customBgUrl: null,
    socialLinks: {},
  });
  const [services, setServices] = useState<{ id: string; name: string; durationMins: number; price: number; currency: string }[]>([]);
  const [savingSocial, setSavingSocial] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: "",
    bio: "",
    avatarUrl: "",
    username: "",
    plan: "FREE",
    brandingRemoved: false,
  });
  const [mobilePreview, setMobilePreview] = useState(true);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "" });
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [uploadingBg, setUploadingBg] = useState(false);
  const [showBrandingModal, setShowBrandingModal] = useState(false);
  const [purchasingBranding, setPurchasingBranding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const isPro = userData.plan === "PRO" || userData.plan === "BUSINESS";
  const canHideBranding = isPro || userData.brandingRemoved;

  const fetchData = useCallback(async () => {
    const [linksRes, pageRes, userRes, servicesRes] = await Promise.all([
      fetch("/api/links"),
      fetch("/api/page"),
      fetch("/api/user"),
      fetch("/api/services"),
    ]);
    setLinks(await linksRes.json());
    const p = await pageRes.json();
    let parsedSocial: SocialLinks = {};
    try { parsedSocial = p.socialLinks ? JSON.parse(p.socialLinks) : {}; } catch { /* ignore */ }
    setPageData({
      themeId: p.themeId || "default",
      isPublished: p.isPublished || false,
      showBranding: p.showBranding !== false,
      customBgUrl: p.customBgUrl || null,
      socialLinks: parsedSocial,
    });
    setServices(await servicesRes.json());
    const u = await userRes.json();
    setUserData({
      name: u.name || "",
      bio: u.bio || "",
      avatarUrl: u.avatarUrl || "",
      username: u.username || "",
      plan: u.plan || "FREE",
      brandingRemoved: u.brandingRemoved || false,
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─── Avatar ──────────────────────────────────────────────
  async function uploadAvatar(file: File) {
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/avatar", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setUserData((prev) => ({ ...prev, avatarUrl: url }));
        toast.success("Profile image updated");
      } else {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploadingAvatar(false);
  }

  async function removeAvatar() {
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ avatarUrl: null }),
    });
    if (res.ok) {
      setUserData((prev) => ({ ...prev, avatarUrl: "" }));
      toast.success("Profile image removed");
    }
  }

  function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAvatar(file);
    e.target.value = "";
  }

  // ─── Background Image ───────────────────────────────────
  async function uploadBackground(file: File) {
    setUploadingBg(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/background", { method: "POST", body: formData });
      if (res.ok) {
        const { url } = await res.json();
        setPageData((prev) => ({ ...prev, customBgUrl: url }));
        toast.success("Background image updated");
      } else {
        const data = await res.json();
        toast.error(data.error || "Upload failed");
      }
    } catch {
      toast.error("Upload failed");
    }
    setUploadingBg(false);
  }

  async function removeBackground() {
    const res = await fetch("/api/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ customBgUrl: null }),
    });
    if (res.ok) {
      setPageData((prev) => ({ ...prev, customBgUrl: null }));
      toast.success("Background image removed");
    }
  }

  function handleBgSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadBackground(file);
    e.target.value = "";
  }

  // ─── Branding toggle ────────────────────────────────────
  async function toggleBranding() {
    const wantsToHide = pageData.showBranding; // currently showing → wants to hide
    if (wantsToHide && !canHideBranding) {
      // FREE user without one-time purchase: show upgrade modal
      setShowBrandingModal(true);
      return;
    }

    const newVal = !pageData.showBranding;
    const res = await fetch("/api/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ showBranding: newVal }),
    });
    if (res.ok) {
      setPageData((prev) => ({ ...prev, showBranding: newVal }));
      toast.success(newVal ? "Footer enabled" : "Footer hidden");
    }
  }

  async function purchaseBrandingRemoval() {
    setPurchasingBranding(true);
    try {
      const res = await fetch("/api/page/remove-branding", { method: "POST" });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to start checkout");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setPurchasingBranding(false);
  }

  // ─── Links ──────────────────────────────────────────────
  async function addLink() {
    if (!newLink.title || !newLink.url) return;
    setSaving(true);
    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newLink),
    });
    if (res.ok) {
      const link = await res.json();
      setLinks([...links, link]);
      setNewLink({ title: "", url: "" });
      setShowAddLink(false);
      toast.success("Link added");
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to add link");
    }
    setSaving(false);
  }

  async function deleteLink(id: string) {
    await fetch(`/api/links/${id}`, { method: "DELETE" });
    setLinks(links.filter((l) => l.id !== id));
    toast.success("Link deleted");
  }

  async function handleReorder(reorderedLinks: Link[]) {
    setLinks(reorderedLinks);
    await fetch("/api/links/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        links: reorderedLinks.map((l, i) => ({ id: l.id, position: i })),
      }),
    });
  }

  // ─── Page actions ───────────────────────────────────────
  async function togglePublish() {
    const newState = !pageData.isPublished;
    const res = await fetch("/api/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: newState }),
    });
    if (res.ok) {
      setPageData({ ...pageData, isPublished: newState });
      toast.success(newState ? "Page published!" : "Page unpublished");
    }
  }

  async function updateTheme(themeId: string) {
    setPageData({ ...pageData, themeId });
    await fetch("/api/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ themeId }),
    });
  }

  async function saveProfile() {
    setSaving(true);
    await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: userData.name, bio: userData.bio }),
    });
    setSaving(false);
    toast.success("Profile saved");
  }

  function copyLink() {
    navigator.clipboard.writeText(`${window.location.origin}/${userData.username}`);
    toast.success("Link copied!");
  }

  async function saveSocialLinks() {
    setSavingSocial(true);
    // Filter out empty values
    const filtered = Object.fromEntries(
      Object.entries(pageData.socialLinks).filter(([, v]) => v && v.trim())
    );
    await fetch("/api/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ socialLinks: JSON.stringify(filtered) }),
    });
    setSavingSocial(false);
    toast.success("Social links saved");
  }

  const SOCIAL_PLATFORMS = [
    { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname", icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
    { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourname", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
    { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourname", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourname", icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
    { key: "onlyfans", label: "OnlyFans", placeholder: "https://onlyfans.com/yourname", icon: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.6a6.6 6.6 0 110-13.2 6.6 6.6 0 010 13.2zm0-10.2a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2z" },
    { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
    { key: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/yourname", icon: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" },
    { key: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/yourname", icon: "M12.017.512a6.452 6.452 0 014.863 2.028 7.627 7.627 0 011.89 5.07c-.01.38-.04.77-.09 1.17.51.16 1.01.24 1.51.24.36 0 .71-.06.99-.19.14-.06.35-.14.58-.14.2 0 .47.07.64.28.22.26.2.6.04.89-.43.78-1.52 1.23-1.77 1.33-.08.03-.2.08-.24.11.01.08.04.2.07.3a11.45 11.45 0 002.54 4.27c.43.44.96.82 1.55 1.12.33.16.66.28.62.62-.04.32-.4.52-.65.63-.66.28-1.38.42-2.12.46-.11.01-.22.05-.29.17-.09.15-.07.39-.26.7-.16.25-.48.45-1.02.45-.22 0-.47-.03-.75-.09a5.41 5.41 0 00-1.16-.15c-.31 0-.62.03-.92.13a4.56 4.56 0 00-1.57 1.03c-.72.65-1.52 1.02-2.38 1.02s-1.65-.37-2.37-1.02a4.56 4.56 0 00-1.57-1.03c-.3-.1-.61-.13-.92-.13a5.41 5.41 0 00-1.16.15c-.28.06-.53.09-.75.09-.54 0-.86-.2-1.02-.45-.19-.31-.17-.55-.26-.7-.07-.12-.18-.16-.29-.17a5.82 5.82 0 01-2.12-.46c-.25-.11-.61-.31-.65-.63-.04-.34.29-.46.62-.62.59-.3 1.12-.68 1.55-1.12a11.45 11.45 0 002.54-4.27c.03-.1.06-.22.07-.3-.04-.03-.16-.08-.24-.11-.25-.1-1.34-.55-1.77-1.33-.16-.29-.18-.63.04-.89.17-.21.44-.28.64-.28.23 0 .44.08.58.14.28.13.63.19.99.19.5 0 1-.08 1.51-.24-.05-.4-.08-.79-.09-1.17a7.627 7.627 0 011.89-5.07A6.452 6.452 0 0112.017.512z" },
    { key: "threads", label: "Threads", placeholder: "https://threads.net/@yourname", icon: "M16.556 12.346c-.07-.035-.144-.068-.217-.1a7.288 7.288 0 00-.246-.937c-.607-1.768-1.848-2.74-3.497-2.74-.05 0-.101.001-.152.003-1.06.036-1.908.496-2.397 1.263l1.122.764c.353-.528.917-.636 1.299-.649.028-.001.057-.001.085-.001.5 0 .878.187 1.123.556.178.268.295.64.351 1.109a7.992 7.992 0 00-1.59-.086c-2.093.12-3.443 1.356-3.38 3.093.032.871.446 1.62 1.166 2.11.607.413 1.39.612 2.205.56.996-.063 1.776-.438 2.32-1.117.413-.515.677-1.172.799-1.99.478.288.835.667 1.04 1.124.347.775.367 2.048-.658 3.073-.898.899-1.978 1.288-3.6 1.3-1.8-.014-3.162-.594-4.048-1.724-.82-1.047-1.243-2.549-1.258-4.464.015-1.915.439-3.417 1.258-4.464.886-1.13 2.248-1.71 4.048-1.724 1.815.015 3.199.598 4.11 1.733.44.548.775 1.236 1.002 2.049l1.332-.357a7.83 7.83 0 00-1.24-2.542c-1.174-1.465-2.884-2.212-5.084-2.233l-.12-.001c-2.187.021-3.876.775-5.02 2.235C7.454 7.5 6.94 9.295 6.922 11.5l-.001.083c.018 2.205.532 4 1.527 5.332 1.143 1.46 2.832 2.215 5.019 2.235l.12.001c1.944-.015 3.36-.55 4.586-1.735 1.587-1.587 1.535-3.582 1.018-4.737a4.24 4.24 0 00-2.635-2.333zm-2.604 3.859c-.835.052-1.704-.328-1.733-1.122-.021-.578.405-1.224 1.976-1.314.173-.01.343-.015.51-.015.435 0 .843.042 1.218.126-.139 1.823-1.034 2.272-1.971 2.325z" },
  ] as const;

  const theme = themes[pageData.themeId] || themes.default;

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Editor Panel */}
      <div className="w-full lg:w-[45%] space-y-6">
        {/* Actions bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button onClick={togglePublish} variant={pageData.isPublished ? "secondary" : "primary"} size="sm">
            {pageData.isPublished ? "Unpublish" : "Publish"}
          </Button>
          <Button variant="secondary" size="sm" onClick={copyLink}>
            Copy link
          </Button>
          {session?.user?.username && (
            <a href={`/${session.user.username}`} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm">View live page</Button>
            </a>
          )}
        </div>

        {/* Profile section */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Profile</h3>
          <div className="space-y-4">
            {/* Avatar upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Profile image</label>
              <div className="flex items-center gap-4">
                {userData.avatarUrl ? (
                  <Image
                    src={userData.avatarUrl}
                    alt="Avatar"
                    width={64}
                    height={64}
                    unoptimized={userData.avatarUrl.startsWith("data:")}
                    className="rounded-full object-cover ring-2 ring-gray-100"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xl font-bold text-white">
                    {userData.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleAvatarSelect}
                  />
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => fileInputRef.current?.click()}
                    loading={uploadingAvatar}
                  >
                    {userData.avatarUrl ? "Change image" : "Upload image"}
                  </Button>
                  {userData.avatarUrl && (
                    <button onClick={removeAvatar} className="text-xs text-red-500 hover:text-red-700 text-left">
                      Remove image
                    </button>
                  )}
                  <p className="text-xs text-gray-400">JPG, PNG or WebP. Max 5 MB.</p>
                </div>
              </div>
            </div>

            <Input
              label="Display name"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
                value={userData.bio}
                onChange={(e) => setUserData({ ...userData, bio: e.target.value })}
                maxLength={300}
              />
            </div>
            <Button size="sm" onClick={saveProfile} loading={saving}>
              Save profile
            </Button>
          </div>
        </div>

        {/* Links section */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Links</h3>
            <Button size="sm" variant="gradient" onClick={() => setShowAddLink(true)}>Add link</Button>
          </div>

          {showAddLink && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg space-y-2">
              <Input placeholder="Link title" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} />
              <Input placeholder="https://..." value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
              <div className="flex gap-2">
                <Button size="sm" onClick={addLink} loading={saving}>Add</Button>
                <Button size="sm" variant="ghost" onClick={() => setShowAddLink(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {links.length === 0 && !showAddLink ? (
            <p className="text-sm text-gray-400 text-center py-8">Add your first link to get started</p>
          ) : (
            <LinkEditor links={links} onReorder={handleReorder} onDelete={deleteLink} />
          )}
        </div>

        {/* Social Links */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Social Links</h3>
            <Button size="sm" onClick={saveSocialLinks} loading={savingSocial}>Save</Button>
          </div>
          <div className="space-y-3">
            {SOCIAL_PLATFORMS.map((platform) => (
              <div key={platform.key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d={platform.icon} />
                  </svg>
                </div>
                <input
                  type="url"
                  placeholder={platform.placeholder}
                  value={pageData.socialLinks[platform.key as keyof SocialLinks] || ""}
                  onChange={(e) =>
                    setPageData((prev) => ({
                      ...prev,
                      socialLinks: { ...prev.socialLinks, [platform.key]: e.target.value },
                    }))
                  }
                  className="flex-1 px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 focus:bg-white transition-all"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Theme picker */}
        <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Theme</h3>
          <div className="grid grid-cols-4 gap-2.5">
            {themeList.map((t) => (
              <button
                key={t.id}
                onClick={() => updateTheme(t.id)}
                className={`relative p-2.5 rounded-lg border-2 transition-all ${
                  pageData.themeId === t.id
                    ? "border-indigo-600 ring-2 ring-indigo-200 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="w-full h-12 rounded-md mb-1.5" style={{ background: t.preview }} />
                {pageData.themeId === t.id && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <span className="text-[11px] text-gray-600 font-medium">{t.name}</span>
              </button>
            ))}
          </div>

          {/* Custom Background Image — PRO+ only */}
          <div className="mt-5 pt-5 border-t">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">Background image</h4>
              {!isPro && (
                <span className="text-[10px] font-semibold bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                  Pro
                </span>
              )}
            </div>

            {isPro ? (
              <div>
                {pageData.customBgUrl ? (
                  <div className="relative group">
                    <div
                      className="w-full h-24 rounded-lg bg-cover bg-center border"
                      style={{ backgroundImage: `url(${pageData.customBgUrl})` }}
                    />
                    <div className="mt-2 flex gap-2">
                      <input
                        ref={bgInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleBgSelect}
                      />
                      <Button size="sm" variant="secondary" onClick={() => bgInputRef.current?.click()} loading={uploadingBg}>
                        Change
                      </Button>
                      <button onClick={removeBackground} className="text-xs text-red-500 hover:text-red-700">
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <input
                      ref={bgInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={handleBgSelect}
                    />
                    <button
                      onClick={() => bgInputRef.current?.click()}
                      className="w-full h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors flex flex-col items-center justify-center gap-1"
                    >
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-xs text-gray-500">Upload background image</span>
                    </button>
                    <p className="text-xs text-gray-400 mt-1.5">JPG, PNG or WebP. Max 10 MB.</p>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => toast("Upgrade to Pro to use custom backgrounds", { icon: "✨" })}
                className="w-full h-20 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-1 opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs text-gray-500">Upgrade to Pro to unlock</span>
              </button>
            )}
          </div>
        </div>

        {/* ── PageDrop Footer toggle (Linktree-style) ─────────── */}
        <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Lightning icon */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">PageDrop footer</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {pageData.showBranding ? "Showing on your page" : "Hidden from your page"}
                </p>
              </div>
            </div>

            {/* Toggle switch */}
            <button
              onClick={toggleBranding}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                pageData.showBranding ? "bg-indigo-600" : "bg-gray-200"
              }`}
              role="switch"
              aria-checked={pageData.showBranding}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                  pageData.showBranding ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Preview of branding */}
          <div className="px-5 pb-4 pt-0">
            <div className="bg-gray-50 rounded-lg px-4 py-3 flex items-center justify-center">
              <span className={`text-sm font-bold tracking-tight ${pageData.showBranding ? "text-indigo-600" : "text-gray-300 line-through"}`}>
                PageDrop
              </span>
              <span className={`ml-0.5 text-lg ${pageData.showBranding ? "text-indigo-500" : "text-gray-300"}`}>
                *
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Panel */}
      <div className="w-full lg:w-[55%]">
        <div className="sticky top-20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-500">Preview</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                className={`px-3 py-1 text-xs rounded-md ${mobilePreview ? "bg-white shadow-sm" : ""}`}
                onClick={() => setMobilePreview(true)}
              >
                Mobile
              </button>
              <button
                className={`px-3 py-1 text-xs rounded-md ${!mobilePreview ? "bg-white shadow-sm" : ""}`}
                onClick={() => setMobilePreview(false)}
              >
                Desktop
              </button>
            </div>
          </div>

          <div className={`mx-auto ${mobilePreview ? "max-w-[375px]" : "max-w-full"}`}>
            <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-[2rem] p-3 shadow-xl">
              <div className="rounded-[1.25rem] overflow-hidden">
                <ProfilePreview
                  user={userData}
                  links={links}
                  services={services}
                  socialLinks={pageData.socialLinks}
                  theme={theme}
                  showBranding={pageData.showBranding}
                  customBgUrl={pageData.customBgUrl || undefined}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Branding removal modal ──────────────────────────── */}
      {showBrandingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowBrandingModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4 animate-scale-in">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Hide PageDrop branding</h3>
              <p className="text-sm text-gray-500 mt-1">
                Remove the &quot;Powered by PageDrop&quot; footer from your page.
              </p>
            </div>

            <div className="space-y-2">
              {/* Option 1: one-time $5 */}
              <button
                onClick={purchaseBrandingRemoval}
                disabled={purchasingBranding}
                className="w-full p-4 rounded-xl border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50/50 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">One-time payment</p>
                    <p className="text-xs text-gray-500 mt-0.5">Remove branding forever</p>
                  </div>
                  <span className="text-lg font-bold text-indigo-600">$5</span>
                </div>
              </button>

              {/* Option 2: upgrade to Pro */}
              <button
                onClick={() => {
                  setShowBrandingModal(false);
                  window.location.href = "/dashboard/settings";
                }}
                className="w-full p-4 rounded-xl border-2 border-gray-200 hover:border-purple-300 bg-gradient-to-r from-indigo-50 to-purple-50 transition-all text-left"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Upgrade to Pro</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      No branding + custom backgrounds + more
                    </p>
                  </div>
                  <span className="text-sm font-bold text-purple-600">$7/mo</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowBrandingModal(false)}
              className="w-full text-center text-sm text-gray-400 hover:text-gray-600 pt-1"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
