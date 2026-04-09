"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

interface Transaction {
  id: string;
  amount: number;
  fee: number;
  currency: string;
  status: string;
  description: string | null;
  createdAt: string;
}

export default function PaymentsPage() {
  const [user, setUser] = useState<{ stripeConnectActive: boolean; plan: string } | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  // Payment button state
  const [payLabel, setPayLabel] = useState("");
  const [payAmount, setPayAmount] = useState("");
  const [payActive, setPayActive] = useState(false);
  const [savingButton, setSavingButton] = useState(false);
  const [buttonLoaded, setButtonLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/user").then((r) => r.json()).then(setUser);

    fetch("/api/page")
      .then((r) => r.json())
      .then((page) => {
        setPayLabel(page.payButtonLabel || "");
        setPayAmount(page.payButtonAmount ? (page.payButtonAmount / 100).toString() : "");
        setPayActive(page.payButtonActive || false);
        setButtonLoaded(true);
      });

    fetch("/api/transactions")
      .then((r) => r.json())
      .then((data) => {
        setTransactions(Array.isArray(data) ? data : []);
        setLoadingTx(false);
      })
      .catch(() => setLoadingTx(false));
  }, []);

  async function connectStripe() {
    const res = await fetch("/api/payments/connect");
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      toast.error(data.error || "Failed to connect Stripe");
    }
  }

  async function savePaymentButton() {
    setSavingButton(true);
    const amountCents = Math.round(parseFloat(payAmount || "0") * 100);
    const res = await fetch("/api/page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        payButtonLabel: payLabel || null,
        payButtonAmount: amountCents || null,
        payButtonActive: payActive && !!payLabel && amountCents > 0,
      }),
    });
    if (res.ok) {
      toast.success("Payment button saved");
    } else {
      toast.error("Failed to save");
    }
    setSavingButton(false);
  }

  function formatAmount(amount: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Payments</h2>
        <p className="text-sm text-gray-500">Connect Stripe and manage your payments.</p>
      </div>

      {/* Stripe Connect */}
      <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Stripe Connect</h3>
        {user?.stripeConnectActive ? (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-lg border border-emerald-100">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-emerald-800">Stripe connected</p>
              <p className="text-xs text-emerald-600">You can receive payments from visitors</p>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Connect your Stripe account to receive payments directly from visitors.
            </p>
            <Button variant="gradient" onClick={connectStripe}>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24"><path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z"/></svg>
              Connect Stripe
            </Button>
          </div>
        )}

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-500">
            Platform fee: {user?.plan === "FREE" ? "3% on all transactions" : "0% (Pro plan)"}
          </p>
        </div>
      </div>

      {/* Payment Button Config */}
      <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Payment Button</h3>
          {buttonLoaded && (
            <label className="flex items-center gap-2 cursor-pointer">
              <span className="text-xs text-gray-500">{payActive ? "Active" : "Inactive"}</span>
              <button
                onClick={() => setPayActive(!payActive)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  payActive ? "bg-indigo-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                    payActive ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </label>
          )}
        </div>

        {!user?.stripeConnectActive ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Connect Stripe first to add a payment button.
          </p>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              Add a payment button to your public page. Visitors can pay you directly.
            </p>
            <Input
              label="Button label"
              placeholder="e.g. Buy me a coffee, Tip me, Support my work"
              value={payLabel}
              onChange={(e) => setPayLabel(e.target.value)}
              maxLength={50}
            />
            <Input
              label="Amount (USD)"
              type="number"
              placeholder="5.00"
              min="0.50"
              step="0.50"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
            />

            {payLabel && payAmount && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {payLabel} — ${parseFloat(payAmount || "0").toFixed(2)}
                </div>
              </div>
            )}

            <Button onClick={savePaymentButton} loading={savingButton}>
              Save payment button
            </Button>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-xl border shadow-sm card-accent-top p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Recent Transactions
          {transactions.length > 0 && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              (showing last {transactions.length})
            </span>
          )}
        </h3>

        {loadingTx ? (
          <div className="text-sm text-gray-400 text-center py-8">Loading...</div>
        ) : transactions.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">
            No transactions yet
          </p>
        ) : (
          <div className="divide-y">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 hover:bg-gray-50/50 -mx-2 px-2 rounded-lg transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {tx.description || "Payment"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(tx.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 font-mono">
                    {formatAmount(tx.amount, tx.currency)}
                  </p>
                  {tx.fee > 0 && (
                    <p className="text-xs text-gray-400">
                      Fee: {formatAmount(tx.fee, tx.currency)}
                    </p>
                  )}
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    tx.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
