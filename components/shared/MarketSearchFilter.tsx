"use client";

import { Search, X } from "lucide-react";

export type RarityFilter = "All" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Chroma" | "Mystical";

type MarketSearchFilterProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: RarityFilter;
  setActiveFilter: (filter: RarityFilter) => void;
};

type FilterStyle = {
  label: RarityFilter;
  // Active state — full color treatment.
  activeBorder: string;
  activeBg: string;
  activeText: string;
  activeRing: string;
  // Inactive state — keep the rarity hue visible but muted, so the row reads
  // as a colorful taxonomy even before the user clicks anything.
  idleText: string;
  idleBorder: string;
  idleHoverBg: string;
  // Indicator dot — a tiny color chip on the left edge of every pill.
  dot: string;
};

const RARITY_FILTERS: FilterStyle[] = [
  {
    label: "All",
    activeBorder: "border-white/30",
    activeBg: "bg-white/10",
    activeText: "text-white",
    activeRing: "ring-white/20",
    idleText: "text-white/70",
    idleBorder: "border-white/10",
    idleHoverBg: "hover:bg-white/[0.06]",
    dot: "bg-white/60",
  },
  {
    label: "Uncommon",
    activeBorder: "border-green-400/60",
    activeBg: "bg-green-500/15",
    activeText: "text-green-300",
    activeRing: "ring-green-400/30",
    idleText: "text-green-400/80",
    idleBorder: "border-green-500/20",
    idleHoverBg: "hover:bg-green-500/[0.08]",
    dot: "bg-green-400",
  },
  {
    label: "Rare",
    activeBorder: "border-blue-400/60",
    activeBg: "bg-blue-500/15",
    activeText: "text-blue-300",
    activeRing: "ring-blue-400/30",
    idleText: "text-blue-400/80",
    idleBorder: "border-blue-500/20",
    idleHoverBg: "hover:bg-blue-500/[0.08]",
    dot: "bg-blue-400",
  },
  {
    label: "Epic",
    activeBorder: "border-purple-400/60",
    activeBg: "bg-purple-500/15",
    activeText: "text-purple-300",
    activeRing: "ring-purple-400/30",
    idleText: "text-purple-400/80",
    idleBorder: "border-purple-500/20",
    idleHoverBg: "hover:bg-purple-500/[0.08]",
    dot: "bg-purple-400",
  },
  {
    label: "Legendary",
    activeBorder: "border-yellow-400/60",
    activeBg: "bg-yellow-500/15",
    activeText: "text-yellow-300",
    activeRing: "ring-yellow-400/30",
    idleText: "text-yellow-400/80",
    idleBorder: "border-yellow-500/20",
    idleHoverBg: "hover:bg-yellow-500/[0.08]",
    dot: "bg-yellow-400",
  },
  {
    label: "Chroma",
    activeBorder: "border-cyan-400/60",
    activeBg: "bg-cyan-500/15",
    activeText: "text-cyan-300",
    activeRing: "ring-cyan-400/30",
    idleText: "text-cyan-400/80",
    idleBorder: "border-cyan-500/20",
    idleHoverBg: "hover:bg-cyan-500/[0.08]",
    dot: "bg-cyan-400",
  },
];

export default function MarketSearchFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: MarketSearchFilterProps) {
  const hasQuery = searchQuery.length > 0;

  return (
    <div className="mb-8 space-y-4">
      <div className="group relative">
        <Search
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40 transition-colors group-focus-within:text-violet-300"
          aria-hidden
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, pack, or rarity (e.g. 'Chroma')..."
          aria-label="Search blooks and packs"
          className="w-full rounded-xl border border-white/15 bg-white/[0.04] py-3.5 pl-12 pr-12 text-base text-white shadow-lg shadow-black/20 outline-none transition-all placeholder:text-white/40 focus:border-violet-400/60 focus:bg-white/[0.06] focus:ring-2 focus:ring-violet-500/30"
        />
        {hasQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div
        className="flex flex-wrap gap-2"
        role="radiogroup"
        aria-label="Filter by rarity"
      >
        {RARITY_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.label;
          return (
            <button
              key={filter.label}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setActiveFilter(filter.label)}
              className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 ${
                isActive
                  ? `${filter.activeBorder} ${filter.activeBg} ${filter.activeText} ring-1 ${filter.activeRing} shadow-sm`
                  : `${filter.idleBorder} bg-white/[0.02] ${filter.idleText} ${filter.idleHoverBg} hover:border-white/20`
              }`}
            >
              <span
                className={`inline-block h-1.5 w-1.5 rounded-full ${filter.dot} ${
                  isActive ? "" : "opacity-70"
                }`}
                aria-hidden
              />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
