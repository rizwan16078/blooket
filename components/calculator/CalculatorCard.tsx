"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocalStorage } from "usehooks-ts";

import LootRevealModal from "@/components/loot/LootRevealModal";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { BLOOK_MAP, LOCKED_PACKS, PACKS as ALL_PACKS } from "@/lib/constants";
import {
  CONFETTI_THRESHOLD,
  DEFAULT_DUPE_REFUND,
  DEFAULT_PACK_SLUG,
  DEFAULT_TOKENS,
  MAX_TOKENS,
  MONTE_CARLO_ITERATIONS,
  SLIDER_MAX_TOKENS,
  buildAdvisorLine,
  calculateOpenCount,
  calculatePackProbabilities,
  clampProbability,
  clampTokens,
  formatHumanChance,
  formatPercent,
  formatTokenLabel,
  getBoxCost,
  getSimulationTargetRarity,
} from "@/lib/math";
import { getBlookById, getBlooksForPack, getPackById, type PackSlug } from "@/lib/packs";
import type { SimulationRequest, SimulationResponse } from "@/lib/simulation";

const STORAGE_KEYS = {
  pack: "blooket-hub-pack-id",
  tokens: "blooket-hub-tokens",
  blook: "blooket-hub-blook-id",
  dupes: "blooket-hub-dupes",
} as const;

const HERO_GRID_PACK_IDS = [
  "space",
  "medieval",
  "aquatic",
  "blizzard",
  "lunch",
  "bug",
  "breakfast",
  "bot",
  "safari",
  "dino",
  "wonderland",
  "outback",
  "ice-monster",
] as const;

function toneConfig(probability: number) {
  if (probability >= 0.7) {
    return {
      classes: "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
      dotColor: "bg-emerald-400",
      label: "Lucky range",
      glowColor: "rgba(52, 211, 153, 0.12)",
    };
  }

  if (probability >= 0.3) {
    return {
      classes: "border-amber-500/25 bg-amber-500/10 text-amber-400",
      dotColor: "bg-amber-400",
      label: "Normal range",
      glowColor: "rgba(251, 191, 36, 0.12)",
    };
  }

  return {
    classes: "border-rose-500/25 bg-rose-500/10 text-rose-400",
    dotColor: "bg-rose-400",
    label: "Risk zone",
    glowColor: "rgba(251, 113, 133, 0.12)",
  };
}

function SkeletonValue({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-full bg-white/[0.06] ${className}`} />;
}

function HydrationValue({
  mounted,
  fallback,
  children,
}: {
  mounted: boolean;
  fallback: ReactNode;
  children: ReactNode;
}) {
  return mounted ? <>{children}</> : <>{fallback}</>;
}

function GaugeRing({
  label,
  probability,
  mounted,
  accent,
}: {
  label: string;
  probability: number;
  mounted: boolean;
  accent: string;
}) {
  const safeProbability = clampProbability(probability);
  const radius = 46;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - safeProbability);
  const isHigh = safeProbability >= 0.95;

  return (
    <div className="relative mx-auto h-[7.5rem] w-[7.5rem] shrink-0">
      {/* Ambient glow behind gauge */}
      <div
        className="absolute -inset-3 rounded-full blur-2xl opacity-30 transition-opacity duration-500"
        style={{ background: accent }}
      />

      <svg className="relative h-full w-full -rotate-90" viewBox="0 0 112 112" aria-hidden="true">
        {/* Track */}
        <circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.06)"
          strokeWidth="10"
        />
        {/* Filled arc */}
        <motion.circle
          cx="56"
          cy="56"
          r={radius}
          fill="none"
          stroke={accent}
          strokeLinecap="round"
          strokeWidth="10"
          initial={false}
          animate={{
            strokeDashoffset: mounted ? progressOffset : circumference,
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          style={{ filter: `drop-shadow(0 0 6px ${accent})` }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <HydrationValue
          mounted={mounted}
          fallback={<SkeletonValue className="h-7 w-14" />}
        >
          <span
            className="text-[1.65rem] font-black tabular-nums text-white"
            style={isHigh ? { textShadow: `0 0 18px ${accent}` } : undefined}
          >
            {formatPercent(safeProbability)}
          </span>
        </HydrationValue>
        <span
          className="mt-0.5 text-[10px] font-black uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function OutputPanel({
  label,
  probability,
  mounted,
  accent,
  index,
}: {
  label: string;
  probability: number;
  mounted: boolean;
  accent: string;
  index: number;
}) {
  const tone = toneConfig(probability);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] shadow-lg backdrop-blur-sm"
    >
      {/* Top accent line */}
      <div
        className="h-2 w-full"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Ambient corner glow */}
      <div
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity duration-500 group-hover:opacity-35"
        style={{ background: accent }}
      />

      <div className="relative flex flex-col gap-5 p-5 sm:p-6">
        {/* Gauge */}
        <GaugeRing
          label={label}
          probability={probability}
          mounted={mounted}
          accent={accent}
        />

        {/* Stats below gauge */}
        <div className="space-y-3 text-center">
          {/* Percentage */}
          <HydrationValue
            mounted={mounted}
            fallback={<SkeletonValue className="mx-auto h-8 w-24" />}
          >
            <p className="text-3xl font-black tracking-tight text-white">
              {formatPercent(probability)}
            </p>
          </HydrationValue>

          {/* Human-readable chance */}
          <HydrationValue
            mounted={mounted}
            fallback={<SkeletonValue className="mx-auto h-4 w-32" />}
          >
            <p className="text-sm text-slate-400">{formatHumanChance(probability)}</p>
          </HydrationValue>

          {/* Risk band badge */}
          <HydrationValue
            mounted={mounted}
            fallback={<SkeletonValue className="mx-auto h-6 w-24" />}
          >
            <span
              className={`mx-auto inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] ${tone.classes}`}
            >
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${tone.dotColor}`} />
              {tone.label}
            </span>
          </HydrationValue>
        </div>
      </div>
    </motion.div>
  );
}

