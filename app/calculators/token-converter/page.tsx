import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import TokenConverterInteractive from "@/components/calculators/TokenConverterInteractive";

export const metadata: Metadata = {
  title: "Blooket Token to Pack Converter — How Many Packs Can You Open?",
  description:
    "Enter your Blooket token balance and instantly see how many packs you can open for every market pack, with and without duplicate sell-back tokens factored in.",
  keywords: [
    "blooket token calculator",
    "blooket token converter",
    "how many blooket packs can I open",
    "blooket pack count",
    "blooket token budget",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/token-converter`,
    languages: {
      "en-US": `${siteUrl}/calculators/token-converter`,
      "x-default": `${siteUrl}/calculators/token-converter`,
    },
  },
  openGraph: {
    title: `Blooket Token → Pack Converter | ${siteName}`,
    description:
      "See how many packs your tokens can buy across all Blooket market packs.",
    type: "website",
    url: `${siteUrl}/calculators/token-converter`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Token Converter", item: `${siteUrl}/calculators/token-converter` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blooket Token to Pack Converter",
  url: `${siteUrl}/calculators/token-converter`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "How many packs can I open with 500 tokens in Blooket?",
    answer: "With 500 tokens you can open 20 standard packs at 25 tokens each, 10 mid-tier packs at 50 tokens each, or a mix of any packs from the Blooket market. The token converter shows your pack count for every available pack simultaneously so you can plan across all options at once.",
  },
  {
    question: "How much does a Blooket pack cost in tokens?",
    answer: "Pack prices range from 20 to 75 tokens depending on the pack. Standard packs like Space, Dino, and Rainbow cost 25 tokens. Seasonal and rarer packs typically cost 50 tokens. The token converter lists the cost for every pack in the current Blooket market.",
  },
  {
    question: "Can I earn tokens back from duplicate sells to open more packs?",
    answer: "Yes. When you pull a blook you already own, Blooket refunds tokens based on its rarity — 5 for Commons, 10 for Uncommons, 25 for Rares, 100 for Epics, 500 for Legendaries, and 300 for Chromas. Enable the duplicate sell-back toggle in the converter to see how many additional packs those refunds can fund.",
  },
  {
    question: "What is the fastest way to earn 500 tokens per day in Blooket?",
    answer: "The daily token cap is 500 tokens, reset at midnight EST. Cafe mode with easy quiz sets earns around 90 tokens per 7-minute round, reaching the cap in about 4 rounds (roughly 28 minutes). Factory mode is a close second. See the full farming breakdown in our token farming guide.",
  },
];

export default function TokenConverterPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Tools</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Blooket Token to Pack Converter
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            Enter your token balance and instantly see how many packs you can open for every Blooket market pack. Toggle duplicate sell-back to account for the tokens you earn back from duplicate blooks — and plan your next pack-opening session before you spend a single token.
          </p>
        </section>

        <Suspense>
          <TokenConverterInteractive />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">How Blooket tokens and packs work</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            Tokens are Blooket's primary currency, earned by playing game modes up to the daily 500-token cap. Each pack in the Blooket market has a fixed token price. Once you open a pack, your result is determined by a random draw against the pack's drop rate table — and if you pull a blook you already own, the game automatically refunds tokens based on the blook's rarity tier.
          </p>
          <p className="mt-4 text-base leading-7 text-white/55">
            The token-to-pack converter helps you decide where to spend before you commit. It shows gross pack count (tokens ÷ pack price) and, with sell-back enabled, net effective pack count accounting for the refund value of expected duplicates over many openings. For a full breakdown of what each blook is worth to sell, see the{" "}
            <Link href="/calculators/value" className="text-violet-400 hover:text-violet-300">value calculator</Link>.{" "}
            To calculate how many tokens you need for a specific blook target, use the{" "}
            <Link href="/calculators/chase" className="text-violet-400 hover:text-violet-300">chase calculator</Link>.
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
            <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Chase Calculator</Link>
            <Link href="/calculators/value" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Value Calculator</Link>
            <Link href="/calculators/roi" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">ROI Calculator</Link>
            <Link href="/blog/how-to-farm-tokens-fast-blooket" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Token Farming Guide</Link>
          </div>
        </section>
      </main>
    </>
  );
}
