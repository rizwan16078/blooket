import type { Metadata } from "next";
import Link from "next/link";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { getBlooksByRarity, formatRateLabel } from "@/lib/authority";
import { buildBreadcrumbSchema, buildFaqSchema, buildHowToSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "How to Get a Chroma in Blooket — 7 Proven Strategies (2026)",
  description:
    "Complete guide to getting Chroma blooks in Blooket. Drop rates, best packs, token budgets, chase math, and 7 strategies ranked by efficiency. Updated for 2026.",
  keywords: [
    "how to get a chroma in blooket",
    "how to get chroma in blooket",
    "chroma blooks",
    "chromas in blooket",
    "every chroma in blooket",
    "blooket chroma guide",
    "chroma farming blooket",
    "fastest way to get chroma blooket",
  ],
  alternates: {
    canonical: `${siteUrl}/guides/how-to-get-chroma-blooket`,
    languages: {
      "en-US": `${siteUrl}/guides/how-to-get-chroma-blooket`,
      "x-default": `${siteUrl}/guides/how-to-get-chroma-blooket`,
    },
  },
  openGraph: {
    title: `How to Get a Chroma in Blooket | ${siteName}`,
    description: "7 proven strategies to get Chroma blooks — drop rates, best packs, and token budgets.",
    type: "article",
    url: `${siteUrl}/guides/how-to-get-chroma-blooket`,
  },
};

const chromaBlooks = getBlooksByRarity("Chroma");

const faqEntries: FaqEntry[] = [
  {
    question: "What is the easiest Chroma to get in Blooket?",
    answer:
      "The easiest Chroma to pull is the one with the highest drop rate: Ice Slime in the Ice Monster Pack at 0.08%. That same pack also has the highest combined Chroma rate (0.15% across Ice Slime, Frozen Fossil, and Ice Crab), so it is the best pack to open for any Chroma.",
  },
  {
    question: "How many tokens do I need to get a Chroma?",
    answer:
      "For a 50% chance at a single 0.05% Chroma, you need approximately 1,381 opens (27,620 tokens at 20/pull or 34,525 at 25/pull). For a 90% chance, you need about 4,603 opens (92,060–115,075 tokens). Use the Chase Calculator for exact numbers for any specific Chroma.",
  },
  {
    question: "Can I get a Chroma for free in Blooket?",
    answer:
      "You cannot get a Chroma without opening packs, which requires tokens. Tokens are earned through gameplay. There is no free Chroma giveaway or unlock method. The fastest path is to earn tokens efficiently and spend them on the pack with the best Chroma rate for your budget.",
  },
  {
    question: "Which pack has the most Chromas?",
    answer:
      "The Ice Monster Pack has 3 Chromas (Ice Crab, Frozen Fossil, Ice Slime), giving it the highest combined Chroma rate at 0.15% per pull. The Space Pack has 7 Chromas (Colored Astronauts), but only one is active at a time, so the effective rate is still 0.05% per pull.",
  },
];

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Guides", item: `${siteUrl}/guides` },
  { name: "How to Get Chroma", item: `${siteUrl}/guides/how-to-get-chroma-blooket` },
]);

const faqSchema = buildFaqSchema(faqEntries);

