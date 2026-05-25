import type { Metadata } from "next";
import { Suspense } from "react";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import ROICalculatorInteractive from "@/components/calculators/ROICalculatorInteractive";

export const metadata: Metadata = {
  title: "Blooket ROI Calculator — Best Pack Value per Token Spent",
  description:
    "Compare the expected return on token spend across all Blooket packs. See which pack gives the best value per token for Epic+, Legendary, or Chroma pulls.",
  keywords: [
    "blooket ROI calculator",
    "blooket pack value",
    "blooket best pack value",
    "blooket token efficiency",
    "blooket pack comparison",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/roi`,
    languages: {
      "en-US": `${siteUrl}/calculators/roi`,
      "x-default": `${siteUrl}/calculators/roi`,
    },
  },
  openGraph: {
    title: `ROI Calculator | ${siteName}`,
    description:
      "Compare expected return on token spend across all Blooket packs.",
    type: "website",
    url: `${siteUrl}/calculators/roi`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "ROI Calculator", item: `${siteUrl}/calculators/roi` },
]);

export default function ROICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Suspense>
        <ROICalculatorInteractive />
      </Suspense>
    </>
  );
}
