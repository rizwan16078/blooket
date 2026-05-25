"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import { ChevronDown, Lightbulb, Minus, Plus } from "lucide-react";

import {
  calculateMetricProbabilityV2,
  calculateOpenCount,
  formatPercent,
  getMetricRate,
  packsForConfidence,
  tokensForConfidence,
} from "@/lib/calculator-v2";
import { PACKS, getPackById, type PackSlug } from "@/lib/packs";
import {
  METRIC_REQUIRED_RARITY,
  packHasRarity,
} from "@/lib/blook-probabilities";
import { useAnimatedNumber } from "@/hooks/useAnimatedNumber";

import { MonoLabel, SubPanel } from "./parts";

/** Slider scale shown beneath the tokens input. */
const SLIDER_MAX = 100;

const CONFETTI_THRESHOLD = 0.99;

type Metric = "epicPlus" | "legendary" | "chroma";

type Props = {
  packSlug: PackSlug;
  tokens: number;
  metric: Metric;
  dupesEnabled: boolean;
  onPackChange: (slug: PackSlug) => void;
  onTokensChange: (tokens: number) => void;
  onMetricChange: (metric: Metric) => void;
};

const METRIC_LABEL: Record<Metric, string> = {
  epicPlus: "Epic+",
  legendary: "Legendary",
  chroma: "Chroma",
};

const METRIC_OPTIONS: { key: Metric; label: string }[] = [
  { key: "epicPlus", label: "Epic+" },
  { key: "legendary", label: "Legendary" },
  { key: "chroma", label: "Chroma" },
];

/**
 * Casual-user view. One question, one answer, one helpful tip.
 * Inputs at the top, big probability number in the middle, contextual
 * advice at the bottom, "Show advanced" CTA to switch to Pro mode.
 */
