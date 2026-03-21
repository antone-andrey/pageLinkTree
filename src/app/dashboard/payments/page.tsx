"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
export default function PaymentsPage() {
  const [user, setUser] = useState<{ stripeConnectActive: boolean; plan: string } | null>(null);

  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then(setUser);
  }, []);

  async function connectStripe() {
    const res = await fetch("/api/payments/connect");
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
        <p className="text-sm text-gray-500">Connect Stripe and manage your payments.</p>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Stripe Connect</h3>
        {user?.stripeConnectActive ? (
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm text-green-700">Stripe connected</span>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Connect your Stripe account to receive payments directly from visitors.
            </p>
            <Button onClick={connectStripe}>Connect Stripe</Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            Platform fee: {user?.plan === "FREE" ? "3% on all transactions" : "0% (Pro plan)"}
          </p>
        </div>
      </div>

      {/* Payment button config placeholder */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Payment Button</h3>
        <p className="text-sm text-gray-400 text-center py-8">
          Add a payment button to start earning
        </p>
      </div>

      {/* Transaction history placeholder */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Transactions</h3>
        <p className="text-sm text-gray-400 text-center py-8">
          No transactions yet
        </p>
      </div>
    </div>
  );
}
