export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Chroma";

export type RarityKey =
  | "common"
  | "uncommon"
  | "rare"
  | "epic"
  | "legendary"
  | "chroma";

export interface Blook {
  id: string;
  packId: string;
  name: string;
  rarity: Rarity;
  dropRate: number;
  sellValue: number;
  rotationGroup?: string;
}

export interface PackRecord {
  id: string;
  name: string;
  costPerPull: number;
  effectiveCost: number;
  isLocked: boolean;
  themeColor: string;
  accent: { from: string; to: string; glow: string };
}

export interface Pack extends PackRecord {
  featuredBlooks: Blook[];
  dropRates: Record<RarityKey, number>;
  avgSellValue: number;
}

export type OddsMetric = "epicPlus" | "legendary" | "chroma";
