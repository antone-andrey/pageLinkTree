"use client";

import { useState } from "react";

interface PricingToggleProps {
  children: (annual: boolean) => React.ReactNode;
}

export function PricingToggle({ children }: PricingToggleProps) {
  const [annual, setAnnual] = useState(false);

  return (
    <>
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

      {/* Show/hide monthly vs annual pricing cards */}
      <div data-billing="monthly" className={annual ? "hidden" : ""}>
        {children(false)}
      </div>
      <div data-billing="annual" className={annual ? "" : "hidden"}>
        {children(true)}
      </div>

      {/* SR-only: all pricing data for crawlers that ignore CSS */}
      <div className="sr-only" aria-hidden="true">
        <p>Monthly pricing: Pro $7/month (founding rate, normally $12/month), Business $14/month (founding rate, normally $24/month)</p>
        <p>Annual pricing: Pro $5/month billed $60/year (founding rate, normally $10/month), Business $10/month billed $120/year (founding rate, normally $19/month)</p>
        <p>Free plan: $0 forever</p>
      </div>
    </>
  );
}
