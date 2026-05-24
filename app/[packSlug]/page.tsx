import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PackExperiencePage from "@/components/pack-experience-page";
import { getPackBySlug, PACKS } from "@/lib/packs";
import {
  buildInitialCalculatorState,
  type SearchParamRecord,
} from "@/lib/search-params";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

type PackPageProps = {
  params: Promise<{ packSlug: string }>;
  searchParams: Promise<SearchParamRecord>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return PACKS.map((pack) => ({
    packSlug: pack.route.slice(1),
  }));
}

export async function generateMetadata({
  params,
}: PackPageProps): Promise<Metadata> {
  const { packSlug } = await params;
  const matchedPack = PACKS.find((pack) => pack.route === `/${packSlug}`);

  if (!matchedPack) {
    return {};
  }

  const legPct = (matchedPack.dropRates.legendary * 100).toFixed(2);
  const chromaPct = (matchedPack.dropRates.chroma * 100).toFixed(2);
  const cost = matchedPack.costPerPull;
  const title = `${matchedPack.name} Pack Odds 2026 — Drop Rates & Free Calculator`;
  const description = `${matchedPack.name} Pack: ${legPct}% Legendary, ${chromaPct}% Chroma drop rates, ${cost}-token cost. Exact odds, sell values, and chase math — free Blooket calculator 2026 →`;
  const canonical = `${siteUrl}${matchedPack.route}`;

  return {
    title,
    description,
    keywords: [
      `blooket ${matchedPack.name.toLowerCase()} pack`,
      `blooket ${matchedPack.name.toLowerCase()} box`,
      `${matchedPack.name.toLowerCase()} box odds`,
      `${matchedPack.name.toLowerCase()} pack drop rates`,
      `${matchedPack.name.toLowerCase()} pack chroma`,
      `${matchedPack.name.toLowerCase()} pack calculator`,
      `blooket ${matchedPack.name.toLowerCase()} odds 2026`,
    ],
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "website",
      url: canonical,
    },
  };
}

export default async function PackPage({
  params,
  searchParams,
}: PackPageProps) {
  const { packSlug } = await params;
  const matchedPack = PACKS.find((pack) => pack.route === `/${packSlug}`);

  if (!matchedPack) {
    notFound();
  }

  const resolvedSearchParams = await searchParams;
  const initialState = buildInitialCalculatorState(
    resolvedSearchParams,
    matchedPack.slug,
  );
  const contentPack = getPackBySlug(matchedPack.slug);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", item: siteUrl },
    { name: "Packs", item: `${siteUrl}/packs` },
    { name: `${matchedPack.name} Pack`, item: `${siteUrl}${matchedPack.route}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <PackExperiencePage
        contentPack={contentPack}
        initialState={{
          ...initialState,
          packSlug: matchedPack.slug,
        }}
        pageMode="pack"
      />
    </>
  );
}
