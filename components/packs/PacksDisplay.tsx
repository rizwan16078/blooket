"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import PackNavSidebar from "@/components/packs/PackNavSidebar";
import PackTableSection from "@/components/packs/PackTableSection";
import MarketSearchFilter, { RarityFilter } from "@/components/shared/MarketSearchFilter";
import { LOCKED_PACKS, PACKS, PACK_BLOOKS_MAP, UNLOCKED_PACKS } from "@/lib/constants";

export default function PacksDisplay() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RarityFilter>("All");

  const filteredPacksData = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    
    return PACKS.map((pack) => {
      const blooks = PACK_BLOOKS_MAP[pack.id] ?? [];
      const packMatchesSearch = pack.name.toLowerCase().includes(searchLower);
      
      const filteredBlooks = blooks.filter((blook) => {
        const matchesSearch =
          searchQuery === "" ||
          blook.name.toLowerCase().includes(searchLower) ||
          blook.rarity.toLowerCase().includes(searchLower) ||
          packMatchesSearch;
          
        const matchesFilter =
          activeFilter === "All" || blook.rarity.toLowerCase() === activeFilter.toLowerCase();
          
        return matchesSearch && matchesFilter;
      });

      return {
        pack,
        blooks: filteredBlooks,
        visible: filteredBlooks.length > 0 || (packMatchesSearch && activeFilter === "All"),
      };
    }).filter(p => p.visible);
  }, [searchQuery, activeFilter]);

  return (
    <>
      <MarketSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
        <aside>
          <PackNavSidebar
            packs={filteredPacksData.map(p => p.pack)}
            liveCount={UNLOCKED_PACKS.length}
            lockedCount={LOCKED_PACKS.length}
          />
        </aside>

        <div className="grid gap-8">
          {filteredPacksData.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="rounded-2xl border-4 border-[#2a424a] bg-[#1e353c] p-8 shadow-lg">
                <p className="mb-2 text-2xl font-black text-white">No Packs found! 😢</p>
                <p className="mb-6 text-slate-400">Try adjusting your search or filters to find what you&apos;re looking for.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="inline-flex h-10 items-center justify-center rounded-xl bg-blue-500 px-6 font-black text-white shadow-[0_4px_0_0_rgba(29,78,216,1)] transition-all hover:bg-blue-600 active:translate-y-1 active:shadow-none"
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredPacksData.map(({ pack, blooks }) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={pack.id}
                >
                  <PackTableSection
                    pack={pack}
                    blooks={blooks}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </>
  );
}
