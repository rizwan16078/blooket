import type { Metadata } from "next";
import { Suspense } from "react";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import ChaseCalculatorInteractive from "@/components/calculators/ChaseCalculatorInteractive";

export const metadata: Metadata = {
  title: "Blooket Chase Calculator — Token Budget at 50%, 90% & 99%",
  description:
    "Target a specific Blooket blook and see exactly how many tokens and packs you need for a 50%, 90%, or 99% chance of pulling it.",
  keywords: [
    "blooket chase calculator",
    "blooket specific blook odds",
    "how many tokens for blooket blook",
    "blooket target blook",
    "blooket chase probability",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/chase`,
    languages: {
      "en-US": `${siteUrl}/calculators/chase`,
      "x-default": `${siteUrl}/calculators/chase`,
    },
  },
  openGraph: {
    title: `Chase Calculator | ${siteName}`,
    description:
      "See how many tokens you need for a 50%, 90%, or 99% chance at any Blooket blook.",
    type: "website",
    url: `${siteUrl}/calculators/chase`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Chase Calculator", item: `${siteUrl}/calculators/chase` },
]);

export default function ChaseCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Suspense>
        <ChaseCalculatorInteractive />
      </Suspense>
    </>
  );
}
