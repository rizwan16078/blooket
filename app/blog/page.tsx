/* eslint-disable react/no-unescaped-entities */
import { Suspense } from "react";
import { Metadata } from "next";
import { getBlogPosts } from "@/lib/blog";
import { type BlogCategory, type SortOption, type ViewMode, POSTS_PER_PAGE } from "@/types/blog";
import { siteName, siteUrl } from "@/lib/site";
import BlogSearch from "@/components/blog/BlogSearch";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogSort from "@/components/blog/BlogSort";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/BlogPagination";
import BlogToolbar from "@/components/blog/BlogToolbar";

export const metadata: Metadata = {
  title: `Blog — Guides, Strategies & Data | ${siteName}`,
  description:
    "Data-driven Blooket guides, pack odds analysis, token farming strategies, and calculator tools. Written by players, for players.",
  openGraph: {
    title: `Blog — ${siteName}`,
    description: "Data-driven Blooket guides, strategies, and calculator tools.",
    url: `${siteUrl}/blog`,
    siteName,
    type: "website",
  },
  alternates: { canonical: `${siteUrl}/blog` },
};

interface BlogPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);
  const search = typeof params.search === "string" ? params.search : "";
  const category = (typeof params.category === "string" ? params.category : "all") as
    | BlogCategory
    | "all";
  const sort = (typeof params.sort === "string" ? params.sort : "latest") as SortOption;
  const viewMode = (typeof params.view === "string" && params.view === "list" ? "list" : "grid") as ViewMode;

  const result = getBlogPosts({ page, search, category, sort, limit: POSTS_PER_PAGE });

  return (
    <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
      {/* Header */}
      <div className="max-w-3xl mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Blooket <span className="text-emerald-400">Strategies & Guides</span>
        </h1>
        <p className="text-lg text-slate-300 leading-relaxed">
          Stop guessing and start optimizing. From token farming strategies to deep statistical
          breakdowns of drop rates, we&apos;ve got the math to back up your gameplay.
        </p>
      </div>

      {/* Search + Sort row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Suspense fallback={<div className="h-10 w-72 bg-slate-800/50 rounded-lg animate-pulse" />}>
          <BlogSearch />
        </Suspense>
        <BlogSort activeSort={sort} />
      </div>

      {/* Category filters */}
      <div className="mb-8">
        <Suspense fallback={<div className="flex gap-2"><div className="h-10 w-20 bg-slate-800/50 rounded-full animate-pulse" /><div className="h-10 w-24 bg-slate-800/50 rounded-full animate-pulse" /></div>}>
          <BlogFilters categories={result.categories} activeCategory={category} />
        </Suspense>
      </div>

      {/* Toolbar */}
      <BlogToolbar viewMode={viewMode} total={result.total} />

      {/* Post grid */}
      <div className="mt-6">
        <BlogGrid posts={result.posts} search={search} category={category} viewMode={viewMode} />
      </div>

      {/* Pagination */}
      <BlogPagination
        currentPage={result.page}
        totalPages={result.totalPages}
        total={result.total}
        limit={POSTS_PER_PAGE}
      />
    </main>
  );
}
