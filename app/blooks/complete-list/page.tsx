import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP, SELL_VALUES } from "@/lib/constants";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Blooks in Blooket — Complete Visual Library (172 Blooks)",
  description:
    "Every blook in Blooket listed with rarity, pack, drop rate, and sell value. The complete 172-blook library sorted by rarity from Chroma to Common.",
  keywords: [
    "all blooks in blooket",
    "every blook in blooket",
    "complete blook list",
    "blooket blook list",
    "all blooks",
    "blooket every blook",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks/complete-list`,
    languages: {
      "en-US": `${siteUrl}/blooks/complete-list`,
      "x-default": `${siteUrl}/blooks/complete-list`,
    },
  },
  openGraph: {
    title: `All Blooks in Blooket | ${siteName}`,
    description: "Every blook in Blooket — 172 blooks with rarity, pack, drop rate, and sell value.",
    type: "website",
    url: `${siteUrl}/blooks/complete-list`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Blooks", item: `${siteUrl}/blooks` },
  { name: "Complete List", item: `${siteUrl}/blooks/complete-list` },
]);

const RARITY_ORDER = ["Chroma", "Legendary", "Epic", "Rare", "Uncommon", "Common"] as const;

const sortedBlooks = [...BLOOKS].sort((a, b) => {
  const aIndex = RARITY_ORDER.indexOf(a.rarity);
  const bIndex = RARITY_ORDER.indexOf(b.rarity);
  if (aIndex !== bIndex) return aIndex - bIndex;
  return a.name.localeCompare(b.name);
});

export default function CompleteBlookListPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-6xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Complete Library
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            All Blooks in Blooket
            <span className="mt-2 block text-xl font-medium text-violet-300">
              172 blooks — complete visual library
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Every blook in the game, sorted by rarity from Chroma down to Common.
            Click any blook name to see its detail page with chase odds and
            probability analysis.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-6">
          {RARITY_ORDER.map((rarity) => {
            const count = BLOOKS.filter((b) => b.rarity === rarity).length;
            return (
              <div key={rarity} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg text-center">
                <p className="text-2xl font-black text-white">{count}</p>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/40">{rarity}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Rarity</th>
                <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
              </tr>
            </thead>
            <tbody>
              {sortedBlooks.map((blook) => {
                const pack = PACK_MAP[blook.packId];
                const percent = (blook.dropRate * 100).toFixed(2);
                return (
                  <tr
                    key={blook.id}
                    className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                  >
                    <td className="py-3 px-3 font-semibold text-white">
                      <Link href={`/blooks/${blook.id}`} className="hover:text-violet-300">
                        {blook.name}
                      </Link>
                    </td>
                    <td className="py-3 px-3 text-white/60">{blook.rarity}</td>
                    <td className="py-3 px-3 text-white/60">
                      {pack ? (
                        <Link href={`/packs#${blook.packId}`} className="text-emerald-400/70 hover:text-emerald-300">
                          {pack.name}
                        </Link>
                      ) : blook.packId}
                    </td>
                    <td className="py-3 px-3 text-white/50">{percent}%</td>
                    <td className="py-3 px-3 text-white/50">{blook.sellValue} tokens</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">About this list</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              This table contains all 172 indexed blooks in Blooket, sorted by rarity
              from the rarest (Chroma) to the most common (Common). Data is sourced
              from the same constants that power the calculator, so the drop rates
              and sell values are always in sync.
            </p>
            <p>
              For rarity-specific views, use the hub pages:{" "}
              <Link href="/blooks/chroma" className="text-emerald-400 hover:text-emerald-300">Chroma</Link>,{" "}
              <Link href="/blooks/legendary" className="text-emerald-400 hover:text-emerald-300">Legendary</Link>,{" "}
              <Link href="/blooks/epic" className="text-emerald-400 hover:text-emerald-300">Epic</Link>,{" "}
              <Link href="/blooks/rare" className="text-emerald-400 hover:text-emerald-300">Rare</Link>,{" "}
              <Link href="/blooks/uncommon" className="text-emerald-400 hover:text-emerald-300">Uncommon</Link>.
            </p>
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Blook Library
          </Link>
          <Link href="/value-guide" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Value Guide
          </Link>
          <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chase Calculator
          </Link>
          <Link href="/calculators/value" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Value Calculator
          </Link>
        </aside>
      </main>
    </>
  );
}
