import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — PageDrop",
  description: "Learn how PageDrop collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Privacy Policy",
            description: "Learn how PageDrop collects, uses, and protects your personal information.",
            dateModified: "2026-04-01",
            publisher: { "@type": "Organization", name: "PageDrop", url: "https://page-drop.com" },
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 mb-8 inline-block">&larr; Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-6">
          <p><strong>Last updated:</strong> April 2026</p>

          <p>This Privacy Policy describes how PageDrop (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated at page-drop.com, collects, uses, shares, and protects your personal information when you use our link-in-bio platform with booking and payment features (the &ldquo;Service&rdquo;). By using PageDrop, you agree to the practices described in this policy.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">1. Information We Collect</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-4">1.1 Account Information</h3>
          <p>When you create a PageDrop account, we collect your email address, display name, username, and profile information you choose to provide (such as bio text, profile photo, and links). If you sign up using Google OAuth, we receive your name and email address from Google.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">1.2 Usage Data</h3>
          <p>We automatically collect information about how you and your visitors interact with the Service, including page views, link clicks, booking activity, referral sources, browser type, device type, IP address, and timestamps. This data powers the analytics dashboard available to account holders.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">1.3 Payment Data</h3>
          <p>Payments on PageDrop are processed through Stripe Connect. When you connect your Stripe account or when visitors make payments through your page, payment information (such as credit card numbers) is collected and processed directly by Stripe. PageDrop does not store full credit card numbers on its servers. We may receive limited transaction information from Stripe, such as transaction amounts, dates, and the last four digits of a card, for the purpose of displaying transaction history and calculating platform fees.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">1.4 Cookies and Similar Technologies</h3>
          <p>We use cookies and similar technologies to maintain your session, remember your preferences, and collect analytics data. For detailed information about the cookies we use, please refer to our <Link href="/cookies" className="text-indigo-600 hover:text-indigo-700 underline">Cookie Policy</Link>.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">1.5 Communications</h3>
          <p>If you contact us via email or other channels, we collect the content of your messages and any information you voluntarily provide.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide, maintain, and improve the Service</li>
            <li>Create and manage your account</li>
            <li>Process transactions and calculate platform fees</li>
            <li>Display your public profile page to visitors</li>
            <li>Provide analytics and insights about your page performance</li>
            <li>Send service-related communications (account verification, security alerts, billing notifications, and important updates)</li>
            <li>Respond to your support requests and inquiries</li>
            <li>Detect, prevent, and address fraud, abuse, and security issues</li>
            <li>Enforce our Terms of Service and other policies</li>
            <li>Comply with legal obligations</li>
          </ul>
          <p>We do not sell your personal data to third parties. We do not use your personal data for automated decision-making or profiling that produces legal effects.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">3. Data Sharing and Third Parties</h2>
          <p>We share your information only in the following circumstances:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Stripe:</strong> Payment data is shared with Stripe to process transactions via Stripe Connect. Stripe&rsquo;s use of your data is governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Stripe&rsquo;s Privacy Policy</a>.</li>
            <li><strong>Google:</strong> If you use Google OAuth for authentication, limited data is exchanged with Google in accordance with <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Google&rsquo;s Privacy Policy</a>.</li>
            <li><strong>Analytics providers:</strong> We may use third-party analytics services to understand usage patterns and improve the Service.</li>
            <li><strong>Hosting and infrastructure:</strong> Your data is stored and processed using third-party cloud infrastructure providers that maintain appropriate security certifications.</li>
            <li><strong>Legal requirements:</strong> We may disclose your information if required by law, regulation, legal process, or governmental request, or to protect the rights, property, or safety of PageDrop, our users, or the public.</li>
            <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction. We will notify you of any such change.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 mt-8">4. Data Retention</h2>
          <p>We retain your personal data for as long as your account is active or as needed to provide you with the Service. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it for legal, tax, or regulatory purposes (e.g., transaction records may be retained for up to 7 years for tax compliance). Aggregated, anonymized data that cannot identify you may be retained indefinitely for analytical purposes.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">5. Your Rights</h2>
          <p>Depending on your location, you may have the following rights regarding your personal data:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
            <li><strong>Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
            <li><strong>Deletion:</strong> Request deletion of your personal data. You can delete your account at any time from your account settings, or contact us for assistance.</li>
            <li><strong>Data portability:</strong> Request a copy of your data in a structured, machine-readable format.</li>
            <li><strong>Restriction:</strong> Request that we restrict the processing of your data in certain circumstances.</li>
            <li><strong>Objection:</strong> Object to the processing of your data for certain purposes.</li>
            <li><strong>Withdraw consent:</strong> Where processing is based on consent, you may withdraw consent at any time.</li>
          </ul>
          <p>To exercise any of these rights, please contact us at <a href="mailto:support@page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">support@page-drop.com</a>. We will respond to your request within 30 days. If you are located in the European Economic Area and believe we have not adequately addressed your concerns, you have the right to lodge a complaint with your local data protection authority.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">6. Children&rsquo;s Privacy</h2>
          <p>PageDrop is not intended for use by anyone under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected data from a child under 13, we will promptly delete it. If you believe a child under 13 has provided us with personal data, please contact us at <a href="mailto:support@page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">support@page-drop.com</a>.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">7. International Data Transfers</h2>
          <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that are different from the laws of your country. We take appropriate safeguards to ensure that your personal data remains protected in accordance with this Privacy Policy, including the use of standard contractual clauses or other approved transfer mechanisms where required.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">8. Security Measures</h2>
          <p>We implement industry-standard security measures to protect your data, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>All data transmitted between your browser and our servers is encrypted using TLS/HTTPS.</li>
            <li>Passwords are hashed using strong, one-way cryptographic algorithms.</li>
            <li>Access to personal data is restricted to authorized personnel on a need-to-know basis.</li>
            <li>We conduct regular security reviews and monitoring.</li>
            <li>Payment data is handled by Stripe, which is PCI DSS Level 1 certified.</li>
          </ul>
          <p>While we take reasonable precautions, no method of transmission or storage is 100% secure. We cannot guarantee absolute security of your data.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">9. Cookies</h2>
          <p>We use cookies and similar technologies for session management, authentication, analytics, and user preferences. For a full breakdown of the cookies we use and how to manage them, please see our <Link href="/cookies" className="text-indigo-600 hover:text-indigo-700 underline">Cookie Policy</Link>.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">10. Third-Party Links</h2>
          <p>Your PageDrop page may contain links to third-party websites. We are not responsible for the privacy practices of those websites. We encourage you to review the privacy policies of any third-party sites you visit.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">11. Changes to This Policy</h2>
          <p>We may update this Privacy Policy from time to time. When we make material changes, we will notify you by updating the &ldquo;Last updated&rdquo; date at the top of this page and, where appropriate, by sending you an email notification. Your continued use of the Service after any changes constitutes your acceptance of the updated policy.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">12. Contact Us</h2>
          <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us at:</p>
          <p>
            PageDrop<br />
            Email: <a href="mailto:support@page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">support@page-drop.com</a><br />
            Website: <a href="https://page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">page-drop.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
