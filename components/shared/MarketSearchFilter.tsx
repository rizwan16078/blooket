"use client";

import { Search } from "lucide-react";

export type RarityFilter = "All" | "Uncommon" | "Rare" | "Epic" | "Legendary" | "Chroma" | "Mystical";

type MarketSearchFilterProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: RarityFilter;
  setActiveFilter: (filter: RarityFilter) => void;
};

const RARITY_FILTERS: { label: RarityFilter; color: string; border: string; bg: string }[] = [
  { label: "All", color: "text-white/60", border: "border-white/10", bg: "bg-white/[0.04]" },
  { label: "Uncommon", color: "text-green-400", border: "border-green-500/30", bg: "bg-green-500/10" },
  { label: "Rare", color: "text-blue-400", border: "border-blue-500/30", bg: "bg-blue-500/10" },
  { label: "Epic", color: "text-purple-400", border: "border-purple-500/30", bg: "bg-purple-500/10" },
  { label: "Legendary", color: "text-yellow-400", border: "border-yellow-500/30", bg: "bg-yellow-500/10" },
  { label: "Chroma", color: "text-cyan-400", border: "border-cyan-500/30", bg: "bg-cyan-500/10" },
];

export default function MarketSearchFilter({
  searchQuery,
  setSearchQuery,
  activeFilter,
  setActiveFilter,
}: MarketSearchFilterProps) {
  return (
    <div className="mb-8 space-y-4">
      <div className="relative">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/25 h-6 w-6" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, pack, or rarity (e.g. 'Chroma')..."
          className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-4 pl-14 pr-4 text-xl text-white shadow-sm focus:ring-2 focus:ring-violet-500/30 outline-none transition-all placeholder:text-white/25"
        />
      </div>
      
      <div className="flex flex-wrap gap-2">
        {RARITY_FILTERS.map((filter) => {
          const isActive = activeFilter === filter.label;
          return (
            <button
              key={filter.label}
              onClick={() => setActiveFilter(filter.label)}
              className={`px-4 py-2 rounded-full font-semibold transition-all border-2 ${
                isActive
                  ? `${filter.border} ${filter.bg} ${filter.color} scale-105 shadow-sm`
                  : "border-transparent bg-white/[0.02] text-white/30 hover:bg-white/[0.04]"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
