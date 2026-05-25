export type Rarity =
  | "Common"
  | "Uncommon"
  | "Rare"
  | "Epic"
  | "Legendary"
  | "Chroma";

export interface Pack {
  id: string;
  name: string;
  imageUrl: string;
  themeColor: string;
  costPerPull: number;
  effectiveCost: number;
}

export interface Blook {
  id: string;
  packId: string;
  name: string;
  rarity: Rarity;
  dropRate: number;
  imageUrl: string;
  sellValue: number;
  description: string;
  rotationGroup?: string;
}

export interface PackRecord extends Pack {
  route: string;
  isLocked: boolean;
  lastUpdated: string;
  source: string;
  summary: string;
  description: string;
  accent: {
    from: string;
    to: string;
    glow: string;
  };
}

export interface SimulatedLootItem {
  id: string;
  name: string;
  rarity: Rarity;
  imageUrl: string;
}

export interface SimulationWorkerInput {
  pack: Pack;
  blooks: Blook[];
  tokens: number;
  dupesEnabled: boolean;
  targetRarity: Rarity;
}

export interface SimulationWorkerOutput {
  expectedTokens: number;
  p10BestCase: number;
  p90WorstCase: number;
  simulatedRun: SimulatedLootItem[];
  rerunAllowed: boolean;
  rerunCount: number;
  /** How many of the N iterations hit the target rarity at least once */
  targetHitCount: number;
  /** Total iterations run */
  totalIterations: number;
  /** Histogram bins: each entry is [binFloor, count] for refund token distribution */
  histogramBins: [number, number][];
  /** Per-iteration target hit counts (capped at 10 for memory) */
  targetHitsPerIteration: number[];
}
