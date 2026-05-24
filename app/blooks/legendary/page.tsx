import type { Metadata } from "next";
import Link from "next/link";

import { PACK_MAP } from "@/lib/constants";
import { getBlooksByRarity, getRaritySummary, formatRateLabel } from "@/lib/authority";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Legendary Blooks in Blooket — Drop Rates, Packs & Chase Odds",
  description:
    "Browse every Legendary blook in Blooket with pack, drop rate, and chase strategy. The complete Legendary hub for collectors and probability-minded players.",
  keywords: [
    "legendary blooks",
    "all legendary blooks",
    "blooket legendary",
    "blooket legendary odds",
    "blooket legendary list",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks/legendary`,
    languages: {
      "en-US": `${siteUrl}/blooks/legendary`,
      "x-default": `${siteUrl}/blooks/legendary`,
    },
  },
  openGraph: {
    title: `All Legendary Blooks | ${siteName}`,
    description:
      "Every Legendary blook with pack, drop rate, and chase strategy.",
    type: "website",
    url: `${siteUrl}/blooks/legendary`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Blooks", item: `${siteUrl}/blooks` },
  { name: "Legendary", item: `${siteUrl}/blooks/legendary` },
]);

const summary = getRaritySummary("Legendary");
const legendaryBlooks = getBlooksByRarity("Legendary");

export default function LegendaryBlooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-400">
            Rarity Hub
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            All Legendary Blooks
            <span className="mt-2 block text-xl font-medium text-amber-300">
              The top chase targets before Chroma
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Legendaries are the second-rarest blook tier with drop rates from{" "}
            {formatRateLabel(summary.lowestRate)} to{" "}
            {formatRateLabel(summary.highestRate)}. Every pack with a Legendary
            is listed below with its drop rate and availability.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Total Legendaries</p>
            <p className="mt-2 text-2xl font-black text-amber-400">{summary.count}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Across Packs</p>
            <p className="mt-2 text-2xl font-black text-amber-400">{summary.packCount}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-amber-400">200 tokens</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Legendary Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
                <th className="py-3 px-3 font-bold text-white/70">Availability</th>
              </tr>
            </thead>
            <tbody>
              {legendaryBlooks.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                return (
                  <tr
                    key={blook.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <Link href={`/blooks/${blook.id}`} className="hover:text-amber-300">
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
                    <td className="py-3 px-3 text-amber-300/80">
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
          <h2 className="text-2xl font-bold text-white">Legendary hunting strategy</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Legendary drop rates range from 0.2% to 1% per pull. At 500 tokens,
              most Legendaries are within reach but not guaranteed. The{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>{" "}
              gives you exact probability-at-budget numbers.
            </p>
            <p>
              Packs without a Chroma (like Bot, Dino, Breakfast) are the best
              value for Legendary-only hunters because the full top-end budget
              goes into one target. See the{" "}
              <Link href="/guides/best-blooket-pack-to-open" className="text-emerald-400 hover:text-emerald-300">
                Best Pack to Open guide
              </Link>{" "}
              for the full comparison.
            </p>
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Blooks
          </Link>
          <Link href="/blooks/chroma" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chroma Hub
          </Link>
          <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chase Calculator
          </Link>
        </aside>
      </main>
    </>
  );
}
