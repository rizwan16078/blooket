"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

import { PACKS, type PackSlug } from "@/lib/packs";
import { PACK_BLOOKS_MAP } from "@/lib/constants";
import { formatPercent, getEffectiveBlooks, getRarityRate } from "@/lib/math";
import type { Blook, Rarity } from "@/types";
import { cn } from "@/lib/utils";

const RARITY_STYLES: Record<Rarity, string> = {
  Common: "border-slate-400/30 bg-slate-400/10 text-slate-200",
  Uncommon: "border-emerald-400/30 bg-emerald-400/10 text-emerald-300",
  Rare: "border-sky-400/30 bg-sky-400/10 text-sky-300",
  Epic: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  Legendary: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  Chroma: "border-teal-400/40 bg-teal-400/10 text-teal-300",
};

const RARITY_ORDER: Rarity[] = [
  "Common",
  "Uncommon",
  "Rare",
  "Epic",
  "Legendary",
  "Chroma",
];

const OPEN_COUNTS = [1, 10, 100] as const;
const MAX_VISIBLE_PULLS = 100;

type Pull = {
  blook: Blook;
  key: number;
};

function rollOnce(blooks: Blook[]): Blook {
  const total = blooks.reduce((sum, blook) => sum + blook.dropRate, 0);
  let roll = Math.random() * total;
  for (const blook of blooks) {
    roll -= blook.dropRate;
    if (roll <= 0) return blook;
  }
  return blooks[blooks.length - 1];
}

