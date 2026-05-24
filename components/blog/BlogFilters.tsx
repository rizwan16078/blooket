"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";
import type { BlogCategory, BlogCategoryCount } from "@/types/blog";

interface BlogFiltersProps {
  categories: BlogCategoryCount[];
  activeCategory: string;
}

export default function BlogFilters({ categories, activeCategory }: BlogFiltersProps) {
  const searchParams = useSearchParams();

  const handleFilter = useCallback(
    (category: BlogCategory | "all") => {
      const params = new URLSearchParams(searchParams.toString());
      if (category === "all") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      params.delete("page");
      const q = params.toString();
      window.location.href = q ? `/blog?${q}` : "/blog";
    },
    [searchParams]
  );

  const totalCount = categories.reduce((sum, c) => sum + c.count, 0);

  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter by category">
      <button
        role="tab"
        aria-selected={activeCategory === "all"}
        onClick={() => handleFilter("all")}
        className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
          activeCategory === "all"
            ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
            : "bg-[#0f1629] border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
        }`}
      >
        All <span className="ml-1 text-xs opacity-70">{totalCount}</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.name}
          role="tab"
          aria-selected={activeCategory === cat.name}
          onClick={() => handleFilter(cat.name)}
          className={`px-4 py-2 text-sm font-medium rounded-full border transition-colors ${
            activeCategory === cat.name
              ? "bg-emerald-400/10 border-emerald-400/30 text-emerald-400"
              : "bg-[#0f1629] border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
          }`}
        >
          {cat.name} <span className="ml-1 text-xs opacity-70">{cat.count}</span>
        </button>
      ))}
    </div>
  );
}
