import type { MetadataRoute } from "next";

import { blogPosts } from "@/data/blog";
import { guideEntries } from "@/data/guides";
import { BLOOKS } from "@/lib/constants";
import { PACKS } from "@/lib/packs";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/packs`,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/blooks`,
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
      changeFrequency: "monthly",
      priority: 0.85,
    },
    ...PACKS.map((pack) => ({
      url: `${siteUrl}${pack.route}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BLOOKS.map((blook) => ({
      url: `${siteUrl}/blooks/${blook.id}`,
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
    {
      url: `${siteUrl}/how-it-works`,
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
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/team`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${siteUrl}/editorial-guidelines`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/html-sitemap`,
      changeFrequency: "monthly",
      priority: 0.4,
    },
    {
      url: `${siteUrl}/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
