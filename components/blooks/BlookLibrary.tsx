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
    params.set("packId", packId);
  }

  if (blookId) {
    params.set("blookId", blookId);
  }

  return params.toString() ? `${pathname}?${params.toString()}` : pathname;
}

export default function BlookLibrary({ initialBlookId = null }: BlookLibraryProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeBlookId = searchParams.get("blookId") ?? initialBlookId;
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
          <div className="rounded-2xl border-4 border-sky-200/50 bg-white p-8 shadow-lg">
            <p className="mb-2 text-2xl font-black text-slate-900">No Blooks found! 😢</p>
            <p className="mb-6 text-slate-500">Try adjusting your search or filters to find what you&apos;re looking for.</p>
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
                    className="w-full group rounded-[1.6rem] border-4 border-sky-100 bg-white p-3 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                    style={{
                      contentVisibility: "auto",
                      containIntrinsicSize: "200px",
                    }}
                  >
                    <div className="relative overflow-hidden rounded-[1.2rem] bg-sky-50">
                      <div
                        className="absolute inset-0 opacity-20"
                        style={{
                          background: `radial-gradient(circle at top, ${pack.themeColor}, transparent 60%)`,
                        }}
                      />
                      <div className="relative aspect-square">
                        <Image
                          src={blook.imageUrl}
                          alt={blook.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 768px) 45vw, (max-width: 1280px) 24vw, 18vw"
                          className="object-contain p-5"
                        />
                      </div>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm font-black text-slate-900">{blook.name}</p>
                      <p className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-slate-500">
                        {blook.rarity}
                      </p>
                      <p className="mt-2 text-xs text-slate-500">{pack.name} Pack</p>
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
            router.replace(modalQuery(pathname, searchParams.get("packId") ?? "", null), {
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
                <div className="relative overflow-hidden rounded-[1.8rem] bg-sky-50">
                  <div
                    className="absolute inset-0 opacity-25"
                    style={{
                      background: `radial-gradient(circle at top, ${activePack.themeColor}, transparent 60%)`,
                    }}
                  />
                  <div className="relative aspect-square">
                    <Image
                      src={activeBlook.imageUrl}
                      alt={activeBlook.name}
                      fill
                      className="object-contain p-8"
                      sizes="(max-width: 768px) 80vw, 22vw"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl bg-sky-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Rarity
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      {activeBlook.rarity}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-sky-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Drop rate
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      {formatPercent(activeBlook.dropRate)}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-sky-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Estimated tokens
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      {formatTokenLabel(calculateEstimatedTokensForBlook(activeBlook, activePack))}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-sky-50 p-4">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                      Sell value
                    </p>
                    <p className="mt-2 text-lg font-black text-slate-900">
                      {formatTokenLabel(activeBlook.sellValue)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="button"
                  onClick={() => {
                    router.push(`/?packId=${activePack.id}&blookId=${activeBlook.id}&tokens=500`);
                  }}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-green-500 px-5 text-sm font-black text-white shadow-[0_4px_0_0_rgba(21,128,61,1)] transition-all hover:bg-green-600 active:translate-y-1 active:shadow-none"
                >
                  Try My Luck
                </button>

                <button
                  type="button"
                  onClick={() => router.push(`/blooks/${activeBlook.id}`)}
                  className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-500 px-5 text-sm font-black text-white shadow-[0_4px_0_0_rgba(29,78,216,1)] transition-all hover:bg-blue-600 active:translate-y-1 active:shadow-none"
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
