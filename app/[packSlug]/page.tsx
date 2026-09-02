import type { Metadata } from "next";
import Link from "next/link";
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

  const cost = matchedPack.costPerPull;

  // Name the actual chase blooks in the title. All 16 pack pages previously
  // shared the suffix "Odds 2026 — Drop Rates & Free Calculator", so they
  // rendered as 16 interchangeable blue links and several drew 300-700 Bing
  // impressions at a 0% click-through. People search for the blook, not the
  // pack, and the competitor winning this SERP names them too.
  const chaseBlooks = matchedPack.featuredBlooks
    .filter((blook) => blook.rarity === "Chroma" || blook.rarity === "Legendary")
    .sort((a, b) => a.dropRate - b.dropRate)
    .map((blook) => blook.name);

  const namedChase = chaseBlooks.slice(0, 2).join(" & ");
  const title = namedChase
    ? `${matchedPack.name} Pack Odds — ${namedChase} Drop Rates`
    : `${matchedPack.name} Pack Odds — Every Blook & Drop Rate`;

  // Lead the description with the rarest thing in the pack and what it costs
  // to actually get it: the two numbers a searcher is weighing.
  const rarest = chaseBlooks[0];
  const rarestRate = matchedPack.featuredBlooks
    .filter((blook) => blook.name === rarest)
    .map((blook) => (blook.dropRate * 100).toFixed(2))[0];
  const description = rarest
    ? `${rarest} drops at ${rarestRate}% from the ${matchedPack.name} Pack (${cost} tokens). See every blook's exact odds, sell value, and how many packs you need at 50%, 90% and 99%.`
    : `Every ${matchedPack.name} Pack blook with exact drop rates, sell values, and the packs you need at 50%, 90% and 99% confidence. ${cost} tokens per opening.`;

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

  const pillClass =
    "rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white";
  const hasChroma = matchedPack.dropRates.chroma > 0;
  const hasLegendary = matchedPack.dropRates.legendary > 0;
  const relatedGuides = [
    { href: "/guides/best-blooket-pack-to-open", label: "Best Pack to Open" },
    ...(hasChroma
      ? [
          { href: "/guides/best-pack-for-chromas", label: "Best Pack for Chromas" },
          { href: "/guides/how-to-get-chroma-blooket", label: "How to Get a Chroma" },
        ]
      : []),
    ...(hasLegendary
      ? [
          { href: "/guides/best-pack-for-legendaries", label: "Best Pack for Legendaries" },
          { href: "/guides/how-to-get-legendary-blooket", label: "How to Get a Legendary" },
        ]
      : []),
  ];
  const siblingPacks = PACKS.filter(
    (entry) => entry.id !== matchedPack.id && !entry.isLocked,
  ).slice(0, 4);

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

      <section className="mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg sm:p-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
            Related guides &amp; calculators
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white">
            Plan your {matchedPack.name} Pack pulls
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/50">
            Turn the {matchedPack.name} odds above into a real token budget with these guides and tools before you spend.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {relatedGuides.map((guide) => (
              <Link key={guide.href} href={guide.href} className={pillClass}>
                {guide.label}
              </Link>
            ))}
            <Link href="/calculators/chase" className={pillClass}>
              Chase Calculator
            </Link>
            <Link href="/calculators/roi" className={pillClass}>
              ROI Calculator
            </Link>
            {hasChroma && (
              <Link href="/blooks/chroma" className={pillClass}>
                All Chroma Blooks
              </Link>
            )}
            {hasLegendary && (
              <Link href="/blooks/legendary" className={pillClass}>
                All Legendary Blooks
              </Link>
            )}
          </div>

          <p className="mt-8 text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
            Compare other packs
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {siblingPacks.map((entry) => (
              <Link key={entry.id} href={entry.route} className={pillClass}>
                {entry.name} Pack
              </Link>
            ))}
            <Link href="/packs" className={pillClass}>
              All packs →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
