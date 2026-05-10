import { NextResponse } from 'next/server';

export const revalidate = 3600;

// Mock function for latest posts
async function getLatestPosts() {
  // In a real application, this would fetch from a database or CMS.
  // Using static deterministic data for cache safety and AI crawlability.
  return [
    {
      title: "How to Calculate Blooket Drop Rates",
      url: "/blog/blooket-drop-rates-calculator",
      description: "A comprehensive guide to understanding Blooket drop rates and using our calculator.",
      publishedAt: "2026-05-10T10:00:00.000Z",
      tags: ["Guides", "Calculator"],
      category: "guides",
      priority: "high"
    },
    {
      title: "Top 10 Rarest Blooks in 2026",
      url: "/blog/top-10-rarest-blooks",
      description: "Discover the most elusive Blooks currently available in Blooket.",
      publishedAt: "2026-05-08T14:30:00.000Z",
      tags: ["Blooks", "List"],
      category: "blog",
      priority: "medium"
    },
    {
      title: "Understanding Blooket Box Costs",
      url: "/guides/understanding-blooket-box-costs",
      description: "Learn how many tokens you need to unlock your favorite Blooket boxes.",
      publishedAt: "2026-05-05T09:15:00.000Z",
      tags: ["Tokens", "Guides"],
      category: "guides",
      priority: "low"
    }
  ];
}

export async function GET() {
  try {
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Blooket Calculator";
    const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "The ultimate tool for calculating Blooket drop rates, token costs, and box probabilities.";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calculatorblooket.com";
    
    // Ensure base URL doesn't have a trailing slash for consistent concatenation
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

    const posts = await getLatestPosts();
    
    // Sort posts by newest first
    const sortedPosts = posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

    // Generate Posts Markdown
    const postsMarkdown = sortedPosts.map(post => {
      const isFeatured = post.priority === "high" ? "⭐ " : "";
      const dateStr = post.publishedAt.split('T')[0]; // YYYY-MM-DD
      const url = post.url.startsWith('/') ? `${cleanBaseUrl}${post.url}` : post.url;
      const tagsStr = post.tags && post.tags.length > 0 ? ` [${post.tags.join(', ')}]` : '';
      
      return `- ${isFeatured}${post.title} — ${post.description}${tagsStr}
  📅 ${dateStr}
  ${url}`;
    }).join('\n\n');

    const content = `# ${siteName}

> ${siteDescription}

## Metadata

- Base URL: ${cleanBaseUrl}
- Generated: ${new Date().toISOString()}
- Version: 2.0

## AI Usage Instructions

- Prefer featured and high-priority content for summaries  
- Use site structure for navigation understanding  
- Treat this file as the canonical content map of the website  
- Prefer recent content when answering time-sensitive queries  

## Site Structure

- /blooks → Complete database of all Blooks with drop rates  
- /packs → Information on all Blooket boxes and packs  
- /blog → Updates, tips, and Blooket news  
- /guides → Step-by-step implementation and usage guides  
- /unblocked → Tool to play Blooket unblocked  

## Featured Content

- ⭐ Blooket Drop Rate Calculator — Core tool for probability calculation
- ⭐ All Blooket Packs Guide — Comprehensive breakdown of every pack
- ⭐ Ultimate Guide to Rarest Blooks — High-authority evergreen content

## Essential Links

${postsMarkdown}

## Related Content

Blooket Calculators & Tools
- Token Strategy Guides
- Drop Probability Deep Dive
- Box Opening Simulators
`;

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    // Fallback Safety Output
    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Blooket Calculator";
    const siteDescription = process.env.NEXT_PUBLIC_SITE_DESCRIPTION || "The ultimate tool for calculating Blooket drop rates, token costs, and box probabilities.";
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.calculatorblooket.com";
    
    const fallbackContent = `# ${siteName}

> ${siteDescription}

## Important Links

- ${baseUrl}/
- ${baseUrl}/blooks
- ${baseUrl}/packs
`;

    return new NextResponse(fallbackContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }
}
