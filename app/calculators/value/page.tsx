import type { Metadata } from "next";
import { Suspense } from "react";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import BlookValueInteractive from "@/components/calculators/BlookValueInteractive";

export const metadata: Metadata = {
  title: "Blooket Blook Value Calculator — Sell Values, Drop Rates & Token Cost",
  description:
    "Every Blooket blook ranked by sell value, drop rate, and expected token cost. Find the most efficient blooks to chase or sell.",
  keywords: [
    "blooket value calculator",
    "blooket sell values",
    "blooket blook worth",
    "blooket token cost per blook",
    "blooket value guide",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/value`,
    languages: {
      "en-US": `${siteUrl}/calculators/value`,
      "x-default": `${siteUrl}/calculators/value`,
    },
  },
  openGraph: {
    title: `Blook Value Calculator | ${siteName}`,
    description:
      "Every blook ranked by sell value, drop rate, and expected token cost.",
    type: "website",
    url: `${siteUrl}/calculators/value`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Value Calculator", item: `${siteUrl}/calculators/value` },
]);

export default function ValueCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <Suspense>
        <BlookValueInteractive />
      </Suspense>
    </>
  );
}
