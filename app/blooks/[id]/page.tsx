import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { calculateEstimatedTokensForBlook, formatPercent, formatTokenLabel } from "@/lib/math";
import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

type BlookDetailPageProps = {
  params: Promise<{ id: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return BLOOKS.map((blook) => ({
    id: blook.id,
  }));
}

export async function generateMetadata({
  params,
}: BlookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const blook = BLOOKS.find((entry) => entry.id === id);

  if (!blook) {
    return {};
  }

  const pack = PACK_MAP[blook.packId];
  const ratePercent = (blook.dropRate * 100).toFixed(blook.dropRate < 0.001 ? 3 : 2);
  const title = `${blook.name} Blook 2026 — ${blook.rarity} Drop Rate & Chase Odds`;
  const description = `${blook.name} drop rate: ${ratePercent}%. See exact ${blook.rarity} chase odds, sell value, and token cost from the ${pack.name} Pack — free Blooket calculator updated 2026 →`;
  const canonical = `${siteUrl}/blooks/${blook.id}`;

  return {
    title,
    description,
    keywords: [
      `blooket ${blook.name.toLowerCase()}`,
      `${blook.name.toLowerCase()} blook`,
      `how to get ${blook.name.toLowerCase()}`,
      `${blook.name.toLowerCase()} drop rate`,
      `${blook.name.toLowerCase()} sell value`,
      `${blook.name.toLowerCase()} chase odds`,
      `${blook.name.toLowerCase()} ${blook.rarity.toLowerCase()}`,
      `${blook.rarity.toLowerCase()} blooket odds`,
    ],
    alternates: {
      canonical,
      languages: {
        "en-US": canonical,
        "x-default": canonical,
      },
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "article",
      url: canonical,
    },
  };
}

export default async function BlookDetailPage({ params }: BlookDetailPageProps) {
  const { id } = await params;
  const blook = BLOOKS.find((entry) => entry.id === id);

  if (!blook) {
    notFound();
  }

  const pack = PACK_MAP[blook.packId];

  // Chase math: tokens needed for at-least-one success at a given confidence level
  const tokensFor = (chance: number) => {
    if (blook.dropRate <= 0 || blook.dropRate >= 1) return 0;
    const attempts = Math.ceil(Math.log(1 - chance) / Math.log(1 - blook.dropRate));
    return attempts * pack.costPerPull;
  };
  const tokens50 = tokensFor(0.5);
  const tokens90 = tokensFor(0.9);
  const tokens99 = tokensFor(0.99);
  const oneInX = blook.dropRate > 0 ? Math.round(1 / blook.dropRate) : 0;
  const ratePercent = (blook.dropRate * 100).toFixed(blook.dropRate < 0.001 ? 3 : 2);

  const faqs = [
    {
      question: `What is the ${blook.name} drop rate in Blooket?`,
      answer: `The ${blook.name} drops at ${ratePercent}% per ${pack.name} Pack opening — roughly 1 in ${oneInX.toLocaleString()} pulls. Each pull is independent, so no pity timer applies.`,
    },
    {
      question: `How many tokens to get the ${blook.name}?`,
      answer: `For 90% confidence at the ${blook.name}, plan on about ${formatTokenLabel(tokens90)}. For a coin-flip (50%) chance, ${formatTokenLabel(tokens50)} is enough. For near-certainty (99%), budget ${formatTokenLabel(tokens99)}.`,
    },
    {
      question: `Where does the ${blook.name} come from?`,
      answer: `The ${blook.name} is a ${blook.rarity} Blook from the ${pack.name} Pack at ${pack.costPerPull} tokens per pull. It is the only pack that contains this Blook in the current rotation.`,
    },
  ];

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${blook.name} Blook Statistics`,
    description: blook.description,
    url: `${siteUrl}/blooks/${blook.id}`,
    variableMeasured: ["Drop Rate", "Sell Value", "Rarity", "Estimated Tokens"],
  };

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", item: siteUrl },
    { name: "Blooks", item: `${siteUrl}/blooks` },
    { name: blook.name, item: `${siteUrl}/blooks/${blook.id}` },
  ]);

  const faqSchema = buildFaqSchema(faqs);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(datasetSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbs),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(faqSchema),
        }}
      />

      <main className="mx-auto flex-1 w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl backdrop-blur-sm">
            <div
              className="absolute inset-0 opacity-25"
              style={{
                background: `radial-gradient(circle at top, ${pack.themeColor}, transparent 60%)`,
              }}
            />
            <div className="relative aspect-square flex items-center justify-center">
              <Image
                src={blook.imageUrl}
                alt={blook.name}
                width={800}
                height={800}
                className="object-contain p-8 w-full h-full"
              />
            </div>
          </div>

          <div className="space-y-5">
            <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
              {pack.name} Pack
            </p>
            <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
              {blook.name}
            </h1>
            <p className="text-base leading-8 text-white/50">{blook.description}</p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Rarity
                </p>
                <p className="mt-2 text-lg font-black text-white">{blook.rarity}</p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Drop rate
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatPercent(blook.dropRate)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Sell value
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatTokenLabel(blook.sellValue)}
                </p>
              </div>
              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-lg">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                  Estimated tokens
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {formatTokenLabel(calculateEstimatedTokensForBlook(blook, pack))}
                </p>
              </div>
            </div>

            <Link
              href={`/?pack=${pack.id}&blook=${blook.id}&tokens=500`}
              className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
            >
              Try My Luck
            </Link>

            <div className="mt-12 space-y-8 text-white/70 border-t border-white/10 pt-8">
              <section>
                <h2 className="text-2xl font-bold text-white mb-3">About the {blook.name}</h2>
                <p className="leading-relaxed">
                  {blook.name} is indexed on this site as a {blook.rarity.toLowerCase()} blook from the {pack.name} Pack.
                  Its listed drop rate on the current pack table is {formatPercent(blook.dropRate)}, and
                  its sell value is {formatTokenLabel(blook.sellValue)}. This page exists so you can
                  move from the broad pack table into a specific entity page without losing the
                  probability context.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">How to Get the {blook.name} — Chase Odds</h2>
                <p className="leading-relaxed">
                  To get the {blook.name}, you need to open {pack.name} Packs using in-game tokens.
                  Based on the listed drop rate, the raw expectation works out to about{" "}
                  {formatTokenLabel(calculateEstimatedTokensForBlook(blook, pack))} worth of openings.
                  That number is not a guarantee. It is a planning anchor &mdash; the cumulative
                  probability table below shows the real budget at different confidence levels.
                </p>

                <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/5 p-4 text-sm leading-7">
                  <p className="font-bold text-violet-200">
                    Drop rate: <span className="text-white">{ratePercent}%</span>
                    {" · "}
                    Roughly <span className="text-white">1 in {oneInX.toLocaleString()}</span> pulls
                  </p>
                </div>

                <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                  <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/75">
                    <thead className="bg-white/[0.03] text-[11px] uppercase tracking-[0.22em] text-white/35">
                      <tr>
                        <th className="px-4 py-3">Confidence</th>
                        <th className="px-4 py-3">Attempts needed</th>
                        <th className="px-4 py-3">Token budget</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">50% (coin-flip)</td>
                        <td className="px-4 py-3">{Math.ceil(tokens50 / pack.costPerPull).toLocaleString()}</td>
                        <td className="px-4 py-3">{formatTokenLabel(tokens50)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-emerald-300">90% (recommended)</td>
                        <td className="px-4 py-3">{Math.ceil(tokens90 / pack.costPerPull).toLocaleString()}</td>
                        <td className="px-4 py-3 text-emerald-300">{formatTokenLabel(tokens90)}</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-semibold text-white">99% (near-certain)</td>
                        <td className="px-4 py-3">{Math.ceil(tokens99 / pack.costPerPull).toLocaleString()}</td>
                        <td className="px-4 py-3">{formatTokenLabel(tokens99)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">Is the {blook.name} Worth Chasing?</h2>
                <p className="leading-relaxed">
                  Whether the {blook.name} is worth chasing depends on your goal. If you want one
                  specific collector target, this page gives you the pack, rarity, and budget context.
                  If you only care about maximizing odds for the rarity tier, it is smarter to compare
                  pack-level value in the{" "}
                  <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">chase calculator</Link>
                  {" "}and{" "}
                  <Link href={pack.route} className="text-emerald-400 hover:text-emerald-300">{pack.name} Pack page</Link>
                  {" "}before committing all your tokens to one chase.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">FAQ</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.question} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
                      <p className="font-bold text-white">{faq.question}</p>
                      <p className="mt-1 text-sm leading-7 text-white/60">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="mt-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400 mb-4">Related next steps</p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={pack.route}
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
                >
                  {pack.name} Pack
                </Link>
                <Link
                  href="/calculators/chase"
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
                >
                  Chase Calculator
                </Link>
                {blook.rarity === "Chroma" && (
                  <Link
                    href="/blooks/chroma"
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
                  >
                    All Chroma Blooks
                  </Link>
                )}
                {blook.rarity === "Legendary" && (
                  <Link
                    href="/blooks/legendary"
                    className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
                  >
                    All Legendary Blooks
                  </Link>
                )}
                <Link
                  href="/value-guide"
                  className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white"
                >
                  Value Guide
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
    </>
  );
}
