import type { MetadataRoute } from "next";

import { BLOOKS } from "@/lib/constants";
import { PACKS } from "@/lib/packs";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/packs`,
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: `${siteUrl}/blooks`,
      changeFrequency: "daily",
      priority: 0.95,
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
    {
      url: `${siteUrl}/how-it-works`,
      changeFrequency: "monthly",
      priority: 0.6,
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
