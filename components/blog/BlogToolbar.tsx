"use client";

import { useSearchParams } from "next/navigation";
import { LayoutGrid, List } from "lucide-react";
import { useCallback } from "react";
import type { ViewMode } from "@/types/blog";

interface BlogToolbarProps {
  viewMode: ViewMode;
  total: number;
}

export default function BlogToolbar({ viewMode, total }: BlogToolbarProps) {
  const searchParams = useSearchParams();

  const setViewMode = useCallback(
    (mode: ViewMode) => {
      const params = new URLSearchParams(searchParams.toString());
      if (mode === "grid") {
        params.delete("view");
      } else {
        params.set("view", mode);
      }
      const q = params.toString();
      window.location.href = q ? `/blog?${q}` : "/blog";
    },
    [searchParams]
  );

  return (
    <div className="flex items-center justify-between gap-4">
      <p className="text-sm text-slate-400">
        <span className="font-medium text-white">{total}</span> {total === 1 ? "post" : "posts"} found
      </p>
      <div className="flex items-center gap-1 bg-[#0f1629] border border-slate-800 rounded-lg p-0.5">
        <button
          onClick={() => setViewMode("grid")}
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === "grid"
              ? "bg-emerald-400/10 text-emerald-400"
              : "text-slate-500 hover:text-white"
          }`}
        >
          <LayoutGrid className="w-4 h-4" />
        </button>
        <button
          onClick={() => setViewMode("list")}
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={`p-1.5 rounded-md transition-colors ${
            viewMode === "list"
              ? "bg-emerald-400/10 text-emerald-400"
              : "text-slate-500 hover:text-white"
          }`}
        >
          <List className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
