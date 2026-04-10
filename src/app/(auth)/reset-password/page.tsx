"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inputClass = "w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 focus:bg-white/[0.07]";
const cardClass = "bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl animate-scale-in";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });

    if (res.ok) {
      setDone(true);
    } else {
      const data = await res.json();
      setError(data.error || "Failed to reset password");
    }
    setLoading(false);
  }

  if (!token) {
    return (
      <div className={`${cardClass} text-center`}>
        <h2 className="text-xl font-semibold text-white mb-2">Invalid link</h2>
        <p className="text-gray-400 text-sm mb-4">This password reset link is invalid or has expired.</p>
        <Link href="/forgot-password" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          Request a new link
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className={`${cardClass} text-center`}>
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Password reset!</h2>
        <p className="text-gray-400 text-sm mb-4">Your password has been updated successfully.</p>
        <Link href="/login">
          <Button variant="gradient">Sign in</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={cardClass}>
      <h2 className="text-xl font-semibold text-white mb-2">Set new password</h2>
      <p className="text-gray-400 text-sm mb-6">Enter your new password below.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">New password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-1">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Type it again"
            required
            className={inputClass}
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <Button type="submit" variant="gradient" className="w-full" loading={loading}>
          Reset password
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className={`${cardClass} text-center text-gray-500`}>Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
