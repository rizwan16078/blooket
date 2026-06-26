import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { getBlooksByRarity, formatRateLabel } from "@/lib/authority";
import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Get Legendary Blooks in Blooket — Pack Comparison & Drop Math",
  description:
    "Complete guide to getting Legendary blooks in Blooket. Drop rates, best packs, token budgets, and pack comparison for Legendary hunting. Updated for 2026.",
  keywords: [
    "how to get a legendary in blooket",
    "how to get legendary blooket",
    "legendary blooks",
    "legendaries in blooket",
    "blooket legendary guide",
    "best pack for legendary blooket",
    "legendary drop rate blooket",
  ],
  alternates: {
    canonical: `${siteUrl}/guides/how-to-get-legendary-blooket`,
    languages: {
      "en-US": `${siteUrl}/guides/how-to-get-legendary-blooket`,
      "x-default": `${siteUrl}/guides/how-to-get-legendary-blooket`,
    },
  },
  openGraph: {
    title: `How to Get Legendary Blooks in Blooket | ${siteName}`,
    description: "Pack comparison, drop rates, and token budgets for Legendary hunting.",
    type: "article",
    url: `${siteUrl}/guides/how-to-get-legendary-blooket`,
  },
};

const legendaryBlooks = getBlooksByRarity("Legendary");

const faqEntries: FaqEntry[] = [
  {
    question: "What is the easiest Legendary to get in Blooket?",
    answer:
      "Legendary drop rates range from 0.2% (Megalodon) to 1% (Medieval King). The easiest Legendary to pull is the Medieval King at 1% — the highest Legendary rate of any live pack, and Medieval has no Chroma to split the top-end budget.",
  },
  {
    question: "How many tokens do I need for a Legendary?",
    answer:
      "For a 50% chance at a 0.45% Legendary, you need about 154 opens (3,080 tokens at 20/pull or 3,850 at 25/pull). For a 90% chance, you need about 511 opens (10,220–12,775 tokens). Use the Chase Calculator for exact numbers.",
  },
  {
    question: "Which pack is best for Legendary hunting?",
    answer:
      "The Medieval Pack is the best live pack for Legendary hunting — its King has a 1% drop rate (the highest of any live pack) and the pack has no Chroma. The Aquatic Pack is next, with two Legendaries totaling 0.7% per open. Check the ROI Calculator for the current rankings.",
  },
  {
    question: "Is it worth chasing a specific Legendary?",
    answer:
      "Compared to Chromas, Legendaries are significantly more accessible. A 90% chance at a Legendary costs roughly 10K–13K tokens, while a 90% chance at a Chroma costs 90K–115K tokens. If you want a specific Legendary for your collection, it is a realistic target for most active players.",
  },
];

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Guides", item: `${siteUrl}/guides` },
  { name: "How to Get Legendary", item: `${siteUrl}/guides/how-to-get-legendary-blooket` },
]);

const faqSchema = buildFaqSchema(faqEntries);

