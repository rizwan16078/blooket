import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import ROICalculatorInteractive from "@/components/calculators/ROICalculatorInteractive";

export const metadata: Metadata = {
  title: "Blooket Pack ROI Calculator — Best Pack Value per Token Spent",
  description:
    "Compare every Blooket pack by expected return on tokens spent. See which pack gives the best value for Epic+, Legendary, or Chroma pulls with duplicate sell-back included.",
  keywords: [
    "blooket ROI calculator",
    "blooket pack value",
    "blooket best pack value",
    "blooket token efficiency",
    "blooket pack comparison",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/roi`,
    languages: {
      "en-US": `${siteUrl}/calculators/roi`,
      "x-default": `${siteUrl}/calculators/roi`,
    },
  },
  openGraph: {
    title: `Blooket Pack ROI Calculator | ${siteName}`,
    description:
      "Compare expected return on token spend across all Blooket packs.",
    type: "website",
    url: `${siteUrl}/calculators/roi`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "ROI Calculator", item: `${siteUrl}/calculators/roi` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blooket Pack ROI Calculator",
  url: `${siteUrl}/calculators/roi`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "Which Blooket pack gives the best value for tokens?",
    answer: "It depends on your goal. For raw Legendary probability per token, packs with a Legendary at 1.0% drop rate and a 25-token price point outperform packs where the same rarity costs 50 tokens. The ROI calculator ranks every pack on a net-value basis so you can compare directly.",
  },
  {
    question: "What does 'ROI' mean in Blooket pack terms?",
    answer: "ROI here means net token return: the expected sell-back value of all blooks you pull over many openings, expressed as a percentage of gross token spend. A pack with a 30% ROI means that on average you recover 30 tokens of value for every 100 tokens spent through duplicate refunds.",
  },
  {
    question: "Does duplicate sell-back significantly affect pack value?",
    answer: "Yes — over hundreds of packs, duplicate refunds typically recover 25–35% of total token spend. Higher-rarity packs tend to have lower duplicate rates early but higher per-duplicate refund values. The ROI calculator models both gross and net costs so you see the full picture.",
  },
  {
    question: "Should I always open the highest-ROI pack?",
    answer: "Not necessarily. The highest-ROI pack maximizes statistical return, but if your goal is a specific blook, the chase calculator gives a more accurate token budget. ROI is most useful when you want to grind blook score or maximize rare pulls over many sessions without a specific target.",
  },
];

export default function ROICalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Tools</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Blooket Pack ROI Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            Every Blooket pack ranked by expected return on tokens spent. Compare packs by net value after duplicate sell-backs, filter by rarity target, and find the most token-efficient pack for your strategy before you spend a single token.
          </p>
        </section>

        <Suspense>
          <ROICalculatorInteractive />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">How Blooket pack ROI works</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            Every Blooket pack has a fixed cost in tokens and a set of blooks at defined drop rates. When you pull a duplicate blook — one you already own — the game refunds a fixed number of tokens based on rarity: 5 for Commons, 10 for Uncommons, 25 for Rares, 100 for Epics, 500 for Legendaries, and 300 for Chromas. Over many pack openings, these refunds add up and meaningfully reduce your net spend.
          </p>
          <p className="mt-4 text-base leading-7 text-white/55">
            ROI is calculated as total expected refund value divided by total tokens spent, expressed as a percentage. A pack with a 32% ROI returns an average of 32 tokens of sell-back value for every 100 tokens opened. The calculator models each pack across all rarity tiers and accounts for the probability of pulling each blook at least once before the duplicate rate rises. Use it alongside the{" "}
            <Link href="/calculators/chase" className="text-violet-400 hover:text-violet-300">chase calculator</Link>{" "}
            when you have a specific blook in mind.
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
            <Link href="/value-guide" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Value Guide</Link>
            <Link href="/guides/best-blooket-pack-to-open" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Best Packs Guide</Link>
          </div>
        </section>
      </main>
    </>
  );
}