const howToSchema = buildHowToSchema({
  name: "How to Get a Chroma in Blooket",
  description:
    "Seven strategies to maximize your odds of pulling a Chroma blook in Blooket, ranked by token efficiency.",
  url: `${siteUrl}/guides/how-to-get-chroma-blooket`,
  steps: [
    { name: "Open the Ice Monster Pack", text: "The Ice Monster Pack has the highest combined Chroma rate in the game at 0.15% per pull (Ice Slime 0.08%, Frozen Fossil 0.05%, Ice Crab 0.02%). If your goal is any Chroma, this is the pack to open." },
    { name: "Target the highest-rate Chroma", text: "Ice Slime in the Ice Monster Pack is the highest-rate Chroma at 0.08% — about 60% more likely per pull than a 0.05% Chroma. Target it first if you want any Chroma for sell value or collection status." },
    { name: "Use the Chase Calculator before spending", text: "The Chase Calculator shows exactly how many tokens you need for a 50%, 90%, or 99% chance at a specific Chroma. A 0.05% Chroma at 90% confidence needs about 4,603 opens." },
    { name: "Enable duplicate resell", text: "Sell duplicates for tokens based on rarity. Chroma duplicates sell for 300 tokens — 12 to 15 free pulls of value per duplicate." },
    { name: "Save for bulk sessions", text: "Cumulative probability compounds, so one large session beats many small ones. Save at least 1,000 to 1,250 tokens (about 50 opens) before spending." },
    { name: "Avoid seasonal packs unless they are live", text: "Seasonal packs like Blizzard, Spooky, and Autumn are locked most of the year and their Chroma rates are comparable to full-time packs. Open the always-available Ice Monster Pack instead." },
    { name: "Compare ROI before committing", text: "The ROI Calculator ranks packs by probability per token spent so you can confirm which pack gives the most Chroma probability for your budget." },
  ],
});

