/**
 * Per-blook probability helpers.
 *
 * Given a pack + a token budget, compute the probability of pulling each
 * specific blook in that pack (grouped by rarity). Also supports the inverse
 * question: how many tokens are needed for a given guarantee level.
 */

import {
  calculateAtLeastOneSuccess,
  calculateBlookAttempts,
  calculateOpenCount,
} from "@/lib/math";
import { getBlooksForPack, type Pack } from "@/lib/packs";
import type { Blook, Rarity } from "@/types";

export const RARITY_ORDER: Rarity[] = [
  "Chroma",
  "Legendary",
  "Epic",
  "Rare",
  "Uncommon",
  "Common",
];

/**
 * Does this pack actually contain at least one blook of the given rarity?
 * Used to disable Chroma/Legendary buttons on packs that don't have them
 * (e.g. Medieval has no Chroma) and prevent the misleading 0.00% UI.
 */
export function packHasRarity(packId: string, rarity: Rarity): boolean {
  const blooks = getBlooksForPack(packId as never) ?? [];
  return blooks.some((b) => b.rarity === rarity);
}

/** Returns the set of rarities that exist in this pack. */
export function getAvailableRarities(packId: string): Set<Rarity> {
  const blooks = getBlooksForPack(packId as never) ?? [];
  return new Set(blooks.map((b) => b.rarity));
}

/**
 * The Odds tab targets a metric (epicPlus / legendary / chroma) rather than
 * a raw rarity. This maps each metric to the rarity required for it to be
 * meaningful, so we can disable the corresponding button.
 */
export const METRIC_REQUIRED_RARITY: Record<
  "epicPlus" | "legendary" | "chroma",
  Rarity
> = {
  epicPlus: "Epic",
  legendary: "Legendary",
  chroma: "Chroma",
};

export const RARITY_DESIGN: Record<
  Rarity,
  {
    label: string;
    /** tailwind text class for the rarity number */
    text: string;
    /** tailwind border class on hover */
    hoverBorder: string;
    /** tailwind dot color class */
    dot: string;
    /** tailwind ring/badge class */
    badge: string;
  }
> = {
  Common: {
    label: "Common",
    text: "text-slate-300",
    hoverBorder: "hover:border-slate-300/30",
    dot: "bg-slate-300",
    badge: "bg-slate-500/15 text-slate-200",
  },
  Uncommon: {
    label: "Uncommon",
    text: "text-emerald-300",
    hoverBorder: "hover:border-emerald-400/30",
    dot: "bg-emerald-400",
    badge: "bg-emerald-500/15 text-emerald-200",
  },
  Rare: {
    label: "Rare",
    text: "text-sky-300",
    hoverBorder: "hover:border-sky-400/30",
    dot: "bg-sky-400",
    badge: "bg-sky-500/15 text-sky-200",
  },
  Epic: {
    label: "Epic",
    text: "text-violet-300",
    hoverBorder: "hover:border-violet-400/30",
    dot: "bg-violet-400",
    badge: "bg-violet-500/15 text-violet-200",
  },
  Legendary: {
    label: "Legendary",
    text: "text-amber-300",
    hoverBorder: "hover:border-amber-400/30",
    dot: "bg-amber-400",
    badge: "bg-amber-500/15 text-amber-200",
  },
  Chroma: {
    label: "Chroma",
    text: "text-teal-300",
    hoverBorder: "hover:border-teal-400/30",
    dot: "bg-teal-400",
    badge: "bg-teal-500/15 text-teal-200",
  },
};

export interface BlookWithProbability extends Blook {
  /** P(pull at least one of this exact blook in `pulls` opens) */
  probability: number;
  /** Number of distinct rotation siblings sharing this blook's slot */
  rotationSize: number;
}

/**
 * Group every blook in a pack by rarity, attaching the live probability for
 * the user's current token budget. Each group is sorted by probability
 * descending — so within Common you see the most-likely first.
 */
export function getBlookProbabilities(
  pack: Pack,
  tokens: number,
  dupesEnabled: boolean,
): Record<Rarity, BlookWithProbability[]> {
  const pulls = calculateOpenCount(tokens, pack, dupesEnabled);
  const blooks = getBlooksForPack(pack.id) ?? [];

  // How many siblings share each rotation group. We do NOT split the rate
  // across rotation siblings — Blooket cycles them, only one is in the live
  // pool at a time. The rate listed on each blook is for an active day.
  const rotationCounts = new Map<string, number>();
  for (const blook of blooks) {
    if (!blook.rotationGroup) continue;
    rotationCounts.set(
      blook.rotationGroup,
      (rotationCounts.get(blook.rotationGroup) ?? 0) + 1,
    );
  }

  const grouped: Record<Rarity, BlookWithProbability[]> = {
    Common: [],
    Uncommon: [],
    Rare: [],
    Epic: [],
    Legendary: [],
    Chroma: [],
  };

  for (const blook of blooks) {
    const blookAttempts = calculateBlookAttempts(tokens, pack, blook, dupesEnabled);
    grouped[blook.rarity].push({
      ...blook,
      probability: calculateAtLeastOneSuccess(blook.dropRate, blookAttempts),
      rotationSize: blook.rotationGroup
        ? rotationCounts.get(blook.rotationGroup) ?? 1
        : 1,
    });
  }

  for (const rarity of RARITY_ORDER) {
    grouped[rarity].sort((a, b) => b.probability - a.probability);
  }

  return grouped;
}

/**
 * Inverse problem: how many packs / tokens / grind days do you need to
 * reach the given guarantee level for one specific blook?
 *
 *   n = ceil( log(1 - P) / log(1 - p) )
 *
 * `dupesEnabled` switches the cost basis from sticker price to effective
 * cost (sticker price minus average duplicate sell-back).
 */
export function getTokensForGuarantee(
  blook: Blook,
  pack: Pack,
  guaranteeLevel: number,
  dailyGrindCap = 500,
  dupesEnabled = true,
): { tokens: number; packs: number; days: number } {
  if (blook.dropRate <= 0) {
    return { tokens: Infinity, packs: Infinity, days: Infinity };
  }
  if (guaranteeLevel >= 1) {
    return { tokens: Infinity, packs: Infinity, days: Infinity };
  }
  if (guaranteeLevel <= 0) {
    return { tokens: 0, packs: 0, days: 0 };
  }

  const packsNeeded = Math.ceil(
    Math.log(1 - guaranteeLevel) / Math.log(1 - blook.dropRate),
  );
  const costPerPull = dupesEnabled ? pack.effectiveCost : pack.costPerPull;
  const tokens = Math.ceil(packsNeeded * costPerPull);
  const days = dailyGrindCap > 0 ? Math.ceil(tokens / dailyGrindCap) : Infinity;

  return { tokens, packs: packsNeeded, days };
}
