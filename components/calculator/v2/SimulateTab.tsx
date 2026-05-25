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

import { MonoLabel, SubPanel, Tooltip } from "./parts";

/* ─── Constants ──────────────────────────────────────────────────── */

const ITERATION_OPTIONS = [
  { value: 1000, label: "1K" },
  { value: 5000, label: "5K" },
  { value: 10000, label: "10K" },
  { value: 50000, label: "50K" },
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

  return (
    <div className="space-y-5">
      {/* ─── Controls ──────────────────────────────────────── */}
      <SubPanel className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MonoLabel>
            Iterations
            <Tooltip content="More iterations = more accurate results, but takes longer">
              <HelpDot />
            </Tooltip>
          </MonoLabel>
          <div className="flex gap-1.5">
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
        </div>

        <button
          type="button"
          disabled={!canRun || isRunning}
          onClick={runSimulation}
          className={`cyber-ghost inline-flex w-full items-center justify-center gap-2 rounded-xl border px-5 py-3 text-sm font-semibold uppercase tracking-wider transition ${
            !canRun
              ? "cursor-not-allowed border-white/5 text-slate-600"
              : isRunning
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 animate-pulse"
                : "border-cyan-400/40 bg-cyan-400/15 text-cyan-200 hover:bg-cyan-400/25"
          }`}
        >
          {isRunning ? (
            <>
              <RotateCw className="h-4 w-4 animate-spin" /> Running…
            </>
          ) : (
            <>
              <Play className="h-4 w-4" /> Run {iterations.toLocaleString()} simulations
            </>
          )}
        </button>

        {!canRun && (
          <p className="text-center text-xs text-slate-500">
            Need at least {pack.costPerPull} tokens to open one pack
          </p>
        )}
      </SubPanel>

      {/* ─── Results ────────────────────────────────────────── */}
      {result && (
        <>
          {/* Big probability */}
          <SubPanel className="text-center">
            <MonoLabel>Simulated chance for {metric === "epicPlus" ? "Epic+" : metric}</MonoLabel>
            <p className="cyber-display cyber-glow-cyan mt-2 text-6xl text-cyan-300 sm:text-7xl">
              {simProbability !== null ? formatPercent(simProbability) : "—"}
            </p>
            <p className="cyber-mono mt-2 text-xs uppercase tracking-wider text-slate-400">
              {result.targetHitCount.toLocaleString()} / {result.totalIterations.toLocaleString()} runs hit target
            </p>
          </SubPanel>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <SubPanel className="text-center">
              <MonoLabel>Avg refund</MonoLabel>
              <p className="cyber-mono mt-1 text-lg font-semibold text-white">
                {Math.round(result.expectedTokens).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">tokens back</p>
            </SubPanel>
            <SubPanel className="text-center">
              <MonoLabel>Best case (P10)</MonoLabel>
              <p className="cyber-mono mt-1 text-lg font-semibold text-emerald-300">
                {Math.round(result.p10BestCase).toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500">tokens back</p>
            </SubPanel>
            <SubPanel className="text-center">
              <MonoLabel>Worst case (P90)</MonoLabel>
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
              <MonoLabel>Refund distribution</MonoLabel>
            </div>
            <HistogramChart bins={result.histogramBins} />
          </SubPanel>

          {/* Sample run grid */}
          <SubPanel className="space-y-3">
            <MonoLabel>Sample run — your {Math.floor(tokens / pack.costPerPull)} opens</MonoLabel>
            <SampleRunGrid items={result.simulatedRun} metricRarities={metricRarities} />
          </SubPanel>

          {/* Rerun button */}
          {result.rerunAllowed && (
            <button
              type="button"
              onClick={runSimulation}
              disabled={isRunning}
              className="cyber-ghost inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <RotateCw className="h-3.5 w-3.5" /> Rerun simulation
            </button>
          )}
        </>
      )}
    </div>
  );
}

/* ─── Sub-components ───────────────────────────────────────────────── */

function HelpDot() {
  return (
    <span
      tabIndex={0}
      aria-label="More info"
      className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full text-cyan-400/60 hover:text-cyan-400 focus:text-cyan-400 focus:outline-none"
    >
      <svg viewBox="0 0 16 16" fill="currentColor" className="h-3 w-3">
        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zm.75 10.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM8 3.5c.69 0 1.25.56 1.25 1.25 0 .5-.3.93-.73 1.12-.58.26-1.02.82-1.02 1.48v.15h1.5v-.15c0-.23.14-.43.35-.52A2.75 2.75 0 008 3.5z" />
      </svg>
    </span>
  );
}

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
  const displayItems = items.slice(0, 50); // Cap display for performance
  return (
    <div className="flex flex-wrap gap-1.5">
      {displayItems.map((item, i) => {
        const isHit = metricRarities.has(item.rarity);
        return (
          <div
            key={`${item.id}-${i}`}
            className={`relative h-8 w-8 overflow-hidden rounded-md border transition ${
              isHit
                ? "border-amber-400/60 ring-1 ring-amber-400/30"
                : "border-white/5"
            }`}
            title={`${item.name} (${item.rarity})`}
          >
            {"imageUrl" in item && item.imageUrl && (
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="32px"
                className="object-cover"
              />
            )}
            {/* Rarity dot indicator */}
            <span
              className={`absolute bottom-0 right-0 h-1.5 w-1.5 rounded-tl-sm ${RARITY_COLORS[item.rarity] ?? "bg-slate-400"}`}
            />
          </div>
        );
      })}
      {items.length > 50 && (
        <div className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 bg-white/[0.02] text-[10px] text-slate-400">
          +{items.length - 50}
        </div>
      )}
    </div>
  );
}
