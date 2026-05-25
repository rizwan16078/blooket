"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Sparkles, Users, Zap } from "lucide-react";

import {
  CONFIDENCE_LEVELS,
  DAILY_TOKEN_CAP,
  calculateOpenCount,
  calculatePackProbabilities,
  chaseCurve,
  daysToBudget,
  expectedPullsByRarity,
  formatPercent,
  getBoxCost,
  getMetricRate,
  packValueIndex,
  rankPacksByValue,
  tokensForConfidence,
} from "@/lib/calculator-v2";
import { PACKS, getPackById, type PackSlug } from "@/lib/packs";
import {
  ChaseCurve,
  ConfidencePill,
  CyberCTA,
  CyberGhost,
  MonoLabel,
  MonoStat,
  RarityDonut,
  SubPanel,
} from "./parts";

const METRIC_OPTIONS = [
  { key: "epicPlus", label: "Epic+" },
  { key: "legendary", label: "Legendary" },
  { key: "chroma", label: "Chroma" },
] as const;

const PROB_MODE_OPTIONS = [
  { key: "atLeastOne", label: "P(≥1)" },
  { key: "exactlyOne", label: "P(=1)" },
  { key: "none", label: "P(NONE)" },
] as const;

type Props = {
  packSlug: PackSlug;
  tokens: number;
  dupesEnabled: boolean;
  metric: "epicPlus" | "legendary" | "chroma";
  probMode: "atLeastOne" | "exactlyOne" | "none";
  dailyCap: number;
  onPackChange: (slug: PackSlug) => void;
  onTokensChange: (tokens: number) => void;
  onDupesChange: (enabled: boolean) => void;
  onMetricChange: (metric: "epicPlus" | "legendary" | "chroma") => void;
  onProbModeChange: (mode: "atLeastOne" | "exactlyOne" | "none") => void;
  onDailyCapChange: (cap: number) => void;
  onRunSimulation?: () => void;
};

const RARITY_COLORS = {
  common: "#94a3b8",
  uncommon: "#60a5fa",
  rare: "#a78bfa",
  epic: "#fb923c",
  legendary: "#22d3ee",
  chroma: "#34d399",
};