export default function SimpleOddsView({
  packSlug,
  tokens,
  metric,
  dupesEnabled,
  onPackChange,
  onTokensChange,
  onMetricChange,
}: Props) {
  const pack = getPackById(packSlug);
  const attempts = calculateOpenCount(tokens, pack, dupesEnabled);
  const packOpens = tokens / pack.costPerPull;
  const rate = getMetricRate(pack, metric);

  // Same impossibility guard as OddsTab — keep the two views in lockstep
  const metricAvailability = useMemo(
    () => ({
      epicPlus: packHasRarity(pack.id, METRIC_REQUIRED_RARITY.epicPlus),
      legendary: packHasRarity(pack.id, METRIC_REQUIRED_RARITY.legendary),
      chroma: packHasRarity(pack.id, METRIC_REQUIRED_RARITY.chroma),
    }),
    [pack.id],
  );
  useEffect(() => {
    if (!metricAvailability[metric]) {
      if (metricAvailability.legendary) onMetricChange("legendary");
      else if (metricAvailability.epicPlus) onMetricChange("epicPlus");
      else if (metricAvailability.chroma) onMetricChange("chroma");
    }
  }, [metric, metricAvailability, onMetricChange]);
  const probability = useMemo(
    () =>
      rate <= 0 || attempts <= 0
        ? 0
        : calculateMetricProbabilityV2(pack, tokens, dupesEnabled, metric),
    [rate, attempts, pack, tokens, dupesEnabled, metric],
  );

  // Smooth count-up animation for the big percentage number
  const animatedProbability = useAnimatedNumber(probability, 500);

  // Confetti burst on first crossing of the 99% threshold
  const previousPeakRef = useRef(probability);
  useEffect(() => {
    if (
      probability >= CONFETTI_THRESHOLD &&
      previousPeakRef.current < CONFETTI_THRESHOLD
    ) {
      void import("canvas-confetti").then(({ default: confetti }) => {
        confetti({
          particleCount: 140,
          spread: 80,
          startVelocity: 36,
          scalar: 0.95,
          origin: { y: 0.4 },
          colors: ["#22d3ee", "#a78bfa", "#34d399", "#f8fafc"],
        });
      });
    }
    previousPeakRef.current = probability;
  }, [probability]);

  const tokensFor90 = tokensForConfidence(pack as never, metric, 0.9, dupesEnabled);
  const tokensFor99 = tokensForConfidence(pack as never, metric, 0.99, dupesEnabled);

  const tip = useMemo(() => {
    if (rate <= 0) {
      return {
        tone: "warning",
        message: `${pack.name} pack does not contain ${METRIC_LABEL[metric]} blooks. Pick a different target.`,
      };
    }
    if (probability >= 0.99) {
      return {
        tone: "success",
        message: `Virtually guaranteed. You could open ~${packsForConfidence(rate, 0.9).toLocaleString()} packs (${tokensFor90.toLocaleString()} tkn) and still hit 90%.`,
      };
    }
    if (probability >= 0.9) {
      return {
        tone: "success",
        message: `Strong odds. Add ${(tokensFor99 - tokens).toLocaleString()} more tokens to push to 99%.`,
      };
    }
    if (probability >= 0.5) {
      return {
        tone: "warning",
        message: `Coin-flip territory. Save ${(tokensFor90 - tokens).toLocaleString()} more tokens for 90% confidence.`,
      };
    }
    return {
      tone: "warning",
      message: `Low odds. Save up to ${tokensFor90.toLocaleString()} tkn for 90% chance, or pick a cheaper rarity tier.`,
    };
  }, [pack.name, metric, probability, rate, tokens, tokensFor90, tokensFor99]);

  // Floor-1 attempts means the user can't even afford a single pull.
  // Show a coaching empty-state instead of a misleading non-zero %.
  const canAffordPull = Math.floor(attempts) >= 1;

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      {/* ── LEFT: inputs (wider) ── */}
      <SubPanel className="space-y-6">
        {/* Row 1 — Pack chip + Target rarity (stack on narrow, side-by-side on xl+) */}
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.3fr_1fr]">
          {/* Pack chip — image + dropdown */}
          <div>
            <MonoLabel
              tooltip="Pick which pack you want to open. Each pack has different drop rates."
            >
              Pack
            </MonoLabel>
            <div className="relative mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-3 transition focus-within:border-cyan-400/40">
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-white/5">
                <Image
                  src={pack.imageUrl}
                  alt=""
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <span className="flex-1 truncate text-base font-semibold text-white">
                {pack.name} Pack
                <span className="ml-2 cyber-mono text-sm font-normal text-slate-400">
                  ({pack.costPerPull} tkn)
                </span>
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
              {/* Invisible native select fills the chip area for full click + a11y */}
              <select
                value={packSlug}
                onChange={(event) =>
                  onPackChange(event.target.value as PackSlug)
                }
                aria-label="Select pack"
                className="absolute inset-0 cursor-pointer opacity-0"
              >
                {PACKS.map((p) => (
                  <option key={p.id} value={p.id} className="bg-[#06080f]">
                    {p.name} Pack ({p.costPerPull} tkn)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Target rarity */}
          <div>
            <MonoLabel
              tooltip="Which rarity tier do you want to pull? Higher rarity = lower chance."
            >
              Target rarity
            </MonoLabel>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
              {METRIC_OPTIONS.map((option) => {
                const isAvailable = metricAvailability[option.key];
                const isActive = metric === option.key;
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => onMetricChange(option.key)}
                    disabled={!isAvailable}
                    title={
                      !isAvailable
                        ? `${pack.name} has no ${option.label} blooks`
                        : undefined
                    }
                    className={`cyber-mono rounded-lg px-2 py-3 text-sm uppercase tracking-wider transition ${
                      !isAvailable
                        ? "cursor-not-allowed text-slate-600 line-through"
                        : isActive
                        ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2 — Tokens (default 0, +/- step 1) */}
        <div>
          <MonoLabel
            tooltip="How many tokens you have to spend on this pack. Use + / - to adjust one at a time, or type directly."
          >
            How many tokens?
          </MonoLabel>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => onTokensChange(Math.max(0, tokens - 1))}
              aria-label="Decrease tokens by 1"
              className="cyber-ghost inline-flex h-14 w-14 shrink-0 items-center justify-center"
            >
              <Minus className="h-5 w-5" />
            </button>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              value={tokens}
              onChange={(event) =>
                onTokensChange(Math.max(0, Number(event.target.value) || 0))
              }
              className="cyber-mono w-full rounded-xl border border-white/10 bg-white/[0.02] px-3 py-3.5 text-center text-3xl font-semibold text-white outline-none focus:border-cyan-400/50"
              aria-label="Tokens"
            />
            <button
              type="button"
              onClick={() => onTokensChange(tokens + 1)}
              aria-label="Increase tokens by 1"
              className="cyber-ghost inline-flex h-14 w-14 shrink-0 items-center justify-center"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          <input
            type="range"
            min={0}
            max={SLIDER_MAX}
            step={1}
            value={Math.min(tokens, SLIDER_MAX)}
            onChange={(event) => onTokensChange(Number(event.target.value))}
            className="cyber-range mt-4"
            aria-label="Tokens slider"
          />
          <div className="mt-3 flex gap-1.5">
            {[0, 500, 1000, 2000, 5000].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => onTokensChange(v)}
                className={`cyber-mono flex-1 rounded-lg border px-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition ${
                  tokens === v
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                    : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-white"
                }`}
              >
                {v === 0 ? "0" : v >= 1000 ? `${v / 1000}K` : v}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onTokensChange(tokens + 500)}
              className="cyber-mono flex-1 rounded-lg border border-white/10 bg-white/[0.02] px-1 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 hover:border-white/20 hover:text-white transition"
            >
              +500
            </button>
          </div>
        </div>
      </SubPanel>

      {/* ── RIGHT: result column (big number + tip stacked) ── */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-4">
        {tokens <= 0 ? (
          <div className="cyber-glass-sub text-center px-4 py-10">
            <p className="cyber-display text-2xl text-slate-300 sm:text-3xl">
              Enter tokens to see your chances
            </p>
            <p className="cyber-mono mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-500">
              Type a number on the left or drag the slider
            </p>
          </div>
        ) : !canAffordPull ? (
          <div className="cyber-glass-sub text-center px-4 py-10">
            <p className="cyber-display text-2xl text-orange-300 sm:text-3xl">
              Need at least {pack.costPerPull} tokens
            </p>
            <p className="cyber-mono mt-3 text-[11px] uppercase tracking-[0.22em] text-slate-400">
              {pack.name} Pack costs {pack.costPerPull} tkn per pull
            </p>
          </div>
        ) : (
          <div className="text-center">
            <p
              key={`${packSlug}-${metric}`}
              className="cyber-display cyber-glow-cyan cyber-number-flash text-7xl text-cyan-300 sm:text-8xl"
              style={{ lineHeight: 1 }}
              aria-live="polite"
            >
              {formatPercent(animatedProbability)}
            </p>
            <p className="cyber-mono mt-3 text-xs uppercase tracking-[0.22em] text-slate-300">
              Chance for {METRIC_LABEL[metric]} in {Math.floor(packOpens).toLocaleString()} opens
            </p>
            <div className="mx-auto mt-4 h-2 max-w-md overflow-hidden rounded-full bg-white/5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400 transition-[width] duration-500 ease-out"
                style={{ width: `${animatedProbability * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Contextual tip — only when the result is meaningful */}
        {tokens > 0 && canAffordPull ? (
          <div
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 ${
              tip.tone === "success"
                ? "border-emerald-400/25 bg-emerald-400/[0.04]"
                : "border-orange-400/25 bg-orange-400/[0.04]"
            }`}
          >
            <Lightbulb
              className={`h-4 w-4 shrink-0 ${
                tip.tone === "success" ? "text-emerald-300" : "text-orange-300"
              }`}
            />
            <p className="text-sm text-slate-200">{tip.message}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
