import {
  DEFAULT_DUPE_REFUND,
  DEFAULT_PACK_SLUG,
  DEFAULT_TOKENS,
  clampTokens,
} from "@/lib/odds";
import { isPackSlug, type PackSlug } from "@/lib/packs";

export type SearchParamRecord = Record<
  string,
  string | string[] | undefined
>;

export type InitialCalculatorState = {
  packSlug: PackSlug;
  tokens: number;
  dupeRefund: boolean;
  hasPackParam: boolean;
  hasTokensParam: boolean;
  hasDupeParam: boolean;
};

function getSingleValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

export function parsePackFromSearchParams(
  searchParams: SearchParamRecord,
  fallback = DEFAULT_PACK_SLUG,
) {
  const rawPack = getSingleValue(searchParams.pack);

  if (rawPack && isPackSlug(rawPack)) {
    return rawPack;
  }

  return fallback;
}

export function parseTokensFromSearchParams(searchParams: SearchParamRecord) {
  const rawTokens = getSingleValue(searchParams.tokens);

  if (!rawTokens) {
    return DEFAULT_TOKENS;
  }

  const parsedTokens = Number(rawTokens);
  return clampTokens(parsedTokens);
}

export function parseDupeRefundFromSearchParams(
  searchParams: SearchParamRecord,
) {
  const rawValue = getSingleValue(searchParams.dupe);

  if (!rawValue) {
    return DEFAULT_DUPE_REFUND;
  }

  return rawValue === "1" || rawValue === "true" || rawValue === "on";
}

export function buildInitialCalculatorState(
  searchParams: SearchParamRecord,
  fallbackPackSlug: PackSlug,
) : InitialCalculatorState {
  return {
    packSlug: parsePackFromSearchParams(searchParams, fallbackPackSlug),
    tokens: parseTokensFromSearchParams(searchParams),
    dupeRefund: parseDupeRefundFromSearchParams(searchParams),
    hasPackParam: getSingleValue(searchParams.pack) !== undefined,
    hasTokensParam: getSingleValue(searchParams.tokens) !== undefined,
    hasDupeParam: getSingleValue(searchParams.dupe) !== undefined,
  };
}
