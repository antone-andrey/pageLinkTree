import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — PageDrop",
  description: "Read the terms and conditions for using the PageDrop platform.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Terms of Service",
            description: "Read the terms and conditions for using the PageDrop platform.",
            dateModified: "2026-04-01",
            publisher: { "@type": "Organization", name: "PageDrop", url: "https://page-drop.com" },
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 mb-8 inline-block">&larr; Back to home</Link>
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose prose-gray max-w-none text-sm text-gray-600 space-y-6">
          <p><strong>Last updated:</strong> April 2026</p>

          <p>These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of PageDrop (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), a link-in-bio platform with booking and payment features operated at page-drop.com (the &ldquo;Service&rdquo;). Please read these Terms carefully before using the Service.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">1. Acceptance of Terms</h2>
          <p>By creating an account, accessing, or using PageDrop, you agree to be bound by these Terms, our <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700 underline">Privacy Policy</Link>, and our <Link href="/cookies" className="text-indigo-600 hover:text-indigo-700 underline">Cookie Policy</Link>. If you do not agree to all of these Terms, you may not use the Service. If you are using the Service on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">2. Eligibility</h2>
          <p>You must be at least 13 years of age to use PageDrop. If you are between 13 and 18 years of age, you may only use the Service with the consent and supervision of a parent or legal guardian who agrees to be bound by these Terms. By using the Service, you represent and warrant that you meet these eligibility requirements.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">3. Account Responsibilities</h2>
          <p>When you create an account, you agree to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide accurate, current, and complete information during registration.</li>
            <li>Maintain and promptly update your account information as necessary.</li>
            <li>Keep your password secure and confidential.</li>
            <li>Accept responsibility for all activity that occurs under your account.</li>
            <li>Notify us immediately at <a href="mailto:support@page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">support@page-drop.com</a> if you suspect unauthorized access to your account.</li>
          </ul>
          <p>You may not transfer your account to another person or use another person&rsquo;s account without permission. We reserve the right to suspend or terminate accounts that contain inaccurate information or violate these Terms.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">4. Description of Service</h2>
          <p>PageDrop is a link-in-bio platform that allows users to create a customizable public page with links, booking capabilities, and payment collection. The Service includes a dashboard for managing your page, viewing analytics, configuring bookings, and tracking transactions. Features may vary by plan and may be modified over time.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">5. Plans, Pricing, and Fees</h2>
          <p>PageDrop offers the following plans:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Free ($0/month):</strong> Access to core features with a 3% platform fee on all transactions processed through your page.</li>
            <li><strong>Pro ($7/month founding price, $12/month regular price):</strong> Enhanced features with 0% platform fee on transactions.</li>
            <li><strong>Business ($14/month founding price, $24/month regular price):</strong> Full feature set with 0% platform fee on transactions.</li>
          </ul>
          <p>Founding prices are available to early subscribers and are locked in for the duration of their continuous subscription. We reserve the right to modify pricing for new subscribers with 30 days&rsquo; advance notice.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">6. Billing and Refunds</h2>
          <p>Paid subscriptions are billed monthly in advance through Stripe. By subscribing to a paid plan, you authorize us to charge your payment method on a recurring monthly basis until you cancel.</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period.</li>
            <li>We do not provide refunds for partial months. If you cancel mid-cycle, you will retain access to paid features until the end of your current billing period.</li>
            <li>If you downgrade from a paid plan to the Free plan, the 3% platform fee will apply to transactions from the start of your next billing cycle.</li>
            <li>We reserve the right to suspend your account if a payment fails and is not resolved within 7 days.</li>
          </ul>
          <p>Transaction fees collected via the platform fee are non-refundable. For disputes about payments made through your page by visitors or clients, you should work directly with Stripe and the paying party, as those funds are processed through your connected Stripe account.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">7. Payments via Stripe Connect</h2>
          <p>PageDrop uses Stripe Connect to facilitate payments between you and your visitors or clients. When you enable payments on your page, funds from transactions go directly to your connected Stripe account. By using this feature, you agree to comply with <a href="https://stripe.com/legal/connect-account" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-700 underline">Stripe&rsquo;s Connected Account Agreement</a> and all applicable Stripe policies. PageDrop is not a party to the transactions between you and your visitors, and we do not hold or control the funds at any point.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">8. Acceptable Use Policy</h2>
          <p>You agree not to use PageDrop for any purpose that is unlawful or prohibited by these Terms. Specifically, you must not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong>Illegal activity:</strong> Use the Service for any activity that violates local, state, national, or international law or regulation.</li>
            <li><strong>Spam and bulk messaging:</strong> Use the Service to send unsolicited messages, chain letters, or bulk communications.</li>
            <li><strong>Malware and harmful code:</strong> Upload, distribute, or link to viruses, malware, spyware, or any other harmful software.</li>
            <li><strong>Harassment and abuse:</strong> Use the Service to harass, threaten, intimidate, bully, stalk, or otherwise harm other individuals.</li>
            <li><strong>Hate speech:</strong> Publish content that promotes violence, discrimination, or hatred against individuals or groups based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics.</li>
            <li><strong>Adult content on Free tier:</strong> Host sexually explicit or pornographic content on Free plan pages. Adult content may be permitted on paid plans in compliance with applicable law, provided it is appropriately labeled.</li>
            <li><strong>Impersonation:</strong> Impersonate any person or entity, or falsely state or misrepresent your affiliation with any person or entity.</li>
            <li><strong>Fraud and deception:</strong> Use the Service for phishing, scams, or any form of fraudulent activity.</li>
            <li><strong>Intellectual property infringement:</strong> Upload or share content that infringes on the copyrights, trademarks, or other intellectual property rights of others.</li>
            <li><strong>System abuse:</strong> Attempt to gain unauthorized access to the Service, other accounts, or systems; interfere with the proper functioning of the Service; or use automated tools to scrape or extract data.</li>
            <li><strong>Prohibited goods and services:</strong> Use the Service to sell or promote illegal drugs, weapons, counterfeit goods, or any other prohibited items.</li>
          </ul>
          <p>We reserve the right to investigate and take appropriate action, including removing content and suspending or terminating accounts, for violations of this policy at our sole discretion.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">9. Content Ownership and License Grant</h2>
          <p>You retain full ownership of all content you create, upload, or publish on PageDrop (&ldquo;Your Content&rdquo;). By using the Service, you grant us a non-exclusive, worldwide, royalty-free, sublicensable license to use, display, reproduce, and distribute Your Content solely for the purpose of operating and providing the Service (e.g., rendering your public page, displaying your profile to visitors, generating thumbnails). This license terminates when you delete Your Content or your account, except where Your Content has been shared with others and they have not deleted it.</p>
          <p>You represent and warrant that you own or have the necessary rights to all content you publish on PageDrop, and that Your Content does not violate the rights of any third party.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">10. DMCA and Content Takedown</h2>
          <p>We respect the intellectual property rights of others. If you believe that content on PageDrop infringes your copyright, you may submit a takedown notice to <a href="mailto:support@page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">support@page-drop.com</a> with the following information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Identification of the copyrighted work you claim has been infringed.</li>
            <li>Identification of the infringing material and its location on the Service.</li>
            <li>Your contact information (name, address, email, phone).</li>
            <li>A statement that you have a good faith belief that the use is not authorized by the copyright owner.</li>
            <li>A statement, under penalty of perjury, that the information in your notice is accurate and that you are the copyright owner or authorized to act on behalf of the owner.</li>
            <li>Your physical or electronic signature.</li>
          </ul>
          <p>We will process valid takedown notices and may remove or disable access to the allegedly infringing content. Repeat infringers may have their accounts terminated.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">11. Termination</h2>
          <p>You may terminate your account at any time by deleting it from your account settings or by contacting us. We may suspend or terminate your account at any time, with or without notice, for conduct that we determine, in our sole discretion, violates these Terms, is harmful to other users, or is otherwise objectionable. Upon termination:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Your right to access and use the Service will immediately cease.</li>
            <li>Your public page will be taken offline.</li>
            <li>We will delete your personal data in accordance with our Privacy Policy.</li>
            <li>Outstanding platform fees owed to us remain payable.</li>
            <li>Provisions of these Terms that by their nature should survive termination (including limitations of liability, indemnification, and dispute resolution) will survive.</li>
          </ul>

          <h2 className="text-lg font-bold text-gray-900 mt-8">12. Disclaimers</h2>
          <p>THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR STATUTORY, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE, OR THAT ANY DEFECTS WILL BE CORRECTED. YOUR USE OF THE SERVICE IS AT YOUR SOLE RISK.</p>
          <p>We do not endorse, guarantee, or assume responsibility for any content created by users or any transactions between users and their visitors or clients.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">13. Limitation of Liability</h2>
          <p>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL PAGEDROP, ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY.</p>
          <p>OUR TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU HAVE PAID TO PAGEDROP IN THE TWELVE (12) MONTHS IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE CLAIM, OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">14. Indemnification</h2>
          <p>You agree to indemnify, defend, and hold harmless PageDrop and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys&rsquo; fees) arising out of or related to: (a) your use of the Service; (b) Your Content; (c) your violation of these Terms; (d) your violation of any third-party rights; or (e) transactions between you and your visitors or clients facilitated through the Service.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">15. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to its conflict of law provisions. Any legal action or proceeding arising under these Terms shall be brought exclusively in the federal or state courts located in Delaware, and you consent to personal jurisdiction and venue in such courts.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">16. Dispute Resolution</h2>
          <p>Before initiating any formal legal proceedings, you agree to first attempt to resolve any dispute informally by contacting us at <a href="mailto:support@page-drop.com" className="text-indigo-600 hover:text-indigo-700 underline">support@page-drop.com</a>. We will attempt to resolve the dispute within 30 days. If the dispute cannot be resolved informally, either party may pursue formal legal remedies as described in the Governing Law section above.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">17. Modifications to the Service and Terms</h2>
          <p>We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time, with or without notice. We may also update these Terms from time to time. When we make material changes, we will update the &ldquo;Last updated&rdquo; date and may notify you by email or through the Service. Your continued use of the Service after any such changes constitutes your acceptance of the revised Terms. If you do not agree to the revised Terms, you must stop using the Service.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">18. Severability</h2>
          <p>If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, the remaining provisions shall remain in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable while preserving its original intent.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">19. Entire Agreement</h2>
          <p>These Terms, together with the Privacy Policy and Cookie Policy, constitute the entire agreement between you and PageDrop regarding the Service, and supersede all prior agreements, understandings, and communications, whether written or oral, relating to the subject matter herein.</p>

          <h2 className="text-lg font-bold text-gray-900 mt-8">20. Contact</h2>
          <p>If you have any questions about these Terms of Service, please contact us at:</p>
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
