import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy — PageDrop",
  description: "Learn about the cookies and similar technologies used by PageDrop.",
};

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Cookie Policy",
            description: "Learn about the cookies and similar technologies used by PageDrop.",
            dateModified: "2026-04-01",
            publisher: { "@type": "Organization", name: "PageDrop", url: "https://page-drop.com" },
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 mb-8 inline-block">&larr; Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Cookie Policy</h1>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-6">
          <p><strong>Last updated:</strong> April 2026</p>

          <p>This Cookie Policy explains how PageDrop (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), operated at page-drop.com, uses cookies and similar technologies when you visit or use our Service. This policy should be read alongside our <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 underline">Privacy Policy</Link>.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">1. What Are Cookies?</h2>
          <p>Cookies are small text files that are placed on your device (computer, tablet, or smartphone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website operators information about how the site is being used. Cookies can be &ldquo;persistent&rdquo; (remaining on your device until they expire or are deleted) or &ldquo;session&rdquo; cookies (deleted when you close your browser).</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">2. Types of Cookies We Use</h2>

          <h3 className="text-base font-semibold text-gray-800 mt-4">2.1 Essential / Authentication Cookies</h3>
          <p>These cookies are necessary for the Service to function and cannot be disabled. They are used to maintain your logged-in session, remember your authentication state, and ensure the security of your account.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">2.2 Analytics Cookies</h3>
          <p>These cookies help us understand how visitors interact with the Service by collecting information about page views, link clicks, traffic sources, and usage patterns. This data is used to improve the Service and power the analytics dashboard for account holders. Analytics data is aggregated and does not directly identify individual visitors to your pages.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">2.3 Functional / Preference Cookies</h3>
          <p>These cookies allow the Service to remember your preferences and settings, such as your language preference, theme selection, and dashboard layout. They enhance your experience but are not strictly necessary for the Service to function.</p>

          <h3 className="text-base font-semibold text-gray-800 mt-4">2.4 Third-Party Cookies</h3>
          <p>Certain third-party services integrated with PageDrop may set their own cookies:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Google OAuth:</strong> If you sign in with Google, Google may set cookies related to the authentication process. These are governed by <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Google&rsquo;s Privacy Policy</a>.</li>
            <li><strong>Stripe:</strong> When you connect your Stripe account or when visitors make payments through your page, Stripe may set cookies for fraud prevention, authentication, and payment processing. These are governed by <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Stripe&rsquo;s Privacy Policy</a>.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 mt-8">3. Cookie List</h2>
          <p>The following table provides details about the specific cookies used on PageDrop:</p>

          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">Cookie Name</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">Type</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">Purpose</th>
                  <th className="px-4 py-2 text-left font-semibold text-gray-900 border-b border-gray-200">Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">session_token</td>
                  <td className="px-4 py-2 border-b border-gray-100">Essential</td>
                  <td className="px-4 py-2 border-b border-gray-100">Maintains your authenticated session</td>
                  <td className="px-4 py-2 border-b border-gray-100">Session / 30 days</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">csrf_token</td>
                  <td className="px-4 py-2 border-b border-gray-100">Essential</td>
                  <td className="px-4 py-2 border-b border-gray-100">Prevents cross-site request forgery attacks</td>
                  <td className="px-4 py-2 border-b border-gray-100">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">analytics_id</td>
                  <td className="px-4 py-2 border-b border-gray-100">Analytics</td>
                  <td className="px-4 py-2 border-b border-gray-100">Tracks anonymous usage data for page analytics</td>
                  <td className="px-4 py-2 border-b border-gray-100">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">preferences</td>
                  <td className="px-4 py-2 border-b border-gray-100">Functional</td>
                  <td className="px-4 py-2 border-b border-gray-100">Stores your display and dashboard preferences</td>
                  <td className="px-4 py-2 border-b border-gray-100">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">g_state</td>
                  <td className="px-4 py-2 border-b border-gray-100">Third-party (Google)</td>
                  <td className="px-4 py-2 border-b border-gray-100">Google OAuth sign-in state</td>
                  <td className="px-4 py-2 border-b border-gray-100">Session</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">__stripe_mid</td>
                  <td className="px-4 py-2 border-b border-gray-100">Third-party (Stripe)</td>
                  <td className="px-4 py-2 border-b border-gray-100">Stripe fraud prevention and payment processing</td>
                  <td className="px-4 py-2 border-b border-gray-100">1 year</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 border-b border-gray-100 font-mono text-xs">__stripe_sid</td>
                  <td className="px-4 py-2 border-b border-gray-100">Third-party (Stripe)</td>
                  <td className="px-4 py-2 border-b border-gray-100">Stripe session identifier for payment processing</td>
                  <td className="px-4 py-2 border-b border-gray-100">30 minutes</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-lg font-bold text-gray-900 mt-8">4. How to Manage Cookies</h2>
          <p>You can control and manage cookies through your browser settings. Most browsers allow you to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>View which cookies are stored on your device and delete them individually or all at once.</li>
            <li>Block third-party cookies.</li>
            <li>Block cookies from specific websites.</li>
            <li>Block all cookies from being set.</li>
            <li>Delete all cookies when you close your browser.</li>
          </ul>
          <p>Please note that blocking or deleting essential cookies may prevent you from logging in or using certain features of the Service. Below are links to cookie management instructions for popular browsers:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/en-us/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/microsoft-edge/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Microsoft Edge</a></li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 mt-8">5. Consent</h2>
          <p>By continuing to use PageDrop, you consent to the use of cookies as described in this policy. Essential cookies are required for the Service to function and are set regardless of your preferences. For non-essential cookies (analytics, functional, third-party), you can manage your preferences through your browser settings as described above. Where required by applicable law, we will request your explicit consent before placing non-essential cookies.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">6. Updates to This Policy</h2>
          <p>We may update this Cookie Policy from time to time to reflect changes in the cookies we use or for operational, legal, or regulatory reasons. When we make changes, we will update the &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this policy periodically.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">7. Contact Us</h2>
          <p>If you have any questions about our use of cookies or this Cookie Policy, please contact us at:</p>
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
