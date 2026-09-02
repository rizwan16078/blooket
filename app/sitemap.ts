import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { guideEntries } from "@/data/guides";
import { MISSPELLINGS } from "@/data/misspellings";
import { BLOOKS } from "@/lib/constants";
import { PACKS } from "@/lib/packs";
import { siteUrl } from "@/lib/site";

// Default freshness stamp for entries that don't carry their own date.
// Must never move backwards relative to what production already serves —
// Google discounts sitemap lastmod entirely if dates regress.
const DEFAULT_LASTMOD = "2026-07-30";

/**
 * Whether the 179 individual /blooks/[id] pages are advertised in the sitemap.
 *
 * Off, deliberately. As of the 2026-09-03 audit Google had discovered 271 URLs
 * and indexed 14, with "Discovered – currently not indexed" flat for three
 * months — the classic signature of a domain whose crawl budget is exhausted
 * before it reaches anything that matters. Blook detail pages are the cheapest
 * thing to give up: they are templated (median 34% pairwise overlap), and not
 * one of them appears in Bing's top 37 pages by impressions even though Bing
 * has all of them indexed. They earn nothing even when they rank.
 *
 * The pages stay live, indexable, and internally linked from /packs,
 * /value-guide, the rarity hubs and /html-sitemap, so crawlers can still reach
 * them — they simply stop competing with money pages for the crawl budget.
 * Flip this back to true once Search Console shows indexed pages climbing
 * past ~60, which is the signal that budget is no longer the constraint.
 */
const INCLUDE_BLOOK_DETAIL_PAGES = false;

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // No trailing slash: the homepage <link rel="canonical"> emits
      // `${siteUrl}` exactly. Declaring `${siteUrl}/` here advertised a URL
      // whose own canonical pointed somewhere else, which is a contradictory
      // signal on a domain that is already struggling to get indexed.
      url: siteUrl,
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
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/guides`,
      lastModified: DEFAULT_LASTMOD,
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
      url: `${siteUrl}/calculators/simulator`,
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
      url: `${siteUrl}/calculators/token-grinder`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Games and the extension are the only assets here that competing Blooket
    // calculator sites do not also have, which makes them the most plausible
    // link and share magnets on the domain. They were missing from both the
    // sitemap and every server-rendered link, so no crawler could find them.
    {
      url: `${siteUrl}/games`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/games/blookle`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/games/guess-the-blook`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/games/rarity-quiz`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/extension`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/value-guide`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    // Open, licensed CSV/JSON of every drop rate. Datasets attract citations
    // and links in a way an interactive calculator does not, which is the one
    // thing this domain is short of.
    {
      url: `${siteUrl}/dataset`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
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
      priority: 0.88,
    })),
    ...(INCLUDE_BLOOK_DETAIL_PAGES
      ? BLOOKS.map((blook) => ({
          url: `${siteUrl}/blooks/${blook.id}`,
          lastModified: DEFAULT_LASTMOD,
          changeFrequency: "weekly" as const,
          priority: 0.75,
        }))
      : []),
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.78,
      images: [`${siteUrl}${post.imageUrl}`],
    })),
    ...guideEntries.map((guide) => ({
      url: `${siteUrl}/guides/${guide.slug}`,
      lastModified: guide.updatedAt,
      changeFrequency: "monthly" as const,
      priority: guide.priority === "high" ? 0.82 : 0.74,
    })),
    // /m/* misspelling pages are intentionally excluded from the sitemap.
    // Including 47 low-authority typo pages wastes crawl budget on a young
    // domain where Google only crawls ~20-50 pages per day. They are served
    // with noindex so Googlebot skips them and focuses on real content.
    {
      url: `${siteUrl}/how-it-works`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/methodology`,
      lastModified: DEFAULT_LASTMOD,
      changeFrequency: "monthly",
      priority: 0.65,
    },
    {
      url: `${siteUrl}/updates`,
      lastModified: DEFAULT_LASTMOD,
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
    // editorial-guidelines, html-sitemap, privacy, terms omitted from sitemap.
    // These are support pages with no ranking value. Keeping them out of the
    // sitemap reserves crawl budget for money pages on a low-authority domain.
  ];
}
