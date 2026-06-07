import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import RarityQuizGame from "@/components/games/RarityQuizGame";

export const metadata: Metadata = {
  title: "Blooket Rarity Quiz — Speed Test Your Blook Knowledge",
  description:
    "A blook image appears and you have 8 seconds to pick the correct rarity. 15 rounds, all rarities included. Free Blooket speed quiz game.",
  alternates: {
    canonical: `${siteUrl}/games/rarity-quiz`,
    languages: {
      "en-US": `${siteUrl}/games/rarity-quiz`,
      "x-default": `${siteUrl}/games/rarity-quiz`,
    },
  },
  openGraph: {
    title: `Blooket Rarity Quiz | ${siteName}`,
    description: "Can you name the rarity of every blook in 8 seconds each? Speed quiz!",
    type: "website",
    url: `${siteUrl}/games/rarity-quiz`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Games", item: `${siteUrl}/games` },
  { name: "Rarity Quiz", item: `${siteUrl}/games/rarity-quiz` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blooket Rarity Quiz",
  url: `${siteUrl}/games/rarity-quiz`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "How do you play the Blooket Rarity Quiz?",
    answer: "A blook image appears on screen and you have 8 seconds to select its rarity — Common, Uncommon, Rare, Epic, Legendary, or Chroma. The quiz runs 15 rounds. Your final score depends on how many you get correct and how quickly you answered each one.",
  },
  {
    question: "What are the rarity tiers in Blooket?",
    answer: "Blooket has six rarity tiers from most to least common: Common, Uncommon, Rare, Epic, Legendary, and Chroma. Commons sell for 5 tokens; Uncommons 10; Rares 25; Epics 100; Legendaries 500; Chromas 300. Knowing these tiers by blook appearance is what the Rarity Quiz tests.",
  },
  {
    question: "Why is rarity recognition useful in real Blooket?",
    answer: "When you open packs quickly, knowing a blook's rarity on sight lets you decide instantly whether to sell a duplicate or keep it. A player who mistakes a Legendary duplicate for an Epic might sell for 100 tokens instead of 500 — a 400-token error. Rarity recognition prevents costly mis-sells.",
  },
  {
    question: "Are all rarities equally likely to appear in the quiz?",
    answer: "No — the quiz pool reflects actual drop rate distributions, so Commons and Uncommons appear more frequently than Legendaries and Chromas. This mirrors real pack-opening and trains you to recognize the most common blooks quickly while still testing your knowledge of rarer ones.",
  },
];

export default function RarityQuizPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Games</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Blooket Rarity Quiz
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            A blook image appears — pick its rarity before the 8-second timer runs out. 15 rounds covering all six rarity tiers. See how fast you can correctly identify Commons, Rares, Legendaries, and Chromas on sight.
          </p>
        </section>

        <Suspense>
          <RarityQuizGame />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">Why rarity recognition matters</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            In Blooket, every blook belongs to one of six rarity tiers — Common, Uncommon, Rare, Epic, Legendary, and Chroma — and each tier has a fixed sell value. Being able to identify a blook's rarity on sight is more than trivia: it prevents expensive mistakes when selling duplicates during fast pack-opening sessions, and it helps you estimate pack value at a glance. The Rarity Quiz trains exactly that skill, under time pressure.
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
            <Link href="/games/blookle" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Blookle</Link>
            <Link href="/guides/legendary-blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Legendary Blooks Guide</Link>
            <Link href="/guides/chroma-blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Chroma Blooks Guide</Link>
          </div>
        </section>
      </main>
    </>
  );
}
