"use client";

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { BLOOKS } from "@/lib/constants";
import MarketSearchFilter, { RarityFilter } from "@/components/shared/MarketSearchFilter";
import { calculateEstimatedTokensForBlook, formatPercent, formatTokenLabel } from "@/lib/math";
import { getPackById, type Pack } from "@/lib/packs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type BlookLibraryProps = {
  initialBlookId?: string | null;
};

function modalQuery(pathname: string, packId: string, blookId: string | null) {
  const params = new URLSearchParams();

  if (packId) {
    params.set("pack", packId);
  }

  if (blookId) {
    params.set("blook", blookId);
  }

  return params.toString() ? `${pathname}?${params.toString()}` : pathname;
}

export default function BlookLibrary({ initialBlookId = null }: BlookLibraryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeBlookId = searchParams.get("blook") ?? searchParams.get("blookId") ?? initialBlookId;
  const activeBlook = activeBlookId
    ? BLOOKS.find((blook) => blook.id === activeBlookId) ?? null
    : null;
  const activePack = activeBlook ? getPackById(activeBlook.packId as Pack["id"]) : null;

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<RarityFilter>("All");

  const filteredBlooks = useMemo(() => {
    return BLOOKS.filter((blook) => {
      const pack = getPackById(blook.packId as Pack["id"]);
      const searchLower = searchQuery.toLowerCase();
      
      const matchesSearch =
        searchQuery === "" ||
        blook.name.toLowerCase().includes(searchLower) ||
        blook.rarity.toLowerCase().includes(searchLower) ||
        pack.name.toLowerCase().includes(searchLower);
        
      const matchesFilter =
        activeFilter === "All" || blook.rarity.toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  return (
    <>
      <MarketSearchFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {filteredBlooks.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 text-center"
        >
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 shadow-lg">
            <p className="mb-2 text-2xl font-black text-white">No Blooks found! 😢</p>
            <p className="mb-6 text-white/40">Try adjusting your search or filters to find what you&apos;re looking for.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
            >
              Reset Filters
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          <AnimatePresence mode="popLayout">
            {filteredBlooks.map((blook) => {
              const pack = getPackById(blook.packId as Pack["id"]);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={blook.id}
                >
                  <button
                    type="button"
                    aria-label={`Open ${blook.name} library modal`}
                    onClick={() => {
                      router.replace(
                        modalQuery(pathname, blook.packId, blook.id),
                        { scroll: false },
                      );
                    }}
                    className="w-full group rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-left shadow-sm transition hover:-translate-y-1 hover:border-white/[0.1] hover:shadow-lg"
                    style={{
                      contentVisibility: "auto",
                      containIntrinsicSize: "200px",
                    }}
                  >
                    <div className="relative overflow-hidden rounded-xl bg-white/[0.03]">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `radial-gradient(circle at top, ${pack.themeColor}, transparent 60%)`,
                        }}
                      />
                      <div className="relative aspect-square flex items-center justify-center">
                        <Image
                          src={blook.imageUrl}
                          alt={blook.name}
                          width={400}
                          height={400}
                          loading="lazy"
                          className="object-contain p-5 w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-black text-white">{blook.name}</p>
                      <p className="mt-1 text-xs font-bold uppercase tracking-[0.22em] text-white/35">
                        {blook.rarity}
                      </p>
                      <p className="mt-2 text-xs text-white/30">{pack.name} Pack</p>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      <Dialog
        open={Boolean(activeBlook)}
        onOpenChange={(open) => {
          if (!open) {
            router.replace(modalQuery(pathname, searchParams.get("pack") ?? searchParams.get("packId") ?? "", null), {
              scroll: false,
            });
          }
        }}
      >
        <DialogContent className="w-[min(96vw,40rem)]">
          {activeBlook && activePack ? (
            <div className="p-6 sm:p-8">
              <DialogHeader>
                <DialogTitle>{activeBlook.name}</DialogTitle>
                <DialogDescription>{activeBlook.description}</DialogDescription>
              </DialogHeader>

              <div className="mt-6 grid gap-6 md:grid-cols-[0.92fr_1.08fr]">
                <div className="relative overflow-hidden rounded-xl bg-white/[0.03]">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: `radial-gradient(circle at top, ${activePack.themeColor}, transparent 60%)`,
                    }}
                  />
                  <div className="relative aspect-square flex items-center justify-center">
                    <Image
                      src={activeBlook.imageUrl}
                      alt={activeBlook.name}
                      width={800}
                      height={800}
                      className="object-contain p-8 w-full h-full"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                      Rarity
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {activeBlook.rarity}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                      Drop rate
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {formatPercent(activeBlook.dropRate)}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                      Estimated tokens
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {formatTokenLabel(calculateEstimatedTokensForBlook(activeBlook, activePack))}
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4">
                    <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                      Sell value
                    </p>
                    <p className="mt-2 text-lg font-black text-white">
                      {formatTokenLabel(activeBlook.sellValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/?pack=${activePack.id}&blook=${activeBlook.id}&tokens=500`);
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97]"
                >
                  Try My Luck
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/blooks/${activeBlook.id}`)}
                  className="inline-flex h-12 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-bold text-white transition-all hover:bg-white/[0.06] active:scale-[0.97]"
                >
                  Open SEO Page
                </button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
