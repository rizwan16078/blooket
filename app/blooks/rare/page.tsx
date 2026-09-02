import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { getBlooksByRarity, getRaritySummary, formatRateLabel } from "@/lib/authority";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Rare Blooks in Blooket — Drop Rates, Packs & Sell Values",
  description:
    "Browse every Rare blook in Blooket with pack, drop rate, and sell value. The complete Rare rarity hub for players optimizing their token budget.",
  keywords: [
    "rare blooks",
    "all rare blooks",
    "blooket rare",
    "blooket rare odds",
    "rare blooket drop rates",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks/rare`,
    languages: {
      "en-US": `${siteUrl}/blooks/rare`,
      "x-default": `${siteUrl}/blooks/rare`,
    },
  },
  openGraph: {
    title: `All Rare Blooks | ${siteName}`,
    description:
      "Every Rare blook with pack, drop rate, and sell value.",
    type: "website",
    url: `${siteUrl}/blooks/rare`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Blooks", item: `${siteUrl}/blooks` },
  { name: "Rare", item: `${siteUrl}/blooks/rare` },
]);

const summary = getRaritySummary("Rare");
const rareBlooks = getBlooksByRarity("Rare");

export default function RareBlooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-sky-400">
            Rarity Hub
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            All Rare Blooks{" "}
            <span className="mt-2 block text-xl font-medium text-sky-300">
              The third tier — above Uncommon, below Epic
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Rare blooks sit between Uncommon and Epic in the Blooket rarity ladder.
            They have drop rates ranging from {formatRateLabel(summary.lowestRate)} to{" "}
            {formatRateLabel(summary.highestRate)} and sell for 20 tokens each.
            This hub lists every Rare in the game with its pack and drop rate.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Total Rares</p>
            <p className="mt-2 text-2xl font-black text-sky-400">{summary.count}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Across Packs</p>
            <p className="mt-2 text-2xl font-black text-sky-400">{summary.packCount}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-sky-400">20 tokens</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Rare Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
                <th className="py-3 px-3 font-bold text-white/70">Availability</th>
              </tr>
            </thead>
            <tbody>
              {rareBlooks.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                return (
                  <tr
                    key={blook.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <Link href={`/blooks/${blook.id}`} className="hover:text-sky-300">
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
                    <td className="py-3 px-3 text-sky-300/80">
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
          <h2 className="text-2xl font-bold text-white">Rare blook strategy</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Rare blooks have drop rates between 5% and 15%, making them the
              first tier where pulls feel meaningful. At 20 tokens sell value,
              they contribute modestly to duplicate resell. Use the{" "}
              <Link href="/calculators/pack-odds" className="text-emerald-400 hover:text-emerald-300">
                Pack Odds Calculator
              </Link>{" "}
              to compare Rare rates across packs.
            </p>
            <p>
              If you are budgeting tokens and want to know how many packs you can
              open, the{" "}
              <Link href="/calculators/token-converter" className="text-emerald-400 hover:text-emerald-300">
                Token Converter
              </Link>{" "}
              converts your balance into pack counts with and without resell.
            </p>
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Blooks
          </Link>
          <Link href="/blooks/epic" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Epic Hub
          </Link>
          <Link href="/blooks/legendary" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Legendary Hub
          </Link>
          <Link href="/calculators/token-converter" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Token Converter
          </Link>
          <Link href="/value-guide" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Value Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
