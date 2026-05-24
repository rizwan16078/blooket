"use client";

import BlogCard from "./BlogCard";
import BlogEmpty from "./BlogEmpty";
import type { BlogPost, ViewMode } from "@/types/blog";

interface BlogGridProps {
  posts: BlogPost[];
  search?: string;
  category?: string;
  viewMode: ViewMode;
}

export default function BlogGrid({ posts, search, category, viewMode }: BlogGridProps) {
  if (posts.length === 0) {
    return <BlogEmpty search={search} category={category} />;
  }

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <BlogCard key={post.slug} post={post} index={i} viewMode="list" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post, i) => (
        <BlogCard key={post.slug} post={post} index={i} viewMode="grid" />
      ))}
    </div>
  );
}
