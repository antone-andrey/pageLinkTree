"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputClass = "w-full px-3.5 py-2.5 bg-white/[0.05] border border-white/[0.08] rounded-lg text-sm text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400/50 focus:bg-white/[0.07]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setSent(true);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 text-center shadow-2xl animate-scale-in">
        <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white mb-2">Check your email</h2>
        <p className="text-gray-400 text-sm mb-4">
          If an account exists for {email}, we sent a password reset link.
        </p>
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors">
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-8 shadow-2xl animate-scale-in">
      <h2 className="text-xl font-semibold text-white mb-2">Reset your password</h2>
      <p className="text-gray-400 text-sm mb-6">
        Enter your email and we&apos;ll send you a reset link.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={inputClass}
            placeholder="you@example.com"
          />
        </div>
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <Button type="submit" variant="gradient" className="w-full" loading={loading}>
          Send reset link
        </Button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
