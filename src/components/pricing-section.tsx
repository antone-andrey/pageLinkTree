"use client";

import { useState } from "react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    monthlyPrice: 0,
    annualPrice: 0,
    period: "forever",
    desc: "Everything you need to get started.",
    features: ["1 page", "10 links", "Booking", "1 payment button", "3% platform fee"],
  },
  {
    name: "Pro",
    monthlyPrice: 12,
    annualPrice: 10,
    period: "/month",
    desc: "For creators who mean business.",
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
    name: "Business",
    monthlyPrice: 24,
    annualPrice: 19,
    period: "/month",
    desc: "For teams and power users.",
    features: [
      "3 pages",
      "Everything in Pro",
      "Priority support",
      "Team management",
      "API access",
      "White-label branding",
      "Export analytics data",
    ],
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="relative max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-10">
        <p className="text-sm font-semibold text-indigo-400 tracking-wide uppercase mb-3">Pricing</p>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-gray-500">Start free. Upgrade when you&apos;re ready.</p>
      </div>

      {/* Annual/Monthly toggle */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <span className={`text-sm transition-colors ${!annual ? "text-white font-semibold" : "text-gray-500"}`}>
          Monthly
        </span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-[#0a0a0f] ${
            annual ? "bg-indigo-600" : "bg-white/10"
          }`}
          role="switch"
          aria-checked={annual}
          aria-label="Toggle annual billing"
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
              annual ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span className={`text-sm transition-colors ${annual ? "text-white font-semibold" : "text-gray-500"}`}>
          Annual
          <span className="ml-1.5 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Save 20%
          </span>
        </span>
      </div>

      <div className="grid md:grid-cols-3 gap-5">
        {plans.map((plan) => {
          const price = plan.monthlyPrice === 0 ? 0 : annual ? plan.annualPrice : plan.monthlyPrice;
          const billedText =
            plan.monthlyPrice === 0 ? null : annual ? `Billed $${price * 12}/year` : null;

          return (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "bg-gradient-to-b from-indigo-500/[0.08] to-transparent border border-indigo-500/20 shadow-2xl shadow-indigo-500/5"
                  : "bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12]"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-gradient-to-r from-indigo-500 to-violet-500 text-white px-3 py-1 rounded-full shadow-lg shadow-indigo-500/30">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Most popular
                  </span>
                </div>
              )}

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="text-sm mt-1 text-gray-500">{plan.desc}</p>

              <div className="mt-5 flex items-baseline gap-1">
                <span className="text-4xl font-extrabold tracking-tight text-white">
                  ${price}
                </span>
                <span className="text-sm text-gray-500">
                  {plan.monthlyPrice === 0 ? "forever" : "/month"}
                </span>
              </div>

              {annual && plan.monthlyPrice > 0 && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm line-through text-gray-600">
                    ${plan.monthlyPrice}/mo
                  </span>
                  {billedText && (
                    <span className="text-xs text-gray-600">
                      {billedText}
                    </span>
                  )}
                </div>
              )}

              <div className="my-6 h-px bg-white/[0.06]" />

              <ul className="space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                    <svg className="w-4 h-4 flex-shrink-0 text-indigo-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/signup"
                className={`block text-center mt-7 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  plan.popular
                    ? "bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/20"
                    : "bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.08]"
                }`}
              >
                {plan.monthlyPrice === 0 ? "Get started free" : "Start free trial"}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
