import type { Metadata } from "next";
import Link from "next/link";

import ContentMeta from "@/components/content/ContentMeta";
import { LAST_UPDATED } from "@/lib/constants";
import {
  DATASET_COLUMNS,
  DATASET_CSV_PATH,
  DATASET_JSON_PATH,
  DATASET_LICENSE_NAME,
  DATASET_LICENSE_URL,
  DATASET_VERSION,
  buildDatasetRows,
  getDatasetStats,
} from "@/lib/dataset";
import { buildBreadcrumbSchema, serializeJsonLd } from "@/lib/schema";
import { siteName, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blooket Drop Rate Dataset — Free CSV & JSON Download",
  description:
    "Download every Blooket drop rate as an open CSV or JSON file. All packs, all blooks, sell values and 50/90/99% pull thresholds. Free, CC BY 4.0, cite it anywhere.",
  keywords: [
    "blooket drop rate dataset",
    "blooket drop rates csv",
    "blooket data download",
    "blooket odds json",
    "blooket pack data",
  ],
  alternates: {
    canonical: `${siteUrl}/dataset`,
    languages: {
      "en-US": `${siteUrl}/dataset`,
      "x-default": `${siteUrl}/dataset`,
    },
  },
};

export default function DatasetPage() {
  const rows = buildDatasetRows();
  const stats = getDatasetStats(rows);
  const preview = rows.slice(0, 8);

  const datasetSchema = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    "@id": `${siteUrl}/dataset#dataset`,
    name: "Blooket Pack Drop Rates",
    description:
      "Verified drop rates, sell values and 50/90/99% confidence pull thresholds for every blook in every Blooket pack. Published as an open CSV and JSON download.",
    url: `${siteUrl}/dataset`,
    version: DATASET_VERSION,
    dateModified: LAST_UPDATED,
    isAccessibleForFree: true,
    license: DATASET_LICENSE_URL,
    creativeWorkStatus: "Published",
    keywords: [
      "Blooket",
      "drop rates",
      "pack odds",
      "probability",
      "game data",
    ],
    creator: {
      "@type": "Organization",
      name: siteName,
      url: siteUrl,
    },
    // distribution is the field that makes a Dataset actually harvestable —
    // without it a crawler sees a description of data but no way to fetch it.
    distribution: [
      {
        "@type": "DataDownload",
        encodingFormat: "text/csv",
        contentUrl: `${siteUrl}${DATASET_CSV_PATH}`,
        name: "Blooket drop rates (CSV)",
      },
      {
        "@type": "DataDownload",
        encodingFormat: "application/json",
        contentUrl: `${siteUrl}${DATASET_JSON_PATH}`,
        name: "Blooket drop rates (JSON)",
      },
    ],
    variableMeasured: DATASET_COLUMNS.map((c) => ({
      "@type": "PropertyValue",
      name: c.key,
      description: c.description,
    })),
  };

  return (
    <main className="mx-auto flex-1 w-full max-w-5xl px-4 pb-24 pt-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            buildBreadcrumbSchema([
              { name: "Home", item: siteUrl },
              { name: "Drop Rate Dataset", item: `${siteUrl}/dataset` },
            ]),
          ),
        }}
      />

      <header className="space-y-6">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
          Open Data
        </p>
        <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
          Blooket Drop Rate Dataset
        </h1>
        <p className="text-lg leading-8 text-white/65">
          Every drop rate on this site, in one file. {stats.rowCount} blooks across{" "}
          {stats.packCount} packs, with sell values and the number of packs you need
          for a 50%, 90% or 99% chance at each one. Free to download, free to
          republish, {DATASET_LICENSE_NAME}.
        </p>

        <div className="flex flex-wrap gap-3">
          <a
            href={DATASET_CSV_PATH}
            className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-violet-500"
          >
            Download CSV
            <span className="text-xs font-medium text-white/70">
              {stats.rowCount} rows
            </span>
          </a>
          <a
            href={DATASET_JSON_PATH}
            className="inline-flex items-center gap-2 rounded-xl border border-white/[0.12] bg-white/[0.03] px-5 py-3 text-sm font-bold text-white/85 transition hover:border-violet-500/40 hover:text-white"
          >
            Download JSON
          </a>
        </div>

        <ContentMeta
          updatedAt={LAST_UPDATED}
          sources={[
            {
              label: "Blooket Wiki: Packs",
              href: "https://blooket.fandom.com/wiki/Packs",
            },
            {
              label: "Blooket Help: How to View Pack Contents",
              href: "https://help.blooket.com/hc/en-us/articles/16310451530519-How-to-View-Blooket-Pack-Contents",
            },
            {
              label: "Blooket Help: How to Collect Blooks",
              href: "https://help.blooket.com/hc/en-us/articles/16620639672599-How-to-Collect-Blooks",
            },
          ]}
          note={`Dataset version ${DATASET_VERSION}. Drop rates are re-verified against the cited sources before each version bump; the version string is the verification date, not the publish date.`}
        />
      </header>

      <section className="mt-14 space-y-5">
        <h2 className="text-2xl font-black tracking-tight text-white">
          What is in the file
        </h2>
        <p className="max-w-3xl leading-7 text-white/65">
          One row per blook. {stats.columnCount} columns covering pack identity, pack
          cost, rarity, drop rate, sell value, and three precomputed confidence
          thresholds. The threshold columns are the ones worth having — they answer
          &ldquo;how many packs until I actually get this?&rdquo; without anyone
          needing to run the maths themselves.
        </p>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-4 py-3 font-bold">Column</th>
                <th className="px-4 py-3 font-bold">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {DATASET_COLUMNS.map((col) => (
                <tr key={col.key}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-violet-300">
                    {col.key}
                  </td>
                  <td className="px-4 py-3 text-white/65">{col.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 space-y-5">
        <h2 className="text-2xl font-black tracking-tight text-white">Preview</h2>
        <p className="max-w-3xl leading-7 text-white/65">
          The first {preview.length} rows, exactly as they appear in the CSV.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full min-w-[720px] text-left text-sm tabular-nums">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-wider text-white/50">
              <tr>
                <th className="px-4 py-3 font-bold">Blook</th>
                <th className="px-4 py-3 font-bold">Pack</th>
                <th className="px-4 py-3 font-bold">Rarity</th>
                <th className="px-4 py-3 text-right font-bold">Drop rate</th>
                <th className="px-4 py-3 text-right font-bold">Sell</th>
                <th className="px-4 py-3 text-right font-bold">Packs for 90%</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {preview.map((row) => (
                <tr key={row.blook_id}>
                  <td className="px-4 py-3 font-semibold text-white">
                    {row.blook_name}
                  </td>
                  <td className="px-4 py-3 text-white/65">{row.pack_name}</td>
                  <td className="px-4 py-3 text-white/65">{row.rarity}</td>
                  <td className="px-4 py-3 text-right text-white/85">
                    {row.drop_rate_percent}%
                  </td>
                  <td className="px-4 py-3 text-right text-white/65">
                    {row.sell_value_tokens}
                  </td>
                  <td className="px-4 py-3 text-right text-white/85">
                    {row.packs_for_90pct ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-14 space-y-5">
        <h2 className="text-2xl font-black tracking-tight text-white">
          How the thresholds are calculated
        </h2>
        <p className="max-w-3xl leading-7 text-white/65">
          Each pack opening is an independent trial, so the chance of getting at
          least one copy of a blook in <em>n</em> packs is 1 − (1 − p)
          <sup>n</sup>. Rearranged for the number of packs:
        </p>
        <pre className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 font-mono text-sm text-violet-200">
          packs = ceil( ln(1 − confidence) / ln(1 − dropRate) )
        </pre>
        <p className="max-w-3xl leading-7 text-white/65">
          The published figures assume no duplicate-refund discount. Refunds depend
          on which blooks a player already owns, so any single number we printed
          would be unreproducible for most readers — the plain figure is the one
          anyone can check. Use the{" "}
          <Link href="/calculators/chase" className="font-semibold text-violet-300 hover:text-violet-200">
            chase calculator
          </Link>{" "}
          to model refunds against your own collection, and the{" "}
          <Link href="/methodology" className="font-semibold text-violet-300 hover:text-violet-200">
            methodology page
          </Link>{" "}
          for the full derivation.
        </p>
      </section>

      <section className="mt-14 space-y-5">
        <h2 className="text-2xl font-black tracking-tight text-white">
          Licence and citation
        </h2>
        <p className="max-w-3xl leading-7 text-white/65">
          Released under{" "}
          <a
            href={DATASET_LICENSE_URL}
            className="font-semibold text-violet-300 hover:text-violet-200"
            rel="license noopener noreferrer"
            target="_blank"
          >
            Creative Commons Attribution 4.0
          </a>
          . Use it in a wiki, a video, a school project, a competing calculator — all
          fine. The only condition is attribution.
        </p>
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Suggested citation
          </p>
          <p className="mt-3 font-mono text-sm leading-6 text-white/80">
            {siteName}. &ldquo;Blooket Pack Drop Rates&rdquo; (version {DATASET_VERSION}).{" "}
            {siteUrl}/dataset
          </p>
        </div>
      </section>

      <section className="mt-14 space-y-5">
        <h2 className="text-2xl font-black tracking-tight text-white">
          Corrections welcome
        </h2>
        <p className="max-w-3xl leading-7 text-white/65">
          If a rate here disagrees with what you see in-game, that is worth knowing
          and we will fix it. Send the pack, the blook and a screenshot through the{" "}
          <Link href="/contact" className="font-semibold text-violet-300 hover:text-violet-200">
            contact page
          </Link>
          . Corrections are logged on the{" "}
          <Link href="/updates" className="font-semibold text-violet-300 hover:text-violet-200">
            change log
          </Link>{" "}
          with the date and the source.
        </p>
      </section>
    </main>
  );
}
