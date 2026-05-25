"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play, RotateCw, BarChart3 } from "lucide-react";

import { formatPercent } from "@/lib/calculator-v2";
import { getBlooksForPack, getPackById, type PackSlug } from "@/lib/packs";
import type {
  Blook,
  Rarity,
  SimulationWorkerOutput,
} from "@/types";


/* ─── Constants ──────────────────────────────────────────────────── */

const ITERATION_OPTIONS = [
  { value: 1000, label: "1K" },
  { value: 5000, label: "5K" },
  { value: 10000, label: "10K" },
  { value: 50000, label: "50K" },
] as const;

const TRENDING_PACKS = [
  { slug: "safari" as PackSlug, label: "Hunt Rainbow Panda", sub: "0.02% Chroma — Safari Pack" },
  { slug: "ice-monster" as PackSlug, label: "3 Chromas in one pack", sub: "Ice Monster — best Chroma odds" },
  { slug: "space" as PackSlug, label: "Colored Astronauts", sub: "7 rotating Chromas — Space Pack" },
] as const;

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "bg-slate-400",
  Uncommon: "bg-emerald-400",
  Rare: "bg-sky-400",
  Epic: "bg-red-400",
  Legendary: "bg-amber-400",
  Chroma: "bg-purple-400",
};

/* ─── Types ────────────────────────────────────────────────────────── */

type Props = {
  packSlug: PackSlug;
  tokens: number;
  dupesEnabled: boolean;
  onDupesChange: (value: boolean) => void;
  onPackChange?: (slug: PackSlug) => void;
  onTokensChange?: (tokens: number) => void;
  metric: "epicPlus" | "legendary" | "chroma";
};

/* ─── Helpers ──────────────────────────────────────────────────────── */

function getTargetRarity(metric: Props["metric"]): Rarity {
  if (metric === "epicPlus") return "Epic";
  if (metric === "legendary") return "Legendary";
  return "Chroma";
}

function getMetricRarities(metric: Props["metric"]): Set<Rarity> {
  if (metric === "epicPlus") return new Set(["Epic", "Legendary", "Chroma"]);
  if (metric === "legendary") return new Set(["Legendary"]);
  return new Set(["Chroma"]);
}

/* ─── Component ────────────────────────────────────────────────────── */