function getDuplicateSellValue(run: SimulationResponse["simulatedRun"]) {
  const seenIds = new Set<string>();
  let duplicateSellValue = 0;

  for (const item of run) {
    if (seenIds.has(item.id)) {
      duplicateSellValue += BLOOK_MAP[item.id]?.sellValue ?? 0;
    } else {
      seenIds.add(item.id);
    }
  }

  return duplicateSellValue;
}

function buildQueryString({
  packId,
  tokens,
  blookId,
}: {
  packId: string;
  tokens: number;
  blookId: string | null;
}) {
  const params = new URLSearchParams();
  params.set("pack", packId);
  params.set("tokens", String(tokens));

  if (blookId) {
    params.set("blook", blookId);
  }

  return params.toString();
}

/* ─────────────────────── Pack Card Grid ─────────────────────── */

function PackGridCard({
  pack,
  tokens,
  isSelected,
  onClick,
}: {
  pack: (typeof ALL_PACKS)[number];
  tokens: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  const isAffordable = tokens >= pack.costPerPull;

  return (
    <button
      type="button"
      aria-label={`Select ${pack.name} pack`}
      aria-disabled={!isAffordable}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.03] p-2 text-left shadow-sm transition-all duration-200 ${
        isSelected
          ? "border-violet-500/40 shadow-[0_0_24px_rgba(139,92,246,0.25)]"
          : !isAffordable
            ? "border-white/[0.04] grayscale opacity-70"
            : "border-white/[0.06] cursor-pointer hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-lg"
      }`}
      style={
        isSelected
          ? ({ boxShadow: "0 0 24px rgba(139,92,246,0.25)" } as CSSProperties)
          : undefined
      }
    >
      <div className="rounded-xl bg-white/[0.02] p-2">
        <p className="px-1 pb-2 text-center font-sans text-sm font-black tracking-wide text-white drop-shadow-md">
          {pack.name}
        </p>
        <div className="relative aspect-[0.92] w-full overflow-hidden rounded-xl bg-white/[0.03]">
          <Image
            src={pack.imageUrl}
            alt={`${pack.name} Pack`}
            fill
            sizes="(max-width: 768px) 45vw, 22vw"
            className={`object-cover transition ${
              isSelected
                ? "brightness-110"
                : !isAffordable
                  ? "brightness-50 grayscale"
                  : "brightness-95 group-hover:scale-105"
            }`}
          />

          {!isAffordable && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center gap-1.5 rounded-lg bg-rose-500/80 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Locked
              </span>
            </div>
          )}

          {isSelected && (
            <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-violet-500 shadow-lg shadow-violet-500/30">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
          )}
        </div>
      </div>

      <div className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-2 text-lg font-bold text-white shadow-lg shadow-violet-500/15 transition-all group-hover:brightness-110 group-active:scale-[0.97]">
        <span className="inline-flex size-6 items-center justify-center rounded-full bg-amber-400/80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="10" fill="#facc15" />
            <circle cx="12" cy="12" r="7.5" fill="#fde047" />
            <path d="m12 7 1.4 2.84 3.14.46-2.27 2.21.54 3.13L12 14.2l-2.81 1.48.54-3.13-2.27-2.21 3.14-.46L12 7Z" fill="#fff7b3" />
          </svg>
        </span>
        <span>{pack.costPerPull}</span>
      </div>
    </button>
  );
}

/* ─────────────────────── Main Calculator Card ─────────────────────── */

export default function CalculatorCard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const workerRef = useRef<Worker | null>(null);
  const previousPeakRef = useRef(0);
  const pendingSimulationTokensRef = useRef<number>(DEFAULT_TOKENS);

  const [storedPackId, setStoredPackId] = useLocalStorage<PackSlug>(
    STORAGE_KEYS.pack,
    DEFAULT_PACK_SLUG,
    { initializeWithValue: false },
  );
  const [storedTokens, setStoredTokens] = useLocalStorage<number>(
    STORAGE_KEYS.tokens,
    DEFAULT_TOKENS,
    { initializeWithValue: false },
  );
  const [storedBlookId, setStoredBlookId] = useLocalStorage<string | null>(
    STORAGE_KEYS.blook,
    null,
    { initializeWithValue: false },
  );
  const [dupesEnabled, setDupesEnabled] = useLocalStorage<boolean>(
    STORAGE_KEYS.dupes,
    DEFAULT_DUPE_REFUND,
    { initializeWithValue: false },
  );

  const [mounted, setMounted] = useState(false);
  const [packId, setPackId] = useState<PackSlug>(DEFAULT_PACK_SLUG);
  const [tokens, setTokens] = useState(DEFAULT_TOKENS);
  const [blookId, setBlookId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSelling, setIsSelling] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // Worker lifecycle — create once, terminate on unmount
  useEffect(() => {
    const worker = new Worker(
      new URL("../../workers/simulation.worker.ts", import.meta.url),
    );

    const handleMessage = (event: MessageEvent<SimulationResponse>) => {
      setSimulationResult(event.data);
      setIsSimulating(false);
      setIsSelling(false);
      setModalOpen(true);
    };

    worker.addEventListener("message", handleMessage);
    workerRef.current = worker;

    return () => {
      worker.removeEventListener("message", handleMessage);
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  // One-time hydration from URL / localStorage
  const hasHydratedRef = useRef(false);
  useEffect(() => {
    if (hasHydratedRef.current) {
      return;
    }
    hasHydratedRef.current = true;

    const urlPackId = searchParams.get("pack") || searchParams.get("packId");
    const urlTokens = searchParams.get("tokens");
    const urlBlookId = searchParams.get("blook") || searchParams.get("blookId");

    const nextPackId =
      urlPackId && getPackById(urlPackId as PackSlug)
        ? (urlPackId as PackSlug)
        : storedPackId;
    const nextTokens = urlTokens ? clampTokens(Number(urlTokens)) : clampTokens(storedTokens);
    const nextBlook = urlBlookId ?? storedBlookId;
    const fallbackBlook = nextBlook ? getBlookById(nextBlook) : null;

    setPackId(fallbackBlook?.packId ? (fallbackBlook.packId as PackSlug) : nextPackId);
    setTokens(nextTokens);
    setBlookId(nextBlook);
    setMounted(true);
  }, [searchParams, storedBlookId, storedPackId, storedTokens]);

  const selectedPack = getPackById(packId);
  const selectedPackBlooks = getBlooksForPack(packId);
  const selectedBlook = blookId ? getBlookById(blookId) ?? null : null;
  const normalizedTokens = clampTokens(tokens);
  const targetBlook =
    selectedBlook && selectedBlook.packId === selectedPack.id ? selectedBlook : null;
  const targetRarity = getSimulationTargetRarity(selectedPack, targetBlook);

  const probabilities = useMemo(
    () => calculatePackProbabilities(selectedPack, normalizedTokens, dupesEnabled),
    [dupesEnabled, normalizedTokens, selectedPack],
  );

  const openCount = useMemo(
    () => calculateOpenCount(normalizedTokens, selectedPack, dupesEnabled),
    [dupesEnabled, normalizedTokens, selectedPack],
  );

  const advisorLine = useMemo(
    () => buildAdvisorLine(packId, dupesEnabled),
    [dupesEnabled, packId],
  );

  useEffect(() => {
    if (!mounted) {
      return;
    }

    const queryString = buildQueryString({
      packId,
      tokens: normalizedTokens,
      blookId,
    });

    setStoredPackId(packId);
    setStoredTokens(normalizedTokens);
    setStoredBlookId(blookId);

    router.replace(`${pathname}?${queryString}`, { scroll: false });
  }, [
    blookId,
    mounted,
    normalizedTokens,
    packId,
    pathname,
    router,
    setStoredBlookId,
    setStoredPackId,
    setStoredTokens,
  ]);

  useEffect(() => {
    const highestProbability = Math.max(
      probabilities.epicPlus,
      probabilities.legendary,
      probabilities.chroma,
    );

    if (
      mounted &&
      highestProbability >= CONFETTI_THRESHOLD &&
      previousPeakRef.current < CONFETTI_THRESHOLD
    ) {
      confetti({
        particleCount: 120,
        spread: 72,
        startVelocity: 30,
        scalar: 0.9,
        origin: { y: 0.32 },
      });
    }

    previousPeakRef.current = highestProbability;
  }, [mounted, probabilities]);

  const outputs = [
    {
      key: "epicPlus",
      label: "Epic+",
      probability: probabilities.epicPlus,
      accent: selectedPack.accent.glow,
    },
    {
      key: "legendary",
      label: "Legendary",
      probability: probabilities.legendary,
      accent: "#f59e0b",
    },
    {
      key: "chroma",
      label: "Chroma",
      probability: probabilities.chroma,
      accent: "#2dd4bf",
    },
  ] as const;

  const enginePacks = useMemo(
    () =>
      HERO_GRID_PACK_IDS.map((packId) => ALL_PACKS.find((pack) => pack.id === packId)).filter(
        (pack): pack is (typeof ALL_PACKS)[number] => Boolean(pack),
      ),
    [],
  );

  function triggerSimulation(simulationTokens: number) {
    if (!workerRef.current) {
      return;
    }

    pendingSimulationTokensRef.current = simulationTokens;
    setIsSimulating(true);
    workerRef.current.postMessage({
      pack: selectedPack,
      blooks: selectedPackBlooks,
      tokens: simulationTokens,
      dupesEnabled,
      targetRarity,
    } satisfies SimulationRequest);
  }

  function handleRunSimulation() {
    setSimulationResult(null);
    triggerSimulation(normalizedTokens);
  }

  function handleRerun() {
    if (!simulationResult?.rerunAllowed) {
      return;
    }

    const duplicateSellValue = getDuplicateSellValue(simulationResult.simulatedRun);
    setIsSelling(true);
    setSimulationResult(null);

    window.setTimeout(() => {
      triggerSimulation(normalizedTokens + duplicateSellValue);
    }, 500);
  }

  function handlePackClick(pack: (typeof ALL_PACKS)[number]) {
    if (normalizedTokens < pack.costPerPull) {
      toast({
        variant: "destructive",
        title: "Not enough coins!",
        description: `You need ${pack.costPerPull} coins to open this pack.`,
      });
      return;
    }

    setPackId(pack.id as PackSlug);
    setBlookId(null);
  }

  return (
    <>
      <Card className="mx-auto max-w-6xl rounded-[2rem] border-0 bg-transparent shadow-none ring-0">
        <CardContent className="space-y-8 p-0">
          <section className="space-y-6">
            <div className="space-y-4">
              <HydrationValue
                mounted={mounted}
                fallback={<SkeletonValue className="h-12 w-72" />}
              >
                <p className="font-sans text-5xl font-black tracking-wide text-white drop-shadow-md sm:text-7xl">
                  {formatTokenLabel(normalizedTokens)}
                </p>
              </HydrationValue>

              <p className="font-sans text-base font-black tracking-wide text-white/95 drop-shadow-sm">
                Deterministic odds on the main thread, Monte Carlo runs off it.
              </p>
            </div>

            <div className="space-y-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-white shadow-2xl backdrop-blur-sm sm:p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                  <label htmlFor="token-input" className="text-sm font-bold uppercase tracking-[0.24em] text-white/35">
                    Tokens
                  </label>
                  <input
                    id="token-input"
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={MAX_TOKENS}
                    value={normalizedTokens}
                    onChange={(event) => setTokens(clampTokens(Number(event.target.value)))}
                    className="h-12 w-36 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 text-right text-lg font-bold text-white outline-none transition focus:border-violet-500/40 focus:ring-0"
                  />
                </div>

                <div className="space-y-4">
                  <input
                    id="token-slider"
                    type="range"
                    className="range-track"
                    max={SLIDER_MAX_TOKENS}
                    min={0}
                    step={25}
                    value={Math.min(normalizedTokens, SLIDER_MAX_TOKENS)}
                    onChange={(event) => setTokens(clampTokens(Number(event.target.value)))}
                  />

                  <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.25em] text-white/30">
                    <span>0</span>
                    <span className="translate-x-2">2.5k</span>
                    <span>5k slider max</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-bold uppercase tracking-[0.22em] text-white/35">Active packs</p>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {enginePacks.map((pack) => (
                    <PackGridCard
                      key={pack.id}
                      pack={pack}
                      tokens={normalizedTokens}
                      isSelected={pack.id === selectedPack.id}
                      onClick={() => handlePackClick(pack)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/30">
              Locked seasonal packs live in the discovery grid on /packs.
            </p>
            <div className="flex flex-col gap-4 md:flex-row">
              <button
                type="button"
                onClick={() => {
                  if (targetBlook) {
                    setBlookId(null);
                  }
                }}
                className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-5 text-left text-white shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/[0.12]"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/30">
                  DEEP LINK TARGET
                </p>
                <HydrationValue
                  mounted={mounted}
                  fallback={<SkeletonValue className="mt-3 h-6 w-36" />}
                >
                  <p className="mt-3 font-sans text-2xl font-black tracking-wide text-white">
                    {targetBlook ? targetBlook.name : `Targeting ${targetRarity}`}
                  </p>
                </HydrationValue>
              </button>

              <button
                type="button"
                onClick={() => setDupesEnabled((current) => !current)}
                className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] px-5 py-5 text-left text-white shadow-lg backdrop-blur-sm transition hover:-translate-y-0.5 hover:border-white/[0.12]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-white/30">
                      DUPE ECONOMY
                    </p>
                    <p className="mt-3 font-sans text-2xl font-black tracking-wide text-white">
                      {dupesEnabled ? "Refunds enabled" : "Refunds disabled"}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`mt-1 size-5 rounded-full border-2 ${
                      dupesEnabled
                        ? "border-emerald-500/50 bg-emerald-400 shadow-[0_0_0_4px_rgba(52,211,153,0.2)]"
                        : "border-white/10 bg-white/[0.04]"
                    }`}
                  />
                </div>
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-7">
              <div className="space-y-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-white shadow-2xl backdrop-blur-sm sm:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.28em] text-white/35">
                    Reward Probabilities
                  </p>
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[10px] font-bold tabular-nums text-emerald-400">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-500">
                      <path d="M12 2v20M2 12h20" />
                    </svg>
                    {openCount.toFixed(1)} pulls
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {outputs.map((output, index) => (
                    <OutputPanel
                      key={output.key}
                      label={output.label}
                      probability={output.probability}
                      mounted={mounted}
                      accent={output.accent}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="flex h-full flex-col justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 text-white shadow-2xl backdrop-blur-sm">
                <div className="space-y-3">
                  <p className="font-sans text-xs font-bold uppercase tracking-[0.24em] text-white/35">
                    Advisor
                  </p>
                  <HydrationValue
                    mounted={mounted}
                    fallback={<SkeletonValue className="h-6 w-72" />}
                  >
                    <p className="text-base font-bold text-white">{advisorLine}</p>
                  </HydrationValue>
                  <p className="text-sm text-white/40">
                    Active box cost:
                    {" "}
                    {formatTokenLabel(Math.round(getBoxCost(selectedPack, dupesEnabled)))}
                  </p>
                </div>

                <div className="mt-8 flex flex-1 flex-col justify-end gap-4">
                  <button
                    type="button"
                    onClick={handleRunSimulation}
                    disabled={isSimulating || !mounted}
                    className="inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 text-xl font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 hover:shadow-violet-500/30 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSimulating ? "Running Full Simulation..." : "Run Full Simulation"}
                  </button>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                        Locked Packs
                      </p>
                      <p className="mt-2 text-lg font-black text-white">
                        {LOCKED_PACKS.length}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                        Worker Iterations
                      </p>
                      <p className="mt-2 text-lg font-black text-white">
                        {MONTE_CARLO_ITERATIONS.toLocaleString()}
                      </p>
                    </div>
                    <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/30">
                        Target Rarity
                      </p>
                      <p className="mt-2 text-lg font-black text-white">
                        {targetRarity}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>

      <LootRevealModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        result={simulationResult}
        pack={selectedPack}
        isSelling={isSelling}
        targetBlook={targetBlook}
        targetRarity={targetRarity}
        onRerun={handleRerun}
      />
    </>
  );
}
