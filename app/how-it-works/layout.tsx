import type { Metadata } from "next";

import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How the Odds Engine Works",
  description:
    "Learn exactly how the Blooket Calculator computes probabilities using binomial math, effective cost modeling, and Monte Carlo simulation in a web worker.",
  keywords: [
    "blooket odds engine",
    "blooket probability math",
    "blooket binomial formula",
    "blooket monte carlo simulation",
  ],
  alternates: {
    canonical: `${siteUrl}/how-it-works`,
    languages: {
      "en-US": `${siteUrl}/how-it-works`,
      "x-default": `${siteUrl}/how-it-works`,
    },
  },
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
