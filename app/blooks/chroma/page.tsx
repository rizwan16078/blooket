import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { getBlooksByRarity, getRaritySummary, formatRateLabel } from "@/lib/authority";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Chroma Blooks in Blooket — Drop Rates, Packs & Chase Odds",
  description:
    "Browse every Chroma blook in Blooket with pack, drop rate, and chase strategy. The complete Chroma hub for collectors and probability-minded players.",
  keywords: [
    "chroma blooks",
    "all chroma blooks",
    "blooket chroma",
    "rarest blooks",
    "blooket chroma odds",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks/chroma`,
    languages: {
      "en-US": `${siteUrl}/blooks/chroma`,
      "x-default": `${siteUrl}/blooks/chroma`,
    },
  },
  openGraph: {
    title: `All Chroma Blooks | ${siteName}`,
    description:
      "Every Chroma blook with pack, drop rate, and chase strategy.",
    type: "website",
    url: `${siteUrl}/blooks/chroma`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Blooks", item: `${siteUrl}/blooks` },
  { name: "Chroma", item: `${siteUrl}/blooks/chroma` },
]);

const summary = getRaritySummary("Chroma");
const chromaBlooks = getBlooksByRarity("Chroma");

export default function ChromaBlooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-400">
            Rarity Hub
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            All Chroma Blooks
            <span className="mt-2 block text-xl font-medium text-teal-300">
              The rarest pulls you can get from packs
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Chromas sit above Legendaries in the Blooket rarity ladder. They are
            the rarest blooks obtainable from pack openings, with drop rates
            ranging from {formatRateLabel(summary.lowestRate)} to{" "}
            {formatRateLabel(summary.highestRate)}. This hub lists every Chroma
            in the game with its pack and drop rate.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Total Chromas</p>
            <p className="mt-2 text-2xl font-black text-teal-400">{summary.count}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Across Packs</p>
            <p className="mt-2 text-2xl font-black text-teal-400">{summary.packCount}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-teal-400">300 tokens</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Chroma Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
                <th className="py-3 px-3 font-bold text-white/70">Availability</th>
              </tr>
            </thead>
            <tbody>
              {chromaBlooks.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                return (
                  <tr
                    key={blook.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <Link href={`/blooks/${blook.id}`} className="hover:text-teal-300">
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
                    <td className="py-3 px-3 text-teal-300/80">
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
          <h2 className="text-2xl font-bold text-white">Chroma hunting strategy</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Chroma drop rates range from 0.01% to 0.08% per pull. At those rates,
              even 1,000 tokens only gives you a modest chance. The{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>{" "}
              shows exact token budgets for each Chroma.
            </p>
            <p>
              The Ice Monster Pack has the highest combined Chroma rate (0.15%)
              across three Chromas, making it the best pack for Chroma hunting
              per token. See the{" "}
              <Link href="/guides/best-pack-for-chromas" className="text-emerald-400 hover:text-emerald-300">
                Best Pack for Chromas guide
              </Link>{" "}
              for the full breakdown.
            </p>
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Blooks
          </Link>
          <Link href="/blooks/legendary" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Legendary Hub
          </Link>
          <Link href="/guides/chroma-blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chroma Guide
          </Link>
          <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chase Calculator
          </Link>
        </aside>
      </main>
    </>
  );
}
