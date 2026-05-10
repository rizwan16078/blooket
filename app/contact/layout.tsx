import type { Metadata } from "next";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Feedback",
  description:
    "Report a data correction, request a feature, or send feedback about the Blooket Calculator. We respond to all corrections within 48 hours.",
  keywords: [
    "blooket calculator contact",
    "blooket data correction",
    "blooket calculator feedback",
  ],
  alternates: {
    canonical: `${siteUrl}/contact`,
    languages: {
      "en-US": `${siteUrl}/contact`,
      "x-default": `${siteUrl}/contact`,
    },
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
