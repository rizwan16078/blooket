import type { Metadata } from "next";
import { Suspense } from "react";

import BlookLibrary from "@/components/blooks/BlookLibrary";
import { BLOOKS } from "@/lib/constants";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Blook Library — Rarities, Odds & Sell Values",
  description:
    "Browse every Blooket blook with rarity, drop rate, and sell value data. Deep-link into the odds calculator for any blook in the library.",
  keywords: [
    "blooket blooks",
    "blooket blook list",
    "blooket blook rarities",
    "blooket blook drop rates",
    "blooket sell values",
  ],
  alternates: {
    canonical: `${siteUrl}/blooks`,
    languages: {
      "en-US": `${siteUrl}/blooks`,
      "x-default": `${siteUrl}/blooks`,
    },
  },
};

type BlooksPageProps = {
  searchParams: Promise<{
    blookId?: string;
  }>;
};

function BlookLibraryFallback() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3"
        >
          <div className="aspect-square animate-pulse rounded-xl bg-white/[0.04]" />
          <div className="mt-3 h-4 w-24 animate-pulse rounded-full bg-white/[0.06]" />
          <div className="mt-2 h-3 w-16 animate-pulse rounded-full bg-white/[0.06]" />
        </div>
      ))}
    </div>
  );
}

export default async function BlooksPage({ searchParams }: BlooksPageProps) {
  const resolvedSearchParams = await searchParams;

  return (
    <main className="mx-auto flex-1 w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          SEO Blook Library
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Blook Library
          <span className="mt-2 block text-xl font-medium text-violet-300">
            All Rarities, Drop Rates &amp; Sell Values
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          This library is optimized for high-cardinality discovery. Every blook has
          its own detail page, every card lazy-loads, and the catalog uses CSS rendering
          containment to stay smooth past 100 entries.
        </p>
      </section>

      <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 shadow-lg">
        <p className="text-sm text-white/40">
          Indexed blooks: <span className="font-bold text-white">{BLOOKS.length}</span>
        </p>
      </div>

      <section className="mt-8">
        <h2 className="sr-only">Interactive Blook Library</h2>
        <Suspense fallback={<BlookLibraryFallback />}>
          <BlookLibrary initialBlookId={resolvedSearchParams.blookId ?? null} />
        </Suspense>
      </section>
    </main>
  );
}
