import React from "react";

export type BlogSource = {
  label: string;
  href: string;
};

export type BlogCategory =
  | "GAME STRATEGY"
  | "ODDS & DATA"
  | "CALCULATOR TOOLS"
  | "TIPS & TRICKS"
  | "UPDATES";

export type SortOption = "latest" | "oldest" | "popular" | "az";

export type ViewMode = "grid" | "list";

export type BlogFaqEntry = {
  question: string;
  answer: string;
};

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string;
  updatedAt: string;
  category: BlogCategory;
  imageUrl: string;
  hasCalculator: boolean;
  sources: BlogSource[];
  content: React.ReactNode;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  readTime: string;
  views: number;
  featured: boolean;
  faqs?: BlogFaqEntry[];
}

export interface BlogCategoryCount {
  name: BlogCategory;
  count: number;
}

export interface BlogPaginationResult {
  posts: BlogPost[];
  total: number;
  page: number;
  totalPages: number;
  categories: BlogCategoryCount[];
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  "GAME STRATEGY",
  "ODDS & DATA",
  "CALCULATOR TOOLS",
  "TIPS & TRICKS",
  "UPDATES",
];

export const POSTS_PER_PAGE = 12;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "latest", label: "Latest" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "az", label: "A-Z" },
];
