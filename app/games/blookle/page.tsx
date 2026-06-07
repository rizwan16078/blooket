import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import BlookleGame from "@/components/games/BlookleGame";

export const metadata: Metadata = {
  title: "Blookle — Guess the Blooket Blook in 6 Tries",
  description:
    "Guess the mystery Blooket blook in 6 tries. Each guess reveals clues about rarity, pack, drop rate, and sell value — a Wordle-style game for Blooket players.",
  alternates: {
    canonical: `${siteUrl}/games/blookle`,
    languages: {
      "en-US": `${siteUrl}/games/blookle`,
      "x-default": `${siteUrl}/games/blookle`,
    },
  },
  openGraph: {
    title: `Blookle | ${siteName}`,
    description: "Guess the mystery blook in 6 tries with Wordle-style clue feedback!",
    type: "website",
    url: `${siteUrl}/games/blookle`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Games", item: `${siteUrl}/games` },
  { name: "Blookle", item: `${siteUrl}/games/blookle` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blookle",
  url: `${siteUrl}/games/blookle`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "How do you play Blookle?",
    answer: "Each round a mystery blook is selected. You have 6 guesses to identify it. After each guess, color-coded clues reveal how your guess compares to the target across attributes like rarity, pack, drop rate, and sell value — green means exact match, yellow means close, grey means far off.",
  },
  {
    question: "What clues does Blookle give after each guess?",
    answer: "Blookle compares your guess to the target on rarity, pack origin, drop rate tier, and sell value. Arrows indicate whether the target attribute is higher or lower than your guess. Use these clues to narrow the field of ~200 blooks down to the correct answer within 6 tries.",
  },
  {
    question: "Is Blookle the same puzzle for everyone?",
    answer: "Yes, the daily Blookle puzzle is the same for every player on a given day. Your streak counts how many consecutive days you have solved the puzzle — and you can share your result grid without spoiling the answer.",
  },
  {
    question: "Does knowing blook rarities and drop rates help in Blookle?",
    answer: "Significantly. Since drop rate and rarity are two of the hint attributes, players who know that Chromas sit between 0.05% and 0.15% and Legendaries between 0.25% and 1.5% can eliminate huge swaths of the blook pool in one or two guesses. The blook library and drop rates guide are good preparation.",
  },
];

export default function BlooklePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Games</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Blookle
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            Guess the mystery Blooket blook in 6 tries. After each guess, clues reveal whether the target blook has a higher or lower rarity, drop rate, sell value, and more — Wordle-style, for Blooket players.
          </p>
        </section>

        <Suspense>
          <BlookleGame />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">How Blookle works</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            Blookle applies the Wordle format to the Blooket blook catalog. Every day a new blook is selected as the target, and you have six guesses to identify it. After each guess, the game compares your pick to the mystery blook across several attributes and color-codes each cell — so you progressively narrow the search space using logic rather than pure luck. Knowing rarity tiers, pack contents, and drop rates will dramatically improve your solve rate.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
                <p className="font-bold text-white">{faq.question}</p>
                <p className="mt-2 text-sm leading-7 text-white/50">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/games/guess-the-blook" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Guess the Blook</Link>
            <Link href="/games/rarity-quiz" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Rarity Quiz</Link>
            <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Blook Library</Link>
            <Link href="/guides/blooket-drop-rates" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Drop Rates Guide</Link>
          </div>
        </section>
      </main>
    </>
  );
}
