import type { Metadata, Viewport } from "next";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import BackToTop from "@/components/shared/BackToTop";
import { Toaster } from "@/components/ui/toaster";
import { siteName, siteUrl } from "@/lib/site";
import { buildOrganizationSchema, buildWebSiteSchema, buildSiteNavigationSchema, serializeJsonLd } from "@/lib/schema";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Pack Odds & Drop Rates`,
    template: `%s | ${siteName}`,
  },
  description:
    "Production-grade Blooket pack odds calculator with exact probability math, duplicate refund modeling, and server-rendered pack guides.",
  openGraph: {
    title: siteName,
    siteName: siteName,
    description:
      "Exact Blooket pack odds with real-time probability updates and crawlable pack data.",

    type: "website",
    images: [
      {
        url: `${siteUrl}/icon.svg`,
        width: 800,
        height: 600,
        alt: "Blooket Calculator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteName,
    description:
      "Exact Blooket pack odds with real-time probability updates and crawlable pack data.",
  },
  verification: {
    google: "VgPxVDfXDX0pCFb4XqboGAhQhmVMylB7XN-EAmUQ7MY",
    yandex: "a7e0778332167731",
    other: {
      "msvalidate.01": "2B1BC6D0939A71E8F71442B1F50A9065",
    },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0e1a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <head>
        {/* Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildWebSiteSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildSiteNavigationSchema()) }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#0a0e1a] text-slate-100">
        <Navbar />
        <Toaster />
        {children}
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
