import type { Metadata } from "next";
import { Suspense } from "react";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import PackOddsInteractive from "@/components/calculators/PackOddsInteractive";

export const metadata: Metadata = {
  title: "Blooket Pack Odds Calculator — Live Drop Rates for Every Pack",
  description:
    "See live drop rates for every rarity in every Blooket market pack. Compare Legendary and Chroma odds across all packs before you spend tokens.",
  keywords: [
    "blooket pack odds calculator",
    "blooket drop rates",
    "blooket pack odds",
    "blooket legendary odds",
    "blooket chroma odds",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/pack-odds`,
    languages: {
      "en-US": `${siteUrl}/calculators/pack-odds`,
      "x-default": `${siteUrl}/calculators/pack-odds`,
    },
  },
  openGraph: {
    title: `Pack Odds Calculator | ${siteName}`,
    description:
      "Live drop rates for every rarity in every Blooket market pack.",
    type: "website",
    url: `${siteUrl}/calculators/pack-odds`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Pack Odds", item: `${siteUrl}/calculators/pack-odds` },
]);

export default function PackOddsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Suspense>
        <PackOddsInteractive />
      </Suspense>
    </>
  );
}
