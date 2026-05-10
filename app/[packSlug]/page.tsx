import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PackExperiencePage from "@/components/pack-experience-page";
import { getPackBySlug, PACKS } from "@/lib/packs";
import {
  buildInitialCalculatorState,
  type SearchParamRecord,
} from "@/lib/search-params";
import { siteUrl } from "@/lib/site";

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

  return {
    title: `${matchedPack.name} Box Odds Calculator`,
    description: `Check exact ${matchedPack.name} Pack odds in Blooket, including Epic+, Legendary, and Chroma probabilities with duplicate refund math.`,
    alternates: {
      canonical: `${siteUrl}${matchedPack.route}`,
    languages: {
      "en-US": `${siteUrl}${matchedPack.route}`,
      "x-default": `${siteUrl}${matchedPack.route}`,
    },
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

  return (
    <PackExperiencePage
      contentPack={contentPack}
      initialState={{
        ...initialState,
        packSlug: matchedPack.slug,
      }}
      pageMode="pack"
    />
  );
}
