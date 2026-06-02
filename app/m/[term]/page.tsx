import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MISSPELLINGS, getMisspellingByTerm } from "@/data/misspellings";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

type MisspellingPageProps = {
  params: Promise<{ term: string }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return MISSPELLINGS.map((m) => ({
    term: m.term,
  }));
}

export async function generateMetadata({
  params,
}: MisspellingPageProps): Promise<Metadata> {
  const { term } = await params;
  const entry = getMisspellingByTerm(term);

  if (!entry) {
    return {};
  }

  const capitalized = term.charAt(0).toUpperCase() + term.slice(1);

  const title = `${capitalized} Calculator 2026 — Free Blooket Pack Odds Tool`;
  const description = `Searched for ${capitalized}? This IS the Blooket Calculator — free exact pack odds, drop rates, sell values, and Monte Carlo simulation. Try it free now →`;
  const canonical = `${siteUrl}/m/${term}`;

  return {
    title,
    description,
    keywords: [
      term,
      `${term} calculator`,
      "blooket calculator",
      `${term} pack odds`,
      "blooket pack odds",
      `${term} drop rates`,
      "free blooket calculator",
    ],
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: siteUrl,
    },
    openGraph: {
      title: `${title} | ${siteName}`,
      description,
      type: "website",
      url: canonical,
    },
  };
}

export default async function MisspellingPage({ params }: MisspellingPageProps) {
  const { term } = await params;
  const entry = getMisspellingByTerm(term);

  if (!entry) {
    notFound();
  }

  const capitalized = term.charAt(0).toUpperCase() + term.slice(1);

  const breadcrumbs = buildBreadcrumbSchema([
    { name: "Home", item: siteUrl },
    { name: capitalized, item: `${siteUrl}/m/${term}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbs) }}
      />

      <main className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
        <section className="space-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Blooket Calculator
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            {capitalized} Calculator
            <span className="mt-2 block text-xl font-medium text-violet-300">
              Blooket Pack Odds & Drop Rates
            </span>
          </h1>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-sm leading-7 text-emerald-200/80">
            Looking for <strong className="text-emerald-300">{capitalized}</strong>? You&apos;re in the right place — that&apos;s a common spelling of <strong className="text-white">Blooket</strong>. The calculator below works exactly the same.
          </div>
        </section>

        <section className="mt-10 space-y-6 text-white/70">
          <h2 className="text-2xl font-bold text-white">Blooket Pack Odds Calculator</h2>
          <p className="leading-relaxed">
            This is the Blooket Calculator — the same tool you were looking for.
            It uses exact binomial probability math to calculate your chances
            of pulling Epic, Legendary, and Chroma blooks from any Blooket pack.
            No approximations, no guesses — just the real numbers.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Packs Covered</p>
              <p className="mt-2 text-2xl font-black text-white">15+</p>
              <p className="mt-1 text-xs text-white/40">Space, Medieval, Aquatic & more</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Blooks Indexed</p>
              <p className="mt-2 text-2xl font-black text-white">172</p>
              <p className="mt-1 text-xs text-white/40">Every blook with drop rates & sell values</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Math Engine</p>
              <p className="mt-2 text-2xl font-black text-white">Exact</p>
              <p className="mt-1 text-xs text-white/40">Binomial probability + Monte Carlo sim</p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-white/30">Cost</p>
              <p className="mt-2 text-2xl font-black text-emerald-400">Free</p>
              <p className="mt-1 text-xs text-white/40">No login, no download, no sign-up</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <Link
            href="/"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 text-base font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
          >
            Open the Blooket Calculator →
          </Link>
        </section>

        <section className="mt-12 space-y-4 text-white/60 text-sm leading-7">
          <h2 className="text-xl font-bold text-white">What is {capitalized}?</h2>
          <p>
            <strong>{capitalized}</strong> is a common misspelling of <strong>Blooket</strong> —
            the educational gaming platform where students answer questions to earn tokens,
            then spend those tokens opening packs to collect blooks of different rarities.
          </p>
          <p>
            The Blooket Calculator on this site helps players understand the exact probability
            behind each pack opening. Instead of guessing whether a pack is worth your tokens,
            you can see the real numbers: your chance of pulling a Chroma, the expected token
            cost for any blook, and a Monte Carlo simulation that models thousands of
            openings to show you the realistic range of outcomes.
          </p>
        </section>

        <section className="mt-10 space-y-4 text-white/60 text-sm leading-7">
          <h2 className="text-xl font-bold text-white">Calculators & Tools</h2>
          <ul className="space-y-3">
            <li>
              <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Pack Odds Calculator
              </Link>
              {" — "}Main calculator with simulation for any pack and token budget
            </li>
            <li>
              <Link href="/calculators/chase" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Chase Calculator
              </Link>
              {" — "}Token budgets for specific blook targets at 50%, 90%, and 99% probability
            </li>
            <li>
              <Link href="/calculators/roi" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                ROI Calculator
              </Link>
              {" — "}Pack value rankings by probability per token spent
            </li>
            <li>
              <Link href="/calculators/token-converter" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Token Converter
              </Link>
              {" — "}Convert your token balance into pack counts
            </li>
            <li>
              <Link href="/calculators/value" className="text-emerald-400 hover:text-emerald-300 font-semibold">
                Value Calculator
              </Link>
              {" — "}Blook sell values and expected token cost
            </li>
          </ul>
        </section>

        <aside className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Calculator
          </Link>
          <Link href="/calculators" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            All Calculators
          </Link>
          <Link href="/blooks" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Blook Library
          </Link>
          <Link href="/guides" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Guides
          </Link>
          <Link href="/packs" className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-violet-500/25 hover:text-white">
            Packs
          </Link>
        </aside>
      </main>
    </>
  );
}
