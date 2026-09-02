import { BLOOKS, LAST_UPDATED, PACK_MAP } from "@/lib/constants";
import { siteUrl } from "@/lib/site";
import type { Blook, PackRecord } from "@/types";

/**
 * Shared shape for the public drop-rate dataset served at
 * /blooket-drop-rates.csv and /blooket-drop-rates.json.
 *
 * This exists as an open, licensed, machine-readable download because
 * datasets earn citations and links in a way that an interactive calculator
 * does not — a calculator gets bookmarked, a dataset gets referenced. Every
 * derived column is computed here (not in the route handlers) so the CSV and
 * the JSON can never disagree.
 */

export const DATASET_VERSION = LAST_UPDATED;
export const DATASET_LICENSE_URL = "https://creativecommons.org/licenses/by/4.0/";
export const DATASET_LICENSE_NAME = "CC BY 4.0";
export const DATASET_CSV_PATH = "/blooket-drop-rates.csv";
export const DATASET_JSON_PATH = "/blooket-drop-rates.json";

/** Confidence levels the dataset precomputes "packs needed" for. */
export const GUARANTEE_LEVELS = [0.5, 0.9, 0.99] as const;

/**
 * Packs you must open for at least one hit at the given confidence.
 *
 * n = ceil( ln(1 - confidence) / ln(1 - dropRate) )
 *
 * Deliberately assumes no duplicate-refund discount: refunds depend on which
 * blooks a player already owns, so a single published number could not be
 * reproduced by a reader. The plain figure is the one anyone can verify.
 */
export function packsForConfidence(dropRate: number, confidence: number): number | null {
  if (dropRate <= 0 || dropRate >= 1) return null;
  return Math.ceil(Math.log(1 - confidence) / Math.log(1 - dropRate));
}

export interface DatasetRow {
  pack_id: string;
  pack_name: string;
  pack_cost_tokens: number;
  pack_status: "live" | "locked";
  blook_id: string;
  blook_name: string;
  rarity: string;
  drop_rate_percent: number;
  sell_value_tokens: number;
  packs_for_50pct: number | null;
  packs_for_90pct: number | null;
  packs_for_99pct: number | null;
  tokens_for_90pct: number | null;
  blook_url: string;
  pack_url: string;
}

function toRow(blook: Blook, pack: PackRecord): DatasetRow {
  const p50 = packsForConfidence(blook.dropRate, 0.5);
  const p90 = packsForConfidence(blook.dropRate, 0.9);
  const p99 = packsForConfidence(blook.dropRate, 0.99);

  return {
    pack_id: pack.id,
    pack_name: pack.name,
    pack_cost_tokens: pack.costPerPull,
    pack_status: pack.isLocked ? "locked" : "live",
    blook_id: blook.id,
    blook_name: blook.name,
    rarity: blook.rarity,
    // Rates are stored as fractions; publish percent to 4 dp so the rarest
    // Chromas (0.02%) survive the round-trip instead of flooring to 0.
    drop_rate_percent: Number((blook.dropRate * 100).toFixed(4)),
    sell_value_tokens: blook.sellValue,
    packs_for_50pct: p50,
    packs_for_90pct: p90,
    packs_for_99pct: p99,
    tokens_for_90pct: p90 === null ? null : p90 * pack.costPerPull,
    blook_url: `${siteUrl}/blooks/${blook.id}`,
    pack_url: `${siteUrl}${pack.route}`,
  };
}

export function buildDatasetRows(): DatasetRow[] {
  return BLOOKS.flatMap((blook) => {
    const pack = PACK_MAP[blook.packId as keyof typeof PACK_MAP];
    return pack ? [toRow(blook, pack)] : [];
  });
}

export const DATASET_COLUMNS: Array<{ key: keyof DatasetRow; description: string }> = [
  { key: "pack_id", description: "Stable pack identifier used across the site and API." },
  { key: "pack_name", description: "Display name of the pack, e.g. Spooky." },
  { key: "pack_cost_tokens", description: "Token cost of one pack opening." },
  { key: "pack_status", description: "live if the pack is currently purchasable, otherwise locked." },
  { key: "blook_id", description: "Stable blook identifier, prefixed with its pack id." },
  { key: "blook_name", description: "Display name of the blook." },
  { key: "rarity", description: "Common, Uncommon, Rare, Epic, Legendary or Chroma." },
  { key: "drop_rate_percent", description: "Chance of pulling this blook from one pack, in percent." },
  { key: "sell_value_tokens", description: "Tokens returned when the blook is sold." },
  { key: "packs_for_50pct", description: "Packs needed for a 50% chance of at least one." },
  { key: "packs_for_90pct", description: "Packs needed for a 90% chance of at least one." },
  { key: "packs_for_99pct", description: "Packs needed for a 99% chance of at least one." },
  { key: "tokens_for_90pct", description: "packs_for_90pct multiplied by pack_cost_tokens." },
  { key: "blook_url", description: "Canonical page for this blook." },
  { key: "pack_url", description: "Canonical page for this pack." },
];

function escapeCsv(value: string | number | null): string {
  if (value === null) return "";
  const s = String(value);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildDatasetCsv(rows: DatasetRow[]): string {
  const headers = DATASET_COLUMNS.map((c) => c.key);
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((h) => escapeCsv(row[h])).join(","));
  }
  // Trailing newline: POSIX tools and pandas both prefer it.
  return `${lines.join("\n")}\n`;
}

/** Headline counts shown on the dataset landing page and in its schema. */
export function getDatasetStats(rows: DatasetRow[]) {
  const packs = new Set(rows.map((r) => r.pack_id));
  const rarities = new Set(rows.map((r) => r.rarity));
  return {
    rowCount: rows.length,
    packCount: packs.size,
    rarityCount: rarities.size,
    columnCount: DATASET_COLUMNS.length,
  };
}
