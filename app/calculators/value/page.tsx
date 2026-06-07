import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import BlookValueInteractive from "@/components/calculators/BlookValueInteractive";

export const metadata: Metadata = {
  title: "Blooket Blook Value Calculator — Sell Values, Drop Rates & Token Cost",
  description:
    "Every Blooket blook ranked by sell value, drop rate, and expected token cost. Find the most efficient blooks to chase or sell.",
  keywords: [
    "blooket value calculator",
    "blooket sell values",
    "blooket blook worth",
    "blooket token cost per blook",
    "blooket value guide",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/value`,
    languages: {
      "en-US": `${siteUrl}/calculators/value`,
      "x-default": `${siteUrl}/calculators/value`,
    },
  },
  openGraph: {
    title: `Blook Value Calculator | ${siteName}`,
    description:
      "Every blook ranked by sell value, drop rate, and expected token cost.",
    type: "website",
    url: `${siteUrl}/calculators/value`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Value Calculator", item: `${siteUrl}/calculators/value` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blooket Blook Value Calculator",
  url: `${siteUrl}/calculators/value`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "How much is a Legendary Blook worth in Blooket?",
    answer: "Legendary Blooks sell for 500 tokens each — the equivalent of 20 standard 25-token packs. Only sell a Legendary if it is a confirmed duplicate you already own.",
  },
  {
    question: "How much do Common and Uncommon Blooks sell for?",
    answer: "Commons sell for 5 tokens, Uncommons for 10 tokens. Over a long pack-opening session, these small refunds add up to 25–30% of gross token spend recovered.",
  },
  {
    question: "What is the most token-efficient Blook to chase?",
    answer: "The King from Medieval Pack (Legendary at 1.0% drop rate) offers the best token-per-probability ratio of any Legendary. For Chromas, Ice Slime from Ice Monster Pack at 0.08% is the most attainable.",
  },
  {
    question: "Does this calculator include duplicate refund values?",
    answer: "Yes. The value calculator shows both gross token cost and net cost after expected duplicate refunds, so you can compare the true expense of chasing any specific blook.",
  },
];

export default function ValueCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Tools</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Blooket Blook Value Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            Every Blooket blook ranked by sell value, drop rate, and token cost. Filter by rarity, sort by efficiency, and find the most valuable blooks to chase or sell before you open your next pack.
          </p>
        </section>

        <Suspense>
          <BlookValueInteractive />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">How blook value works</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            In Blooket, every blook has a fixed sell value set by its rarity tier. Commons refund 5 tokens, Uncommons 10, Rares 25, Epics 100, Legendaries 500, and Chromas 300. These sell values matter most when you are managing duplicates during a long pack-opening session — over hundreds of pulls, duplicate refunds typically recover 25–30% of your gross token spend.
          </p>
          <p className="mt-4 text-base leading-7 text-white/55">
            The value calculator also shows expected token cost per blook — the number of tokens you need to spend, on average, before pulling a specific blook at least once. This is distinct from the single-pull drop rate: a 1% drop rate does not mean you will pull the blook in 100 tries, but rather that 100 pulls gives you a 63% chance. Use the{" "}
            <Link href="/calculators/chase" className="text-violet-400 hover:text-violet-300">chase calculator</Link>{" "}
            for the 50%, 90%, and 99% confidence token budgets.
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
            <Link href="/calculators/roi" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">ROI Calculator</Link>
            <Link href="/value-guide" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Value Guide</Link>
            <Link href="/guides/blooket-sell-values" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Sell Values Guide</Link>
          </div>
        </section>
      </main>
    </>
  );
}
