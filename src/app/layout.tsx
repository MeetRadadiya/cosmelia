import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartProvider } from "@/lib/context/CartContext";
import { AccountProvider } from "@/lib/context/AccountContext";

import { CategoryProvider } from "@/lib/context/CategoryContext";
import { LocaleProvider } from "@/lib/context/LocaleContext";
import { CompareProvider } from "@/lib/context/CompareContext";
import { CompareFloatingBar } from "@/components/compare/CompareFloatingBar";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { TikTokPixel } from "@/components/analytics/TikTokPixel";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getcosmelia.com"),
  title: {
    default:
      "COSMELIA® Official Store | GetCosmelia - Premium Beauty Tools & Skincare Devices",
    template: "%s | COSMELIA® Official",
  },
  description:
    "Official COSMELIA Store (GetCosmelia). Shop high-performance LED beauty masks, facial sculpting massagers, cooling ice rollers, pimple patches & skincare devices. Fast worldwide delivery.",
  keywords: [
    "Cosmelia",
    "cosmelia",
    "getcosmelia",
    "get cosmelia",
    "getcosmelia.com",
    "cosmelia.com",
    "Cosmelia Official",
    "Cosmelia Store",
    "Cosmelia Beauty",
    "Cosmelia Skincare",
    "Cosmelia Devices",
    "beauty",
    "beauty tools",
    "self-care accessories",
    "skincare tools",
    "facial massagers",
    "ice rollers",
    "pimple patches",
    "eye patches",
    "at-home self-care",
    "LED beauty masks",
    "Cosmetic",
    "Cosmetic Products",
    "Cosmetic tools",
    "Skin Care",
    "Skin Care Products",
    "Skin Care tools",
    "Skin Care gadgets",
    "Skin Care machine",
    "Beauty device",
    "Beauty device Products",
    "Beauty device tools",
    "Beauty device gadgets",
    "Beauty device machine",
  ],
  authors: [{ name: "Cosmelia", url: "https://getcosmelia.com" }],
  creator: "Cosmelia",
  publisher: "Cosmelia",
  applicationName: "Cosmelia",
  category: "Beauty & Skincare",
  alternates: {
    canonical: "https://getcosmelia.com",
  },
  openGraph: {
    title: "COSMELIA® Official Store | GetCosmelia - Premium Beauty Tools",
    description:
      "Official COSMELIA Store (GetCosmelia). Shop LED beauty masks, facial sculpting devices, ice rollers & skincare accessories.",
    url: "https://getcosmelia.com",
    siteName: "Cosmelia",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "COSMELIA® Official Store | GetCosmelia",
    description:
      "Official COSMELIA Store (GetCosmelia). Shop LED beauty masks, facial sculpting devices, ice rollers & skincare accessories.",
    site: "@getcosmelia",
    creator: "@getcosmelia",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

const brandOrganizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://getcosmelia.com/#organization",
  name: "Cosmelia",
  legalName: "Cosmelia Beauty Tools",
  alternateName: [
    "Get Cosmelia",
    "getcosmelia",
    "getcosmelia.com",
    "cosmelia.com",
    "Cosmelia Official",
    "GetCosmelia Store",
  ],
  url: "https://getcosmelia.com",
  logo: "https://getcosmelia.com/icon.svg",
  image: "https://getcosmelia.com/icon.svg",
  email: "radadiyameet366@gmail.com",
  brand: {
    "@type": "Brand",
    name: "Cosmelia",
    logo: "https://getcosmelia.com/icon.svg",
  },
  sameAs: [
    "https://instagram.com",
    "https://tiktok.com",
    "https://pinterest.com",
    "https://youtube.com",
  ],
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://getcosmelia.com/#website",
  name: "Cosmelia",
  alternateName: [
    "Get Cosmelia",
    "getcosmelia",
    "getcosmelia.com",
    "cosmelia.com",
  ],
  url: "https://getcosmelia.com",
  publisher: {
    "@id": "https://getcosmelia.com/#organization",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://getcosmelia.com/search?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

import { ToastProvider } from "@/lib/context/ToastContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(brandOrganizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-[#FAF9F6] text-[#141416] antialiased selection:bg-[#E8D5C4] selection:text-[#141416]">
        <GoogleAnalytics />
        <GoogleTagManager />
        <MetaPixel />
        <TikTokPixel />
        <ToastProvider>
          <LocaleProvider>
            <AccountProvider>
              <CartProvider>
                <CategoryProvider>
                  <CompareProvider>
                    <Header />
                    <main className="flex-grow">{children}</main>
                    <Footer />
                    <CompareFloatingBar />
                    <ScrollToTop />
                  </CompareProvider>
                </CategoryProvider>
              </CartProvider>
            </AccountProvider>
          </LocaleProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
