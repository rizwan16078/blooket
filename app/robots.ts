import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  // Canonical tags on every page consolidate query-parameter variations,
  // so we no longer block them here. The previous wildcard disallow
  // patterns were ambiguous and could match the homepage when crawled
  // with any internal-state query string, causing "Indexed, though
  // blocked by robots.txt" warnings in Search Console.
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
