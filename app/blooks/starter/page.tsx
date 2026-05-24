import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Starter Blooks — What You Get Before Opening Any Pack",
  description:
    "Every blook you start with in Blooket before spending a single token. The complete starter blook list with rarities and sell values.",
  keywords: [
    "blooket starter blooks",
    "blooket starting blooks",
    "blooket default blooks",
    "blooket free blooks",
    "blooket beginning blooks",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks/starter`,
    languages: {
      "en-US": `${siteUrl}/blooks/starter`,
      "x-default": `${siteUrl}/blooks/starter`,
    },
  },
  openGraph: {
    title: `Starter Blooks | ${siteName}`,
    description:
      "Every blook you start with in Blooket before spending a single token.",
    type: "website",
    url: `${siteUrl}/blooks/starter`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Blooks", item: `${siteUrl}/blooks` },
  { name: "Starter", item: `${siteUrl}/blooks/starter` },
]);

const STARTER_BLOOKS = [
  { name: "Red Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Blue Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Green Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Pink Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Orange Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Yellow Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Cyan Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Lime Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Brown Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Black Astronaut", rarity: "Common", sellValue: 0 },
  { name: "White Astronaut", rarity: "Common", sellValue: 0 },
  { name: "Purple Astronaut", rarity: "Common", sellValue: 0 },
];

export default function StarterBlooksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Starter Blooks
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket Starter Blooks
            <span className="mt-2 block text-xl font-medium text-violet-300">
              What you get before opening any pack
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            When you create a Blooket account, you start with a set of default
            blooks. These are all Common rarity and cannot be sold for tokens.
            Every player gets the same starter set.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Starter Blooks</p>
            <p className="mt-2 text-2xl font-black text-white">{STARTER_BLOOKS.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Rarity</p>
            <p className="mt-2 text-2xl font-black text-white">Common</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-white">0 tokens</p>
          </div>
        </div>

        <div className="mt-10 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/[0.08]">
                <th className="py-3 px-3 font-bold text-white/70">Starter Blook</th>
                <th className="py-3 px-3 font-bold text-white/70">Rarity</th>
                <th className="py-3 px-3 font-bold text-white/70">Sell Value</th>
              </tr>
            </thead>
            <tbody>
              {STARTER_BLOOKS.map((blook) => (
                <tr
                  key={blook.name}
                  className="border-b border-white/[0.04] transition hover:bg-white/[0.02]"
                >
                  <td className="py-3 px-3 font-semibold text-white">{blook.name}</td>
                  <td className="py-3 px-3 text-white/60">{blook.rarity}</td>
                  <td className="py-3 px-3 text-white/50">{blook.sellValue} tokens</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="mt-12 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">Getting your first real blook</h2>
          <div className="mt-4 space-y-3 text-sm leading-7 text-white/60">
            <p>
              Starter blooks are cosmetic only and cannot be sold. To start
              collecting, you need to earn tokens by playing games and then open
              packs. The cheapest packs cost 20 tokens per pull.
            </p>
            <p>
              New players should focus on{" "}
              <Link href="/guides/blooket-tokens" className="text-emerald-400 hover:text-emerald-300">
                earning tokens efficiently
              </Link>{" "}
              and then use the{" "}
              <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">
                ROI Calculator
              </Link>{" "}
              to find the best pack for their goals.
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
          <Link href="/guides/blooket-tokens" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Token Guide
          </Link>
        </aside>
      </main>
    </>
  );
}
