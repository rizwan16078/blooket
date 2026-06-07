import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import GuessTheBlookGame from "@/components/games/GuessTheBlookGame";

export const metadata: Metadata = {
  title: "Guess the Blook! — Blooket Mini Game",
  description:
    "A blurred blook image is shown — can you name it? Test your Blooket blook knowledge with this free picture-guessing mini game. All rarities included.",
  alternates: {
    canonical: `${siteUrl}/games/guess-the-blook`,
    languages: {
      "en-US": `${siteUrl}/games/guess-the-blook`,
      "x-default": `${siteUrl}/games/guess-the-blook`,
    },
  },
  openGraph: {
    title: `Guess the Blook! | ${siteName}`,
    description: "Can you identify the blurred blook? Test your Blooket knowledge!",
    type: "website",
    url: `${siteUrl}/games/guess-the-blook`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Games", item: `${siteUrl}/games` },
  { name: "Guess the Blook", item: `${siteUrl}/games/guess-the-blook` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Guess the Blook",
  url: `${siteUrl}/games/guess-the-blook`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "How do you play Guess the Blook?",
    answer: "A blurred or silhouetted blook image appears on screen. Type or select the blook's name before the timer runs out. The image sharpens slightly with each wrong guess, giving you more visual information — but fewer points per round.",
  },
  {
    question: "How many blooks are in the Guess the Blook game?",
    answer: "The game includes blooks from all rarities — Common, Uncommon, Rare, Epic, Legendary, and Chroma. The random pool covers blooks from every current Blooket pack, so knowing rarer blooks by silhouette is a real advantage.",
  },
  {
    question: "Does playing this help you in real Blooket?",
    answer: "Yes — recognizing blooks on sight helps you evaluate pack pulls faster and reduces the chance of accidentally selling a rare duplicate before you register what it is. It also sharpens your rarity recognition, which feeds directly into the Rarity Quiz.",
  },
  {
    question: "Are Chroma and Legendary blooks included?",
    answer: "Yes. All rarity tiers are included in the pool, including Chromas and Legendaries. These are the hardest to identify by silhouette since many players have never seen them in-game — which makes guessing them correctly the most satisfying.",
  },
];

export default function GuessTheBlookPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Games</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Guess the Blook
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            A blurred blook appears — can you name it before it comes into focus? Free Blooket mini game covering all rarities. The faster you guess, the better your score.
          </p>
        </section>

        <Suspense>
          <GuessTheBlookGame />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">Test your blook knowledge</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            Blooket has hundreds of blooks across all rarity tiers, and most players can only reliably identify the ones they have personally pulled. This game challenges that by showing every blook — including Legendaries and Chromas you may never have seen — and testing whether you can name it from its silhouette alone.
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
            <Link href="/games/blookle" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Blookle</Link>
            <Link href="/games/rarity-quiz" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Rarity Quiz</Link>
            <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Blook Library</Link>
            <Link href="/calculators" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Calculators</Link>
          </div>
        </section>
      </main>
    </>
  );
}
