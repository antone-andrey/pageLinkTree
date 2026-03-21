import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PageDrop",
  description: "Learn how PageDrop collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 mb-8 inline-block">&larr; Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-6">
          <p><strong>Last updated:</strong> March 2026</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">1. Information We Collect</h2>
          <p>When you create a PageDrop account, we collect your email address, name, and any profile information you choose to provide. We also collect usage data such as page views, link clicks, and booking activity to power your analytics dashboard.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
          <p>We use your information to provide and improve the PageDrop service, process transactions, send service-related communications, and display analytics. We do not sell your personal data to third parties.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">3. Payments</h2>
          <p>Payments are processed through Stripe Connect. PageDrop does not store your credit card information. Payment data is handled directly by Stripe in accordance with their privacy policy and PCI compliance standards.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">4. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data. All data is transmitted over HTTPS and stored in secure, encrypted databases.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">5. Your Rights</h2>
          <p>You can access, update, or delete your personal data at any time from your account settings. To request complete data deletion, contact us at support@pagedrop.com.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">6. Contact</h2>
          <p>If you have questions about this privacy policy, please contact us at support@pagedrop.com.</p>
        </div>
      </div>
    </div>
  );
}