export default function PackOpeningSimulator() {
  const unlockedPacks = useMemo(() => PACKS.filter((pack) => !pack.isLocked), []);
  const [packId, setPackId] = useState<PackSlug>(unlockedPacks[0].id);
  const [pulls, setPulls] = useState<Pull[]>([]);
  const [totalOpens, setTotalOpens] = useState(0);
  const [rarityCounts, setRarityCounts] = useState<Record<Rarity, number>>({
    Common: 0,
    Uncommon: 0,
    Rare: 0,
    Epic: 0,
    Legendary: 0,
    Chroma: 0,
  });
  const [sellValueTotal, setSellValueTotal] = useState(0);
  const pullKey = useRef(0);

  const pack = useMemo(
    () => unlockedPacks.find((p) => p.id === packId) ?? unlockedPacks[0],
    [unlockedPacks, packId],
  );

  const openPacks = (count: number) => {
    // One Chroma per rotation group is live on a given day in the real market,
    // matching the dedup used by every calculator (see lib/math.ts).
    const blooks = getEffectiveBlooks(PACK_BLOOKS_MAP[pack.id] ?? []);
    if (blooks.length === 0) return;

    const newPulls: Pull[] = [];
    const countsDelta: Partial<Record<Rarity, number>> = {};
    let sellDelta = 0;

    for (let i = 0; i < count; i += 1) {
      const blook = rollOnce(blooks);
      pullKey.current += 1;
      newPulls.push({ blook, key: pullKey.current });
      countsDelta[blook.rarity] = (countsDelta[blook.rarity] ?? 0) + 1;
      sellDelta += blook.sellValue;
    }

    setPulls((prev) => [...newPulls.reverse(), ...prev].slice(0, MAX_VISIBLE_PULLS));
    setTotalOpens((prev) => prev + count);
    setRarityCounts((prev) => {
      const next = { ...prev };
      for (const rarity of RARITY_ORDER) {
        next[rarity] += countsDelta[rarity] ?? 0;
      }
      return next;
    });
    setSellValueTotal((prev) => prev + sellDelta);
  };

  const reset = () => {
    setPulls([]);
    setTotalOpens(0);
    setRarityCounts({
      Common: 0,
      Uncommon: 0,
      Rare: 0,
      Epic: 0,
      Legendary: 0,
      Chroma: 0,
    });
    setSellValueTotal(0);
  };

  const tokensSpent = totalOpens * pack.costPerPull;
  const legendaryRate = getRarityRate(pack.id, "Legendary");
  const chromaRate = getRarityRate(pack.id, "Chroma");
  const expectedLegendaries = totalOpens * legendaryRate;
  const expectedChromas = totalOpens * chromaRate;
  const bestPull = pulls.reduce<Pull | null>((best, pull) => {
    if (!best) return pull;
    return RARITY_ORDER.indexOf(pull.blook.rarity) >
      RARITY_ORDER.indexOf(best.blook.rarity)
      ? pull
      : best;
  }, null);

  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 backdrop-blur-xl sm:p-8">
      {/* Pack selector */}
      <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
        Choose a pack
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {unlockedPacks.map((option) => (
          <button
            key={option.id}
            onClick={() => {
              setPackId(option.id);
              reset();
            }}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-semibold transition-all",
              packId === option.id
                ? "border-teal-400/40 bg-teal-400/10 text-teal-300 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
                : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
            )}
          >
            {option.name}
            <span className="ml-2 text-xs text-white/40">
              {option.costPerPull} tkn
            </span>
          </button>
        ))}
      </div>

      {/* Open buttons */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {OPEN_COUNTS.map((count) => (
          <button
            key={count}
            onClick={() => openPacks(count)}
            className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/30 hover:brightness-110 active:scale-[0.97]"
          >
            Open {count} {count === 1 ? "Pack" : "Packs"}
          </button>
        ))}
        {totalOpens > 0 && (
          <button
            onClick={reset}
            className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            Reset
          </button>
        )}
      </div>

      {/* Session stats */}
      {totalOpens > 0 && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                Packs opened
              </p>
              <p className="mt-1 text-2xl font-black text-white tabular-nums">
                {totalOpens.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                Tokens this would cost
              </p>
              <p className="mt-1 text-2xl font-black text-white tabular-nums">
                {tokensSpent.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                Sell-back value
              </p>
              <p className="mt-1 text-2xl font-black text-emerald-300 tabular-nums">
                {sellValueTotal.toLocaleString()} tkn
              </p>
            </div>
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                Best pull
              </p>
              <p
                className={cn(
                  "mt-1 truncate text-2xl font-black",
                  bestPull
                    ? RARITY_STYLES[bestPull.blook.rarity].split(" ").pop()
                    : "text-white",
                )}
              >
                {bestPull ? bestPull.blook.name : "—"}
              </p>
            </div>
          </div>

          {/* Actual vs expected */}
          <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/60">
            <span className="font-bold text-white">Luck check:</span>{" "}
            you pulled{" "}
            <span className="font-bold text-amber-300">
              {rarityCounts.Legendary} Legendary
            </span>{" "}
            (expected {expectedLegendaries.toFixed(2)} at{" "}
            {formatPercent(legendaryRate)}) and{" "}
            <span className="font-bold text-teal-300">
              {rarityCounts.Chroma} Chroma
            </span>{" "}
            (expected {expectedChromas.toFixed(2)} at {formatPercent(chromaRate)})
            in {totalOpens.toLocaleString()} opens.
          </div>

          {/* Rarity tally */}
          <div className="mt-4 flex flex-wrap gap-2">
            {RARITY_ORDER.filter((rarity) => rarityCounts[rarity] > 0).map(
              (rarity) => (
                <span
                  key={rarity}
                  className={cn(
                    "rounded-full border px-3 py-1 text-xs font-bold",
                    RARITY_STYLES[rarity],
                  )}
                >
                  {rarity} × {rarityCounts[rarity]}
                </span>
              ),
            )}
          </div>

          {/* Pull results */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-5">
            {pulls.map((pull) => (
              <div
                key={pull.key}
                className={cn(
                  "rounded-xl border p-3 text-center",
                  RARITY_STYLES[pull.blook.rarity],
                )}
              >
                <p className="truncate text-sm font-bold">{pull.blook.name}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider opacity-70">
                  {pull.blook.rarity}
                </p>
              </div>
            ))}
          </div>
          {totalOpens > MAX_VISIBLE_PULLS && (
            <p className="mt-3 text-xs text-white/40">
              Showing the {MAX_VISIBLE_PULLS} most recent pulls. Session totals
              above include every open.
            </p>
          )}
        </>
      )}

      {totalOpens === 0 && (
        <p className="mt-8 text-sm leading-7 text-white/50">
          Pick a pack and hit <strong className="text-white">Open</strong> — the
          simulator rolls every pull against the same published drop rates used
          across this site, so your simulated luck matches the real market. When
          you are ready to plan real token spend, the{" "}
          <Link href="/" className="text-emerald-400 hover:text-emerald-300">
            Blooket Calculator
          </Link>{" "}
          computes your exact odds instead of a single random run.
        </p>
      )}
    </div>
  );
}
