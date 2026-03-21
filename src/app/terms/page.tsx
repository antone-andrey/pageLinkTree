import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PageDrop",
  description: "Read the terms and conditions for using the PageDrop platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 mb-8 inline-block">&larr; Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-6">
          <p><strong>Last updated:</strong> March 2026</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">1. Acceptance of Terms</h2>
          <p>By creating an account or using PageDrop, you agree to these terms of service. If you do not agree, please do not use the service.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">2. Description of Service</h2>
          <p>PageDrop provides a link-in-bio platform with built-in booking and payment features. We offer Free, Pro ($12/month), and Business ($24/month) plans.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">3. User Accounts</h2>
          <p>You are responsible for maintaining the security of your account and all activity that occurs under it. You must provide accurate information when creating your account.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">4. Payments and Fees</h2>
          <p>Free plan users are subject to a 3% platform fee on transactions. Pro and Business plan users pay 0% platform fees. Subscription fees are billed monthly and can be cancelled at any time. Payments are processed via Stripe.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">5. Acceptable Use</h2>
          <p>You may not use PageDrop for illegal activities, spam, harassment, or to distribute malware. We reserve the right to suspend accounts that violate these terms.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">6. Intellectual Property</h2>
          <p>You retain ownership of all content you create on PageDrop. By using the service, you grant us a limited license to display your content as part of your public page.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">7. Limitation of Liability</h2>
          <p>PageDrop is provided &ldquo;as is&rdquo; without warranties. We are not liable for indirect, incidental, or consequential damages arising from your use of the service.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">8. Changes to Terms</h2>
          <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">9. Contact</h2>
          <p>For questions about these terms, contact us at support@pagedrop.com.</p>
        </div>
      </div>
    </div>
  );
}
