import type { Metadata } from "next";
import { Suspense } from "react";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import TokenGrinderInteractive from "@/components/calculators/TokenGrinderInteractive";

export const metadata: Metadata = {
  title: "Blooket Token Grinder Calculator — Fastest Way to Earn Daily Tokens",
  description:
    "Calculate the fastest way to earn daily Blooket tokens. Compare gamemodes, estimate time needed, and optimize your grinding strategy.",
  keywords: [
    "blooket token grinder",
    "blooket token calculator",
    "blooket daily tokens",
    "blooket fastest tokens",
    "blooket grind tokens",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/token-grinder`,
    languages: {
      "en-US": `${siteUrl}/calculators/token-grinder`,
      "x-default": `${siteUrl}/calculators/token-grinder`,
    },
  },
  openGraph: {
    title: `Token Grinder Calculator | ${siteName}`,
    description:
      "Calculate the fastest way to earn daily Blooket tokens.",
    type: "website",
    url: `${siteUrl}/calculators/token-grinder`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Token Grinder", item: `${siteUrl}/calculators/token-grinder` },
]);

export default function TokenGrinderPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Suspense>
        <TokenGrinderInteractive />
      </Suspense>
    </>
  );
}
