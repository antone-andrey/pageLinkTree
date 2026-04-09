"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

const PLANS = [
  {
    key: "FREE",
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["1 page", "10 links", "Booking", "1 payment button", "3% platform fee"],
  },
  {
    key: "PRO",
    name: "Pro",
    price: "$7",
    period: "/month",
    popular: true,
    features: [
      "Unlimited links",
      "Booking + payments",
      "0% platform fee",
      "Custom backgrounds",
      "Remove branding",
      "Advanced analytics",
      "Custom domain",
    ],
  },
  {
    key: "BUSINESS",
    name: "Business",
    price: "$14",
    period: "/month",
    features: [
      "3 pages",
      "Everything in Pro",
      "Priority support",
      "Team management",
      "API access",
      "White-label branding",
    ],
  },
];

function SettingsContent() {
  const { update } = useSession();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [currentPlan, setCurrentPlan] = useState("FREE");

  useEffect(() => {
    fetch("/api/user")
      .then((r) => r.json())
      .then((u) => {
        setName(u.name || "");
        setUsername(u.username || "");
        setBio(u.bio || "");
        setCurrentPlan(u.plan || "FREE");
      });
  }, []);

  // Show success toast if redirected from Stripe
  useEffect(() => {
    if (searchParams.get("upgraded") === "true") {
      toast.success("🎉 Plan upgraded successfully!");
      // Refresh user data to get updated plan
      fetch("/api/user")
        .then((r) => r.json())
        .then((u) => {
          setCurrentPlan(u.plan || "FREE");
        });
    }
  }, [searchParams]);

  async function handleUpgrade(plan: string) {
    setUpgrading(plan);
    try {
      const res = await fetch("/api/payments/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        toast.error(data.error || "Failed to start upgrade");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setUpgrading(null);
  }

  async function handleManageBilling() {
    try {
      const res = await fetch("/api/payments/portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to open billing portal");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  async function saveSettings() {
    setSaving(true);
    const res = await fetch("/api/user", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, username, bio }),
    });
    if (res.ok) {
      await update({ username });
      toast.success("Settings saved");
    } else {
      const data = await res.json();
      toast.error(data.error || "Failed to save");
    }
    setSaving(false);
  }

  async function handleDeleteAccount() {
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (res.ok) {
        signOut({ callbackUrl: "/" });
      } else {
        toast.error("Failed to delete account");
      }
    } catch {
      toast.error("Something went wrong");
    }
  }

  const planOrder = ["FREE", "PRO", "BUSINESS"];
  const currentPlanIndex = planOrder.indexOf(currentPlan);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">Manage your account and billing.</p>
      </div>

      {/* Profile settings */}
      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h3 className="font-semibold text-gray-900">Profile</h3>
        <Input label="Display name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} />
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            maxLength={300}
          />
        </div>
        <Button onClick={saveSettings} loading={saving}>Save changes</Button>
      </div>

      {/* Plan & Billing */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-semibold text-gray-900">Plan & Billing</h3>
            <p className="text-sm text-gray-500 mt-1">
              Current plan: <span className="font-semibold text-indigo-600">{currentPlan}</span>
            </p>
          </div>
          {currentPlan !== "FREE" && (
            <button
              onClick={handleManageBilling}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Manage billing →
            </button>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          {PLANS.map((plan) => {
            const planIndex = planOrder.indexOf(plan.key);
            const isCurrent = plan.key === currentPlan;
            const isDowngrade = planIndex < currentPlanIndex;
            const isUpgrade = planIndex > currentPlanIndex;

            return (
              <div
                key={plan.key}
                className={`relative rounded-xl border-2 p-5 transition-all ${
                  isCurrent
                    ? "border-indigo-500 bg-indigo-50/50 shadow-md"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 text-[10px] font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-full">
                    POPULAR
                  </span>
                )}

                <h4 className="font-bold text-gray-900">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-extrabold text-gray-900">{plan.price}</span>
                  <span className="text-sm text-gray-500">{plan.period}</span>
                </div>

                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs text-gray-600">
                      <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-indigo-500" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-4">
                  {isCurrent ? (
                    <span className="block text-center py-2 rounded-lg text-sm font-semibold bg-indigo-100 text-indigo-700">
                      Current plan
                    </span>
                  ) : isUpgrade ? (
                    <button
                      onClick={() => handleUpgrade(plan.key)}
                      disabled={upgrading !== null}
                      className="w-full py-2 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {upgrading === plan.key ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Redirecting...
                        </span>
                      ) : (
                        `Upgrade to ${plan.name}`
                      )}
                    </button>
                  ) : isDowngrade ? (
                    <button
                      onClick={handleManageBilling}
                      className="w-full py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Downgrade
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h3 className="font-semibold text-red-600 mb-2">Danger Zone</h3>
        {!showDeleteConfirm ? (
          <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
            Delete account
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-red-600">
              This will permanently delete your account and all data. This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                Yes, delete my account
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-gray-500">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
