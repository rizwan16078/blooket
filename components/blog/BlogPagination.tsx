"use client";

import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
}

function getPageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [1];

  if (current > 3) {
    pages.push("...");
  }

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  pages.push(total);

  return pages;
}

export default function BlogPagination({
  currentPage,
  totalPages,
  total,
  limit,
}: BlogPaginationProps) {
  const searchParams = useSearchParams();

  const goToPage = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      if (page <= 1) {
        params.delete("page");
      } else {
        params.set("page", String(page));
      }
      const query = params.toString();
      window.location.href = query ? `/blog?${query}` : "/blog";
    },
    [searchParams]
  );

  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, total);
  const pages = getPageRange(currentPage, totalPages);

  return (
    <nav aria-label="Blog pagination" className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10">
      <p className="text-sm text-slate-400">
        Showing <span className="font-medium text-white">{start}</span>-<span className="font-medium text-white">{end}</span> of <span className="font-medium text-white">{total}</span> posts
      </p>

      <div className="flex items-center gap-1">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((page, i) =>
          page === "..." ? (
            <span key={`dots-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-slate-600">
              …
            </span>
          ) : (
            <button
              key={page}
              onClick={() => goToPage(page)}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? "page" : undefined}
              className={`inline-flex items-center justify-center w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? "bg-emerald-400/10 border border-emerald-400/30 text-emerald-400"
                  : "border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 disabled:opacity-30 disabled:pointer-events-none transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