export default function SimulateTab({
  packSlug,
  tokens,
  dupesEnabled,
  onDupesChange,
  onPackChange,
  onTokensChange,
  metric,
}: Props) {
  const pack = getPackById(packSlug);
  const blooks = getBlooksForPack(packSlug) ?? [];
  const targetRarity = getTargetRarity(metric);
  const metricRarities = getMetricRarities(metric);

  const workerRef = useRef<Worker | null>(null);
  const [result, setResult] = useState<SimulationWorkerOutput | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [iterations, setIterations] = useState(5000);

  // Worker lifecycle
  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const runSimulation = useCallback(() => {
    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../../../workers/simulation.worker.ts", import.meta.url),
      );
      workerRef.current.onmessage = (
        event: MessageEvent<SimulationWorkerOutput>,
      ) => {
        setResult(event.data);
        setIsRunning(false);
      };
    }

    setIsRunning(true);
    setResult(null);
    workerRef.current.postMessage({
      pack,
      blooks,
      tokens,
      dupesEnabled,
      targetRarity,
    });
  }, [pack, blooks, tokens, dupesEnabled, targetRarity]);

  const canRun = tokens >= pack.costPerPull;
  const simProbability = result
    ? result.targetHitCount / result.totalIterations
    : null;

  const packOpens = Math.floor(tokens / pack.costPerPull);

  const metricLabel = metric === "epicPlus" ? "Epic+" : metric;

  return (
    <div className="space-y-4">
      {/* ─── Empty state: trending quick-start ─────────────── */}
      {tokens <= 0 && !isRunning && !result && (
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-xl font-bold text-white">Open packs & see what you get</p>
            <p className="mt-1 text-sm text-slate-400">Set your tokens above, then hit simulate</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {TRENDING_PACKS.map((t) => {
              const tPack = getPackById(t.slug);
              return (
                <button
                  key={t.slug}
                  type="button"
                  onClick={() => {
                    onPackChange?.(t.slug);
                    onTokensChange?.(tPack.costPerPull * 50);
                  }}
                  className="group rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
                >
                  <p className="text-sm font-semibold text-white group-hover:text-cyan-200 transition">
                    {t.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {t.sub}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ─── Controls row ───────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {/* Resell toggle */}
        <button
          type="button"
          onClick={() => onDupesChange(!dupesEnabled)}
          className={`flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition ${
            dupesEnabled
              ? "border-emerald-400/30 bg-emerald-400/[0.06]"
              : "border-white/10 bg-white/[0.02] hover:border-white/15"
          }`}
          title={dupesEnabled ? "Selling dupes for tokens = more opens" : "Each pack costs full price"}
        >
          <span
            className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition ${
              dupesEnabled ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <span
              className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition ${
                dupesEnabled ? "translate-x-[18px]" : "translate-x-[3px]"
              }`}
            />
          </span>
          <span className="text-xs font-medium text-slate-300">Resell dupes</span>
        </button>

        {/* Main CTA */}
        <button
          type="button"
          disabled={!canRun || isRunning}
          onClick={runSimulation}
          className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition ${
            !canRun
              ? "cursor-not-allowed border border-white/5 bg-white/[0.02] text-slate-600"
              : isRunning
                ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 animate-pulse"
                : "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98]"
          }`}
        >
          {isRunning ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin" /> Simulating…
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> {canRun ? `Open ${packOpens} Packs` : "Open Packs"}
            </>
          )}
        </button>

        {/* Accuracy toggle */}
        <details className="group">
          <summary className="cyber-mono cursor-pointer list-none whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-[11px] uppercase tracking-wider text-slate-500 hover:text-slate-300 transition">
            <span className="inline-flex items-center gap-1">
              <svg className="h-2.5 w-2.5 transition group-open:rotate-90" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
              {iterations >= 1000 ? `${iterations / 1000}K` : iterations} runs
            </span>
          </summary>
          <div className="absolute z-10 mt-1 flex gap-1 rounded-lg border border-white/10 bg-[#0a0c14]/95 p-2 shadow-xl backdrop-blur-md">
            {ITERATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIterations(opt.value)}
                className={`cyber-mono rounded-md px-2.5 py-1.5 text-xs uppercase tracking-wider transition ${
                  iterations === opt.value
                    ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-400/40"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </details>
      </div>

      {!canRun && tokens > 0 && (
        <p className="text-center text-xs text-slate-500">
          Need at least {pack.costPerPull} tokens to open one {pack.name} pack
        </p>
      )}

      {/* ─── Results ────────────────────────────────────────── */}
      {result && (
        <div className="space-y-4">
          {/* 1️⃣ Sample run — THE FUN PART, shown first */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-white">
                Your {packOpens} opens
              </p>
              {simProbability !== null && (
                <p className="text-sm font-bold text-cyan-300">
                  {formatPercent(simProbability)} {metricLabel}
                </p>
              )}
            </div>
            <SampleRunGrid items={result.simulatedRun} metricRarities={metricRarities} />
          </div>

          {/* 2️⃣ Hero result — big percentage */}
          <div className="rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/[0.06] to-violet-400/[0.04] p-6 text-center">
            <p className="text-sm text-slate-300">
              Chance of pulling {metricLabel}
            </p>
            <p className="cyber-display cyber-glow-cyan mt-1 text-6xl text-cyan-300 sm:text-7xl lg:text-8xl">
              {simProbability !== null ? formatPercent(simProbability) : "—"}
            </p>
            <div className="mx-auto mt-3 h-2 max-w-xs overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-[width] duration-700 ease-out"
                style={{ width: `${(simProbability ?? 0) * 100}%` }}
              />
            </div>
          </div>

          {/* 3️⃣ Stats — compact inline row */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
              <p className="text-[11px] text-slate-500">Avg tokens back</p>
              <p className="mt-0.5 text-base font-bold text-white">
                {Math.round(result.expectedTokens).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
              <p className="text-[11px] text-slate-500">Lucky (top 10%)</p>
              <p className="mt-0.5 text-base font-bold text-emerald-300">
                {Math.round(result.p10BestCase).toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-white/[0.03] px-3 py-2.5">
              <p className="text-[11px] text-slate-500">Unlucky (90% beat)</p>
              <p className="mt-0.5 text-base font-bold text-orange-300">
                {Math.round(result.p90WorstCase).toLocaleString()}
              </p>
            </div>
          </div>

          {/* 4️⃣ Histogram — collapsed by default */}
          <details className="group">
            <summary className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-white/[0.015] px-3 py-2 text-xs text-slate-400 transition hover:border-white/10 hover:text-slate-200 list-none">
              <BarChart3 className="h-3.5 w-3.5" />
              <span>Tokens back distribution</span>
              <svg className="ml-auto h-3 w-3 transition group-open:rotate-90" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
            </summary>
            <div className="mt-2 rounded-xl border border-white/5 bg-white/[0.015] p-3">
              <HistogramChart bins={result.histogramBins} />
            </div>
          </details>

          {/* 5️⃣ Try Again */}
          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/[0.04] hover:text-white"
          >
            <RotateCw className="h-4 w-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────── */

function HistogramChart({ bins }: { bins: [number, number][] }) {
  if (bins.length === 0) return null;
  const maxCount = Math.max(...bins.map(([, c]) => c), 1);

  return (
    <div className="flex items-end gap-[2px] h-24">
      {bins.map(([floor, count], i) => {
        const height = (count / maxCount) * 100;
        return (
          <div
            key={i}
            className="relative flex-1 flex flex-col items-center justify-end group/bin"
          >
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-cyan-500/60 to-cyan-300/40 transition-all hover:from-cyan-400/80 hover:to-cyan-200/60"
              style={{ height: `${Math.max(height, 2)}%` }}
            />
            {/* Tooltip on hover */}
            <span
              role="tooltip"
              className="pointer-events-none absolute -top-6 z-10 hidden rounded bg-[#06080f]/95 px-1.5 py-0.5 text-[10px] text-slate-200 group-hover/bin:block"
            >
              {floor} tkn ({count})
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SampleRunGrid({
  items,
  metricRarities,
}: {
  items: Blook[] | { id: string; name: string; rarity: Rarity; imageUrl: string }[];
  metricRarities: Set<Rarity>;
}) {
  const displayItems = items.slice(0, 60);
  const hitCount = displayItems.filter((item) => metricRarities.has(item.rarity)).length;

  return (
    <div className="space-y-2">
      {hitCount > 0 && (
        <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-400/10 px-2.5 py-1 ring-1 ring-amber-400/20">
          <span className="text-xs">★</span>
          <span className="text-xs font-bold text-amber-200">
            {hitCount} {hitCount === 1 ? "hit" : "hits"}
          </span>
        </div>
      )}
      <div className="flex flex-wrap gap-1.5">
        {displayItems.map((item, i) => {
          const isHit = metricRarities.has(item.rarity);
          return (
            <div
              key={`${item.id}-${i}`}
              className={`relative h-12 w-12 overflow-hidden rounded-lg border-2 transition-all ${
                isHit
                  ? "border-amber-400/70 shadow-[0_0_12px_rgba(251,191,36,0.3)] scale-105 z-10"
                  : "border-white/5 hover:border-white/10"
              }`}
              title={`${item.name} (${item.rarity})`}
            >
              {"imageUrl" in item && item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className={`object-cover ${isHit ? "brightness-110 saturate-150" : "brightness-[0.6]"}`}
                />
              )}
              {/* Rarity dot */}
              <span
                className={`absolute bottom-0.5 right-0.5 h-2 w-2 rounded-full ${RARITY_COLORS[item.rarity] ?? "bg-slate-400"}`}
              />
              {/* Hit badge */}
              {isHit && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-[8px] font-black text-black shadow-md">
                  ★
                </span>
              )}
            </div>
          );
        })}
        {items.length > 60 && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-xs text-slate-400">
            +{items.length - 60}
          </div>
        )}
      </div>
    </div>
  );
}
