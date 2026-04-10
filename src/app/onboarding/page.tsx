"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { themeList } from "@/lib/themes";
import { getPlanLimits } from "@/lib/plan-limits";

const STEPS = [
  { key: "username", label: "Username", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { key: "profile", label: "Profile", icon: "M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" },
  { key: "links", label: "Links", icon: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" },
  { key: "social", label: "Socials", icon: "M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" },
  { key: "theme", label: "Theme", icon: "M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" },
  { key: "launch", label: "Launch", icon: "M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-6.233 0c-1.596 1.596-1.964 6.233-1.964 6.233s4.637-.368 6.233-1.964a4.493 4.493 0 000-6.233" },
];

const SOCIAL_PLATFORMS = [
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourname", icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourname", icon: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
  { key: "x", label: "X (Twitter)", placeholder: "https://x.com/yourname", icon: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourname", icon: "M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourname", icon: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourname", icon: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
  { key: "onlyfans", label: "OnlyFans", placeholder: "https://onlyfans.com/yourname", icon: "M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 18.6a6.6 6.6 0 110-13.2 6.6 6.6 0 010 13.2zm0-10.2a3.6 3.6 0 100 7.2 3.6 3.6 0 000-7.2z" },
  { key: "pinterest", label: "Pinterest", placeholder: "https://pinterest.com/yourname", icon: "M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" },
];

interface SocialLinks {
  [key: string]: string;
}

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  // Step 1: Username
  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  // Step 2: Profile
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  // Step 3: Links
  const [links, setLinks] = useState([
    { title: "", url: "" },
    { title: "", url: "" },
    { title: "", url: "" },
  ]);

  // Step 4: Social Links
  const [socialLinks, setSocialLinks] = useState<SocialLinks>({});

  // Step 5: Theme
  const [selectedTheme, setSelectedTheme] = useState("default");

  useEffect(() => {
    if (session?.user?.name) setDisplayName(session.user.name);
    if (session?.user?.username) setUsername(session.user.username);
  }, [session]);

  const checkUsername = useCallback(async (value: string) => {
    if (value.length < 3) {
      setUsernameAvailable(null);
      return;
    }
    setUsernameChecking(true);
    try {
      const res = await fetch(`/api/username/check?username=${value}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch {
      setUsernameAvailable(null);
    }
    setUsernameChecking(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) checkUsername(username);
    }, 500);
    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  function goForward() {
    setDirection("forward");
  }

  function goBack() {
    setDirection("back");
    setStep(step - 1);
  }

  async function handleNext() {
    if (step === 0 && !usernameAvailable && username !== session?.user?.username) return;

    goForward();

    if (step === 0) {
      setLoading(true);
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.toLowerCase() }),
      });
      setLoading(false);
    }

    if (step === 1) {
      setLoading(true);
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: displayName, bio }),
      });
      setLoading(false);
    }

    if (step === 2) {
      setLoading(true);
      const validLinks = links.filter((l) => l.title && l.url);
      for (const link of validLinks) {
        await fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(link),
        });
      }
      setLoading(false);
    }

    if (step === 3) {
      // Save social links
      setLoading(true);
      const filtered = Object.fromEntries(
        Object.entries(socialLinks).filter(([, v]) => v && v.trim())
      );
      if (Object.keys(filtered).length > 0) {
        await fetch("/api/page", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ socialLinks: JSON.stringify(filtered) }),
        });
      }
      setLoading(false);
    }

    if (step === 4) {
      setLoading(true);
      await fetch("/api/page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId: selectedTheme }),
      });
      setLoading(false);
    }

    if (step === 5) {
      setLoading(true);
      await fetch("/api/page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublished: true }),
      });
      await fetch("/api/user", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ onboardingComplete: true }),
      });
      await update({ onboardingComplete: true, username });
      router.push("/dashboard");
      return;
    }

    setStep(step + 1);
  }

  function updateLink(index: number, field: "title" | "url", value: string) {
    const updated = [...links];
    updated[index] = { ...updated[index], [field]: value };
    setLinks(updated);
  }

  const progress = ((step + 1) / STEPS.length) * 100;

  const inputClasses =
    "w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 focus:bg-white/[0.07]";

  return (
    <div className="min-h-screen auth-bg relative overflow-hidden flex flex-col">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-indigo-500/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-20 right-[10%] w-80 h-80 bg-pink-500/10 rounded-full blur-[120px] animate-pulse-glow delay-300" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-500/5 rounded-full blur-[150px]" />

      {/* Top bar */}
      <div className="relative z-10 px-6 py-5">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Logo size="md" variant="full" theme="dark" />
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">Step {step + 1} of {STEPS.length}</span>
            <div className="w-32 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, #f472b6, #c084fc, #818cf8)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Step indicators */}
      <div className="relative z-10 px-6 mb-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between">
            {STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500 ${
                      i < step
                        ? "bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20"
                        : i === step
                        ? "bg-white/[0.1] border-2 border-indigo-400/60 shadow-lg shadow-indigo-500/10"
                        : "bg-white/[0.04] border border-white/[0.08]"
                    }`}
                  >
                    {i < step ? (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg
                        className={`w-4 h-4 transition-colors duration-300 ${
                          i === step ? "text-indigo-300" : "text-gray-600"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={s.icon} />
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-medium transition-colors duration-300 hidden sm:block ${
                      i <= step ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-8 sm:w-16 lg:w-24 h-px mx-1 sm:mx-2 mb-5 sm:mb-0">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        i < step
                          ? "bg-gradient-to-r from-indigo-500 to-violet-500"
                          : "bg-white/[0.06]"
                      }`}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg">
          <div
            key={step}
            className={`${direction === "forward" ? "animate-fade-up" : "animate-scale-in"}`}
          >
            {/* Step 0: Username */}
            {step === 0 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Claim your unique URL</h2>
                <p className="text-sm text-gray-400 mb-6">
                  This is your personal page address.{" "}
                  <span className="text-indigo-400 font-mono text-xs">page-drop.com/{username || "..."}</span>
                </p>

                <div className="relative">
                  <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
                    <span className="text-sm text-gray-500">page-drop.com/</span>
                  </div>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    placeholder="your-name"
                    className={`${inputClasses} pl-[130px]`}
                  />
                </div>

                <div className="mt-3 flex items-center gap-2 min-h-[24px]">
                  {usernameChecking && (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-gray-500">Checking availability...</span>
                    </div>
                  )}
                  {!usernameChecking && usernameAvailable === true && (
                    <div className="flex items-center gap-2 animate-scale-in">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-xs text-emerald-400 font-medium">Available!</span>
                    </div>
                  )}
                  {!usernameChecking && usernameAvailable === false && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </div>
                      <span className="text-xs text-red-400 font-medium">Username is taken</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Tell us about yourself</h2>
                <p className="text-sm text-gray-400 mb-6">This is what visitors see when they land on your page.</p>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Display name</label>
                    <input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your Name"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Bio</label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="What do you do? Keep it short and sweet."
                      maxLength={300}
                      className={`${inputClasses} resize-none`}
                    />
                    <div className="flex justify-end mt-1.5">
                      <span className={`text-xs ${bio.length > 280 ? "text-amber-400" : "text-gray-600"}`}>
                        {bio.length}/300
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Links */}
            {step === 2 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Add your links</h2>
                <p className="text-sm text-gray-400 mb-6">Add up to 3 links to get started. You can always add more later.</p>

                <div className="space-y-3">
                  {links.map((link, i) => (
                    <div
                      key={i}
                      className="bg-white/[0.03] rounded-xl border border-white/[0.06] p-4 space-y-2.5 transition-all hover:border-white/[0.1]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-indigo-500/30 to-violet-500/30 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-indigo-300">{i + 1}</span>
                        </div>
                        <span className="text-xs text-gray-500">Link {i + 1}</span>
                      </div>
                      <input
                        placeholder="Title (e.g. My Website)"
                        value={link.title}
                        onChange={(e) => updateLink(i, "title", e.target.value)}
                        className={inputClasses}
                      />
                      <input
                        placeholder="https://..."
                        value={link.url}
                        onChange={(e) => updateLink(i, "url", e.target.value)}
                        className={inputClasses}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Social Links */}
            {step === 3 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Connect your socials</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Add your social profiles so visitors can find you everywhere.
                  <span className="text-indigo-400"> This step is optional.</span>
                </p>

                {(() => {
                  const limits = getPlanLimits("FREE");
                  const filledCount = Object.values(socialLinks).filter((v) => v && v.trim()).length;
                  return (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500">{filledCount}/{limits.socialLinks} social links</span>
                        {filledCount >= limits.socialLinks && (
                          <span className="text-[10px] font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-2 py-0.5 rounded-full">
                            Upgrade for more
                          </span>
                        )}
                      </div>
                      <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
                        {SOCIAL_PLATFORMS.map((platform) => {
                          const currentValue = socialLinks[platform.key] || "";
                          const isFilledSlot = currentValue.trim().length > 0;
                          const atLimit = filledCount >= limits.socialLinks && !isFilledSlot;
                          return (
                            <div
                              key={platform.key}
                              className={`flex items-center gap-3 group ${atLimit ? "opacity-40" : ""}`}
                            >
                              <div className={`w-9 h-9 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center flex-shrink-0 transition-all ${atLimit ? "" : "group-focus-within:border-indigo-500/30 group-focus-within:bg-indigo-500/10"}`}>
                                <svg className={`w-4 h-4 transition-colors ${atLimit ? "text-gray-600" : "text-gray-400 group-focus-within:text-indigo-400"}`} fill="currentColor" viewBox="0 0 24 24">
                                  <path d={platform.icon} />
                                </svg>
                              </div>
                              <input
                                type="url"
                                placeholder={atLimit ? "Upgrade to Pro for more" : platform.placeholder}
                                disabled={atLimit}
                                value={currentValue}
                                onChange={(e) =>
                                  setSocialLinks((prev) => ({ ...prev, [platform.key]: e.target.value }))
                                }
                                className={`${inputClasses} flex-1 ${atLimit ? "cursor-not-allowed opacity-60" : ""}`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            )}

            {/* Step 4: Theme */}
            {step === 4 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center mb-5">
                  <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">Pick your style</h2>
                <p className="text-sm text-gray-400 mb-6">Choose a theme for your page. You can always change it later.</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {themeList.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`relative p-3 rounded-xl border-2 transition-all duration-300 group ${
                        selectedTheme === theme.id
                          ? "border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10"
                          : "border-white/[0.06] hover:border-white/[0.15] hover:bg-white/[0.03]"
                      }`}
                    >
                      <div
                        className="w-full h-16 rounded-lg mb-2 overflow-hidden"
                        style={{ background: theme.preview }}
                      >
                        <div className="p-2 space-y-1">
                          <div
                            className="h-1.5 w-8 rounded"
                            style={{
                              background: theme.button.background === "transparent" ? "none" : theme.button.background || "rgba(128,128,128,0.2)",
                              border: theme.button.border || `1px solid ${theme.accent}`,
                            }}
                          />
                          <div
                            className="h-1.5 w-12 rounded"
                            style={{
                              background: theme.button.background === "transparent" ? "none" : theme.button.background || "rgba(128,128,128,0.2)",
                              border: theme.button.border || `1px solid ${theme.accent}`,
                            }}
                          />
                          <div
                            className="h-1.5 w-10 rounded"
                            style={{
                              background: theme.button.background === "transparent" ? "none" : theme.button.background || "rgba(128,128,128,0.2)",
                              border: theme.button.border || `1px solid ${theme.accent}`,
                            }}
                          />
                        </div>
                      </div>
                      <span className={`text-xs font-medium transition-colors ${selectedTheme === theme.id ? "text-indigo-300" : "text-gray-500"}`}>
                        {theme.name}
                      </span>
                      {selectedTheme === theme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Launch */}
            {step === 5 && (
              <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl text-center">
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full opacity-20 blur-xl animate-pulse-glow" />
                  <div className="relative w-20 h-20 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center shadow-xl shadow-indigo-500/20">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-6.233 0c-1.596 1.596-1.964 6.233-1.964 6.233s4.637-.368 6.233-1.964a4.493 4.493 0 000-6.233" />
                    </svg>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">Ready for launch!</h2>
                <p className="text-sm text-gray-400 mb-6">
                  Your page will be live at{" "}
                  <span className="text-gradient-brand font-mono font-semibold">page-drop.com/{username}</span>
                </p>

                {/* Mini preview */}
                <div className="bg-white/[0.04] rounded-2xl border border-white/[0.06] p-6 mb-2 text-left max-w-sm mx-auto">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {displayName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-white text-sm">{displayName || "Your Name"}</p>
                      {bio && <p className="text-xs text-gray-500 line-clamp-1">{bio}</p>}
                    </div>
                  </div>

                  {/* Social icons row */}
                  {Object.entries(socialLinks).some(([, v]) => v?.trim()) && (
                    <div className="flex gap-2 mb-3">
                      {Object.entries(socialLinks).filter(([, v]) => v?.trim()).map(([key]) => {
                        const platform = SOCIAL_PLATFORMS.find((p) => p.key === key);
                        if (!platform) return null;
                        return (
                          <div key={key} className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d={platform.icon} />
                            </svg>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {links.filter((l) => l.title).length > 0 ? (
                    links.filter((l) => l.title).map((link, i) => (
                      <div
                        key={i}
                        className="bg-white/[0.06] border border-white/[0.06] rounded-lg p-2.5 mb-2 text-center text-xs text-gray-300 font-medium"
                      >
                        {link.title}
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-600 text-center py-2">No links added yet</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <button
                onClick={goBack}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/[0.05] transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {step > 0 && step < 5 && (
                <button
                  onClick={() => { goForward(); setStep(step + 1); }}
                  className="px-4 py-2.5 text-sm text-gray-500 hover:text-gray-300 rounded-lg hover:bg-white/[0.04] transition-all"
                >
                  Skip
                </button>
              )}
              <Button
                variant="gradient"
                onClick={handleNext}
                loading={loading}
                disabled={step === 0 && !usernameAvailable && username !== session?.user?.username}
              >
                {step === 5 ? (
                  <span className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58" />
                    </svg>
                    Launch my page
                  </span>
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 px-6 py-4 text-center">
        <p className="text-xs text-gray-600">&copy; {new Date().getFullYear()} PageDrop. All rights reserved.</p>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
