"use client";

import { Search, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";

export default function BlogSearch() {
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState(searchParams.get("search") ?? "");
  const debouncedQuery = useDebounce(query, 300);
  const initialSearch = useRef(searchParams.get("search") ?? "");

  useEffect(() => {
    // Skip navigation if the debounced query already matches the current URL
    if (debouncedQuery.trim() === initialSearch.current.trim()) {
      initialSearch.current = ""; // allow future changes to navigate
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedQuery.trim()) {
      params.set("search", debouncedQuery.trim());
      params.delete("page");
    } else {
      params.delete("search");
      params.delete("page");
    }
    const q = params.toString();
    window.location.href = q ? `/blog?${q}` : "/blog";
  }, [debouncedQuery, searchParams]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape" && document.activeElement === inputRef.current) {
        inputRef.current?.blur();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    inputRef.current?.focus();
  }, []);

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        aria-label="Search blog posts"
        className="w-full h-10 pl-10 pr-10 bg-[#0f1629] border border-slate-800 rounded-lg text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30 transition-colors"
      />
      {query && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 bg-slate-800/50 border border-slate-700/50 rounded pointer-events-none">
        {query ? "" : "⌘K"}
      </kbd>
    </div>
  );
}
