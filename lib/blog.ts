import { blogPosts } from "@/data/blog";
import {
  type BlogPost,
  type BlogCategory,
  type BlogCategoryCount,
  type BlogPaginationResult,
  type SortOption,
  BLOG_CATEGORIES,
  POSTS_PER_PAGE,
} from "@/types/blog";

function searchPosts(posts: BlogPost[], query: string): BlogPost[] {
  if (!query.trim()) return posts;
  const lower = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lower) ||
      post.excerpt.toLowerCase().includes(lower) ||
      post.tags.some((tag) => tag.toLowerCase().includes(lower)) ||
      post.category.toLowerCase().includes(lower)
  );
}

function filterByCategory(posts: BlogPost[], category: BlogCategory | "all"): BlogPost[] {
  if (category === "all") return posts;
  return posts.filter((post) => post.category === category);
}

function sortPosts(posts: BlogPost[], sort: SortOption): BlogPost[] {
  const sorted = [...posts];
  switch (sort) {
    case "latest":
      return sorted.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
    case "oldest":
      return sorted.sort((a, b) => a.publishedAt.localeCompare(b.publishedAt));
    case "popular":
      return sorted.sort((a, b) => b.views - a.views);
    case "az":
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return sorted;
  }
}

function getCategoryCounts(posts: BlogPost[]): BlogCategoryCount[] {
  return BLOG_CATEGORIES.map((name) => ({
    name,
    count: posts.filter((post) => post.category === name).length,
  }));
}

export function getBlogPosts(params: {
  page?: number;
  limit?: number;
  search?: string;
  category?: BlogCategory | "all";
  sort?: SortOption;
}): BlogPaginationResult {
  const {
    page = 1,
    limit = POSTS_PER_PAGE,
    search = "",
    category = "all",
    sort = "latest",
  } = params;

  let filtered = [...blogPosts];

  filtered = searchPosts(filtered, search);
  filtered = filterByCategory(filtered, category);
  filtered = sortPosts(filtered, sort);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * limit;
  const paginatedPosts = filtered.slice(start, start + limit);

  return {
    posts: paginatedPosts,
    total,
    page: safePage,
    totalPages,
    categories: getCategoryCounts(blogPosts),
  };
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getBlogPostBySlug(currentSlug);
  if (!current) return [];

  return blogPosts
    .filter(
      (post) =>
        post.slug !== currentSlug &&
        (post.category === current.category ||
          post.tags.some((tag) => current.tags.includes(tag)))
    )
    .slice(0, limit);
}

export function getAllBlogSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}

export function highlightSearchTerm(text: string, query: string): string {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "<mark>$1</mark>");
}
