import { SearchX } from "lucide-react";
import Link from "next/link";

interface BlogEmptyProps {
  search?: string;
  category?: string;
}

export default function BlogEmpty({ search, category }: BlogEmptyProps) {
  const hasFilters = search || (category && category !== "all");

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-6">
        <SearchX className="w-8 h-8 text-slate-500" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No posts found</h3>
      <p className="text-slate-400 max-w-md mb-6">
        {hasFilters
          ? `No posts match your current filters. Try adjusting your search or category.`
          : "There are no blog posts available at the moment."}
      </p>
      {hasFilters && (
        <Link
          href="/blog"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-slate-700 text-sm font-medium rounded-lg text-slate-300 hover:text-white hover:border-slate-500 transition-colors"
        >
          Clear all filters
        </Link>
      )}
    </div>
  );
}
