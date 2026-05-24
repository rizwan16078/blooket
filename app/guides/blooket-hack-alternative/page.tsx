import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, buildFaqSchema, serializeJsonLd, type FaqEntry } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket 'Hack': The Math-Based Strategy That Actually Works",
  description:
    "There is no real Blooket hack — but there is a math-based strategy that gives you a legitimate advantage. Probability optimization, token efficiency, and pack selection beat any cheat.",
  keywords: [
    "blooket hack",
    "blooket hacks",
    "how to hack blooket",
    "blooket cheat",
    "blooket strategy",
    "blooket advantage",
    "blooket tips",
  ],
  alternates: {
    canonical: `${siteUrl}/guides/blooket-hack-alternative`,
    languages: {
      "en-US": `${siteUrl}/guides/blooket-hack-alternative`,
      "x-default": `${siteUrl}/guides/blooket-hack-alternative`,
    },
  },
  openGraph: {
    title: `Blooket "Hack" — The Math Strategy That Works | ${siteName}`,
    description: "No real Blooket hack exists. But probability math gives you a legitimate advantage over other players.",
    type: "article",
    url: `${siteUrl}/guides/blooket-hack-alternative`,
  },
};

const faqEntries: FaqEntry[] = [
  {
    question: "Is there a real Blooket hack?",
    answer:
      "No. Any website or tool claiming to 'hack' Blooket is either a scam, a phishing attempt, or a violation of Blooket's terms of service that risks your account being banned. The only legitimate advantage is understanding the probability math behind pack openings.",
  },
  {
    question: "What is the best Blooket 'hack' that actually works?",
    answer:
      "Understanding probability. If you know the exact drop rates, you can choose the pack that gives you the best chance for your specific goal, set a token budget that matches your target probability, and avoid wasting tokens on packs with poor ROI. The calculator on this site does all of this for free.",
  },
  {
    question: "Can you get infinite tokens in Blooket?",
    answer:
      "No. Tokens are earned through gameplay and there is no legitimate way to generate infinite tokens. Any tool claiming to do this is a scam. The best approach is to earn tokens efficiently through gameplay and spend them optimally using probability tools.",
  },
];

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Guides", item: `${siteUrl}/guides` },
  { name: "Blooket Hack Alternative", item: `${siteUrl}/guides/blooket-hack-alternative` },
]);

const faqSchema = buildFaqSchema(faqEntries);

export default function BlooketHackAlternativePage() {
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

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Strategy Guide
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Blooket &ldquo;Hack&rdquo;: The Math Strategy That Actually Works
          </h1>
          <p className="text-lg leading-8 text-white/65">
            There is no real Blooket hack. But there is a math-based strategy
            that gives you a legitimate, permanent advantage over players who
            guess. Here are 5 legal &ldquo;hacks&rdquo; that use probability, not cheats.
          </p>
        </section>

        <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm leading-7 text-amber-200/80">
          <strong className="text-amber-300">Warning:</strong> Any tool or website claiming to &ldquo;hack&rdquo; Blooket is likely a scam, phishing attempt, or terms-of-service violation. Using cheats risks your account being permanently banned. The strategies below are 100% legitimate and actually work.
        </div>

        <article className="mt-10 space-y-12 text-white/70">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hack #1: Know the exact drop rates
            </h2>
            <p className="leading-relaxed">
              Most players open packs blindly, hoping for a Chroma. But every pack
              has published drop rates — and they vary wildly. The Space Pack has a
              0.05% Chroma rate, while the Ice Monster Pack has 0.15% (three times
              higher). If your goal is a Chroma, opening Space Packs is objectively
              the wrong move. The{" "}
              <Link href="/calculators/pack-odds" className="text-emerald-400 hover:text-emerald-300">
                Pack Odds Calculator
              </Link>{" "}
              shows the exact rates for every pack.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hack #2: Use the chase formula instead of guessing
            </h2>
            <p className="leading-relaxed">
              The &ldquo;chase formula&rdquo; tells you exactly how many tokens you need for a
              given probability: <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-violet-300 text-sm">n = log(1 - P) / log(1 - p)</code>.
              For a 90% chance at a 0.05% Chroma, you need ~4,603 opens = ~92,060 tokens.
              Most players spend far less and wonder why they never get one. The{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>{" "}
              does this math for every blook.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hack #3: Enable duplicate resell
            </h2>
            <p className="leading-relaxed">
              When you pull a duplicate blook, you can sell it for tokens based on
              its rarity. This refund reduces your effective cost per pull, giving
              you more opens for the same budget. For a 20-token pack, the effective
              cost drops to roughly 14–16 tokens with dupe resell enabled — that&apos;s
              25–30% more opens. The calculator&apos;s &ldquo;Dupe Refund&rdquo; toggle shows the
              difference instantly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hack #4: Compare pack ROI before spending
            </h2>
            <p className="leading-relaxed">
              Not all packs are equal value. The{" "}
              <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">
                ROI Calculator
              </Link>{" "}
              ranks packs by probability per token spent. If you want Epic+ blooks,
              some packs give you 40% more value per token than others. Spending
              tokens on the wrong pack is the most common mistake players make.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">
              Hack #5: Set a budget and stick to it
            </h2>
            <p className="leading-relaxed">
              The biggest &ldquo;hack&rdquo; is bankroll management. Before opening packs,
              decide your token budget and your target probability. The calculator
              shows you: &ldquo;With 500 tokens in the Space Pack, you have a 22% chance
              of at least one Epic+ and a 1.1% chance of a Legendary.&rdquo; If those
              odds aren&apos;t acceptable, save more tokens or switch packs. Never spend
              more than you can afford to lose — probability is not a guarantee.
            </p>
          </section>

          <section>
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
        </article>

        <div className="mt-10">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Try the Calculator — Your &ldquo;Hack&rdquo; Starts Here
          </Link>
        </div>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/calculators/chase" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Chase Calculator
          </Link>
          <Link href="/calculators/roi" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            ROI Calculator
          </Link>
          <Link href="/guides/best-blooket-pack-to-open" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Best Pack to Open
          </Link>
          <Link href="/guides/blooket-rookie-mistakes" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Rookie Mistakes
          </Link>
        </aside>
      </main>
    </>
  );
}
