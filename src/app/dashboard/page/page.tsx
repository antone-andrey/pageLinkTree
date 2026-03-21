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

interface PageData {
  themeId: string;
  isPublished: boolean;
  showBranding: boolean;
  customBgUrl: string | null;
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
  });
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
    const [linksRes, pageRes, userRes] = await Promise.all([
      fetch("/api/links"),
      fetch("/api/page"),
      fetch("/api/user"),
    ]);
    setLinks(await linksRes.json());
    const p = await pageRes.json();
    setPageData({
      themeId: p.themeId || "default",
      isPublished: p.isPublished || false,
      showBranding: p.showBranding !== false,
      customBgUrl: p.customBgUrl || null,
    });
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
    const res = await fetch("/api/page/remove-branding", { method: "POST" });
    if (res.ok) {
      setUserData((prev) => ({ ...prev, brandingRemoved: true }));
      setPageData((prev) => ({ ...prev, showBranding: false }));
      setShowBrandingModal(false);
      toast.success("Branding removed! Footer is now hidden.");
    } else {
      const data = await res.json();
      toast.error(data.error || "Payment failed");
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
        <div className="bg-white rounded-xl border p-6">
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
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: theme.accent + "20", color: theme.accent }}
                  >
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
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Links</h3>
            <Button size="sm" onClick={() => setShowAddLink(true)}>Add link</Button>
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

        {/* Theme picker */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Theme</h3>
          <div className="grid grid-cols-4 gap-2">
            {themeList.map((t) => (
              <button
                key={t.id}
                onClick={() => updateTheme(t.id)}
                className={`p-2.5 rounded-lg border-2 transition-all ${
                  pageData.themeId === t.id
                    ? "border-indigo-600 ring-1 ring-indigo-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="w-full h-10 rounded-md mb-1.5" style={{ background: t.preview }} />
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
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Lightning icon */}
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
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
            <div className="bg-gray-200 rounded-2xl p-2 shadow-inner">
              <div className="rounded-xl overflow-hidden">
                <ProfilePreview
                  user={userData}
                  links={links}
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
          <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-4">
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
                  <span className="text-sm font-bold text-purple-600">$12/mo</span>
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
