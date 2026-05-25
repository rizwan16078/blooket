import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "All Blooket Calculators — Pack Odds, Token Converter, ROI & More",
  description:
    "Every free Blooket calculator in one place: pack odds, token-to-pack converter, ROI estimator, sell value guide, and chase probability tool. No signup needed.",
  keywords: [
    "blooket calculators",
    "blooket calculator tools",
    "blooket pack odds calculator",
    "blooket token calculator",
    "blooket ROI calculator",
    "blooket value calculator",
    "blooket chase calculator",
  ],
  alternates: {
    canonical: `${siteUrl}/calculators`,
    languages: {
      "en-US": `${siteUrl}/calculators`,
      "x-default": `${siteUrl}/calculators`,
    },
  },
  openGraph: {
    title: `All Blooket Calculators | ${siteName}`,
    description:
      "Every free Blooket calculator in one place: pack odds, token converter, ROI, sell values, and chase probability.",
    type: "website",
    url: `${siteUrl}/calculators`,
  },
};

const breadcrumbs = buildBreadcrumbSchema([
  { name: "Home", item: siteUrl },
  { name: "Calculators", item: `${siteUrl}/calculators` },
]);

type CalculatorCard = {
  title: string;
  description: string;
  href: string;
  keywords: string[];
  icon: string;
};

const calculators: CalculatorCard[] = [
  {
    title: "Pack Odds Calculator",
    description:
      "Live drop rates for every rarity in every market pack. See your exact chance of pulling a Legendary or Chroma before you spend a single token.",
    href: "/calculators/pack-odds",
    keywords: ["pack odds", "drop rates", "rarity chance"],
    icon: "📊",
  },
  {
    title: "Token → Pack Converter",
    description:
      "Enter your token balance and instantly see how many packs you can open for every market pack, with and without duplicate sell-back.",
    href: "/calculators/token-converter",
    keywords: ["token calculator", "pack count", "token budget"],
    icon: "🪙",
  },
  {
    title: "ROI Calculator",
    description:
      "Compare the expected return on token spend across all packs. See which pack gives the best value per token for Epic+, Legendary, or Chroma pulls.",
    href: "/calculators/roi",
    keywords: ["ROI", "value per token", "pack comparison"],
    icon: "📈",
  },
  {
    title: "Blook Value Calculator",
    description:
      "Every blook ranked by sell value, drop rate, and expected token cost. Find the most efficient blooks to chase or sell.",
    href: "/calculators/value",
    keywords: ["sell value", "blook value", "token worth"],
    icon: "💎",
  },
  {
    title: "Chase Calculator",
    description:
      "Target a specific blook and see exactly how many tokens and packs you need for a 50%, 90%, or 99% chance of pulling it.",
    href: "/calculators/chase",
    keywords: ["chase probability", "specific blook odds", "target blook"],
    icon: "🎯",
  },
  {
    title: "Token Grinder Calculator",
    description:
      "Find the fastest way to earn daily Blooket tokens. Compare gamemodes, estimate time needed, and optimize your grinding strategy.",
    href: "/calculators/token-grinder",
    keywords: ["token grinder", "daily tokens", "fastest tokens", "grind"],
    icon: "⚡",
  },
];

export default function CalculatorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Calculator Hub
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            All Blooket Calculators
            <span className="mt-2 block text-xl font-medium text-violet-300">
              One hub, six tools, zero guesswork
            </span>
          </h1>
          <p className="max-w-3xl text-base leading-8 text-white/50">
            Every calculator on this site answers a different question about your
            Blooket token strategy. Pick the tool that matches what you are trying
            to figure out, or start with the{" "}
            <Link href="/" className="text-emerald-400 transition hover:text-emerald-300">
              main calculator
            </Link>{" "}
            for the full interactive experience.
          </p>
        </section>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-lg transition hover:border-violet-500/25 hover:bg-white/[0.04]"
            >
              <span className="text-3xl">{calc.icon}</span>
              <h2 className="mt-4 text-lg font-bold text-white group-hover:text-violet-300">
                {calc.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-white/50">
                {calc.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {calc.keywords.map((kw) => (
                  <span
                    key={kw}
                    className="rounded-full bg-white/[0.05] px-2.5 py-0.5 text-[11px] font-medium text-white/40"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-lg sm:p-8">
          <h2 className="text-2xl font-bold text-white">
            Which calculator should you use?
          </h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-white/60">
            <p>
              <strong className="text-white">Just want to see your odds?</strong>{" "}
              Start with the{" "}
              <Link href="/calculators/pack-odds" className="text-emerald-400 hover:text-emerald-300">
                Pack Odds Calculator
              </Link>
              . It shows the raw probability for every rarity in every pack.
            </p>
            <p>
              <strong className="text-white">Have tokens and want to know how far they go?</strong>{" "}
              Use the{" "}
              <Link href="/calculators/token-converter" className="text-emerald-400 hover:text-emerald-300">
                Token → Pack Converter
              </Link>
              . It maps your balance to pack counts across all market packs.
            </p>
            <p>
              <strong className="text-white">Comparing packs by value?</strong>{" "}
              The{" "}
              <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300">
                ROI Calculator
              </Link>
              {" "}ranks every pack by expected return per token spent.
            </p>
            <p>
              <strong className="text-white">Hunting one specific blook?</strong>{" "}
              The{" "}
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300">
                Chase Calculator
              </Link>
              {" "}gives you the exact token budget for a 50%, 90%, or 99% pull chance.
            </p>
            <p>
              <strong className="text-white">Want the full interactive experience?</strong>{" "}
              The{" "}
              <Link href="/" className="text-emerald-400 hover:text-emerald-300">
                main Blooket Calculator
              </Link>
              {" "}combines all of these into one real-time tool with simulation support.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
