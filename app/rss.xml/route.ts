import { siteUrl, siteName } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const pages = [
    { url: "/", title: "Blooket Pack Odds Calculator", description: "Calculate exact drop rates and odds for all Blooket packs with our probability engine." },
    { url: "/packs", title: "All Blooket Packs", description: "Browse all available Blooket packs and their blook odds." },
    { url: "/blooks", title: "Blooket Blook Library", description: "Full library of every blook across all Blooket packs." },
    { url: "/how-it-works", title: "How It Works", description: "Learn how the Blooket Calculator computes exact probability math." },
    { url: "/about", title: "About Blooket Calculator", description: "About the Blooket Calculator project and team." },
  ];

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteName}</title>
    <link>${siteUrl}</link>
    <description>Production-grade probability engine for Blooket packs. Exact math, not guesses.</description>
    <language>en-us</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${pages
  .map(
    (p) => `    <item>
      <title>${p.title}</title>
      <link>${siteUrl}${p.url}</link>
      <description>${p.description}</description>
      <guid>${siteUrl}${p.url}</guid>
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
