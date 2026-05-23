import { blogPosts } from "@/data/blog";
import { guideEntries } from "@/data/guides";
import { siteUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const pages = [
    {
      url: "/",
      title: "Blooket Pack Odds Calculator",
      description:
        "Calculate exact drop rates and odds for all Blooket packs with our probability engine.",
      publishedAt: "2026-05-03",
    },
    {
      url: "/packs",
      title: "All Blooket Packs",
      description: "Browse all available Blooket packs and their blook odds.",
      publishedAt: "2026-05-03",
    },
    {
      url: "/blooks",
      title: "Blooket Blook Library",
      description: "Full library of every blook across all Blooket packs.",
      publishedAt: "2026-05-03",
    },
    {
      url: "/guides",
      title: "Blooket Guides & Glossary",
      description:
        "Rarity hubs, glossary pages, and pack strategy guides built around the site calculator data.",
      publishedAt: "2026-05-24",
    },
    {
      url: "/methodology",
      title: "Methodology",
      description:
        "How the Blooket Calculator models odds, duplicate refunds, source data, and updates.",
      publishedAt: "2026-05-24",
    },
  ];

  const articleItems = [
    ...blogPosts.map((post) => ({
      url: `/blog/${post.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedAt: post.updatedAt,
    })),
    ...guideEntries.map((guide) => ({
      url: `/guides/${guide.slug}`,
      title: guide.title,
      description: guide.description,
      publishedAt: guide.updatedAt,
    })),
  ].sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));

  const allItems = [...articleItems, ...pages];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteName)}</title>
    <link>${siteUrl}</link>
    <description>Production-grade probability engine for Blooket packs. Exact math, not guesses.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${allItems
  .map(
    (p) => `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${siteUrl}${p.url}</link>
      <description>${escapeXml(p.description)}</description>
      <guid>${siteUrl}${p.url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
    </item>`
  )
  .join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
