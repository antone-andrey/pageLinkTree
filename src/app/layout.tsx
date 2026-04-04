import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://linktreebooking.vercel.app"),
  title: "PageDrop — One link. Get paid, get booked, get followed.",
  description:
    "Link-in-bio with built-in booking and payments. Replace Linktree + Calendly + Stripe with one link.",
  keywords: ["link in bio", "linktree alternative", "booking page", "creator tools", "link-in-bio payments"],
  authors: [{ name: "PageDrop" }],
  openGraph: {
    title: "PageDrop — One link. Get paid, get booked, get followed.",
    description: "The link-in-bio that actually makes you money. Share links, book clients, accept payments — all from one page.",
    url: "https://linktreebooking.vercel.app",
    siteName: "PageDrop",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PageDrop — Link-in-bio with booking and payments",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PageDrop — One link. Get paid, get booked, get followed.",
    description: "The link-in-bio that actually makes you money.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://linktreebooking.vercel.app",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "PageDrop",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web",
              offers: [
                { "@type": "Offer", price: "0", priceCurrency: "USD", name: "Free" },
                { "@type": "Offer", price: "7", priceCurrency: "USD", name: "Pro (Founding Member)", billingIncrement: "P1M", description: "Founding Member pricing — locked in forever. Regular price $12/mo." },
                { "@type": "Offer", price: "5", priceCurrency: "USD", name: "Pro Annual (Founding Member)", billingIncrement: "P1Y", description: "Founding Member pricing — $60/yr, locked in forever. Regular price $10/mo." },
                { "@type": "Offer", price: "14", priceCurrency: "USD", name: "Business (Founding Member)", billingIncrement: "P1M", description: "Founding Member pricing — locked in forever. Regular price $24/mo." },
                { "@type": "Offer", price: "10", priceCurrency: "USD", name: "Business Annual (Founding Member)", billingIncrement: "P1Y", description: "Founding Member pricing — $120/yr, locked in forever. Regular price $19/mo." },
              ],
              description: "Link-in-bio with built-in booking and payments.",
              url: "https://linktreebooking.vercel.app",
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "How is PageDrop different from Linktree?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Linktree is a link list. PageDrop is a link list + booking system + payment processor in one. You replace 3 tools with one and keep more of your revenue.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Do I need a Stripe account to use PageDrop?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Only if you want to accept payments. Booking and link sharing work without Stripe. When you're ready, connecting Stripe takes about 2 minutes.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What happens to my money on PageDrop?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Payments go directly to your Stripe account via Stripe Connect. PageDrop never holds your money. On the free plan there's a 3% platform fee; on Pro it's 0%.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I use my own domain with PageDrop?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! Pro and Business plans support custom domains. You can use yourname.com instead of pagedrop.link/yourname.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is there a free trial for PageDrop Pro?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The free plan is fully functional — it's not a trial. When you're ready for unlimited links, custom domains, and 0% fees, upgrade to Pro for $7/mo with Founding Member pricing (regular $12/mo).",
                  },
                },
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "PageDrop",
              url: "https://linktreebooking.vercel.app",
              logo: "https://linktreebooking.vercel.app/icon.png",
              sameAs: [
                "https://twitter.com/pagedrop",
                "https://github.com/pagedrop",
              ],
              description:
                "Link-in-bio platform with built-in booking and payments.",
            }),
          }}
        />
      </head>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
