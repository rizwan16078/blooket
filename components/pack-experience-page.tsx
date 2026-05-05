import CalculatorClient from "@/components/calculator-client";
import {
  buildFaqSchema,
  buildSoftwareSchema,
  serializeJsonLd,
  type FaqEntry,
} from "@/lib/schema";
import {
  atLeastOneSuccess,
  formatCompactNumber,
  formatDateLabel,
  formatPercent,
  formatTokens,
  probabilityOneIn,
} from "@/lib/odds";
import {
  RARITY_SELL_VALUES,
  type Pack,
} from "@/lib/packs";
import type { InitialCalculatorState } from "@/lib/search-params";

type PackExperiencePageProps = {
  contentPack: Pack;
  initialState: InitialCalculatorState;
  pageMode: "root" | "pack";
};

type DropRateRow = {
  label: string;
  key: keyof Pack["dropRates"];
};

const DROP_RATE_ROWS: DropRateRow[] = [
  { label: "Uncommon", key: "uncommon" },
  { label: "Rare", key: "rare" },
  { label: "Epic", key: "epic" },
  { label: "Legendary", key: "legendary" },
  { label: "Chroma", key: "chroma" },
];

function buildFaqs(pack: Pack): FaqEntry[] {
  const legendaryAt500 = atLeastOneSuccess(pack.dropRates.legendary, 500 / pack.price);
  const chromaAt500 = atLeastOneSuccess(pack.dropRates.chroma, 500 / pack.price);

  return [
    {
      question: `What are the odds of a Chroma in the ${pack.name} Pack?`,
      answer:
        pack.dropRates.chroma > 0
          ? `Using the current community-referenced ${pack.name} Pack table, each box has a ${formatPercent(
              pack.dropRates.chroma,
            )} Chroma rate. At 500 tokens with duplicate refunds off, the exact chance of at least one Chroma is ${formatPercent(
              chromaAt500,
            )}.`
          : `The current obtainable ${pack.name} Pack lineup does not include a pack Chroma, so the calculator returns 0% Chroma odds for this pack right now.`,
    },
    {
      question: `How does dupe refund work in this ${pack.name} calculator?`,
      answer: `The real-time calculator does not simulate endless duplicate loops. Instead, it uses a precomputed effective cost for the ${pack.name} Pack. That effective cost is the pack price minus the exact average sell-back value from the current pack table, which keeps calculations instant while still reflecting duplicate refunds.`,
    },
    {
      question: `What are the odds of at least one Legendary from the ${pack.name} Pack?`,
      answer: `This calculator uses exact binomial math, not guesses. At 500 tokens with duplicate refunds off, the chance of at least one Legendary from the ${pack.name} Pack is ${formatPercent(
        legendaryAt500,
      )}.`,
    },
    {
      question: "Does this tool use simulation for the main odds?",
      answer:
        "No. The headline probabilities update with the exact formula P(at least 1 success) = 1 - (1 - p)^n. Full simulation only runs when you explicitly click the simulation button, and it runs off the main thread in a web worker.",
    },
  ];
}

function raritySellLabel(
  rarity: keyof typeof RARITY_SELL_VALUES,
  rate: number,
) {
  if (rate <= 0) {
    return "Not in current pack";
  }

  return `${formatTokens(RARITY_SELL_VALUES[rarity])} tokens`;
}

