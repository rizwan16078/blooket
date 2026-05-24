import type { Metadata } from "next";
import Link from "next/link";

import { PACKS } from "@/lib/packs";
import { formatPercent, getRarityRate } from "@/lib/math";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Pack Odds Calculator — Live Drop Rates for Every Pack",
  description:
    "See live drop rates for every rarity in every Blooket market pack. Compare Legendary and Chroma odds across all packs before you spend tokens.",
  keywords: [
    "blooket pack odds calculator",
    "blooket drop rates",
    "blooket pack odds",
    "blooket legendary odds",
    "blooket chroma odds",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/pack-odds`,
    languages: {
      "en-US": `${siteUrl}/calculators/pack-odds`,
      "x-default": `${siteUrl}/calculators/pack-odds`,
    },
  },
  openGraph: {
    title: `Pack Odds Calculator | ${siteName}`,
    description:
      "Live drop rates for every rarity in every Blooket market pack.",
    type: "website",
    url: `${siteUrl}/calculators/pack-odds`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Pack Odds", item: `${siteUrl}/calculators/pack-odds` },
]);

export default function PackOddsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Pack Odds Calculator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Pack Odds
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Live drop rates for every market pack
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Every pack opens as an independent event. The table below shows the
            combined drop rate for each rarity tier in every market pack. Use these
            rates with the{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              main calculator
            </Link>{" "}
            to compute your actual probability based on your token budget.
          </p>
        </section>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                <th className="py-3 px-4 font-bold text-white/70">Cost</th>
                <th className="py-3 px-4 font-bold text-emerald-400">Uncommon</th>
                <th className="py-3 px-4 font-bold text-sky-400">Rare</th>
                <th className="py-3 px-4 font-bold text-violet-400">Epic</th>
                <th className="py-3 px-4 font-bold text-amber-400">Legendary</th>
                <th className="py-3 px-4 font-bold text-teal-400">Chroma</th>
              </tr>
            </thead>
            <tbody>
              {PACKS.map((pack) => (
                <tr
                  key={pack.id}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-4 font-semibold text-white">
                    <Link
                      href={pack.isLocked ? "/packs" : `/packs#${pack.id}`}
                      className="hover:text-violet-300"
                    >
                      {pack.name}
                    </Link>
                  </td>
                  <td className="py-3 px-4 text-white/60">{pack.price} tokens</td>
                  <td className="py-3 px-4 text-emerald-300/80">
                    {formatPercent(getRarityRate(pack.id, "Uncommon"))}
                  </td>
                  <td className="py-3 px-4 text-sky-300/80">
                    {formatPercent(getRarityRate(pack.id, "Rare"))}
                  </td>
                  <td className="py-3 px-4 text-violet-300/80">
                    {formatPercent(getRarityRate(pack.id, "Epic"))}
                  </td>
                  <td className="py-3 px-4 text-amber-300/80">
                    {formatPercent(getRarityRate(pack.id, "Legendary"))}
                  </td>
                  <td className="py-3 px-4 text-teal-300/80">
                    {formatPercent(getRarityRate(pack.id, "Chroma"))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How to read these odds
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Each percentage is the <strong className="text-white">combined drop rate</strong> for
              that rarity tier in a single pack opening. For example, if a pack has two
              Legendaries at 0.5% each, the Legendary column shows 1.0%.
            </p>
            <p>
              A 1% drop rate does <strong className="text-white">not</strong> mean a 1-in-100
              guarantee. The real chance of pulling at least one Legendary from 100 opens is{" "}
              <strong className="text-white">1 - (1 - 0.01)^100 = 63.4%</strong>, not 100%.
              Use the{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                main calculator
              </Link>{" "}
              for cumulative probability math.
            </p>
            <p>
              Packs with rotating Chromas (like Space) show the rate for a single
              active rotation, not the combined rate across all colors.
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
            href="/calculators/token-converter"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Token Converter
          </Link>
          <Link
            href="/packs"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Pack Details
          </Link>
        </aside>
      </main>
    </>
  );
}
