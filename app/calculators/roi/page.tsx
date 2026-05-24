import type { Metadata } from "next";
import Link from "next/link";

import { PACKS } from "@/lib/packs";
import { getMetricRate, formatPercent, calculateAtLeastOneSuccess, calculateOpenCount, type OddsMetric } from "@/lib/math";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket ROI Calculator — Best Pack Value per Token Spent",
  description:
    "Compare the expected return on token spend across all Blooket packs. See which pack gives the best value per token for Epic+, Legendary, or Chroma pulls.",
  keywords: [
    "blooket ROI calculator",
    "blooket pack value",
    "blooket best pack value",
    "blooket token efficiency",
    "blooket pack comparison",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/roi`,
    languages: {
      "en-US": `${siteUrl}/calculators/roi`,
      "x-default": `${siteUrl}/calculators/roi`,
    },
  },
  openGraph: {
    title: `ROI Calculator | ${siteName}`,
    description:
      "Compare expected return on token spend across all Blooket packs.",
    type: "website",
    url: `${siteUrl}/calculators/roi`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "ROI Calculator", item: `${siteUrl}/calculators/roi` },
]);

const METRICS: { key: OddsMetric; label: string; color: string }[] = [
  { key: "epicPlus", label: "Epic+", color: "text-violet-400" },
  { key: "legendary", label: "Legendary", color: "text-amber-400" },
  { key: "chroma", label: "Chroma", color: "text-teal-400" },
];

export default function ROICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            ROI Calculator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Pack ROI
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Which pack gives the best return per token?
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            ROI is measured as the probability of at least one success per token
            spent. Higher ROI means more bang for your buck. The table below
            ranks every pack by ROI at a 500-token budget across three rarity
            targets.
          </p>
        </section>

        {METRICS.map((metric) => {
          const ranked = PACKS.map((pack) => {
            const rate = getMetricRate(pack, metric.key);
            const opens = calculateOpenCount(500, pack, false);
            const prob = calculateAtLeastOneSuccess(rate, opens);
            const roi = rate / pack.costPerPull;

            return { pack, rate, prob, roi };
          }).sort((a, b) => b.roi - a.roi);

          return (
            <section key={metric.key} className="mt-12">
              <h2 className={`text-2xl font-bold ${metric.color}`}>
                {metric.label} ROI Rankings
              </h2>
              <p className="mt-2 text-sm text-white/50">
                Probability per token spent for at least one {metric.label} at 500 tokens
              </p>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="py-3 px-4 font-bold text-white/70">#</th>
                      <th className="py-3 px-4 font-bold text-white/70">Pack</th>
                      <th className="py-3 px-4 font-bold text-white/70">Drop Rate</th>
                      <th className="py-3 px-4 font-bold text-white/70">ROI (prob/token)</th>
                      <th className="py-3 px-4 font-bold text-white/70">P(at least 1 @ 500t)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranked.map((row, index) => (
                      <tr
                        key={row.pack.id}
                        className={`border-b border-white/[0.04] transition hover:bg-white/[0.02] ${index === 0 ? "bg-violet-500/[0.05]" : ""}`}
                      >
                        <td className="py-3 px-4 font-bold text-white/50">{index + 1}</td>
                        <td className="py-3 px-4 font-semibold text-white">
                          <Link
                            href={row.pack.isLocked ? "/packs" : `/packs#${row.pack.id}`}
                            className="hover:text-violet-300"
                          >
                            {row.pack.name}
                          </Link>
                        </td>
                        <td className="py-3 px-4 text-white/60">
                          {formatPercent(row.rate)}
                        </td>
                        <td className="py-3 px-4 text-white/70">
                          {(row.roi * 100).toFixed(4)}%
                        </td>
                        <td className="py-3 px-4 text-white/70">
                          {formatPercent(row.prob)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          );
        })}

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How ROI is calculated
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              <strong className="text-white">ROI = combined drop rate / pack price.</strong>{" "}
              A pack with a 1% Legendary rate at 20 tokens has a Legendary ROI of
              0.05% per token. A pack with a 0.5% rate at 25 tokens has an ROI of
              0.02% per token. The first pack is more than twice as efficient for
              Legendary hunting per token.
            </p>
            <p>
              ROI does not account for duplicate resell. Enable resell in the{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                main calculator
              </Link>{" "}
              for effective-cost-adjusted numbers.
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
            href="/calculators/pack-odds"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Pack Odds
          </Link>
          <Link
            href="/guides/best-blooket-pack-to-open"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Best Pack Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
