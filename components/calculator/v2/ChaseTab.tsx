"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Crosshair, Search, Share2, X } from "lucide-react";

import {
  RARITY_DESIGN,
  RARITY_ORDER,
  getTokensForGuarantee,
} from "@/lib/blook-probabilities";
import { formatPercent } from "@/lib/math";
import { BLOOKS } from "@/lib/constants";
import { getBlookById, getPackById, type Pack } from "@/lib/packs";
import type { Blook, Rarity } from "@/types";

import { MonoLabel, SubPanel } from "./parts";

const GUARANTEE_LEVELS = [0.5, 0.9, 0.99] as const;

type Props = {
  /** Pre-selected target blook (set when user clicks "Chase This") */
  blookId: string | null;
  dailyCap: number;
  dupesEnabled: boolean;
  onSelectBlook: (blookId: string) => void;
  onClear: () => void;
};

/**
 * Chase tab — answers "how many tokens to guarantee THIS specific blook".
 *
 *  - Searchable picker over all blooks
 *  - 50% / 90% / 99% guarantee table
 *  - Days at user's daily grind cap
 *  - Link back to the blook detail page (SEO equity)
 */
export default function ChaseTab({
  blookId,
  dailyCap,
  dupesEnabled,
  onSelectBlook,
  onClear,
}: Props) {
  const [showShare, setShowShare] = useState(false);

  const blook = blookId ? getBlookById(blookId) : null;

  if (!blook) {
    return <BlookPickerPanel onSelect={onSelectBlook} />;
  }

  const pack = getPackById(blook.packId);
  if (!pack) {
    return <BlookPickerPanel onSelect={onSelectBlook} />;
  }

  const design = RARITY_DESIGN[blook.rarity];
  const guarantees = GUARANTEE_LEVELS.map((level) => ({
    level,
    ...getTokensForGuarantee(blook, pack, level, dailyCap, dupesEnabled),
  }));

  const isMissingArt = !blook.imageUrl || blook.imageUrl === "/icon.svg";

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* ─── Target card ─────────────────────────── */}
      <SubPanel className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <MonoLabel>Target blook</MonoLabel>
          <button
            type="button"
            onClick={onClear}
            aria-label="Pick a different blook"
            className="cyber-mono inline-flex items-center gap-1 text-xs uppercase tracking-wider text-slate-400 transition hover:text-white"
          >
            <X className="h-3 w-3" /> Change
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-white/5">
            {!isMissingArt ? (
              <Image
                src={blook.imageUrl}
                alt={blook.name}
                fill
                sizes="64px"
                className="object-cover"
              />
            ) : (
              <div
                className={`flex h-full w-full items-center justify-center text-sm font-bold uppercase ${design.text}`}
              >
                {blook.name.slice(0, 2)}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <Link
              href={`/blooks/${blook.id}`}
              className="block truncate text-lg font-semibold text-white hover:text-cyan-200 hover:underline"
            >
              {blook.name}
            </Link>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className={`cyber-mono inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wider ${design.badge}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${design.dot}`} />
                {blook.rarity}
              </span>
              <span className="cyber-mono text-[11px] text-slate-400">
                {pack.name} · drop {formatPercent(blook.dropRate)}
              </span>
            </div>
            {blook.rotationGroup ? (
              <p className="mt-2 rounded-md bg-orange-500/10 px-2 py-1 text-[11px] text-orange-300">
                ⚠️ Rotation blook — only active some days. Calculate as if it
                is currently in rotation.
              </p>
            ) : null}
          </div>
        </div>
      </SubPanel>

      {/* ─── Guarantee table ─────────────────────── */}
      <SubPanel className="space-y-3 lg:col-span-2">
        <MonoLabel
          tooltip={`Tokens needed = ⌈log(1 - P) / log(1 - dropRate)⌉ × ${pack.costPerPull} per pack.`}
        >
          Tokens to guarantee
        </MonoLabel>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {guarantees.map((row, i) => {
            const isRecommended = row.level === 0.9;
            return (
              <div
                key={row.level}
                className={`flex flex-col gap-1 rounded-xl border p-3 transition ${
                  isRecommended
                    ? "border-cyan-400/40 bg-cyan-400/[0.05] shadow-[0_0_12px_rgba(34,211,238,0.12)]"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className={`cyber-mono text-xs uppercase tracking-wider ${
                      isRecommended ? "text-cyan-300" : "text-slate-400"
                    }`}
                  >
                    {Math.round(row.level * 100)}% chance
                    {isRecommended ? " · pick" : ""}
                  </span>
                </div>
                <div className="cyber-mono text-2xl font-semibold text-white">
                  {Number.isFinite(row.tokens)
                    ? row.tokens.toLocaleString()
                    : "∞"}
                  <span className="ml-1 text-xs font-normal text-slate-400">
                    tkn
                  </span>
                </div>
                <div className="cyber-mono text-[11px] text-slate-400">
                  {Number.isFinite(row.packs) ? row.packs.toLocaleString() : "∞"}{" "}
                  packs · {Number.isFinite(row.days) ? `${row.days}d` : "∞"}
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400">
          At {dailyCap.toLocaleString()} tokens / day grind cap. Drop rate
          assumes blook is in active rotation.
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          <Link
            href={`/blooks/${blook.id}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            View blook page →
          </Link>
          <Link
            href={pack.route}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            View {pack.name} pack →
          </Link>
          <button
            type="button"
            onClick={() => setShowShare((v) => !v)}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition ${
              showShare
                ? "border-violet-400/40 bg-violet-400/10 text-violet-200"
                : "border-white/10 bg-white/[0.03] text-white hover:border-violet-400/40 hover:text-violet-200"
            }`}
          >
            <Share2 className="h-3.5 w-3.5" />
            Share result
          </button>
        </div>

        {showShare ? (
          <ShareCard
            blook={blook}
            pack={pack}
            guarantees={guarantees}
            dailyCap={dailyCap}
          />
        ) : null}
      </SubPanel>
    </div>
  );
}

/* ─── ShareCard ────────────────────────────────────────────────────── */

function ShareCard({
  blook,
  pack,
  guarantees,
  dailyCap,
}: {
  blook: Blook;
  pack: Pack;
  guarantees: Array<{ level: number; tokens: number; packs: number; days: number }>;
  dailyCap: number;
}) {
  const [copied, setCopied] = useState(false);

  const text = [
    `🎯 Blooket Chase Calculator`,
    ``,
    `Target: ${blook.name} (${blook.rarity})`,
    `Pack: ${pack.name} · ${formatPercent(blook.dropRate)} drop rate`,
    ``,
    `Tokens to guarantee:`,
    ...guarantees.map((g) => {
      const pct = Math.round(g.level * 100);
      const tkn = Number.isFinite(g.tokens) ? g.tokens.toLocaleString() : "∞";
      const pks = Number.isFinite(g.packs) ? g.packs.toLocaleString() : "∞";
      const ds = Number.isFinite(g.days) ? `${g.days}d` : "∞";
      return `• ${pct < 100 ? " " : ""}${pct}% shot → ${tkn} tkn  (${pks} packs · ${ds})`;
    }),
    ``,
    `At ${dailyCap.toLocaleString()} tokens/day · calculatorblooket.com`,
  ].join("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard blocked in some embedded contexts; still give feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.04] p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="cyber-mono text-[10px] uppercase tracking-wider text-slate-500">
          Paste to Discord · Reddit · friends
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className={`cyber-mono inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11px] uppercase tracking-wider transition ${
            copied
              ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
              : "border-violet-400/30 bg-violet-400/[0.06] text-violet-300 hover:border-violet-400/50 hover:text-violet-200"
          }`}
        >
          {copied ? (
            <Check className="h-3 w-3" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="overflow-x-auto rounded-lg bg-black/20 p-3 font-mono text-[11px] leading-relaxed text-slate-300 whitespace-pre-wrap">
        {text}
      </pre>
    </div>
  );
}

/* ─── BlookPickerPanel ─────────────────────────────────────────────── */

function BlookPickerPanel({
  onSelect,
}: {
  onSelect: (blookId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeRarity, setActiveRarity] = useState<Rarity | "all">("all");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return BLOOKS.filter((blook) => {
      if (activeRarity !== "all" && blook.rarity !== activeRarity) return false;
      if (!q) return true;
      return (
        blook.name.toLowerCase().includes(q) ||
        blook.id.toLowerCase().includes(q)
      );
    }).slice(0, 80);
  }, [query, activeRarity]);

  return (
    <div className="space-y-4">
      <SubPanel className="space-y-3">
        <MonoLabel
          tooltip="Search across all 172 blooks. Click one to compute tokens for any guarantee level."
        >
          Pick a blook to chase
        </MonoLabel>

        {/* Search */}
        <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name (e.g. King, Megalodon, Astronaut)"
            className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-slate-400 hover:text-white"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : null}
        </label>

        {/* Rarity filter */}
        <div className="flex flex-wrap gap-1.5">
          {(["all", ...RARITY_ORDER] as const).map((rarity) => {
            const isActive = activeRarity === rarity;
            const design =
              rarity === "all" ? null : RARITY_DESIGN[rarity];
            return (
              <button
                key={rarity}
                type="button"
                onClick={() => setActiveRarity(rarity)}
                className={`cyber-mono rounded-full px-2.5 py-1 text-[11px] uppercase tracking-wider transition ${
                  isActive
                    ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.4)]"
                    : "border border-white/10 bg-white/[0.02] text-slate-400 hover:text-white"
                }`}
              >
                {rarity === "all" ? "All" : design?.label}
              </button>
            );
          })}
        </div>
      </SubPanel>

      {/* Results */}
      <SubPanel>
        <p className="cyber-mono mb-3 text-[11px] uppercase tracking-wider text-slate-400">
          {matches.length === 0
            ? "No blooks match"
            : `${matches.length} match${matches.length === 1 ? "" : "es"}${matches.length === 80 ? " (showing first 80)" : ""}`}
        </p>

        <ul className="grid grid-cols-1 gap-1.5 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((blook) => (
            <PickerRow
              key={blook.id}
              blook={blook}
              onClick={() => onSelect(blook.id)}
            />
          ))}
        </ul>
      </SubPanel>
    </div>
  );
}

function PickerRow({
  blook,
  onClick,
}: {
  blook: Blook;
  onClick: () => void;
}) {
  const design = RARITY_DESIGN[blook.rarity];
  const pack = getPackById(blook.packId);
  const isMissingArt = !blook.imageUrl || blook.imageUrl === "/icon.svg";

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`flex w-full items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-2 text-left transition ${design.hoverBorder} hover:bg-white/[0.04]`}
      >
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/5">
          {!isMissingArt ? (
            <Image
              src={blook.imageUrl}
              alt={blook.name}
              fill
              sizes="36px"
              className="object-cover"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center text-[9px] font-bold uppercase ${design.text}`}
            >
              {blook.name.slice(0, 2)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-medium text-white">
            {blook.name}
          </div>
          <div className="cyber-mono truncate text-[10px] text-slate-400">
            <span className={design.text}>{blook.rarity}</span>
            {pack ? ` · ${pack.name}` : ""} · {formatPercent(blook.dropRate)}
          </div>
        </div>
        <Crosshair className="h-3 w-3 text-slate-500" />
      </button>
    </li>
  );
}