export default function PackExperiencePage({
  contentPack,
  initialState,
  pageMode,
}: PackExperiencePageProps) {
  const faqs = buildFaqs(contentPack);
  const faqSchema = buildFaqSchema(faqs);
  const softwareSchema = buildSoftwareSchema(contentPack);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(faqSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(softwareSchema),
        }}
      />

      <main className="relative overflow-hidden bg-gradient-to-b from-[#112328] to-[#112328]">
        <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.22),transparent_46%),radial-gradient(circle_at_20%_30%,rgba(34,211,238,0.12),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(139,92,246,0.18),transparent_34%)]" />

          <div className="grid flex-1 items-start gap-10 pt-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-14 lg:pt-16">
            <div className="flex max-w-2xl flex-col gap-8">
              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[#2a424a] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white drop-shadow-sm">
                Production-grade odds engine
              </div>

              <div className="space-y-5">
                <p className="text-sm font-black uppercase tracking-[0.28em] text-white/80 drop-shadow-sm">
                  Blooket calculator
                </p>
                <h1 className="max-w-3xl font-sans text-5xl font-black tracking-wide text-white drop-shadow-md sm:text-6xl lg:text-7xl">
                  See Your Real Blooket Chances Before You Spend Tokens
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/90 sm:text-xl">
                  Instant probability calculations powered by exact math not
                  guesses.
                </p>
              </div>

              <div className="grid gap-3 text-sm text-white sm:grid-cols-3">
                <div className="glass-panel rounded-2xl px-4 py-4">
                  ⚡ Real-time exact odds
                </div>
                <div className="glass-panel rounded-2xl px-4 py-4">
                  📊 Based on real drop rates
                </div>
                <div className="glass-panel rounded-2xl px-4 py-4">
                  🎯 No signup required
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border-4 border-[#2a424a] bg-[#1e353c] px-5 py-4 shadow-lg">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Default pack
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {contentPack.name}
                  </p>
                </div>
                <div className="rounded-3xl border-4 border-[#2a424a] bg-[#1e353c] px-5 py-4 shadow-lg">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Effective cost
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {contentPack.effectiveCost.toFixed(3)} tokens
                  </p>
                </div>
                <div className="rounded-3xl border-4 border-[#2a424a] bg-[#1e353c] px-5 py-4 shadow-lg">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                    Last updated
                  </p>
                  <p className="mt-2 text-xl font-black text-white">
                    {formatDateLabel(contentPack.lastUpdated)}
                  </p>
                </div>
              </div>

              <p className="max-w-xl text-sm leading-7 text-white/85">
                {contentPack.summary}
              </p>
            </div>

            <CalculatorClient
              initialState={initialState}
              contentPack={contentPack}
              pageMode={pageMode}
            />
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-24 sm:px-6 lg:px-8">
          <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-500">
                  What is the {contentPack.name} Pack?
                </p>
                <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
                  Understanding the {contentPack.name} Blooket box before you
                  spend.
                </h2>
                <p className="text-base leading-8 text-slate-400">
                  {contentPack.detail}
                </p>
              </div>

              <div className="grid gap-3 text-sm text-white sm:grid-cols-2 lg:w-[24rem]">
                <div className="rounded-2xl bg-[#152a30] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Pack price
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {contentPack.price} tokens
                  </p>
                </div>
                <div className="rounded-2xl bg-[#152a30] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Avg sell-back
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {contentPack.avgSellValue.toFixed(3)} tokens
                  </p>
                </div>
                <div className="rounded-2xl bg-[#152a30] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Epic+ per box
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {formatPercent(
                      contentPack.dropRates.epic +
                        contentPack.dropRates.legendary +
                        contentPack.dropRates.chroma,
                    )}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#152a30] p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    Legendary floor
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {probabilityOneIn(contentPack.dropRates.legendary)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {contentPack.notes.map((note) => (
                <div
                  key={note}
                  className="rounded-2xl bg-[#152a30] p-4 text-sm leading-7 text-slate-400"
                >
                  {note}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {contentPack.featuredBlooks.map((blook) => (
                <div
                  key={blook.name}
                  className="rounded-full bg-[#1e353c] px-4 py-2 text-sm font-bold text-white shadow-sm"
                >
                  {blook.name} · {blook.rarity} · {formatPercent(blook.dropRate)}
                </div>
              ))}
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-500">
                Drop rates table
              </p>
              <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
                Server-rendered odds for the {contentPack.name} Pack
              </h2>
              <p className="max-w-3xl text-base leading-8 text-slate-400">
                These rates are rendered in HTML for crawlability and matched
                against the exact client calculator. Duplicate refund math uses
                the precomputed average sell-back value shown below.
              </p>
            </div>

            <div className="mt-8 overflow-hidden rounded-[1.6rem] border-4 border-[#2a424a]">
              <table className="w-full border-collapse text-left">
                <thead className="bg-[#152a30] text-sm uppercase tracking-[0.18em] text-slate-400">
                  <tr>
                    <th className="px-4 py-4 sm:px-6">Rarity</th>
                    <th className="px-4 py-4 sm:px-6">Drop rate</th>
                    <th className="px-4 py-4 sm:px-6">Approx. odds</th>
                    <th className="px-4 py-4 sm:px-6">Sell value</th>
                  </tr>
                </thead>
                <tbody>
                  {DROP_RATE_ROWS.map((row) => {
                    const rate = contentPack.dropRates[row.key];

                    return (
                      <tr
                        key={row.key}
                        className="border-t border-[#2a424a] text-sm text-white"
                      >
                        <td className="px-4 py-4 sm:px-6">{row.label}</td>
                        <td className="px-4 py-4 sm:px-6">{formatPercent(rate)}</td>
                        <td className="px-4 py-4 sm:px-6">{probabilityOneIn(rate)}</td>
                        <td className="px-4 py-4 sm:px-6">
                          {raritySellLabel(row.key, rate)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t border-[#2a424a] bg-[#152a30] text-sm text-white">
                    <td className="px-4 py-4 font-semibold sm:px-6">
                      Avg duplicate sell-back
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      {formatPercent(
                        contentPack.dropRates.uncommon +
                          contentPack.dropRates.rare +
                          contentPack.dropRates.epic +
                          contentPack.dropRates.legendary +
                          contentPack.dropRates.chroma,
                      )}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      Effective open cost:
                      {" "}
                      {contentPack.effectiveCost.toFixed(3)}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      {contentPack.avgSellValue.toFixed(3)} tokens
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
              <span>
                Source:
                {" "}
                <span className="text-white">{contentPack.source}</span>
              </span>
              <span>
                Updated:
                {" "}
                <span className="text-white">
                  {formatDateLabel(contentPack.lastUpdated)}
                </span>
              </span>
              <span>
                Per 500 tokens at face price:
                {" "}
                <span className="text-white">
                  {formatCompactNumber(500 / contentPack.price, 1)} opens
                </span>
              </span>
            </div>
          </article>

          <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-emerald-500">
                FAQ
              </p>
              <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
                Common questions about {contentPack.name} odds
              </h2>
            </div>

            <div className="mt-8 grid gap-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-[1.6rem] border-4 border-[#2a424a] bg-[#152a30] px-5 py-4"
                >
                  <summary className="cursor-pointer list-none pr-6 text-base font-black text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 max-w-4xl text-sm leading-7 text-slate-400">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </article>
        </section>
      </main>
    </>
  );
}
