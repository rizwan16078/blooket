import type { Metadata, Viewport } from "next";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { siteName, siteUrl } from "@/lib/site";
import { buildOrganizationSchema, buildWebSiteSchema, buildSiteNavigationSchema, serializeJsonLd } from "@/lib/schema";

import { Space_Grotesk, IBM_Plex_Mono } from "next/font/google";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space" });
const ibmPlexMono = IBM_Plex_Mono({ weight: ["400", "500", "600"], subsets: ["latin"], variable: "--font-plex" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // No suffix template — every page title already contains "Blooket".
    // Appending " | Blooket Calculator" pushed several titles past Bing's
    // 70-char limit and Google's ~60-char SERP display width, wasting the
    // most valuable real estate in search results.
    default: `${siteName} — Pack Odds & Drop Rates`,
    template: `%s`,
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
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: "Blooket Calculator RSS Feed" }],
    },
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
      className={`h-full antialiased font-sans ${spaceGrotesk.variable} ${ibmPlexMono.variable}`}
    >
      <head>
        {/* Fonts injected via next/font/google */}
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
      </body>
    </html>
  );
}
