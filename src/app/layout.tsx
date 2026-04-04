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
