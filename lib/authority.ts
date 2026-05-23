import { BLOOKS, PACK_MAP } from "@/lib/constants";
import {
  calculateAtLeastOneSuccess,
  calculateOpenCount,
  formatPercent,
  getMetricRate,
  type OddsMetric,
} from "@/lib/math";
import { PACKS, type Pack } from "@/lib/packs";
import type { Blook, Rarity } from "@/types";

export type PackMetricRanking = {
  pack: Pack;
  rate: number;
  probabilityAt500: number;
  probabilityAt1000: number;
  opensAt500: number;
};

export function getBlooksByRarity(rarity: Rarity) {
  return BLOOKS.filter((blook) => blook.rarity === rarity).sort((left, right) => {
    if (left.dropRate !== right.dropRate) {
      return left.dropRate - right.dropRate;
    }

    return left.name.localeCompare(right.name);
  });
}

export function getPackMetricRankings(
  metric: OddsMetric,
  dupesEnabled = false,
): PackMetricRanking[] {
  return PACKS.map((pack) => {
    const rate = getMetricRate(pack, metric);
    const opensAt500 = calculateOpenCount(500, pack, dupesEnabled);

    return {
      pack,
      rate,
      probabilityAt500: calculateAtLeastOneSuccess(rate, opensAt500),
      probabilityAt1000: calculateAtLeastOneSuccess(
        rate,
        calculateOpenCount(1000, pack, dupesEnabled),
      ),
      opensAt500,
    };
  }).sort((left, right) => {
    if (right.probabilityAt500 !== left.probabilityAt500) {
      return right.probabilityAt500 - left.probabilityAt500;
    }

    return right.rate - left.rate;
  });
}

export function getLivePacks() {
  return PACKS.filter((pack) => !pack.isLocked);
}

export function getSeasonalPacks() {
  return PACKS.filter((pack) => pack.isLocked);
}

export function getPackForBlook(blook: Blook) {
  return PACK_MAP[blook.packId];
}

export function getRaritySummary(rarity: Rarity) {
  const blooks = getBlooksByRarity(rarity);
  const packs = new Set(blooks.map((blook) => blook.packId));

  return {
    blooks,
    count: blooks.length,
    packCount: packs.size,
    lowestRate: blooks[0]?.dropRate ?? 0,
    highestRate: blooks.at(-1)?.dropRate ?? 0,
  };
}

export function formatRateLabel(rate: number) {
  return formatPercent(rate);
}

