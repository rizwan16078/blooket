import type { Metadata } from "next";
import { Suspense } from "react";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import TokenConverterInteractive from "@/components/calculators/TokenConverterInteractive";

export const metadata: Metadata = {
  title: "Blooket Token to Pack Converter — How Many Packs Can You Open?",
  description:
    "Enter your token balance and instantly see how many packs you can open for every Blooket market pack, with and without duplicate sell-back.",
  keywords: [
    "blooket token calculator",
    "blooket token converter",
    "how many blooket packs can I open",
    "blooket pack count",
    "blooket token budget",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/token-converter`,
    languages: {
      "en-US": `${siteUrl}/calculators/token-converter`,
      "x-default": `${siteUrl}/calculators/token-converter`,
    },
  },
  openGraph: {
    title: `Token → Pack Converter | ${siteName}`,
    description:
      "See how many packs your tokens can buy across all Blooket market packs.",
    type: "website",
    url: `${siteUrl}/calculators/token-converter`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Token Converter", item: `${siteUrl}/calculators/token-converter` },
]);

export default function TokenConverterPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Suspense>
        <TokenConverterInteractive />
      </Suspense>
    </>
  );
}
