import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";

import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { Toaster } from "@/components/ui/toaster";
import { siteName, siteUrl } from "@/lib/site";
import { buildOrganizationSchema, buildWebSiteSchema, buildSiteNavigationSchema, serializeJsonLd } from "@/lib/schema";

import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} — Pack Odds & Drop Rates`,
    template: `%s | ${siteName}`,
  },
  keywords: ["blooket calculator", "blooket pack odds", "blooket drop rates", "blooket box simulator"],
  alternates: {
    languages: {
      "en-US": "/en-US",
      "x-default": "/",
    },
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
      className={`${spaceGrotesk.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preconnect to required origins for faster font delivery */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
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
