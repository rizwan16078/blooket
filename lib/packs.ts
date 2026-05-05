import {
  BLOOKS,
  PACKS as BASE_PACKS,
  PACK_BLOOKS_MAP,
  PACK_MAP as BASE_PACK_MAP,
  SELL_VALUES,
} from "@/lib/constants";
import type { Blook, PackRecord, Rarity } from "@/types";

export const PACK_IDS = BASE_PACKS.map((pack) => pack.id) as [
  string,
  ...string[],
];

export type PackId = (typeof BASE_PACKS)[number]["id"];
export type PackSlug = PackId;
export type RarityKey =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "chroma";

export type FeaturedBlook = Blook;

export interface Pack extends PackRecord {
  slug: PackId;
  pack: string;
  price: number;
  avgSellValue: number;
  dropRates: Record<RarityKey, number>;
  featuredBlooks: FeaturedBlook[];
  detail: string;
  notes: string[];
}

const RARITY_KEY_MAP: Record<Rarity, RarityKey> = {
  Common: "common",
  Uncommon: "uncommon",
  Rare: "rare",
  Epic: "epic",
  Legendary: "legendary",
  Chroma: "chroma",
};

export const RARITY_SELL_VALUES: Record<RarityKey, number> = {
  common: SELL_VALUES.Common,
  uncommon: SELL_VALUES.Uncommon,
  rare: SELL_VALUES.Rare,
  epic: SELL_VALUES.Epic,
  legendary: SELL_VALUES.Legendary,
  chroma: SELL_VALUES.Chroma,
};

function buildDropRates(blooks: Blook[]) {
  const effectiveBlooks = blooks.filter((blook, index, source) => {
    if (!blook.rotationGroup) {
      return true;
    }

    return source.findIndex(
      (candidate) => candidate.rotationGroup === blook.rotationGroup,
    ) === index;
  });

  const dropRates: Record<RarityKey, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    chroma: 0,
  };

  for (const blook of effectiveBlooks) {
    dropRates[RARITY_KEY_MAP[blook.rarity]] += blook.dropRate;
  }

  return dropRates;
}

function buildAverageSellValue(blooks: Blook[]) {
  const effectiveBlooks = blooks.filter((blook, index, source) => {
    if (!blook.rotationGroup) {
      return true;
    }

    return source.findIndex(
      (candidate) => candidate.rotationGroup === blook.rotationGroup,
    ) === index;
  });

  return Number(
    effectiveBlooks
      .reduce((sum, blook) => sum + blook.dropRate * blook.sellValue, 0)
      .toFixed(3),
  );
}

export const PACKS: Pack[] = BASE_PACKS.map((pack) => {
  const featuredBlooks = PACK_BLOOKS_MAP[pack.id];
  const dropRates = buildDropRates(featuredBlooks);
  const avgSellValue = buildAverageSellValue(featuredBlooks);

  return {
    ...pack,
    slug: pack.id,
    pack: pack.name,
    price: pack.costPerPull,
    dropRates,
    avgSellValue,
    featuredBlooks,
    detail: pack.description,
    notes: [
      pack.isLocked
        ? "Currently marked as locked in the discovery hub."
        : "Currently available in the live discovery hub.",
      `Duplicate sell-back average sits around ${avgSellValue.toFixed(1)} tokens.`,
      `${featuredBlooks.length} blooks are indexed in this pack collection.`,
    ],
  };
});

export const PACK_MAP = Object.fromEntries(
  PACKS.map((pack) => [pack.id, pack]),
) as Record<PackId, Pack>;

export function isPackSlug(value: string): value is PackSlug {
  return BASE_PACKS.some((pack) => pack.id === value);
}

export function getPackBySlug(slug: PackSlug) {
  return PACK_MAP[slug];
}

export function getPackById(packId: PackId) {
  return PACK_MAP[packId];
}

export function getPackRoute(slug: PackSlug, allowRootForSpace = false) {
  if (allowRootForSpace && slug === "space") {
    return "/";
  }

  return BASE_PACK_MAP[slug].route;
}

export function getBlooksForPack(packId: PackId) {
  return PACK_BLOOKS_MAP[packId];
}

export function getBlookById(blookId: string) {
  return BLOOKS.find((blook) => blook.id === blookId);
}
