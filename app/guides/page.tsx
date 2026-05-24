import type { Metadata } from "next";
import Link from "next/link";

import { guideEntries } from "@/data/guides";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Guides & Glossary",
  description:
    "Explore Blooket guides covering rarity hubs, pack strategy, Market mechanics, drop rates, and collector terminology.",
  keywords: [
    "blooket guides",
    "blooket glossary",
    "blooket rarity guide",
    "blooket market guide",
  ],
  alternates: {
    canonical: `${siteUrl}/guides`,
    languages: {
      "en-US": `${siteUrl}/guides`,
      "x-default": `${siteUrl}/guides`,
    },
  },
};

export default function GuidesPage() {
  const categories = Array.from(new Set(guideEntries.map((guide) => guide.category)));

  return (
    <main className="mx-auto flex-1 w-full max-w-7xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildBreadcrumbSchema([
              { name: "Home", item: siteUrl },
              { name: "Guides", item: `${siteUrl}/guides` },
            ]),
          ),
        }}
      />

      <section className="space-y-5">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Authority Hub
        </p>
        <h1 className="max-w-5xl font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blooket Guides & Glossary
        </h1>
        <p className="max-w-4xl text-lg leading-8 text-white/65">
          This section expands the calculator into a full topical hub: rarity pages,
          glossary entries, Market explainers, and pack strategy guides built around the
          same pack data used throughout the site.
        </p>
      </section>

      <section className="mt-10 space-y-10">
        {categories.map((category) => (
          <div key={category} className="space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-2xl font-black text-white">{category}</h2>
              <p className="text-sm text-white/40">
                {guideEntries.filter((guide) => guide.category === category).length} pages
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {guideEntries
                .filter((guide) => guide.category === category)
                .map((guide) => (
                  <article
                    key={guide.slug}
                    className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 shadow-xl transition hover:border-violet-500/25 hover:bg-white/[0.03]"
                  >
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-violet-400">
                      {guide.priority} priority
                    </p>
                    <h3 className="mt-3 text-xl font-black text-white transition group-hover:text-violet-300">
                      <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
                    </h3>
                    <p className="mt-3 text-sm leading-7 text-white/60">{guide.excerpt}</p>
                    <p className="mt-4 text-xs uppercase tracking-[0.18em] text-white/30">
                      Updated {guide.updatedAt}
                    </p>
                  </article>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}

