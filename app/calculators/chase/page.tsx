import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { calculateAtLeastOneSuccess, formatPercent, formatTokenLabel } from "@/lib/math";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Chase Calculator — Token Budget for Any Blook at 50%, 90% & 99%",
  description:
    "Target a specific Blooket blook and see exactly how many tokens and packs you need for a 50%, 90%, or 99% chance of pulling it.",
  keywords: [
    "blooket chase calculator",
    "blooket specific blook odds",
    "how many tokens for blooket blook",
    "blooket target blook",
    "blooket chase probability",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/chase`,
    languages: {
      "en-US": `${siteUrl}/calculators/chase`,
      "x-default": `${siteUrl}/calculators/chase`,
    },
  },
  openGraph: {
    title: `Chase Calculator | ${siteName}`,
    description:
      "See how many tokens you need for a 50%, 90%, or 99% chance at any Blooket blook.",
    type: "website",
    url: `${siteUrl}/calculators/chase`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Chase Calculator", item: `${siteUrl}/calculators/chase` },
]);

function tokensForProbability(dropRate: number, packCost: number, targetProb: number) {
  if (dropRate <= 0) return Infinity;
  const n = Math.log(1 - targetProb) / Math.log(1 - dropRate);
  return Math.ceil(n) * packCost;
}

const CHASE_BLOOKS = BLOOKS.filter(
  (b) => b.rarity === "Chroma" || b.rarity === "Legendary",
).sort((a, b) => a.dropRate - b.dropRate);

export default function ChaseCalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Chase Calculator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Chase Calculator
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Token budgets for specific blook targets
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Pick a blook you want to chase. The table shows how many tokens you
            need for a 50%, 90%, or 99% chance of pulling it at least once. These
            are theoretical minimums — use the{" "}
            <Link href="/" className="text-emerald-400 hover:text-emerald-300">
              main calculator
            </Link>{" "}
            for interactive simulation.
          </p>
        </section>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Rarity</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-emerald-400">50% Chance</th>
                <th className="py-3 px-3 font-bold text-amber-400">90% Chance</th>
                <th className="py-3 px-3 font-bold text-red-400">99% Chance</th>
              </tr>
            </thead>
            <tbody>
              {CHASE_BLOOKS.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                if (!pack) return null;

                const cost = pack.costPerPull;
                const t50 = tokensForProbability(blook.dropRate, cost, 0.5);
                const t90 = tokensForProbability(blook.dropRate, cost, 0.9);
                const t99 = tokensForProbability(blook.dropRate, cost, 0.99);

                return (
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
                      <Link
                        href={`/packs#${blook.packId}`}
                        className="text-emerald-400/70 hover:text-emerald-300"
                      >
                        {pack.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-white/60">
                      {formatPercent(blook.dropRate)}
                    </td>
                    <td className="py-3 px-3 text-emerald-300/80">
                      {t50 === Infinity ? "N/A" : formatTokenLabel(t50)}
                    </td>
                    <td className="py-3 px-3 text-amber-300/80">
                      {t90 === Infinity ? "N/A" : formatTokenLabel(t90)}
                    </td>
                    <td className="py-3 px-3 text-red-300/80">
                      {t99 === Infinity ? "N/A" : formatTokenLabel(t99)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            How chase math works
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              The formula is{" "}
              <strong className="text-white">n = log(1 - P) / log(1 - p)</strong>,
              where P is your target probability and p is the single-pull drop rate.
              Multiply n by the pack cost to get the token budget.
            </p>
            <p>
              A 50% chance is the &quot;coin flip&quot; threshold — you are as likely
              to succeed as not. A 90% chance is a strong bet but still fails 1 in 10
              times. A 99% chance is near-certain but extremely expensive for
              ultra-rare blooks.
            </p>
            <p>
              These numbers assume no duplicate resell. Enable resell in the{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                main calculator
              </Link>{" "}
              for effective-cost-adjusted budgets.
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
            href="/calculators/value"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Value Calculator
          </Link>
          <Link
            href="/guides/chroma-blooks"
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
          >
            Chroma Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
