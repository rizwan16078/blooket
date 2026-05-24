"use client";

import { useSearchParams } from "next/navigation";
import { ArrowDownAZ, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import { useCallback } from "react";
import type { SortOption } from "@/types/blog";
import { SORT_OPTIONS } from "@/types/blog";

const SORT_ICONS: Record<SortOption, React.ReactNode> = {
  latest: <ArrowDown className="w-3.5 h-3.5" />,
  oldest: <ArrowUp className="w-3.5 h-3.5" />,
  popular: <TrendingUp className="w-3.5 h-3.5" />,
  az: <ArrowDownAZ className="w-3.5 h-3.5" />,
};

interface BlogSortProps {
  activeSort: SortOption;
}

export default function BlogSort({ activeSort }: BlogSortProps) {
  const searchParams = useSearchParams();

  const handleSort = useCallback(
    (sort: SortOption) => {
      const params = new URLSearchParams(searchParams.toString());
      if (sort === "latest") {
        params.delete("sort");
      } else {
        params.set("sort", sort);
      }
      params.delete("page");
      const q = params.toString();
      window.location.href = q ? `/blog?${q}` : "/blog";
    },
    [searchParams]
  );

  return (
    <div className="relative">
      <select
        value={activeSort}
        onChange={(e) => handleSort(e.target.value as SortOption)}
        aria-label="Sort posts"
        className="appearance-none h-10 pl-9 pr-8 bg-[#0f1629] border border-slate-800 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors cursor-pointer"
      >
        {SORT_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
        {SORT_ICONS[activeSort]}
      </span>
      <svg
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}
