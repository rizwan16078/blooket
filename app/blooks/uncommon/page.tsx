import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { getBlooksByRarity, getRaritySummary, formatRateLabel } from "@/lib/authority";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Uncommon Blooks in Blooket — Drop Rates, Packs & Sell Values",
  description:
    "Browse every Uncommon blook in Blooket with pack, drop rate, and sell value. The complete Uncommon rarity hub for players tracking their collection.",
  keywords: [
    "uncommon blooks",
    "all uncommon blooks",
    "blooket uncommon",
    "blooket uncommon odds",
    "uncommon blooket drop rates",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks/uncommon`,
    languages: {
      "en-US": `${siteUrl}/blooks/uncommon`,
      "x-default": `${siteUrl}/blooks/uncommon`,
    },
  },
  openGraph: {
    title: `All Uncommon Blooks | ${siteName}`,
    description:
      "Every Uncommon blook with pack, drop rate, and sell value.",
    type: "website",
    url: `${siteUrl}/blooks/uncommon`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Blooks", item: `${siteUrl}/blooks` },
  { name: "Uncommon", item: `${siteUrl}/blooks/uncommon` },
]);

const summary = getRaritySummary("Uncommon");
const uncommonBlooks = getBlooksByRarity("Uncommon");

export default function UncommonBlooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
            Rarity Hub
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            All Uncommon Blooks{" "}
            <span className="mt-2 block text-xl font-medium text-emerald-300">
              The second tier — above Common, below Rare
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Uncommon blooks sit between Common and Rare in the Blooket rarity ladder.
            They have drop rates ranging from {formatRateLabel(summary.lowestRate)} to{" "}
            {formatRateLabel(summary.highestRate)} and sell for 5 tokens each.
            This hub lists every Uncommon in the game with its pack and drop rate.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Total Uncommons</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{summary.count}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Across Packs</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">{summary.packCount}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-emerald-400">5 tokens</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Uncommon Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
                <th className="py-3 px-3 font-bold text-white/70">Availability</th>
              </tr>
            </thead>
            <tbody>
              {uncommonBlooks.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                return (
                  <tr
                    key={blook.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <Link href={`/blooks/${blook.id}`} className="hover:text-emerald-300">
                        {blook.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-white/60">
                      {pack ? (
                        <Link href={`/packs#${blook.packId}`} className="text-emerald-400/70 hover:text-emerald-300">
                          {pack.name}
                        </Link>
                      ) : blook.packId}
                    </td>
                    <td className="py-3 px-3 text-emerald-300/80">
                      {formatRateLabel(blook.dropRate)}
                    </td>
                    <td className="py-3 px-3 text-white/60">{blook.sellValue} tokens</td>
                    <td className="py-3 px-3 text-white/50">
                      {pack?.isLocked ? "Seasonal" : "Live"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">Uncommon blook strategy</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Uncommon blooks are the most frequent non-Common pulls, with drop rates
              between 10% and 25%. At only 5 tokens sell value, they are not worth
              chasing individually but contribute to the duplicate resell loop. Use the{" "}
              <Link href="/calculators/value" className="text-emerald-400 hover:text-emerald-300">
                Value Calculator
              </Link>{" "}
              to see how Uncommon sell values affect your effective pack cost.
            </p>
            <p>
              If you are a new player wondering which pack gives the best odds for
              your first non-Common blook, the{" "}
              <Link href="/guides/best-blooket-pack-to-open" className="text-emerald-400 hover:text-emerald-300">
                Best Pack to Open guide
              </Link>{" "}
              ranks packs by value for every rarity tier.
            </p>
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Blooks
          </Link>
          <Link href="/blooks/rare" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Rare Hub
          </Link>
          <Link href="/blooks/epic" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Epic Hub
          </Link>
          <Link href="/calculators/value" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Value Calculator
          </Link>
          <Link href="/value-guide" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Value Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