export default function HowToGetLegendaryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchema) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-400">
            Strategy Guide
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            How to Get Legendary Blooks in Blooket
            <span className="mt-2 block text-xl font-medium text-amber-300">
              Pack comparison & drop math for Legendary hunting
            </span>
          </h1>
          <p className="text-lg leading-8 text-white/65">
            Legendary blooks are the second-rarest tier in Blooket with drop rates
            between 0.2% and 1%. They are significantly more accessible than
            Chromas and appear in most packs. This guide shows you the most
            token-efficient way to get one.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Total Legendaries</p>
            <p className="mt-2 text-2xl font-black text-amber-400">{legendaryBlooks.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Drop Rate Range</p>
            <p className="mt-2 text-2xl font-black text-amber-400">0.2–1%</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-amber-400">200 tokens</p>
          </div>
        </div>

        <article className="mt-10 space-y-10 text-white/70">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Why Legendaries are easier than Chromas</h2>
            <p className="leading-relaxed">
              A typical Legendary has a 0.45% drop rate — that&apos;s 9× higher than
              a 0.05% Chroma. In token terms, a 90% chance at a Legendary costs
              roughly 10K–13K tokens, while a 90% chance at a Chroma costs
              90K–115K tokens. If you&apos;re new to pack strategy, Legendary hunting
              is the best place to start.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Best packs for Legendary hunting</h2>
            <p className="leading-relaxed mb-4">
              The best live packs for Legendary hunting pair a high Legendary rate
              with a low token cost. Here are the top picks:
            </p>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="font-bold text-white">Medieval Pack (20 tokens)</p>
                <p className="text-sm text-white/50 mt-1">One Legendary (King, 1%) — the highest Legendary rate of any live pack, with no Chroma to split the top-end budget. Best overall for Legendary hunting.</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="font-bold text-white">Aquatic Pack (20 tokens)</p>
                <p className="text-sm text-white/50 mt-1">Two Legendaries (Baby Shark 0.5% + Megalodon 0.2% = 0.7% combined). The best odds of pulling some Legendary per open.</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                <p className="font-bold text-white">Lunch Pack (25 tokens)</p>
                <p className="text-sm text-white/50 mt-1">One Legendary (Sandwich, 0.65%). A strong single-Legendary rate at the higher 25-token price.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Token budget planning</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 px-3 font-bold text-white/70">Probability</th>
                    <th className="py-3 px-3 font-bold text-white/70">Opens (0.45%)</th>
                    <th className="py-3 px-3 font-bold text-white/70">Tokens (20/pull)</th>
                    <th className="py-3 px-3 font-bold text-white/70">Tokens (25/pull)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-amber-300/80">50%</td>
                    <td className="py-3 px-3 text-white/60">154</td>
                    <td className="py-3 px-3 text-white/60">3,080</td>
                    <td className="py-3 px-3 text-white/60">3,850</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-amber-300/80">90%</td>
                    <td className="py-3 px-3 text-white/60">511</td>
                    <td className="py-3 px-3 text-white/60">10,220</td>
                    <td className="py-3 px-3 text-white/60">12,775</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-amber-300/80">99%</td>
                    <td className="py-3 px-3 text-white/60">1,022</td>
                    <td className="py-3 px-3 text-white/60">20,440</td>
                    <td className="py-3 px-3 text-white/60">25,550</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Legendary vs Chroma — Which should you chase?</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08]">
                    <th className="py-3 px-3 font-bold text-white/70">Factor</th>
                    <th className="py-3 px-3 font-bold text-white/70">Legendary</th>
                    <th className="py-3 px-3 font-bold text-white/70">Chroma</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-white/60">Drop rate</td>
                    <td className="py-3 px-3 text-amber-300/80">0.2–1%</td>
                    <td className="py-3 px-3 text-teal-300/80">0.02–0.08%</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-white/60">90% token cost</td>
                    <td className="py-3 px-3 text-amber-300/80">~10K–13K</td>
                    <td className="py-3 px-3 text-teal-300/80">~90K–115K</td>
                  </tr>
                  <tr className="border-b border-white/[0.04]">
                    <td className="py-3 px-3 text-white/60">Sell value</td>
                    <td className="py-3 px-3 text-white/60">200 tokens</td>
                    <td className="py-3 px-3 text-white/60">300 tokens</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-3 text-white/60">Accessibility</td>
                    <td className="py-3 px-3 text-emerald-400">Achievable for most players</td>
                    <td className="py-3 px-3 text-red-400/70">Requires large budget</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </article>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">All Legendary Blooks — Drop Rates & Packs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-3 px-3 font-bold text-white/70">Legendary Blook</th>
                  <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                  <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                  <th className="py-3 px-3 font-bold text-white/70">Availability</th>
                </tr>
              </thead>
              <tbody>
                {legendaryBlooks.map((blook) => {
                  const pack = PACK_MAP[blook.packId];
                  return (
                    <tr key={blook.id} className="border-b border-white/[0.04] transition hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-white">
                        <Link href={`/blooks/${blook.id}`} className="hover:text-amber-300">{blook.name}</Link>
                      </td>
                      <td className="py-3 px-3 text-white/60">
                        {pack ? <Link href={`/packs#${blook.packId}`} className="text-emerald-400/70 hover:text-emerald-300">{pack.name}</Link> : blook.packId}
                      </td>
                      <td className="py-3 px-3 text-amber-300/80">{formatRateLabel(blook.dropRate)}</td>
                      <td className="py-3 px-3 text-white/50">{pack?.isLocked ? "Seasonal" : "Live"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">FAQ</h2>
          <div className="space-y-4">
            {faqEntries.map((entry, index) => (
              <div key={index} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <h3 className="font-bold text-white">{entry.question}</h3>
                <p className="mt-2 text-sm leading-7 text-white/60">{entry.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/blooks/legendary" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Legendary Blooks
          </Link>
          <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chase Calculator
          </Link>
          <Link href="/calculators/roi" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            ROI Calculator
          </Link>
          <Link href="/guides/how-to-get-chroma-blooket" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            How to Get Chroma
          </Link>
          <Link href="/guides" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Guides
          </Link>
        </aside>
      </main>
    </>
  );
}
