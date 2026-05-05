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
  { label: "All", color: "text-slate-600", border: "border-slate-200", bg: "bg-[#1e353c]" },
  { label: "Uncommon", color: "text-green-600", border: "border-green-400", bg: "bg-green-50" },
  { label: "Rare", color: "text-blue-600", border: "border-blue-400", bg: "bg-blue-50" },
  { label: "Epic", color: "text-purple-600", border: "border-purple-400", bg: "bg-purple-50" },
  { label: "Legendary", color: "text-yellow-600", border: "border-yellow-400", bg: "bg-yellow-50" },
  { label: "Chroma", color: "text-cyan-600", border: "border-cyan-400", bg: "bg-cyan-50" },
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
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 h-6 w-6" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, pack, or rarity (e.g. 'Chroma')..."
          className="w-full bg-[#1e353c] border-4 border-[#2a424a] rounded-2xl py-4 pl-14 pr-4 text-xl text-white shadow-sm focus:ring-4 focus:ring-sky-300 outline-none transition-all placeholder:text-slate-400"
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
                  : "border-transparent bg-[#1e353c] text-slate-400 hover:bg-slate-50"
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
