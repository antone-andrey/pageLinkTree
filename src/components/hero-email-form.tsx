"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function HeroEmailForm() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const email = new FormData(form).get("email") as string;
    if (email) {
      router.push(`/signup?email=${encodeURIComponent(email)}`);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-1.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm">
      <label htmlFor="hero-email" className="sr-only">Email address</label>
      <input
        id="hero-email"
        type="email"
        name="email"
        placeholder="you@example.com"
        required
        autoComplete="email"
        className="flex-1 px-4 py-3 bg-transparent text-white placeholder-gray-500 text-sm focus:outline-none min-w-0"
      />
      <button
        type="submit"
        className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 transition-all whitespace-nowrap"
      >
        Get started free
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
        </svg>
      </button>
    </form>
  );
}
