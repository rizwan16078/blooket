import type { Blook, Pack, Rarity, OddsMetric, RarityKey } from "@/types";
import { PACK_MAP, BLOOKS } from "./data";

/* ─── Constants ────────────────────────────────────────────────── */

export const DEFAULT_TOKENS = 500;
export const MAX_TOKENS = 100000;
export const DAILY_CAP = 500;

export const METRIC_LABELS: Record<OddsMetric, string> = {
  epicPlus: "Epic+",
  legendary: "Legendary",
  chroma: "Chroma",
};

/* ─── Helpers ───────────────────────────────────────────────────── */

export function clampProbability(v: number) {
  return Math.min(1, Math.max(0, v));
}

export function clampTokens(v: number) {
  if (!Number.isFinite(v)) return DEFAULT_TOKENS;
  return Math.min(MAX_TOKENS, Math.max(0, Math.round(v)));
}

export function formatPercent(probability: number) {
  const pct = clampProbability(probability) * 100;
  if (pct >= 99.995) return `${pct.toFixed(2)}%`;
  if (pct > 0 && pct < 0.01) return "<0.01%";
  return `${pct.toFixed(2)}%`;
}

/* ─── Core calculations ────────────────────────────────────────── */

function getEffectiveBlooks(blooks: Blook[]) {
  const seen = new Set<string>();
  return blooks.filter((b) => {
    if (!b.rotationGroup) return true;
    if (seen.has(b.rotationGroup)) return false;
    seen.add(b.rotationGroup);
    return true;
  });
}

export function getRarityRate(packId: string, rarity: Rarity) {
  const pack = PACK_MAP[packId];
  if (!pack) return 0;
  return getEffectiveBlooks(pack.featuredBlooks)
    .filter((b) => b.rarity === rarity)
    .reduce((s, b) => s + b.dropRate, 0);
}

export function getMetricRate(pack: Pack, metric: OddsMetric) {
  if (metric === "epicPlus") return getRarityRate(pack.id, "Epic") + getRarityRate(pack.id, "Legendary") + getRarityRate(pack.id, "Chroma");
  if (metric === "legendary") return getRarityRate(pack.id, "Legendary");
  return getRarityRate(pack.id, "Chroma");
}

export function getBoxCost(pack: Pick<Pack, "costPerPull" | "effectiveCost">, dupesEnabled: boolean) {
  return dupesEnabled ? pack.effectiveCost : pack.costPerPull;
}

export function calculateOpenCount(tokens: number, pack: Pick<Pack, "costPerPull" | "effectiveCost">, dupesEnabled: boolean) {
  return clampTokens(tokens) / getBoxCost(pack, dupesEnabled);
}

export function calculateAtLeastOneSuccess(rate: number, attempts: number) {
  if (rate <= 0 || attempts <= 0) return 0;
  return clampProbability(1 - Math.pow(1 - rate, attempts));
}

export function calculateMetricProbability(pack: Pack, tokens: number, dupesEnabled: boolean, metric: OddsMetric) {
  return calculateAtLeastOneSuccess(
    getMetricRate(pack, metric),
    calculateOpenCount(tokens, pack, dupesEnabled),
  );
}

export function calculateBlookAttempts(tokens: number, pack: Pack, blook: Blook, dupesEnabled: boolean): number {
  if (tokens <= 0) return 0;
  const baseCost = dupesEnabled ? pack.effectiveCost : pack.costPerPull;
  const effectiveCost = baseCost + blook.sellValue * blook.dropRate;
  if (effectiveCost <= 0) return Infinity;
  return tokens / effectiveCost;
}

export function calculateBlookProbability(tokens: number, pack: Pack, blook: Blook, dupesEnabled: boolean): number {
  const attempts = calculateBlookAttempts(tokens, pack, blook, dupesEnabled);
  return calculateAtLeastOneSuccess(blook.dropRate, attempts);
}

export function calculateMetricProbabilityV2(pack: Pack, tokens: number, dupesEnabled: boolean, metric: OddsMetric): number {
  const blooks = getEffectiveBlooks(pack.featuredBlooks);
  const rarities = metricToRarities(metric);
  const targetBlooks = blooks.filter((b) => rarities.has(b.rarity));
  if (targetBlooks.length === 0 || tokens <= 0) return 0;
  let product = 1;
  for (const blook of targetBlooks) {
    const attempts = calculateBlookAttempts(tokens, pack, blook, dupesEnabled);
    product *= Math.pow(1 - blook.dropRate, attempts);
  }
  return clampProbability(1 - product);
}

function metricToRarities(metric: OddsMetric): Set<Rarity> {
  if (metric === "epicPlus") return new Set(["Epic", "Legendary", "Chroma"]);
  if (metric === "legendary") return new Set(["Legendary"]);
  return new Set(["Chroma"]);
}

export function calculateEstimatedTokensForBlook(blook: Blook, pack: Pick<Pack, "costPerPull">) {
  if (blook.dropRate <= 0) return Infinity;
  return pack.costPerPull / blook.dropRate;
}

export function getRiskBand(probability: number) {
  const p = clampProbability(probability);
  if (p >= 0.7) return { label: "Lucky range", tone: "green" as const };
  if (p >= 0.3) return { label: "Normal range", tone: "yellow" as const };
  return { label: "Risk zone", tone: "red" as const };
}

export function formatTokenLabel(value: number) {
  return `${Math.round(value).toLocaleString()} tokens`;
}

export function getBestValuePack(metric: OddsMetric, dupesEnabled: boolean) {
  return UNLOCKED_PACKS.reduce((best: Pack, candidate: Pack) => {
    const bestScore = getMetricRate(best, metric) / getBoxCost(best, dupesEnabled);
    const candidateScore = getMetricRate(candidate, metric) / getBoxCost(candidate, dupesEnabled);
    return candidateScore > bestScore ? candidate : best;
  });
}

import { UNLOCKED_PACKS } from "./data";
