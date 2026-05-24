import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { SELL_VALUES } from "@/lib/constants";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

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

const RARITY_ORDER: Record<string, number> = {
  Chroma: 0,
  Legendary: 1,
  Epic: 2,
  Rare: 3,
  Uncommon: 4,
  Common: 5,
};

const rankedBlooks = BLOOKS.filter(
  (b) => b.rarity !== "Common" && !b.rotationGroup,
)
  .map((b) => {
    const pack = PACK_MAP[b.packId];
    const packCost = pack?.costPerPull ?? 20;
    const expectedTokens = b.dropRate > 0 ? packCost / b.dropRate : Infinity;

    return { ...b, expectedTokens };
  })
  .sort((a, b) => {
    if (a.rarity !== b.rarity) {
      return (RARITY_ORDER[a.rarity] ?? 99) - (RARITY_ORDER[b.rarity] ?? 99);
    }
    return a.expectedTokens - b.expectedTokens;
  });

export default function ValueCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Value Calculator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Blook Values
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Sell values, drop rates &amp; expected token cost
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Every blook ranked by expected token cost — how many tokens you would
            need to spend on average to pull it once. Lower cost means easier to
            obtain. Sell values are fixed by rarity tier.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {Object.entries(SELL_VALUES).map(([rarity, value]) => (
            <div key={rarity} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">
                {rarity} sell value
              </p>
              <p className="mt-2 text-2xl font-black text-white">{value} tokens</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Rarity</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
                <th className="py-3 px-3 font-bold text-white/70">Est. Token Cost</th>
              </tr>
            </thead>
            <tbody>
              {rankedBlooks.map((blook) => (
                <tr
                  key={blook.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-3 font-semibold text-white">
                    <Link
                      href={`/blooks/${blook.id}`}
                      className="hover:text-violet-300"
                    >
                      {blook.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-white/60">{blook.rarity}</td>
                  <td className="py-3 px-3 text-white/60">
                    {(blook.dropRate * 100).toFixed(2)}%
                  </td>
                  <td className="py-3 px-3 text-white/60">{blook.sellValue} tokens</td>
                  <td className="py-3 px-3 text-white/70">
                    {blook.expectedTokens === Infinity
                      ? "N/A"
                      : `${Math.round(blook.expectedTokens).toLocaleString()} tokens`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How expected token cost works
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              <strong className="text-white">Expected token cost = pack price / drop rate.</strong>{" "}
              If a blook has a 0.5% drop rate and its pack costs 20 tokens, you
              would expect to spend 4,000 tokens to pull it once on average.
            </p>
            <p>
              This is an <strong className="text-white">expected value</strong>, not a guarantee.
              Some players will spend far less, others far more. Use the{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>{" "}
              for probability-at-budget numbers.
            </p>
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/calculators"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            All Calculators
          </Link>
          <Link
            href="/calculators/chase"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Chase Calculator
          </Link>
          <Link
            href="/value-guide"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Value Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
