"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Link2 } from "lucide-react";

import { BLOOKS } from "@/lib/constants";
import { RARITY_DESIGN, RARITY_ORDER } from "@/lib/blook-probabilities";
import type { Blook, Rarity } from "@/types";
import { MonoLabel, SubPanel } from "./parts";

const TIERS = [
  { key: "S", color: "#ef4444" },
  { key: "A", color: "#f97316" },
  { key: "B", color: "#eab308" },
  { key: "C", color: "#22c55e" },
  { key: "D", color: "#3b82f6" },
] as const;

type TierKey = (typeof TIERS)[number]["key"];
type TierState = Partial<Record<TierKey, string[]>>;

function encodeTiers(tiers: TierState): string {
  const parts: string[] = [];
  for (const tier of TIERS) {
    const ids = tiers[tier.key];
    if (ids && ids.length > 0) {
      ids.forEach((id) => parts.push(`${id}:${tier.key}`));
    }
  }
  return parts.join(",");
}

function decodeTiers(encoded: string): TierState {
  const tiers: TierState = {};
  encoded.split(",").forEach((part) => {
    const colonIdx = part.lastIndexOf(":");
    if (colonIdx < 0) return;
    const id = part.slice(0, colonIdx);
    const tier = part.slice(colonIdx + 1) as TierKey;
    if (id && TIERS.some((t) => t.key === tier)) {
      if (!tiers[tier]) tiers[tier] = [];
      tiers[tier]!.push(id);
    }
  });
  return tiers;
}

