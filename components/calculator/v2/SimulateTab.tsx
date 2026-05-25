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

import { SubPanel } from "./parts";

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

  return (
    <div className="space-y-5">
      {/* ─── Empty state: trending quick-start ─────────────── */}
      {tokens <= 0 && !isRunning && !result && (
        <SubPanel className="space-y-4 text-center">
          <div>
            <p className="text-lg font-bold text-white">Try a popular chase</p>
            <p className="mt-1 text-xs text-slate-400">Set tokens and pick a pack to simulate opens</p>
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
        </SubPanel>
      )}

      {/* ─── Controls ──────────────────────────────────────── */}
      <SubPanel className="space-y-4">
        {/* Resell toggle — competitors all have this */}
        <button
          type="button"
          onClick={() => onDupesChange(!dupesEnabled)}
          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
            dupesEnabled
              ? "border-emerald-400/30 bg-emerald-400/[0.06]"
              : "border-white/10 bg-white/[0.02] hover:border-white/15"
          }`}
        >
          <div>
            <p className="text-sm font-semibold text-white">
              Sell duplicates for tokens
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {dupesEnabled
                ? "Simulates selling dupes back — more pack opens"
                : "Off — each pack costs the full price"
              }
            </p>
          </div>
          <span
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
              dupesEnabled ? "bg-emerald-500" : "bg-white/10"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition ${
                dupesEnabled ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </span>
        </button>

        {/* Main CTA */}
        <button
          type="button"
          disabled={!canRun || isRunning}
          onClick={runSimulation}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-xl px-5 py-4 text-base font-bold uppercase tracking-wider transition ${
            !canRun
              ? "cursor-not-allowed border border-white/5 bg-white/[0.02] text-slate-600"
              : isRunning
                ? "border border-cyan-400/30 bg-cyan-400/10 text-cyan-300 animate-pulse"
                : "bg-gradient-to-r from-cyan-500 to-violet-500 text-white shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98]"
          }`}
        >
          {isRunning ? (
            <>
              <RotateCw className="h-5 w-5 animate-spin" /> Simulating…
            </>
          ) : (
            <>
              <Play className="h-5 w-5" /> Simulate {packOpens > 0 ? `${packOpens} Opens` : "Pack Opens"}
            </>
          )}
        </button>

        {!canRun && tokens > 0 && (
          <p className="text-center text-xs text-slate-500">
            Need at least {pack.costPerPull} tokens to open one pack
          </p>
        )}

        {/* Collapsed iteration setting — advanced users only */}
        <details className="group">
          <summary className="cyber-mono cursor-pointer list-none text-[11px] uppercase tracking-[0.2em] text-slate-500 hover:text-slate-300 transition">
            <span className="inline-flex items-center gap-1.5">
              <svg className="h-3 w-3 transition group-open:rotate-90" viewBox="0 0 16 16" fill="currentColor"><path d="M6 4l4 4-4 4" /></svg>
              Accuracy: {iterations.toLocaleString()} runs
            </span>
          </summary>
          <div className="mt-2 flex gap-1.5">
            {ITERATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setIterations(opt.value)}
                className={`cyber-mono rounded-lg border px-3 py-1.5 text-xs uppercase tracking-wider transition ${
                  iterations === opt.value
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </details>
      </SubPanel>

      {/* ─── Results ────────────────────────────────────────── */}
      {result && (
        <>
          {/* Big probability — hero result */}
          <SubPanel className="text-center">
            <p className="cyber-mono text-xs uppercase tracking-[0.22em] text-slate-400">
              Chance of getting {metric === "epicPlus" ? "Epic+" : metric}
            </p>
            <p className="cyber-display cyber-glow-cyan mt-2 text-7xl text-cyan-300 sm:text-8xl">
              {simProbability !== null ? formatPercent(simProbability) : "—"}
            </p>
            <p className="cyber-mono mt-3 text-xs uppercase tracking-wider text-slate-400">
              across {Math.floor(tokens / pack.costPerPull)} pack opens
            </p>
          </SubPanel>

          {/* Stats row — plain English, stacks on mobile */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <SubPanel className="text-center">
              <p className="cyber-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Avg tokens back
              </p>
              <p className="cyber-mono mt-1 text-lg font-semibold text-white">
                {Math.round(result.expectedTokens).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">from selling dupes</p>
            </SubPanel>
            <SubPanel className="text-center">
              <p className="cyber-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Lucky run (top 10%)
              </p>
              <p className="cyber-mono mt-1 text-lg font-semibold text-emerald-300">
                {Math.round(result.p10BestCase).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">tokens back</p>
            </SubPanel>
            <SubPanel className="text-center">
              <p className="cyber-mono text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Unlucky run (90% beat this)
              </p>
              <p className="cyber-mono mt-1 text-lg font-semibold text-orange-300">
                {Math.round(result.p90WorstCase).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">tokens back</p>
            </SubPanel>
          </div>

          {/* Histogram */}
          <SubPanel className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-cyan-300" />
              <p className="cyber-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                Tokens back distribution
              </p>
            </div>
            <HistogramChart bins={result.histogramBins} />
          </SubPanel>

          {/* Sample run grid */}
          <SubPanel className="space-y-3">
            <p className="cyber-mono text-xs uppercase tracking-[0.18em] text-slate-400">
              Your {Math.floor(tokens / pack.costPerPull)} opens — sample result
            </p>
            <SampleRunGrid items={result.simulatedRun} metricRarities={metricRarities} />
          </SubPanel>

          {/* Rerun button — always available */}
          <button
            type="button"
            onClick={runSimulation}
            disabled={isRunning}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm font-semibold uppercase tracking-wider text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            <RotateCw className="h-4 w-4" /> Try Again
          </button>
        </>
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
    <div className="space-y-3">
      {hitCount > 0 && (
        <p className="text-xs font-semibold text-emerald-300">
          {hitCount} {hitCount === 1 ? "hit" : "hits"} in this run
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        {displayItems.map((item, i) => {
          const isHit = metricRarities.has(item.rarity);
          return (
            <div
              key={`${item.id}-${i}`}
              className={`relative h-10 w-10 overflow-hidden rounded-lg border transition-all ${
                isHit
                  ? "border-amber-400/60 ring-2 ring-amber-400/30 shadow-[0_0_8px_rgba(251,191,36,0.25)]"
                  : "border-white/5"
              }`}
              style={{
                animation: `fadeSlideIn 0.3s ease-out ${Math.min(i * 0.02, 0.8)}s both`,
              }}
              title={`${item.name} (${item.rarity})`}
            >
              {"imageUrl" in item && item.imageUrl && (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="40px"
                  className={`object-cover ${isHit ? "brightness-110" : "brightness-75"}`}
                />
              )}
              {/* Rarity dot indicator */}
              <span
                className={`absolute bottom-0 right-0 h-2 w-2 rounded-tl-sm ${RARITY_COLORS[item.rarity] ?? "bg-slate-400"}`}
              />
              {/* Hit sparkle overlay */}
              {isHit && (
                <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-amber-400 text-[7px] font-black text-black shadow-sm">
                  ★
                </span>
              )}
            </div>
          );
        })}
        {items.length > 60 && (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02] text-[10px] text-slate-400">
            +{items.length - 60}
          </div>
        )}
      </div>
    </div>
  );
}
