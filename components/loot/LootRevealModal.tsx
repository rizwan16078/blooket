"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

import { BLOOK_MAP, RARITY_DESIGN } from "@/lib/constants";
import { formatTokenLabel } from "@/lib/math";
import type { Pack } from "@/lib/packs";
import type { Blook, SimulationWorkerOutput } from "@/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type LootRevealModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: SimulationWorkerOutput | null;
  pack: Pack;
  isSelling: boolean;
  targetBlook: Blook | null;
  targetRarity: Blook["rarity"];
  onRerun: () => void;
};

function rarityBadgeClasses(rarity: Blook["rarity"]) {
  const style = RARITY_DESIGN[rarity];

  if (style.color === "amber") {
    return "border-amber-300 bg-amber-100 text-amber-700";
  }

  if (style.color === "violet") {
    return "border-violet-300 bg-violet-100 text-violet-700";
  }

  if (style.color === "teal") {
    return "border-teal-300 bg-teal-100 text-teal-700";
  }

  if (style.color === "sky") {
    return "border-teal-600 bg-[#2a424a] text-emerald-400";
  }

  if (style.color === "emerald") {
    return "border-emerald-300 bg-emerald-100 text-emerald-700";
  }

  return "border-slate-300 bg-[#112328] text-white";
}

export default function LootRevealModal({
  open,
  onOpenChange,
  result,
  pack,
  isSelling,
  targetBlook,
  targetRarity,
  onRerun,
}: LootRevealModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const seenIds = new Set<string>();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-hidden">
        <div className="relative">
          {isSelling ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-sky-500/75 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 text-center">
                <motion.div
                  animate={prefersReducedMotion ? undefined : { rotate: 360 }}
                  transition={
                    prefersReducedMotion
                      ? undefined
                      : { duration: 1.2, ease: "linear", repeat: Infinity }
                  }
                  className="flex h-16 w-16 items-center justify-center rounded-full bg-yellow-300 text-yellow-700 shadow-[0_4px_0_0_rgba(202,138,4,1)]"
                >
                  $
                </motion.div>
                <div>
                  <p className="font-sans text-xl font-black tracking-wide text-white drop-shadow-md">
                    Selling duplicates...
                  </p>
                  <p className="mt-2 text-sm text-white/90">
                    Converting extras into rerun fuel.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="max-h-[92vh] overflow-y-auto p-6 sm:p-8">
            <DialogHeader className="pr-12">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#2a424a] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-emerald-400">
                  {pack.name} run
                </span>
                <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-amber-700">
                  Hunting {targetBlook ? targetBlook.name : targetRarity}
                </span>
              </div>
              <DialogTitle>Loot Reveal</DialogTitle>
              <DialogDescription>
                Sequential pull results, rerun economy, and simulation summaries in
                one loop.
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <div className="rounded-3xl bg-[#152a30] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Expected sell-back
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {result ? formatTokenLabel(result.expectedTokens) : "Pending"}
                </p>
              </div>
              <div className="rounded-3xl bg-[#152a30] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  P10 best case
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {result ? formatTokenLabel(result.p10BestCase) : "Pending"}
                </p>
              </div>
              <div className="rounded-3xl bg-[#152a30] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  P90 worst case
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {result ? formatTokenLabel(result.p90WorstCase) : "Pending"}
                </p>
              </div>
              <div className="rounded-3xl bg-[#152a30] p-4">
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-500">
                  Reruns left
                </p>
                <p className="mt-2 text-lg font-black text-white">
                  {result ? Math.max(0, 5 - result.rerunCount) : 5}
                </p>
              </div>
            </div>

            <motion.div
              className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              initial={prefersReducedMotion ? false : "hidden"}
              animate={prefersReducedMotion ? undefined : "show"}
              variants={{
                hidden: {},
                show: {
                  transition: {
                    staggerChildren: 0.025,
                  },
                },
              }}
            >
              {(result?.simulatedRun ?? []).map((item) => {
                const duplicate = seenIds.has(item.id);
                seenIds.add(item.id);
                const sourceBlook = BLOOK_MAP[item.id];

                return (
                  <motion.article
                    key={`${item.id}-${duplicate ? "duplicate" : "first"}-${seenIds.size}`}
                    variants={
                      prefersReducedMotion
                        ? undefined
                        : {
                            hidden: { opacity: 0, y: 16, scale: 0.96 },
                            show: { opacity: 1, y: 0, scale: 1 },
                          }
                    }
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="rounded-[1.6rem] border-4 border-[#2a424a] bg-[#1e353c] p-3 shadow-lg"
                  >
                    <div className="relative overflow-hidden rounded-[1.2rem] bg-[#152a30]">
                      <div
                        className="absolute inset-0 opacity-25"
                        style={{
                          background: `radial-gradient(circle at top, ${pack.themeColor}, transparent 60%)`,
                        }}
                      />
                      <div className="relative aspect-square">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          loading="lazy"
                          className="object-contain p-5"
                          sizes="(max-width: 768px) 45vw, 18vw"
                        />
                      </div>
                    </div>

                    <div className="mt-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-black text-white">{item.name}</p>
                        <span
                          className={`mt-2 inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] ${rarityBadgeClasses(
                            item.rarity,
                          )}`}
                        >
                          {item.rarity}
                        </span>
                      </div>
                    </div>

                    {duplicate ? (
                      <div className="mt-3 rounded-2xl bg-yellow-100 px-3 py-2">
                        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700">
                          Duplicate
                        </p>
                        <p className="mt-1 text-sm text-amber-800">
                          Sell for {formatTokenLabel(sourceBlook?.sellValue ?? 0)}
                        </p>
                      </div>
                    ) : null}
                  </motion.article>
                );
              })}
            </motion.div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-500">
                Duplicate sell values stay in-session only for the rerun economy loop.
              </p>
              <button
                type="button"
                disabled={!result?.rerunAllowed || isSelling}
                onClick={onRerun}
                className="inline-flex h-12 items-center justify-center rounded-xl bg-teal-700 px-5 text-sm font-black text-white shadow-[0_4px_0_0_rgba(15,118,110,1)] transition-all hover:bg-teal-600 active:translate-y-1 active:shadow-none disabled:cursor-not-allowed disabled:opacity-55"
              >
                Sell Duplicates & Re-roll
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
