/**
 * Calculator v2 — extended probability helpers for the Cyber Glass redesign.
 *
 * Builds on lib/math.ts but adds:
 *  - Confidence-threshold inversion (tokens needed for X% chance)
 *  - Cumulative chase curve data generation
 *  - Pack Value Index composite score
 *  - Daily-grind day estimator
 */

import {
  atLeastOneSuccess,
  clampTokens,
} from "@/lib/odds";
import {
  calculateAtLeastOneSuccess,
  calculateBlookAttempts,
  calculateBlookProbability,
  calculateMetricProbabilityV2,
  calculateOpenCount,
  calculatePackProbabilities,
  formatPercent as formatPercentMath,
  getBoxCost,
  getMetricRate,
  type OddsMetric,
} from "@/lib/math";
import type { Pack, PackSlug } from "@/lib/packs";

export const DAILY_TOKEN_CAP = 500;
export const CONFIDENCE_LEVELS = [0.5, 0.75, 0.9, 0.95, 0.99] as const;
export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];

export const PROBABILITY_MODES = ["atLeastOne", "exactlyOne", "none"] as const;
export type ProbabilityMode = (typeof PROBABILITY_MODES)[number];

/**
 * Invert `1 - (1 - p)^n = c` to solve for n (packs needed) given a
 * per-pull rate p and confidence c.
 */
export function packsForConfidence(rate: number, confidence: number): number {
  if (rate <= 0) return Infinity;
  if (confidence <= 0) return 0;
  if (confidence >= 1) return Infinity;
  return Math.ceil(Math.log(1 - confidence) / Math.log(1 - rate));
}

/**
 * Tokens needed to reach a confidence threshold for a metric.
 */
export function tokensForConfidence(
  pack: Pack,
  metric: OddsMetric,
  confidence: number,
  dupesEnabled: boolean,
): number {
  const rate = getMetricRate(pack, metric);
  const packs = packsForConfidence(rate, confidence);
  if (!Number.isFinite(packs)) return Infinity;
  return Math.ceil(packs * getBoxCost(pack, dupesEnabled));
}

/**
 * Days of grinding at the daily cap to reach a token target.
 */
export function daysToBudget(tokens: number, dailyCap = DAILY_TOKEN_CAP): number {
  if (tokens <= 0) return 0;
  if (dailyCap <= 0) return Infinity;
  return Math.ceil(tokens / dailyCap);
}

/**
 * Generate (x, y) data points for a cumulative chase curve:
 *  x = number of packs opened (0 → maxPacks)
 *  y = probability of at least one success
 */
export function chaseCurve(
  rate: number,
  maxPacks: number,
  steps = 60,
): Array<{ packs: number; probability: number }> {
  if (maxPacks <= 0 || steps <= 0) return [];
  const stepSize = Math.max(1, Math.floor(maxPacks / steps));
  const points: Array<{ packs: number; probability: number }> = [];
  for (let packs = 0; packs <= maxPacks; packs += stepSize) {
    points.push({ packs, probability: calculateAtLeastOneSuccess(rate, packs) });
  }
  if (points[points.length - 1]?.packs !== maxPacks) {
    points.push({
      packs: maxPacks,
      probability: calculateAtLeastOneSuccess(rate, maxPacks),
    });
  }
  return points;
}

/**
 * Expected pulls per rarity if user opens `attempts` packs.
 */
export function expectedPullsByRarity(pack: Pack, attempts: number) {
  return {
    common: pack.dropRates.common * attempts,
    uncommon: pack.dropRates.uncommon * attempts,
    rare: pack.dropRates.rare * attempts,
    epic: pack.dropRates.epic * attempts,
    legendary: pack.dropRates.legendary * attempts,
    chroma: pack.dropRates.chroma * attempts,
  };
}

/**
 * Pack Value Index — a composite 0-100 score that signals overall pack worth.
 *
 *   Price:    cheaper per-pull → higher score (relative to most expensive pack)
 *   Rarity:   higher rare-tier yield (epic + leg + chroma) → higher score
 *   Resale:   higher avg sell-back / cost → higher score
 *   Meta:     freshness + lock status. Always-available, recent = higher.
 */
export function packValueIndex(pack: Pack, allPacks: Pack[]) {
  const maxCost = Math.max(...allPacks.map((p) => p.costPerPull));
  const priceScore = Math.round(100 * (1 - (pack.costPerPull - 1) / Math.max(1, maxCost)));

  const rareYield =
    pack.dropRates.epic + pack.dropRates.legendary + pack.dropRates.chroma;
  const maxRare = Math.max(
    ...allPacks.map(
      (p) => p.dropRates.epic + p.dropRates.legendary + p.dropRates.chroma,
    ),
  );
  const rarityScore = Math.round(100 * (rareYield / Math.max(1e-6, maxRare)));

  const resaleRatio = pack.effectiveCost
    ? Math.max(0, 1 - pack.effectiveCost / pack.costPerPull)
    : 0;
  const resaleScore = Math.round(100 * Math.min(1, resaleRatio * 1.4));

  const metaScore = pack.isLocked ? 60 : 90;

  const total = Math.round(
    priceScore * 0.25 +
      rarityScore * 0.35 +
      resaleScore * 0.25 +
      metaScore * 0.15,
  );

  return {
    price: clamp(priceScore, 0, 100),
    rarity: clamp(rarityScore, 0, 100),
    resale: clamp(resaleScore, 0, 100),
    meta: clamp(metaScore, 0, 100),
    total: clamp(total, 0, 100),
  };
}

/**
 * Rank packs by their Pack Value Index.
 */
export function rankPacksByValue(packs: Pack[]) {
  return packs
    .map((pack) => ({ pack, pvi: packValueIndex(pack, packs) }))
    .sort((a, b) => b.pvi.total - a.pvi.total);
}

/**
 * Find cheapest pack for a given metric (lowest tokens to reach 90%).
 */
export function cheapestPackForMetric(
  packs: Pack[],
  metric: OddsMetric,
  confidence = 0.9,
  dupesEnabled = true,
) {
  return packs
    .map((pack) => ({
      pack,
      tokens: tokensForConfidence(pack, metric, confidence, dupesEnabled),
    }))
    .filter((entry) => Number.isFinite(entry.tokens))
    .sort((a, b) => a.tokens - b.tokens);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// Re-exports for convenience
export {
  atLeastOneSuccess,
  calculateAtLeastOneSuccess,
  calculateBlookAttempts,
  calculateBlookProbability,
  calculateMetricProbabilityV2,
  calculateOpenCount,
  calculatePackProbabilities,
  clampTokens,
  formatPercentMath as formatPercent,
  getBoxCost,
  getMetricRate,
};
export type { OddsMetric, Pack, PackSlug };
