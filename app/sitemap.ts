import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { guideEntries } from "@/data/guides";
import { MISSPELLINGS } from "@/data/misspellings";
import { BLOOKS, LAST_UPDATED } from "@/lib/constants";
import { PACKS } from "@/lib/packs";
import { siteUrl } from "@/lib/site";

// Default freshness stamp for entries that don't carry their own date.
// Bumping LAST_UPDATED in lib/constants.ts cascades freshness to every
// programmatic entry below, which helps Google re-crawl pages currently
// stuck in "Discovered - currently not indexed".
const DEFAULT_LASTMOD = LAST_UPDATED;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/packs`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/blooks`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: "2026-05-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: "2026-05-24",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/unblocked`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/calculators`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/calculators/pack-odds`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/calculators/token-converter`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/calculators/roi`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/calculators/value`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/calculators/chase`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/value-guide`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/chroma`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/legendary`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/epic`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/rare`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/uncommon`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/complete-list`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/blooks/starter`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/faq`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/guides/blooket-hack-alternative`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/guides/how-to-get-chroma-blooket`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/guides/how-to-get-legendary-blooket`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about/who-made-blooket`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/glossary`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/is-blooket-plus-worth-it`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/best-blooket-calculator`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...PACKS.map((pack) => ({
      url: `${siteUrl}${pack.route}`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BLOOKS.map((blook) => ({
      url: `${siteUrl}/blooks/${blook.id}`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.72,
      images: [`${siteUrl}${post.imageUrl}`],
    })),
    ...guideEntries.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified: guide.updatedAt,
      changeFrequency: "monthly" as const,
      priority: guide.priority === "high" ? 0.76 : 0.68,
    })),
    ...MISSPELLINGS.map((m) => ({
      url: `${siteUrl}/m/${m.term}`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly" as const,
      priority: m.volume >= 10000 ? 0.7 : m.volume >= 1000 ? 0.6 : 0.5,
    })),
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/methodology`,
      lastModified: "2026-05-24",
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/updates`,
      lastModified: "2026-05-24",
      changeFrequency: "monthly",
      priority: 0.55,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/team`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/editorial-guidelines`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/html-sitemap`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