export default function TierTab() {
  const [tiers, setTiers] = useState<TierState>(() => {
    if (typeof window === "undefined") return {};
    const hash = window.location.hash;
    if (!hash.includes("tiers=")) return {};
    const params = new URLSearchParams(hash.replace(/^#/, ""));
    const encoded = params.get("tiers");
    return encoded ? decodeTiers(encoded) : {};
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [rarityFilter, setRarityFilter] = useState<Rarity | "all">("all");
  const [copied, setCopied] = useState(false);

  // Keep URL hash in sync so share links work
  useEffect(() => {
    const encoded = encodeTiers(tiers);
    const newHash = encoded ? `#tiers=${encoded}` : " ";
    window.history.replaceState(
      null,
      "",
      window.location.pathname + window.location.search + newHash,
    );
  }, [tiers]);

  const rankedIds = useMemo(
    () => new Set(Object.values(tiers).flat()),
    [tiers],
  );

  const poolBlooks = useMemo(() => {
    return BLOOKS.filter((b) => {
      if (rankedIds.has(b.id)) return false;
      if (rarityFilter !== "all" && b.rarity !== rarityFilter) return false;
      return true;
    });
  }, [rankedIds, rarityFilter]);

  const handlePoolClick = useCallback((blook: Blook) => {
    setSelected((prev) => (prev === blook.id ? null : blook.id));
  }, []);

  const handleTierClick = useCallback(
    (tier: TierKey) => {
      if (!selected) return;
      setTiers((prev) => {
        const next: TierState = {};
        for (const t of TIERS) {
          const existing = prev[t.key] ?? [];
          next[t.key] = existing.filter((id) => id !== selected);
        }
        next[tier] = [...(next[tier] ?? []), selected];
        return next;
      });
      setSelected(null);
    },
    [selected],
  );

  const handleRemove = useCallback((tier: TierKey, blookId: string) => {
    setTiers((prev) => ({
      ...prev,
      [tier]: (prev[tier] ?? []).filter((id) => id !== blookId),
    }));
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {
      // Blocked in some embedded contexts
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedBlook = selected ? BLOOKS.find((b) => b.id === selected) : null;

  return (
    <div className="space-y-4">
      {/* Tier rows */}
      <SubPanel className="p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <MonoLabel>
            Blook tier list{" "}
            <span className="text-slate-600 normal-case tracking-normal font-normal">
              — click a blook, then a tier
            </span>
          </MonoLabel>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className={`cyber-mono inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] uppercase tracking-wider transition ${
                copied
                  ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-cyan-400/40 hover:text-cyan-200"
              }`}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Link2 className="h-3 w-3" />
              )}
              {copied ? "Copied!" : "Share link"}
            </button>
            <button
              type="button"
              onClick={() => {
                setTiers({});
                setSelected(null);
              }}
              className="cyber-mono inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] uppercase tracking-wider text-slate-400 transition hover:border-red-500/30 hover:text-red-300"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-white/[0.06]">
          {TIERS.map((tier, i) => (
            <TierRow
              key={tier.key}
              tier={tier}
              blookIds={tiers[tier.key] ?? []}
              canPlace={selected !== null}
              isLast={i === TIERS.length - 1}
              onTierClick={() => handleTierClick(tier.key)}
              onRemove={(id) => handleRemove(tier.key, id)}
            />
          ))}
        </div>
      </SubPanel>

      {/* Pool */}
      <SubPanel className="p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <MonoLabel>
            Unranked pool
            {rankedIds.size > 0 ? (
              <span className="ml-1.5 normal-case tracking-normal font-normal text-slate-500">
                ({rankedIds.size} ranked)
              </span>
            ) : null}
          </MonoLabel>
          <div className="flex flex-wrap gap-1">
            {(["all", ...RARITY_ORDER] as const).map((rarity) => (
              <button
                key={rarity}
                type="button"
                onClick={() => setRarityFilter(rarity)}
                className={`cyber-mono rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider transition ${
                  rarityFilter === rarity
                    ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                    : "border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                {rarity === "all" ? "All" : rarity}
              </button>
            ))}
          </div>
        </div>

        {selectedBlook ? (
          <p className="cyber-mono text-[11px] text-cyan-300">
            Selected:{" "}
            <span className="font-semibold text-white">
              {selectedBlook.name}
            </span>{" "}
            — click a tier letter above to rank it, or click it again to
            deselect.
          </p>
        ) : (
          <p className="cyber-mono text-[11px] text-slate-500">
            Click any blook below to select it, then click a tier to rank it.
          </p>
        )}

        <div className="max-h-56 overflow-y-auto">
          <div className="flex flex-wrap gap-1.5">
            {poolBlooks.map((blook) => (
              <BlookChip
                key={blook.id}
                blook={blook}
                isSelected={selected === blook.id}
                onClick={() => handlePoolClick(blook)}
              />
            ))}
            {poolBlooks.length === 0 ? (
              <p className="w-full py-4 text-center text-sm text-slate-500">
                {rankedIds.size > 0
                  ? "All blooks ranked!"
                  : "No blooks match filter"}
              </p>
            ) : null}
          </div>
        </div>
      </SubPanel>

      <p className="cyber-mono text-center text-[10px] text-slate-600">
        Share link encodes your tier list in the URL · Never leaves your device
      </p>
    </div>
  );
}

/* ─── TierRow ──────────────────────────────────────────────────────── */

function TierRow({
  tier,
  blookIds,
  canPlace,
  isLast,
  onTierClick,
  onRemove,
}: {
  tier: (typeof TIERS)[number];
  blookIds: string[];
  canPlace: boolean;
  isLast: boolean;
  onTierClick: () => void;
  onRemove: (id: string) => void;
}) {
  const blooks = useMemo(
    () =>
      blookIds
        .map((id) => BLOOKS.find((b) => b.id === id))
        .filter(Boolean) as Blook[],
    [blookIds],
  );

  return (
    <div
      className={`flex items-stretch ${!isLast ? "border-b border-white/[0.05]" : ""}`}
    >
      {/* Tier label button */}
      <button
        type="button"
        onClick={onTierClick}
        disabled={!canPlace}
        title={canPlace ? `Place in ${tier.key} tier` : tier.key}
        className={`flex w-12 shrink-0 items-center justify-center text-xl font-black transition select-none ${
          canPlace ? "cursor-pointer hover:brightness-125" : "cursor-default"
        }`}
        style={{
          background: `${tier.color}1a`,
          borderRight: `2px solid ${tier.color}30`,
        }}
      >
        <span style={{ color: tier.color }}>{tier.key}</span>
      </button>

      {/* Drop zone */}
      <div
        role={canPlace ? "button" : undefined}
        tabIndex={canPlace ? 0 : undefined}
        onClick={canPlace ? onTierClick : undefined}
        onKeyDown={
          canPlace
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") onTierClick();
              }
            : undefined
        }
        className={`flex min-h-[52px] flex-1 flex-wrap items-center gap-1.5 px-2.5 py-2 transition ${
          canPlace ? "cursor-pointer" : ""
        }`}
        style={{ background: `${tier.color}08` }}
      >
        {blooks.map((blook) => (
          <RankedBlook
            key={blook.id}
            blook={blook}
            color={tier.color}
            onRemove={(e) => {
              e.stopPropagation();
              onRemove(blook.id);
            }}
          />
        ))}
        {blooks.length === 0 && canPlace ? (
          <span
            className="cyber-mono pl-1 text-[10px]"
            style={{ color: `${tier.color}50` }}
          >
            Drop here
          </span>
        ) : null}
      </div>
    </div>
  );
}

/* ─── RankedBlook ──────────────────────────────────────────────────── */

function RankedBlook({
  blook,
  color,
  onRemove,
}: {
  blook: Blook;
  color: string;
  onRemove: (e: React.MouseEvent) => void;
}) {
  const isMissingArt = !blook.imageUrl || blook.imageUrl === "/icon.svg";
  const design = RARITY_DESIGN[blook.rarity];

  return (
    <div
      className="group relative h-10 w-10 shrink-0 overflow-hidden rounded-lg"
      style={{ border: `1px solid ${color}40`, background: `${color}12` }}
      title={blook.name}
    >
      {!isMissingArt ? (
        <Image
          src={blook.imageUrl}
          alt={blook.name}
          fill
          sizes="40px"
          className="object-contain"
          unoptimized
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center text-[9px] font-bold ${design.text}`}
        >
          {blook.name.slice(0, 2)}
        </div>
      )}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${blook.name}`}
        className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/70 text-xs text-white opacity-0 transition group-hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

/* ─── BlookChip ────────────────────────────────────────────────────── */

function BlookChip({
  blook,
  isSelected,
  onClick,
}: {
  blook: Blook;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isMissingArt = !blook.imageUrl || blook.imageUrl === "/icon.svg";
  const design = RARITY_DESIGN[blook.rarity];

  return (
    <button
      type="button"
      onClick={onClick}
      title={`${blook.name} — ${blook.rarity}`}
      className={`relative h-10 w-10 shrink-0 overflow-hidden rounded-lg transition-all duration-150 ${
        isSelected
          ? "scale-110 ring-2 ring-cyan-400 ring-offset-1 ring-offset-[#0a0e1a]"
          : "border border-white/[0.06] hover:scale-105 hover:border-white/20"
      }`}
    >
      {!isMissingArt ? (
        <Image
          src={blook.imageUrl}
          alt={blook.name}
          fill
          sizes="40px"
          className="object-contain"
          unoptimized
        />
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-white/[0.03] text-[9px] font-bold ${design.text}`}
        >
          {blook.name.slice(0, 2)}
        </div>
      )}
    </button>
  );
}
