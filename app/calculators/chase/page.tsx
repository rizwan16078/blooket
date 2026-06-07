import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";
import ChaseCalculatorInteractive from "@/components/calculators/ChaseCalculatorInteractive";

export const metadata: Metadata = {
  title: "Blooket Chase Calculator — Token Budget at 50%, 90% & 99% Confidence",
  description:
    "Pick any Blooket blook and see exactly how many tokens you need for a 50%, 90%, or 99% chance of pulling it. Accounts for pack price, drop rate, and duplicate sell-back.",
  keywords: [
    "blooket chase calculator",
    "blooket specific blook odds",
    "how many tokens for blooket blook",
    "blooket target blook",
    "blooket chase probability",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators/chase`,
    languages: {
      "en-US": `${siteUrl}/calculators/chase`,
      "x-default": `${siteUrl}/calculators/chase`,
    },
  },
  openGraph: {
    title: `Blooket Chase Calculator | ${siteName}`,
    description:
      "See how many tokens you need for a 50%, 90%, or 99% chance at any Blooket blook.",
    type: "website",
    url: `${siteUrl}/calculators/chase`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
  { name: "Chase Calculator", item: `${siteUrl}/calculators/chase` },
]);

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Blooket Chase Calculator",
  url: `${siteUrl}/calculators/chase`,
  applicationCategory: "GameApplication",
  operatingSystem: "All",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  publisher: { "@type": "Organization", "@id": `${siteUrl}/#organization`, name: siteName },
};

const faqs: FaqEntry[] = [
  {
    question: "How many tokens do I need to guarantee a Legendary Blook in Blooket?",
    answer: "There is no token amount that guarantees a Legendary — Blooket uses independent random draws with no pity system. At a 1% drop rate with a 25-token pack, you have a 50% chance after roughly 1,725 tokens, a 90% chance after 5,743 tokens, and a 99% chance after 11,508 tokens. The chase calculator shows exact figures for any blook.",
  },
  {
    question: "What is the difference between 50%, 90%, and 99% confidence?",
    answer: "These confidence levels represent how likely you are to have pulled the target blook by that token budget. At 50% confidence you will succeed about half the time. At 90% you cover nine in ten players. At 99% only one player in a hundred would still not have the blook — but the token cost is roughly 6.6× higher than the 50% budget for most Legendaries.",
  },
  {
    question: "Does the chase calculator include duplicate sell-backs?",
    answer: "Yes. The calculator accounts for duplicate refunds from all non-target blooks you pull along the way, which reduces your effective net token spend. At a 1% target rate you pull many Commons and Uncommons before hitting the target, and their 5–10 token refunds add up meaningfully over hundreds of packs.",
  },
  {
    question: "Why is chasing a Chroma cheaper than chasing some Legendaries?",
    answer: "It depends on the pack price. Some Chroma blooks come from packs that cost 50 tokens per open and have a 0.08–0.15% drop rate. Compare that to a Legendary in a 25-token pack at 0.5% — the per-token probability can actually favor the Legendary. The chase calculator normalizes for pack cost so you can compare any two targets directly.",
  },
];

export default function ChaseCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(appSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildFaqSchema(faqs)) }} />

      <main className="flex-1">
        <section className="mx-auto max-w-5xl px-4 pb-8 pt-10 sm:px-6 lg:px-8 lg:pt-14">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">Blooket Tools</p>
          <h1 className="mt-3 font-sans text-4xl font-black tracking-tight text-white sm:text-5xl">
            Blooket Chase Calculator
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/55">
            Target any Blooket blook and see the exact token budget you need for a 50%, 90%, or 99% chance of pulling it. Powered by geometric probability math — not guesswork — with duplicate sell-back factored in.
          </p>
        </section>

        <Suspense>
          <ChaseCalculatorInteractive />
        </Suspense>

        <section className="mx-auto max-w-5xl px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          <h2 className="font-sans text-2xl font-black text-white">How the Blooket chase calculator works</h2>
          <p className="mt-4 text-base leading-7 text-white/55">
            Blooket pack drops are independent random events — each pull has the same probability regardless of how many packs you have already opened. There is no pity system or guaranteed pull mechanic. This means the number of pulls needed follows a geometric distribution, and the token budget for any confidence level can be calculated precisely using that model.
          </p>
          <p className="mt-4 text-base leading-7 text-white/55">
            The formula for pulling a target blook at least once with probability P after n packs is: P = 1 − (1 − r)^n, where r is the drop rate. Solving for n at P = 0.50, 0.90, and 0.99 gives the three confidence budgets. Multiply n by the pack price and subtract expected duplicate refunds along the way to get your net token cost. For planning your full collection, combine this with the{" "}
            <Link href="/calculators/value" className="text-violet-400 hover:text-violet-300">value calculator</Link>{" "}
            to identify which blooks to prioritize and which to skip.
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
            <Link href="/calculators/value" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Value Calculator</Link>
            <Link href="/calculators/roi" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">ROI Calculator</Link>
            <Link href="/guides/blooket-drop-rates" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Drop Rates Guide</Link>
            <Link href="/guides/blooket-sell-values" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">Sell Values Guide</Link>
          </div>
        </section>
      </main>
    </>
  );
}
