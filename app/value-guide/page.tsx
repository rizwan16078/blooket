import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, SELL_VALUES, PACK_MAP } from "@/lib/constants";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Value Guide — Sell Values, Drop Rates & Tier Filter",
  description:
    "Every Blooket blook ranked by sell value, drop rate, and expected token cost. Filter by rarity tier and find the most efficient blooks to chase or sell.",
  keywords: [
    "blooket value guide",
    "blooket sell values",
    "blooket blook worth",
    "blooket tier list",
    "blooket rarity values",
  ],
  alternates: {
    canonical: `${siteUrl}/value-guide`,
    languages: {
      "en-US": `${siteUrl}/value-guide`,
      "x-default": `${siteUrl}/value-guide`,
    },
  },
  openGraph: {
    title: `Blooket Value Guide | ${siteName}`,
    description:
      "Every blook ranked by sell value, drop rate, and expected token cost.",
    type: "website",
    url: `${siteUrl}/value-guide`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Value Guide", item: `${siteUrl}/value-guide` },
]);

const TRADE_VALUES: Record<string, number> = {
  Chroma: 350,
  Legendary: 200,
  Epic: 100,
  Rare: 50,
  Uncommon: 25,
};

const RARITY_TIERS = [
  { rarity: "Chroma" as const, color: "text-teal-400", bg: "bg-teal-500/10" },
  { rarity: "Legendary" as const, color: "text-amber-400", bg: "bg-amber-500/10" },
  { rarity: "Epic" as const, color: "text-violet-400", bg: "bg-violet-500/10" },
  { rarity: "Rare" as const, color: "text-sky-400", bg: "bg-sky-500/10" },
  { rarity: "Uncommon" as const, color: "text-emerald-400", bg: "bg-emerald-500/10" },
];

export default function ValueGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Value Guide
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Value Guide
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Sell values, drop rates &amp; tier filter
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            The value of a Blook in Blooket is determined by several factors, including its
            rarity, demand, and the number of tokens it can be sold for. Rarer Blooks tend to
            have higher values due to their scarcity, while more common Blooks may have lower
            values. Additionally, the demand for certain Blooks can fluctuate based on trends
            and player preferences, which can also impact their value.
          </p>
          <p className="max-w-3xl text-base leading-8 text-white/40">
            We have calculated the value of each Blook based on its default chance of being
            obtained from packs, its sell value in tokens, and the blook desirability within
            the community. The trade value is an approximation, and will not be completely
            accurate until a global market is released.
          </p>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            The two tiers that drive most chase decisions live on dedicated rarity
            pages: every{" "}
            <Link href="/blooks/chroma" className="text-teal-400 hover:text-teal-300">
              Chroma
            </Link>{" "}
            in the game and every{" "}
            <Link href="/blooks/legendary" className="text-amber-400 hover:text-amber-300">
              Legendary
            </Link>{" "}
            sorted by rate. Pair this guide with the{" "}
            <Link href="/guides/how-to-sell-blooks" className="text-emerald-400 hover:text-emerald-300">
              resell strategy guide
            </Link>{" "}
            to turn duplicates back into tokens.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {RARITY_TIERS.map(({ rarity, color }) => (
            <div key={rarity} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
              <p className={`text-xs font-bold uppercase tracking-[0.22em] text-white/30`}>
                {rarity} sell value
              </p>
              <p className={`mt-2 text-2xl font-black ${color}`}>
                {SELL_VALUES[rarity]} tokens
              </p>
              <p className="mt-1 text-xs text-white/40">
                {BLOOKS.filter((b) => b.rarity === rarity).length} blooks
              </p>
            </div>
          ))}
        </div>

        {RARITY_TIERS.map(({ rarity, color, bg }) => {
          const tierBlooks = BLOOKS.filter(
            (b) => b.rarity === rarity && !b.rotationGroup,
          ).sort((a, b) => b.sellValue - a.sellValue || a.dropRate - b.dropRate);

          return (
            <section key={rarity} className="mt-12">
              <h2 className={`text-2xl font-bold ${color}`}>
                {rarity} Blooks
              </h2>
              <p className="mt-1 text-sm text-white/40">
                {tierBlooks.length} blooks · {SELL_VALUES[rarity]} token sell value
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="py-3 px-3 font-bold text-white/70">Blook</th>
                      <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                      <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                      <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
                      <th className="py-3 px-3 font-bold text-white/70">Trade Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tierBlooks.map((blook) => {
                      const pack = PACK_MAP[blook.packId];
                      return (
                        <tr
                          key={blook.id}
                          className={`border-b border-white/[0.04] transition hover:bg-white/[0.02]`}
                        >
                          <td className="py-3 px-3 font-semibold text-white">
                            <Link
                              href={`/blooks/${blook.id}`}
                              className="hover:text-violet-300"
                            >
                              {blook.name}
                            </Link>
                          </td>
                          <td className="py-3 px-3 text-white/60">
                            {pack ? (
                              <Link
                                href={`/packs#${blook.packId}`}
                                className="text-emerald-400/70 hover:text-emerald-300"
                              >
                                {pack.name}
                              </Link>
                            ) : blook.packId}
                          </td>
                          <td className="py-3 px-3 text-white/60">
                            {(blook.dropRate * 100).toFixed(2)}%
                          </td>
                          <td className={`py-3 px-3 ${color}`}>
                            {blook.sellValue} tokens
                          </td>
                          <td className="py-3 px-3 text-white/60">
                            ~{TRADE_VALUES[blook.rarity] ?? blook.sellValue} tokens
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/calculators/value"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Value Calculator
          </Link>
          <Link
            href="/blooks/chroma"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Chroma Hub
          </Link>
          <Link
            href="/blooks/legendary"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Legendary Hub
          </Link>
        </aside>
      </main>
    </>
  );
}