export default function HowToGetChromaPage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(howToSchema) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-400">
            Strategy Guide
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            How to Get a Chroma in Blooket{" "}
            <span className="mt-2 block text-xl font-medium text-teal-300">
              7 proven strategies ranked by token efficiency
            </span>
          </h1>
          <p className="text-lg leading-8 text-white/65">
            Chroma blooks are the rarest tier in Blooket with drop rates between
            0.02% and 0.08%. This guide covers every strategy to maximize your
            chances, from pack selection to token budgeting.
          </p>
        </section>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Total Chromas</p>
            <p className="mt-2 text-2xl font-black text-teal-400">{chromaBlooks.length}</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Drop Rate Range</p>
            <p className="mt-2 text-2xl font-black text-teal-400">0.02–0.08%</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Sell Value</p>
            <p className="mt-2 text-2xl font-black text-teal-400">300 tokens</p>
          </div>
        </div>

        <article className="mt-10 space-y-10 text-white/70">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #1: Open the Ice Monster Pack</h2>
            <p className="leading-relaxed">
              The Ice Monster Pack has the highest combined Chroma rate in the game
              at 0.15% per pull (Ice Slime 0.08%, Frozen Fossil 0.05%, Ice Crab 0.02%).
              At 25 tokens per pull, that gives you the best per-token Chroma
              probability of any pack. If your only goal is &ldquo;any Chroma,&rdquo; this is the pack to open.
            </p>
            <p className="mt-3 leading-relaxed">
              Compare: the Space Pack also has 0.05% per Chroma, but only one
              Colored Astronaut is active at a time, so the effective rate is the
              same as a single-Chroma pack. Ice Monster gives you three shots per pull.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #2: Target the highest-drop-rate Chromas</h2>
            <p className="leading-relaxed">
              Not all Chromas are equally rare. The highest-rate Chroma in the game
              is Ice Slime (Ice Monster Pack) at 0.08% — roughly 60% more likely per
              pull than a 0.05% Chroma like Frozen Fossil. If you want any Chroma
              for the sell value or collection status rather than a specific one,
              target Ice Slime first.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #3: Use the Chase Calculator before spending</h2>
            <p className="leading-relaxed">
              Never open packs without knowing your probability. The{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>{" "}
              shows you exactly how many tokens you need for a 50%, 90%, or 99%
              chance at any specific Chroma. For a 0.05% Chroma at 90% confidence,
              you need ~4,603 opens — that&apos;s 92,060 tokens at 20/pull. Most players
              spend far less and wonder why they never get one.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #4: Enable duplicate resell</h2>
            <p className="leading-relaxed">
              When you pull a duplicate, sell it for tokens based on its rarity.
              Chroma duplicates sell for 300 tokens — that&apos;s 12–15 free pulls worth
              of value per dupe. Even Common duplicates (2 tokens each) add up over
              hundreds of opens. The calculator&apos;s &ldquo;Dupe Refund&rdquo; toggle shows how
              much this saves you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #5: Save for bulk sessions</h2>
            <p className="leading-relaxed">
              Probability works on cumulative opens. One 1,000-token session gives
              you a much higher chance than ten 100-token sessions, because the
              cumulative formula compounds. Save your tokens until you can afford
              at least 50 opens (1,000–1,250 tokens) before spending.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #6: Avoid seasonal packs unless they&apos;re live</h2>
            <p className="leading-relaxed">
              Some packs (Blizzard, Spooky, Autumn) are seasonal and locked for
              most of the year. Even when live, their Chroma rates are comparable
              to full-time packs. Don&apos;t wait for a seasonal pack — open the
              Ice Monster Pack instead, which is always available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">Strategy #7: Compare ROI before committing</h2>
            <p className="leading-relaxed">
              The{" "}
              <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">
                ROI Calculator
              </Link>{" "}
              ranks packs by probability per token spent. If you&apos;re deciding
              between two packs, check the ROI first — one pack may give you 40%
              more Chroma probability per token than another.
            </p>
          </section>
        </article>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">All Chroma Blooks — Drop Rates & Packs</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-3 px-3 font-bold text-white/70">Chroma Blook</th>
                  <th className="py-3 px-3 font-bold text-white/70">Pack</th>
                  <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                  <th className="py-3 px-3 font-bold text-white/70">Availability</th>
                </tr>
              </thead>
              <tbody>
                {chromaBlooks.map((blook) => {
                  const pack = PACK_MAP[blook.packId];
                  return (
                    <tr key={blook.id} className="border-b border-white/[0.04] transition hover:bg-white/[0.02]">
                      <td className="py-3 px-3 font-semibold text-white">
                        <Link href={`/blooks/${blook.id}`} className="hover:text-teal-300">{blook.name}</Link>
                      </td>
                      <td className="py-3 px-3 text-white/60">
                        {pack ? <Link href={`/packs#${blook.packId}`} className="text-emerald-400/70 hover:text-emerald-300">{pack.name}</Link> : blook.packId}
                      </td>
                      <td className="py-3 px-3 text-teal-300/80">{formatRateLabel(blook.dropRate)}</td>
                      <td className="py-3 px-3 text-white/50">{pack?.isLocked ? "Seasonal" : "Live"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-4">Chroma Token Budget Cheat Sheet</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="py-3 px-3 font-bold text-white/70">Drop Rate</th>
                  <th className="py-3 px-3 font-bold text-white/70">50% Chance</th>
                  <th className="py-3 px-3 font-bold text-white/70">90% Chance</th>
                  <th className="py-3 px-3 font-bold text-white/70">99% Chance</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-3 px-3 text-teal-300/80">0.08%</td>
                  <td className="py-3 px-3 text-white/60">866 opens</td>
                  <td className="py-3 px-3 text-white/60">2,877 opens</td>
                  <td className="py-3 px-3 text-white/60">5,756 opens</td>
                </tr>
                <tr className="border-b border-white/[0.04]">
                  <td className="py-3 px-3 text-teal-300/80">0.05%</td>
                  <td className="py-3 px-3 text-white/60">1,386 opens</td>
                  <td className="py-3 px-3 text-white/60">4,603 opens</td>
                  <td className="py-3 px-3 text-white/60">9,210 opens</td>
                </tr>
                <tr>
                  <td className="py-3 px-3 text-teal-300/80">0.02%</td>
                  <td className="py-3 px-3 text-white/60">3,466 opens</td>
                  <td className="py-3 px-3 text-white/60">11,512 opens</td>
                  <td className="py-3 px-3 text-white/60">23,024 opens</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-white/40">
            Token cost = opens × pack cost. E.g., 1,386 opens × 20 tokens = 27,720 tokens for 50% at 0.05%.
          </p>
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
          <Link href="/blooks/chroma" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Chroma Blooks
          </Link>
          <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chase Calculator
          </Link>
          <Link href="/calculators/roi" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            ROI Calculator
          </Link>
          <Link href="/guides/how-to-get-legendary-blooket" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            How to Get Legendary
          </Link>
          <Link href="/guides" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Guides
          </Link>
        </aside>
      </main>
    </>
  );
}
