import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Glossary — Every Term, Stat & Mechanic Explained",
  description:
    "The complete Blooket glossary: drop rate, Chroma, Legendary, effective cost, cumulative probability, and every other term explained with examples.",
  keywords: [
    "blooket glossary",
    "blooket terms",
    "blooket definitions",
    "blooket drop rate meaning",
    "blooket chroma meaning",
  ],
  alternates: {
    canonical: `${siteUrl}/glossary`,
    languages: {
      "en-US": `${siteUrl}/glossary`,
      "x-default": `${siteUrl}/glossary`,
    },
  },
  openGraph: {
    title: `Blooket Glossary | ${siteName}`,
    description:
      "Every Blooket term, stat, and mechanic explained with examples.",
    type: "website",
    url: `${siteUrl}/glossary`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Glossary", item: `${siteUrl}/glossary` },
]);

type GlossaryEntry = {
  term: string;
  slug: string;
  short: string;
  definition: string;
  related: string[];
};

const entries: GlossaryEntry[] = [
  {
    term: "Drop Rate",
    slug: "drop-rate",
    short: "The probability of pulling a specific blook from a single pack opening.",
    definition:
      "Expressed as a percentage (e.g., 0.03% for a Chroma). Each pack opening is an independent event — the rate does not change based on previous opens.",
    related: ["cumulative-probability", "rarity"],
  },
  {
    term: "Rarity",
    slug: "rarity",
    short: "A blook's tier: Uncommon, Rare, Epic, Legendary, or Chroma.",
    definition:
      "Rarity determines the drop rate range and sell value. Higher rarity means lower drop rate and higher sell value. Chroma is the rarest, Uncommon the most common.",
    related: ["drop-rate", "sell-value", "chroma"],
  },
  {
    term: "Chroma",
    slug: "chroma",
    short: "The rarest blook tier, with drop rates typically 0.01%-0.08%.",
    definition:
      "Chroma blooks are the top of the rarity ladder. They sell for 300 tokens each and only appear in select packs. Some Chromas rotate seasonally.",
    related: ["rarity", "legendary", "seasonal-pack"],
  },
  {
    term: "Legendary",
    slug: "legendary",
    short: "The second-rarest tier, with drop rates typically 0.2%-1%.",
    definition:
      "Legendary blooks sell for 200 tokens and appear in most packs as the primary chase target. Packs without a Chroma usually have a Legendary at the top.",
    related: ["rarity", "chroma", "epic"],
  },
  {
    term: "Epic",
    slug: "epic",
    short: "The middle tier, with drop rates typically 2%-5%.",
    definition:
      "Epic blooks sell for 75 tokens. They are uncommon but not rare — most players will pull several Epics before getting a Legendary.",
    related: ["rarity", "legendary", "rare"],
  },
  {
    term: "Sell Value",
    slug: "sell-value",
    short: "The number of tokens you receive when selling a blook.",
    definition:
      "Sell values are fixed by rarity: Uncommon 5, Rare 10, Epic 75, Legendary 200, Chroma 300. Megalodon is an exception at 250 tokens.",
    related: ["rarity", "effective-cost", "duplicate-resell"],
  },
  {
    term: "Effective Cost",
    slug: "effective-cost",
    short: "Pack price minus average duplicate sell-back value.",
    definition:
      "When you enable duplicate resell, each pull returns some tokens on average. The effective cost is the net token spend per pull. For example, a 20-token pack with 3.2 average resell has an effective cost of 16.8 tokens.",
    related: ["sell-value", "duplicate-resell", "cost-per-pull"],
  },
  {
    term: "Cumulative Probability",
    slug: "cumulative-probability",
    short: "The chance of at least one success across multiple independent opens.",
    definition:
      "Calculated as 1 - (1 - p)^n, where p is the single-pull rate and n is the number of opens. A 1% rate over 100 opens gives 63.4%, not 100%.",
    related: ["drop-rate", "chase-calculator"],
  },
  {
    term: "Chase",
    slug: "chase",
    short: "Targeting a specific blook through repeated pack openings.",
    definition:
      "Chasing means spending tokens on a specific pack to try to pull a particular blook. The Chase Calculator shows the token budget needed for 50%, 90%, or 99% probability.",
    related: ["cumulative-probability", "drop-rate"],
  },
  {
    term: "Seasonal Pack",
    slug: "seasonal-pack",
    short: "A pack that is only available during specific time periods.",
    definition:
      "Seasonal packs (Blizzard, Spooky, Autumn) rotate in and out of the shop. When locked, you cannot open them. Their Chromas are only obtainable while the pack is active.",
    related: ["chroma", "locked-pack"],
  },
  {
    term: "Duplicate Resell",
    slug: "duplicate-resell",
    short: "Selling duplicate blooks back for tokens after each pull.",
    definition:
      "When you pull a blook you already own, you can sell it for its sell value. This effectively reduces the cost of future pulls. The calculator models this as a reduced effective cost per pull.",
    related: ["sell-value", "effective-cost"],
  },
  {
    term: "Monte Carlo Simulation",
    slug: "monte-carlo-simulation",
    short: "Running thousands of random trials to estimate outcome distributions.",
    definition:
      "The calculator runs 5,000 simulated pack-opening sessions to show not just the average outcome but the P10 (lucky) and P90 (unlucky) bounds. This gives a realistic picture of variance.",
    related: ["cumulative-probability", "chase"],
  },
  {
    term: "Token",
    slug: "token",
    short: "The in-game currency used to open packs.",
    definition:
      "Tokens are earned by playing games. Typical earning rates are 250-300 tokens per session. Packs cost 20 or 25 tokens per opening.",
    related: ["effective-cost", "cost-per-pull"],
  },
  {
    term: "Rotation Group",
    slug: "rotation-group",
    short: "A set of blooks that share a single slot in the drop table.",
    definition:
      "Some blooks (like the colored Astronauts in the Space Pack) rotate through a single drop slot. Only one is active at a time, so the effective Chroma rate stays the same regardless of which color is current.",
    related: ["drop-rate", "chroma"],
  },
  {
    term: "Chase Calculator",
    slug: "chase-calculator",
    short: "A tool that calculates the token budget needed to pull a specific blook at a given probability.",
    definition:
      "The Chase Calculator uses the formula n = log(1 - P) / log(1 - p) to determine how many pack opens (and therefore tokens) you need for a 50%, 90%, or 99% chance at your target blook.",
    related: ["cumulative-probability", "chase", "drop-rate"],
  },
  {
    term: "Locked Pack",
    slug: "locked-pack",
    short: "A seasonal pack that is currently unavailable in the Blooket Market.",
    definition:
      "Locked packs rotate in and out of the Market based on the season. When locked, you cannot open them or chase their blooks. Their Chromas and Legendaries are only obtainable while the pack is active.",
    related: ["seasonal-pack", "chroma"],
  },
];

export default function GlossaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Glossary
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Glossary{" "}
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Every term, stat &amp; mechanic explained
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Definitions for every Blooket term you will encounter on this site.
            Each entry includes a short definition and links to related terms.
          </p>
        </section>

        <dl className="mt-10 space-y-8">
          {entries.map((entry) => (
            <div
              key={entry.slug}
              id={entry.slug}
              className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg scroll-mt-24"
            >
              <dt className="text-lg font-bold text-white">{entry.term}</dt>
              <dd className="mt-2 text-sm text-white/70">{entry.short}</dd>
              <dd className="mt-2 text-sm leading-7 text-white/50">{entry.definition}</dd>
              {entry.related.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.related.map((slug) => {
                    const related = entries.find((e) => e.slug === slug);
                    return related ? (
                      <Link
                        key={slug}
                        href={`#${slug}`}
                        className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium text-violet-400 transition hover:text-violet-300"
                      >
                        {related.term}
                      </Link>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          ))}
        </dl>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/calculators" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Calculators
          </Link>
          <Link href="/guides" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Guides
          </Link>
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Blook Library
          </Link>
        </aside>
      </main>
    </>
  );
}
