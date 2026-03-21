"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { themeList } from "@/lib/themes";

const STEPS = ["Username", "Profile", "Links", "Theme", "Preview"];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

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

  // Step 4: Theme
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

  async function handleNext() {
    if (step === 0 && !usernameAvailable && username !== session?.user?.username) return;

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
      setLoading(true);
      await fetch("/api/page", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ themeId: selectedTheme }),
      });
      setLoading(false);
    }

    if (step === 4) {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Progress bar */}
      <div className="bg-white border-b px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    i <= step
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {i < step ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 sm:w-24 h-0.5 mx-1 ${i < step ? "bg-indigo-600" : "bg-gray-200"}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            {STEPS.map((s) => (
              <span key={s}>{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {step === 0 && (
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose your username</h2>
              <p className="text-gray-500 mb-6">This will be your page URL: pagedrop.com/{username || "..."}</p>

              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                placeholder="your-name"
                className="text-lg"
              />

              <div className="mt-2 text-sm">
                {usernameChecking && <span className="text-gray-400">Checking...</span>}
                {!usernameChecking && usernameAvailable === true && (
                  <span className="text-green-600">Username is available!</span>
                )}
                {!usernameChecking && usernameAvailable === false && (
                  <span className="text-red-600">Username is taken</span>
                )}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Set up your profile</h2>
              <p className="text-gray-500 mb-6">Tell visitors who you are.</p>

              <div className="space-y-4">
                <Input
                  id="displayName"
                  label="Display name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  required
                />
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Bio
                  </label>
                  <textarea
                    id="bio"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="What do you do?"
                    maxLength={300}
                  />
                  <p className="text-xs text-gray-400 mt-1">{bio.length}/300</p>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add your links</h2>
              <p className="text-gray-500 mb-6">Add up to 3 links to get started. You can add more later.</p>

              <div className="space-y-4">
                {links.map((link, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      placeholder="Title"
                      value={link.title}
                      onChange={(e) => updateLink(i, "title", e.target.value)}
                    />
                    <Input
                      placeholder="https://..."
                      value={link.url}
                      onChange={(e) => updateLink(i, "url", e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pick a theme</h2>
              <p className="text-gray-500 mb-6">Choose how your page looks. You can change this anytime.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {themeList.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme.id)}
                    className={`relative p-4 rounded-xl border-2 transition-all ${
                      selectedTheme === theme.id
                        ? "border-indigo-600 ring-2 ring-indigo-200"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className="w-full h-20 rounded-lg mb-2 overflow-hidden"
                      style={{
                        background: theme.preview,
                      }}
                    >
                      <div className="p-2 space-y-1">
                        <div
                          className="h-2 w-8 rounded"
                          style={{
                            background: theme.button.background === 'transparent'
                              ? 'none'
                              : theme.button.background || 'rgba(128,128,128,0.2)',
                            border: theme.button.border || `1px solid ${theme.accent}`,
                            boxShadow: theme.button.boxShadow,
                          }}
                        />
                        <div
                          className="h-2 w-12 rounded"
                          style={{
                            background: theme.button.background === 'transparent'
                              ? 'none'
                              : theme.button.background || 'rgba(128,128,128,0.2)',
                            border: theme.button.border || `1px solid ${theme.accent}`,
                            boxShadow: theme.button.boxShadow,
                          }}
                        />
                        <div
                          className="h-2 w-10 rounded"
                          style={{
                            background: theme.button.background === 'transparent'
                              ? 'none'
                              : theme.button.background || 'rgba(128,128,128,0.2)',
                            border: theme.button.border || `1px solid ${theme.accent}`,
                            boxShadow: theme.button.boxShadow,
                          }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your page is ready!</h2>
              <p className="text-gray-500 mb-4">
                Your page will be live at{" "}
                <span className="font-mono text-indigo-600">pagedrop.com/{username}</span>
              </p>

              <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-700 font-bold">
                    {displayName?.[0]?.toUpperCase() || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{displayName || "Your Name"}</p>
                    <p className="text-sm text-gray-500">{bio || "Your bio"}</p>
                  </div>
                </div>
                {links.filter((l) => l.title).map((link, i) => (
                  <div key={i} className="bg-white border rounded-lg p-3 mb-2 text-center text-sm">
                    {link.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-6">
            {step > 0 ? (
              <Button variant="secondary" onClick={() => setStep(step - 1)}>
                Back
              </Button>
            ) : (
              <div />
            )}

            <div className="flex gap-2">
              {step < 4 && step > 0 && (
                <Button variant="ghost" onClick={() => setStep(step + 1)}>
                  Skip
                </Button>
              )}
              <Button onClick={handleNext} loading={loading}>
                {step === 4 ? "Publish & go to dashboard" : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
