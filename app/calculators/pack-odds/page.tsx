import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";

import FaqAccordion from "@/components/FaqAccordion";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  serializeJsonLd,
  type FaqEntry,
} from "@/lib/schema";
import { formatPercent, getRarityRate } from "@/lib/math";
import { PACKS } from "@/lib/packs";
import type { Rarity } from "@/types";
import { siteName, siteUrl } from "@/lib/site";
import PackOddsInteractive from "@/components/calculators/PackOddsInteractive";

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

const faqEntries: FaqEntry[] = [
  {
    question: "What are the Blooket pack odds?",
    answer:
      "Every Blooket market pack has fixed drop rates per blook that sum to 100%. Uncommons typically land between 15% and 20% each, Rares near 10%, Epics between 2% and 5%, Legendaries between 0.2% and 1%, and Chromas between 0.02% and 0.08%. The tables on this page list the live combined rate per rarity for every pack.",
  },
  {
    question: "Which Blooket pack has the best Legendary odds?",
    answer:
      "It changes as Blooket rotates packs, so check the live reference table on this page — it ranks every market pack's combined Legendary rate. Remember that a higher Legendary rate does not always mean better value: pack cost matters too, which is what the ROI Calculator accounts for.",
  },
  {
    question: "Does a 1% drop rate guarantee a pull in 100 opens?",
    answer:
      "No. Each open is independent, so the chance of at least one success in 100 opens at 1% is 1 - 0.99^100, which is about 63.4%. Use the interactive calculator above to convert your real token budget into an honest probability.",
  },
  {
    question: "Do pack odds change with duplicate resell?",
    answer:
      "The per-open rates never change, but selling duplicate blooks back for tokens lets you afford more opens from the same starting balance. Toggling duplicate resell in the calculator uses each pack's effective cost to reflect those extra opens.",
  },
  {
    question: "Where do these drop rates come from?",
    answer:
      "Rates are compiled from publicly documented Blooket pack data and cross-checked so every pack's blook rates sum to 100%. See the methodology page for exactly how the dataset is sourced, validated, and updated.",
  },
];

const rarityColumns: { key: Rarity; label: string; className: string }[] = [
  { key: "Uncommon", label: "Uncommon", className: "text-emerald-300/80" },
  { key: "Rare", label: "Rare", className: "text-sky-300/80" },
  { key: "Epic", label: "Epic", className: "text-violet-300/80" },
  { key: "Legendary", label: "Legendary", className: "text-amber-300/80" },
  { key: "Chroma", label: "Chroma", className: "text-teal-300/80" },
];

export default function PackOddsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildFaqSchema(faqEntries)),
        }}
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
            Enter your token budget to see your live probability for each pack.
            The interactive table ranks packs by your chance of pulling at
            least one blook of your target rarity, and the reference tables
            below list the raw combined drop rate for every rarity tier in
            every Blooket market pack.
          </p>
        </section>

        <Suspense>
          <PackOddsInteractive />
        </Suspense>

        {/* Static Reference: Drop Rates per Rarity (server-rendered) */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-2">
            Reference: Drop Rates per Pack
          </h2>
          <p className="text-sm text-white/50 mb-4">
            Combined drop rates for each rarity tier in a single pack opening.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                  <th className="py-3 px-4 font-bold text-white/70">Cost</th>
                  {rarityColumns.map((col) => (
                    <th
                      key={col.key}
                      className={`py-3 px-4 font-bold ${col.className}`}
                    >
                      {col.label}
                    </th>
                  ))}
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
                        href={pack.isLocked ? "/packs" : pack.route}
                        className="hover:text-violet-300"
                      >
                        {pack.name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-white/60">
                      {pack.costPerPull} tokens
                    </td>
                    {rarityColumns.map((col) => (
                      <td key={col.key} className={`py-3 px-4 ${col.className}`}>
                        {formatPercent(getRarityRate(pack.id, col.key))}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Educational content (server-rendered) */}
        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How to read these odds
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Each percentage in the reference table is the{" "}
              <strong className="text-white">combined drop rate</strong> for
              that rarity tier in a single pack opening. For example, if a pack
              has two Legendaries at 0.5% each, the Legendary column shows
              1.0%.
            </p>
            <p>
              A 1% drop rate does <strong className="text-white">not</strong>{" "}
              mean a 1-in-100 guarantee. The real chance of pulling at least
              one Legendary from 100 opens is{" "}
              <strong className="text-white">1 - (1 - 0.01)^100 = 63.4%</strong>
              , not 100%. Use the interactive controls above to compute your
              actual probability based on your token budget.
            </p>
            <p>
              Packs with rotating Chromas (like Space) show the rate for a
              single active rotation, not the combined rate across all colors.
              If you want to see what a run of openings actually feels like at
              these rates, try the{" "}
              <Link
                href="/calculators/simulator"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Pack Opening Simulator
              </Link>
              , which rolls random pulls against this exact table.
            </p>
            <p>
              Drop rates are per-open constants set by Blooket, so your
              previous pulls never change your next pull&apos;s odds — there is
              no pity timer and no hidden streak bonus. The only lever you
              control is how many opens your tokens buy, which is why the same
              rarity can be a realistic chase in a cheap pack and a long shot
              in an expensive one. The{" "}
              <Link
                href="/calculators/roi"
                className="text-emerald-400 hover:text-emerald-300"
              >
                ROI Calculator
              </Link>{" "}
              folds pack cost into the comparison, and the{" "}
              <Link
                href="/calculators/chase"
                className="text-emerald-400 hover:text-emerald-300"
              >
                Chase Calculator
              </Link>{" "}
              turns any target blook into a concrete token budget at 50%, 90%,
              and 99% confidence.
            </p>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-2xl backdrop-blur-sm sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            FAQ
          </p>
          <h2 className="mt-3 font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
            Pack odds questions
          </h2>
          <FaqAccordion entries={faqEntries} />
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/calculators"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            All Calculators
          </Link>
          <Link
            href="/calculators/simulator"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Pack Simulator
          </Link>
          <Link
            href="/calculators/token-converter"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Token Converter
          </Link>
          <Link
            href="/calculators/roi"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            ROI Calculator
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