export default function OddsTab({
  packSlug,
  tokens,
  dupesEnabled,
  metric,
  probMode,
  dailyCap,
  onPackChange,
  onTokensChange,
  onDupesChange,
  onMetricChange,
  onProbModeChange,
  onDailyCapChange,
  onRunSimulation,
}: Props) {
  const pack = getPackById(packSlug);
  const boxCost = getBoxCost(pack, dupesEnabled);
  const attempts = calculateOpenCount(tokens, pack, dupesEnabled);
  const rate = getMetricRate(pack, metric);

  const probabilities = useMemo(
    () => calculatePackProbabilities(pack, tokens, dupesEnabled),
    [pack, tokens, dupesEnabled],
  );

  const primaryProbabilityAtLeastOne = probabilities[metric];

  // Display probability based on mode
  const displayProbability = useMemo(() => {
    if (probMode === "atLeastOne") return primaryProbabilityAtLeastOne;
    if (probMode === "none") return Math.max(0, 1 - primaryProbabilityAtLeastOne);
    // exactlyOne — binomial P(X=1) = n*p*(1-p)^(n-1)
    if (rate <= 0 || attempts <= 0) return 0;
    return Math.min(
      1,
      attempts * rate * Math.pow(1 - rate, Math.max(0, attempts - 1)),
    );
  }, [probMode, primaryProbabilityAtLeastOne, rate, attempts]);

  // Chase curve — show 0 → 99% threshold or current attempts (whichever larger)
  const ninetyNinePacks = useMemo(
    () =>
      Math.min(
        5000,
        Math.max(
          50,
          Math.ceil(Math.log(0.01) / Math.log(1 - Math.max(rate, 1e-6))),
        ),
      ),
    [rate],
  );
  const curve = useMemo(
    () => chaseCurve(rate, ninetyNinePacks, 60),
    [rate, ninetyNinePacks],
  );

  // Confidence thresholds
  const thresholds = useMemo(
    () =>
      CONFIDENCE_LEVELS.map((c) => {
        const tkn = tokensForConfidence(pack, metric, c, dupesEnabled);
        const packs = Math.ceil(tkn / boxCost);
        return {
          confidence: c,
          packs,
          tokens: tkn,
          days: daysToBudget(tkn, dailyCap),
        };
      }),
    [pack, metric, dupesEnabled, boxCost, dailyCap],
  );

  // Expected rarities donut data
  const expected = expectedPullsByRarity(pack, attempts);
  const donutData = [
    { key: "common", value: expected.common, color: RARITY_COLORS.common },
    { key: "uncommon", value: expected.uncommon, color: RARITY_COLORS.uncommon },
    { key: "rare", value: expected.rare, color: RARITY_COLORS.rare },
    { key: "epic", value: expected.epic, color: RARITY_COLORS.epic },
    { key: "legendary", value: expected.legendary, color: RARITY_COLORS.legendary },
    { key: "chroma", value: expected.chroma, color: RARITY_COLORS.chroma },
  ].filter((slice) => slice.value > 0);

  // Sell-back economy
  const totalSpend = Math.round(attempts * pack.costPerPull);
  const effectiveSpend = Math.round(attempts * boxCost);
  const refund = Math.max(0, totalSpend - effectiveSpend);
  const roiPercent =
    totalSpend > 0 ? Math.round((refund / totalSpend) * 100) : 0;

  // PVI + ranked packs
  const allPacksList = PACKS as never;
  const pvi = packValueIndex(pack as never, allPacksList);
  const rankings = useMemo(() => rankPacksByValue(allPacksList), []);
  const rankIndex = rankings.findIndex((r) => r.pack.id === pack.id);

  // Mini pack comparison (top 3 by metric at 90%)
  const topPacksForMetric = useMemo(() => {
    return PACKS.map((p) => ({
      pack: p,
      tokens: tokensForConfidence(p as never, metric, 0.9, dupesEnabled),
    }))
      .filter((entry) => Number.isFinite(entry.tokens))
      .sort((a, b) => a.tokens - b.tokens)
      .slice(0, 3);
  }, [metric, dupesEnabled]);

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* ─── COLUMN 1 — CONFIGURE ─────────────────────────────────── */}
      <SubPanel className="space-y-5">
        <MonoLabel>1 · Configure</MonoLabel>

        {/* Pack selector */}
        <div>
          <MonoLabel tooltip="Pick which Blooket pack you want to model.">
            Pack
          </MonoLabel>
          <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-2.5">
            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
              <Image
                src={pack.imageUrl}
                alt={pack.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <select
              value={packSlug}
              onChange={(event) => onPackChange(event.target.value as PackSlug)}
              className="cyber-mono flex-1 bg-transparent text-sm font-semibold text-white outline-none"
              aria-label="Select pack"
            >
              {PACKS.map((p) => (
                <option key={p.id} value={p.id} className="bg-[#06080f]">
                  {p.name} Pack
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Target metric */}
        <div>
          <MonoLabel tooltip="Choose which rarity tier you want to chase. Each tier has its own drop rate.">
            Target rarity
          </MonoLabel>
          <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
            {METRIC_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onMetricChange(option.key)}
                className={`cyber-mono rounded-lg px-2 py-2 text-[11px] uppercase tracking-wider transition ${
                  metric === option.key
                    ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tokens */}
        <div>
          <MonoLabel tooltip="How many tokens you're willing to spend.">
            Tokens available
          </MonoLabel>
          <div className="mt-2 flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100000}
              step={25}
              value={tokens}
              onChange={(event) =>
                onTokensChange(Math.max(0, Number(event.target.value) || 0))
              }
              className="cyber-mono w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-right text-lg font-semibold text-white outline-none focus:border-cyan-400/50"
            />
          </div>
          <input
            type="range"
            min={0}
            max={20000}
            step={50}
            value={Math.min(tokens, 20000)}
            onChange={(event) => onTokensChange(Number(event.target.value))}
            className="cyber-range mt-3"
            aria-label="Tokens slider"
          />
        </div>

        {/* Dupe refund */}
        <button
          type="button"
          onClick={() => onDupesChange(!dupesEnabled)}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5"
        >
          <div className="text-left">
            <p className="cyber-mono text-[10px] uppercase tracking-wider text-slate-400">
              Sell duplicates
            </p>
            <p className="cyber-mono mt-0.5 text-xs text-white">
              {dupesEnabled ? "Refunds on" : "Refunds off"}
            </p>
          </div>
          <div
            className={`relative h-6 w-11 rounded-full transition ${
              dupesEnabled ? "bg-cyan-400/30" : "bg-white/10"
            }`}
          >
            <div
              className={`absolute top-0.5 h-5 w-5 rounded-full transition ${
                dupesEnabled
                  ? "left-[22px] bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                  : "left-0.5 bg-white/40"
              }`}
            />
          </div>
        </button>

        {/* Daily grind cap */}
        <div>
          <MonoLabel tooltip="Tokens you can earn per day. Used to estimate grind days.">
            Daily grind cap
          </MonoLabel>
          <input
            type="number"
            min={50}
            max={5000}
            step={50}
            value={dailyCap}
            onChange={(event) =>
              onDailyCapChange(Math.max(50, Number(event.target.value) || DAILY_TOKEN_CAP))
            }
            className="cyber-mono mt-2 w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-right text-sm font-semibold text-white outline-none focus:border-cyan-400/50"
          />
          <div className="mt-2 flex gap-1.5">
            {[0, 500, 1000, 2000, 5000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onDailyCapChange(Math.max(50, v || DAILY_TOKEN_CAP))}
                className={`cyber-mono flex-1 rounded-lg border px-1 py-1 text-[9px] font-semibold uppercase tracking-wider transition ${
                  dailyCap === v
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white"
                }`}
              >
                {v === 0 ? "0" : v >= 1000 ? `${v / 1000}K` : v}
              </button>
            ))}
          </div>
        </div>
      </SubPanel>

      {/* ─── COLUMN 2 — PROBABILITY ───────────────────────────────── */}
      <SubPanel className="space-y-5 lg:col-span-2">
        <div className="flex items-center justify-between">
          <MonoLabel>2 · Probability</MonoLabel>
          {/* Probability mode toggle */}
          <div className="flex gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-0.5">
            {PROB_MODE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                onClick={() => onProbModeChange(option.key)}
                className={`cyber-mono rounded-md px-2 py-1 text-[10px] uppercase tracking-wider transition ${
                  probMode === option.key
                    ? "bg-cyan-400/15 text-cyan-300"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Giant number */}
        <div className="text-center">
          <p
            className="cyber-display cyber-glow-cyan text-7xl text-cyan-300 sm:text-8xl"
            style={{ lineHeight: 1 }}
          >
            {formatPercent(displayProbability)}
          </p>
          <p className="cyber-mono mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
            {probMode === "none" ? "Chance of NO " : "Chance to pull "}
            {METRIC_OPTIONS.find((option) => option.key === metric)?.label}
            {" "}in {Math.floor(attempts).toLocaleString()} pulls
          </p>
        </div>

        {/* Probability bar */}
        <div className="space-y-1.5">
          <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${displayProbability * 100}%` }}
            />
          </div>
          <div className="cyber-mono flex justify-between text-[9px] uppercase tracking-wider text-slate-500">
            <span>0%</span>
            <span>50%</span>
            <span>90%</span>
            <span>99%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Chase curve */}
        <div>
          <MonoLabel className="mb-2">Cumulative chase curve</MonoLabel>
          <ChaseCurve
            points={curve}
            height={140}
            marker={{ packs: Math.floor(attempts) }}
          />
          <div className="cyber-mono mt-1 flex justify-between text-[9px] text-slate-500">
            <span>0 packs</span>
            <span>{Math.floor(ninetyNinePacks / 2).toLocaleString()}</span>
            <span>{ninetyNinePacks.toLocaleString()} packs</span>
          </div>
        </div>

        {/* Confidence thresholds */}
        <div>
          <MonoLabel className="mb-2">Confidence thresholds</MonoLabel>
          <div className="grid grid-cols-5 gap-2">
            {thresholds.map((threshold) => (
              <ConfidencePill
                key={threshold.confidence}
                confidence={threshold.confidence}
                packs={threshold.packs}
                tokens={threshold.tokens}
                days={threshold.days}
                highlighted={threshold.confidence === 0.9}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        {onRunSimulation ? (
          <CyberCTA onClick={onRunSimulation} className="w-full text-base">
            ▶ Run 10,000 simulations
          </CyberCTA>
        ) : null}
      </SubPanel>

      {/* ─── COLUMN 3 — BREAKDOWN ─────────────────────────────────── */}
      <SubPanel className="space-y-5">
        <MonoLabel>3 · Expected rewards</MonoLabel>

        {/* Donut */}
        {donutData.length > 0 ? (
          <div className="flex flex-col items-center gap-3">
            <RarityDonut
              data={donutData}
              size={140}
              centerLabel={
                <div>
                  <p className="cyber-mono text-base font-semibold text-white">
                    {Math.floor(attempts).toLocaleString()}
                  </p>
                  <p className="cyber-mono text-[9px] uppercase tracking-wider text-slate-500">
                    pulls
                  </p>
                </div>
              }
            />
            <ul className="cyber-mono w-full space-y-1 text-[10px]">
              {donutData.slice().reverse().map((slice) => (
                <li
                  key={slice.key}
                  className="flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5 text-slate-400">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    {slice.key.toUpperCase()}
                  </span>
                  <span className="text-white">~{slice.value.toFixed(1)}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="cyber-mono text-xs text-slate-500">No pulls yet.</p>
        )}

        {/* Sell-back economy */}
        <SubPanel className="space-y-2">
          <MonoLabel>Sell-back economy</MonoLabel>
          <div className="cyber-mono flex items-center justify-between text-xs">
            <span className="text-slate-400">Total spend</span>
            <span className="text-white">{totalSpend.toLocaleString()} tkn</span>
          </div>
          {dupesEnabled && refund > 0 ? (
            <div className="cyber-mono flex items-center justify-between text-xs">
              <span className="text-slate-400">Duplicate refund</span>
              <span className="text-emerald-300">
                −{refund.toLocaleString()} tkn
              </span>
            </div>
          ) : null}
          <div className="cyber-mono flex items-center justify-between border-t border-white/5 pt-2 text-sm">
            <span className="text-slate-300">Effective cost</span>
            <span className="font-semibold text-cyan-300">
              {effectiveSpend.toLocaleString()} tkn
            </span>
          </div>
          <p className="cyber-mono text-[10px] text-slate-500">
            ROI · {roiPercent}% retention
          </p>
        </SubPanel>

        {/* Pack Value Index */}
        <SubPanel className="space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
            <MonoLabel className="!text-cyan-300">Pack Value Index</MonoLabel>
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="cyber-display cyber-glow-cyan text-4xl text-cyan-300"
              style={{ lineHeight: 1 }}
            >
              {pvi.total}
            </span>
            <span className="cyber-mono text-xs text-slate-400">/ 100</span>
          </div>
          <div className="cyber-mono space-y-0.5 text-[10px] text-slate-400">
            <p>PRICE {pvi.price} · RARITY {pvi.rarity}</p>
            <p>RESALE {pvi.resale} · META {pvi.meta}</p>
          </div>
          <p className="cyber-mono text-[10px] text-violet-300">
            Ranked #{rankIndex + 1} of {rankings.length} packs
          </p>
        </SubPanel>
      </SubPanel>

      {/* ─── COLUMN 4 — ADVISOR ──────────────────────────────────── */}
      <SubPanel className="space-y-5">
        <MonoLabel>4 · Advisor</MonoLabel>

        {/* Best pack callout */}
        {topPacksForMetric[0] ? (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-3">
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5 text-cyan-300" />
              <p className="cyber-mono text-[10px] uppercase tracking-wider text-cyan-300">
                Best pack at 90%
              </p>
            </div>
            <p className="cyber-display mt-2 text-xl text-white">
              {topPacksForMetric[0].pack.name} Pack
            </p>
            <p className="cyber-mono mt-1 text-[11px] text-slate-400">
              {topPacksForMetric[0].tokens.toLocaleString()} tkn to 90% chance
            </p>
          </div>
        ) : null}

        {/* Mini pack comparison */}
        <div className="space-y-1.5">
          <MonoLabel>Top 3 cheapest packs</MonoLabel>
          {topPacksForMetric.map((entry, index) => {
            const isActive = entry.pack.id === pack.id;
            return (
              <button
                key={entry.pack.id}
                type="button"
                onClick={() => onPackChange(entry.pack.id as PackSlug)}
                className={`flex w-full items-center justify-between gap-2 rounded-lg border px-2.5 py-2 text-left transition ${
                  isActive
                    ? "border-cyan-400/40 bg-cyan-400/10"
                    : "border-white/5 bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <span className="cyber-mono text-[10px] uppercase tracking-wider text-slate-400">
                  #{index + 1}
                </span>
                <span className="cyber-mono flex-1 text-xs text-white">
                  {entry.pack.name}
                </span>
                <span className="cyber-mono text-[11px] text-cyan-300">
                  {entry.tokens.toLocaleString()}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-2">
          <MonoStat
            label="Median"
            value={`~${Math.ceil(Math.log(0.5) / Math.log(1 - Math.max(rate, 1e-6)))}`}
          />
          <MonoStat
            label="P90"
            value={`~${Math.ceil(Math.log(0.1) / Math.log(1 - Math.max(rate, 1e-6)))}`}
          />
        </div>

        {/* Recent community activity (illustrative) */}
        <div>
          <div className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-violet-300" />
            <MonoLabel className="!text-violet-300">Live activity</MonoLabel>
          </div>
          <ul className="cyber-mono mt-2 space-y-1 text-[10px] text-slate-400">
            <li>
              <span className="cyber-pulse-dot inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 align-middle" />
              {" "}824 players running calculations
            </li>
            <li>
              <span className="text-emerald-300">●</span> 17,240 sims today
            </li>
            <li>
              <span className="text-violet-300">●</span> {pack.name} trending #1
            </li>
          </ul>
        </div>

        <div className="flex gap-2 pt-2">
          <CyberGhost className="flex-1 text-[10px]">Share</CyberGhost>
          <CyberGhost className="flex-1 text-[10px]">Copy link</CyberGhost>
        </div>
      </SubPanel>
    </div>
  );
}
