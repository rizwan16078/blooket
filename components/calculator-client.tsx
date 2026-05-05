"use client";

import {
  startTransition,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import {
  DEFAULT_SIMULATION_ITERATIONS,
  PRECOMPUTED_PACK_MATH,
  SIMULATIONS_TODAY,
  clampTokens,
  formatCompactNumber,
  formatPercent,
  formatTokens,
  getCalculatorSnapshot,
} from "@/lib/odds";
import { getSimulationTargetRarity } from "@/lib/math";
import {
  PACKS,
  getPackBySlug,
  getPackRoute,
  type Pack,
  type PackSlug,
} from "@/lib/packs";
import type { InitialCalculatorState } from "@/lib/search-params";
import type { SimulationRequest, SimulationResponse } from "@/lib/simulation";

type CalculatorClientProps = {
  contentPack: Pack;
  initialState: InitialCalculatorState;
  pageMode: "root" | "pack";
};

type PersistedState = {
  packSlug: PackSlug;
  tokens: number;
  dupeRefund: boolean;
};

type MetricCardProps = {
  label: string;
  helper: string;
  value: number;
  accent: string;
};

const STORAGE_KEY = "blooket-odds-calculator";

function readPersistedState(): PersistedState | null {
  const stored = window.localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored) as Partial<PersistedState>;
    if (
      parsed.packSlug &&
      PACKS.some((pack) => pack.slug === parsed.packSlug) &&
      typeof parsed.tokens === "number" &&
      typeof parsed.dupeRefund === "boolean"
    ) {
      return {
        packSlug: parsed.packSlug,
        tokens: clampTokens(parsed.tokens),
        dupeRefund: parsed.dupeRefund,
      };
    }
  } catch {}

  return null;
}

function buildQueryString({
  packSlug,
  tokens,
  dupeRefund,
  includePack,
}: {
  packSlug: PackSlug;
  tokens: number;
  dupeRefund: boolean;
  includePack: boolean;
}) {
  const params = new URLSearchParams();

  if (includePack) {
    params.set("pack", packSlug);
  }

  params.set("tokens", String(tokens));
  params.set("dupe", dupeRefund ? "1" : "0");

  return params.toString();
}

function MetricCard({ label, helper, value, accent }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/35">
            {label}
          </p>
          <p className="mt-2 text-2xl font-black text-white">
            {formatPercent(value)}
          </p>
        </div>

        <div
          className="metric-ring"
          style={{
            "--ring-angle": `${value * 360}deg`,
            "--ring-accent": accent,
          } as CSSProperties}
        >
          <span className="text-sm font-black text-white">
            {Math.round(value * 100)}
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-white/40">{helper}</p>
    </div>
  );
}

function CelebrationBurst({ visible }: { visible: boolean }) {
  if (!visible) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
      <div className="confetti-burst">
        {Array.from({ length: 16 }).map((_, index) => (
          <span
            key={index}
            style={{ "--confetti-index": index } as CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}

export default function CalculatorClient({
  contentPack,
  initialState,
  pageMode,
}: CalculatorClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const workerRef = useRef<Worker | null>(null);

  const [selectedPackSlug, setSelectedPackSlug] = useState<PackSlug>(
    initialState.packSlug,
  );
  const [tokens, setTokens] = useState(initialState.tokens);
  const [dupeRefund, setDupeRefund] = useState(initialState.dupeRefund);
  const [isHydrated, setIsHydrated] = useState(false);
  const [simulation, setSimulation] = useState<SimulationResponse | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const selectedPack = getPackBySlug(selectedPackSlug);
  const calculatorSnapshot = getCalculatorSnapshot(
    selectedPackSlug,
    tokens,
    dupeRefund,
  );

  const currentMath = dupeRefund
    ? PRECOMPUTED_PACK_MATH[selectedPackSlug].refunded
    : PRECOMPUTED_PACK_MATH[selectedPackSlug].standard;
  const simulationTargetRarity = getSimulationTargetRarity(selectedPack);

  useEffect(() => {
    const persisted = readPersistedState();

    if (!persisted) {
      queueMicrotask(() => {
        setIsHydrated(true);
      });
      return;
    }

    const resolvedPackSlug =
      pageMode === "pack"
        ? contentPack.slug
        : initialState.hasPackParam
          ? initialState.packSlug
          : persisted.packSlug;
    const resolvedTokens = initialState.hasTokensParam
      ? initialState.tokens
      : persisted.tokens;
    const resolvedDupeRefund = initialState.hasDupeParam
      ? initialState.dupeRefund
      : persisted.dupeRefund;

    queueMicrotask(() => {
      setSelectedPackSlug(resolvedPackSlug);
      setTokens(resolvedTokens);
      setDupeRefund(resolvedDupeRefund);
      setIsHydrated(true);
    });

    if (
      pageMode === "root" &&
      !initialState.hasPackParam &&
      resolvedPackSlug !== initialState.packSlug
    ) {
      const queryString = buildQueryString({
        packSlug: resolvedPackSlug,
        tokens: resolvedTokens,
        dupeRefund: resolvedDupeRefund,
        includePack: true,
      });

      startTransition(() => {
        router.replace(`/?${queryString}`, { scroll: false });
      });
    }
  }, [
    contentPack.slug,
    initialState.dupeRefund,
    initialState.hasDupeParam,
    initialState.hasPackParam,
    initialState.hasTokensParam,
    initialState.packSlug,
    initialState.tokens,
    pageMode,
    router,
  ]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        packSlug: selectedPackSlug,
        tokens,
        dupeRefund,
      } satisfies PersistedState),
    );
  }, [dupeRefund, isHydrated, selectedPackSlug, tokens]);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    const queryString = buildQueryString({
      packSlug: selectedPackSlug,
      tokens,
      dupeRefund,
      includePack: pageMode === "root",
    });

    window.history.replaceState(
      null,
      "",
      queryString ? `${pathname}?${queryString}` : pathname,
    );
  }, [dupeRefund, isHydrated, pageMode, pathname, selectedPackSlug, tokens]);

  useEffect(() => {
    return () => {
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, []);

  const metricCards = [
    {
      label: "Epic+ probability",
      helper: "At least one Epic, Legendary, or Chroma.",
      value: calculatorSnapshot.probabilities.epicPlus,
      accent: "#67e8f9",
    },
    {
      label: "Legendary probability",
      helper: "Exact chance of at least one Legendary.",
      value: calculatorSnapshot.probabilities.legendary,
      accent: "#f59e0b",
    },
    {
      label: "Chroma probability",
      helper:
        selectedPack.dropRates.chroma > 0
          ? "Uses the current community-referenced pack Chroma rate."
          : "No obtainable pack Chroma in the current lineup.",
      value: calculatorSnapshot.probabilities.chroma,
      accent: "#c084fc",
    },
  ] satisfies MetricCardProps[];

  function handleTokenInput(nextValue: string) {
    const numeric = Number(nextValue);
    setTokens(Number.isNaN(numeric) ? 0 : clampTokens(numeric));
  }

  function handlePackSelection(nextSlug: PackSlug) {
    setSelectedPackSlug(nextSlug);
    setSimulation(null);

    const nextPath =
      pageMode === "root" && nextSlug === "space"
        ? "/"
        : getPackRoute(nextSlug);

    const nextQuery = buildQueryString({
      packSlug: nextSlug,
      tokens,
      dupeRefund,
      includePack: nextPath === "/",
    });

    startTransition(() => {
      router.replace(
        nextQuery ? `${nextPath}?${nextQuery}` : nextPath,
        { scroll: false },
      );
    });
  }

  function handleRunSimulation() {
    const request: SimulationRequest = {
      pack: selectedPack,
      blooks: selectedPack.featuredBlooks,
      tokens,
      dupesEnabled: dupeRefund,
      targetRarity: simulationTargetRarity,
    };

    if (!workerRef.current) {
      workerRef.current = new Worker(
        new URL("../workers/simulation.worker.ts", import.meta.url),
      );
    }

    setIsSimulating(true);

    workerRef.current.onmessage = (event: MessageEvent<SimulationResponse>) => {
      setSimulation(event.data);
      setIsSimulating(false);
    };

    workerRef.current.postMessage(request);
  }

  const confettiVisible = metricCards.some((metric) => metric.value >= 0.9995);

  return (
    <section className="relative">
      <CelebrationBurst visible={confettiVisible} />

      <div className="glass-panel relative rounded-[2rem] p-5 sm:p-6">
        <div
          className="absolute inset-x-6 top-0 h-px"
          style={{
            background: `linear-gradient(90deg, transparent, ${selectedPack.accent.glow}, transparent)`,
          }}
        />

        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
              Target Pack
            </p>
            <select
              id="pack"
              className="mt-2 w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-base font-bold text-white outline-none transition focus:border-violet-500/40"
              value={selectedPackSlug}
              onChange={(event) =>
                handlePackSelection(event.target.value as PackSlug)
              }
            >
              {PACKS.map((pack) => (
                <option key={pack.slug} value={pack.slug}>
                  {pack.name} Pack
                </option>
              ))}
            </select>
          </div>

          <div
            className="rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider text-emerald-400"
            style={{
              background: `linear-gradient(135deg, ${selectedPack.accent.from}22, ${selectedPack.accent.to}22)`,
            }}
          >
            {selectedPack.name}
          </div>
        </div>

        <div className="mt-8 space-y-2">
          <h3 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            {formatTokens(tokens)} tokens
          </h3>
          <p className="text-sm text-white/40">
            Deterministic odds on the main thread, Monte Carlo runs off it.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="grid gap-6">
            <div className="flex items-center justify-between gap-4">
              <label
                className="text-sm font-bold uppercase tracking-wider text-white/35"
                htmlFor="token-slider"
              >
                Tokens
              </label>
              <div className="relative">
                <input
                  aria-label="Token input"
                  className="w-36 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-right text-lg font-bold text-white outline-none transition focus:border-violet-500/40"
                  inputMode="numeric"
                  min={0}
                  max={100000}
                  step={25}
                  type="number"
                  value={tokens}
                  onChange={(event) => handleTokenInput(event.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <input
                id="token-slider"
                className="range-track"
                max={5000}
                min={0}
                step={25}
                type="range"
                value={Math.min(tokens, 5000)}
                onChange={(event) => handleTokenInput(event.target.value)}
              />

              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.15em] text-white/30">
                <span>0</span>
                <span className="translate-x-2">2.5k</span>
                <span>5k slider max</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 grid gap-5">
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 shadow-sm">
            <div>
              <p className="text-sm font-bold text-white">Dupe refund</p>
              <p className="mt-1 text-sm text-white/40">
                Uses the precomputed effective cost of
                {" "}
                {selectedPack.effectiveCost.toFixed(3)}
                {" "}
                tokens.
              </p>
            </div>

            <button
              aria-pressed={dupeRefund}
              className={`relative inline-flex h-12 w-20 items-center rounded-full border transition ${
                dupeRefund
                  ? "border-violet-500/30 bg-violet-500/10"
                  : "border-white/[0.08] bg-white/[0.03]"
              }`}
              type="button"
              onClick={() => setDupeRefund((current) => !current)}
            >
              <span
                className={`absolute h-9 w-9 rounded-full bg-violet-500 shadow-lg shadow-violet-500/30 transition ${
                  dupeRefund ? "translate-x-9" : "translate-x-1"
                }`}
              />
              <span className="sr-only">Toggle dupe refund</span>
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {metricCards.map((metric) => (
              <MetricCard key={metric.label} {...metric} />
            ))}
          </div>

          <div className="grid gap-3 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 text-sm text-white/40 shadow-sm sm:grid-cols-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                Estimated opens
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {formatCompactNumber(calculatorSnapshot.attempts, 1)}
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                Cost model
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {currentMath.costsPerBox.toFixed(3)} / box
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                Data freshness
              </p>
              <p className="mt-2 text-lg font-black text-white">
                {selectedPack.lastUpdated}
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-white">
                  Full simulation
                </p>
                <p className="mt-1 text-sm text-white/40">
                  Runs {formatTokens(DEFAULT_SIMULATION_ITERATIONS)} iterations in
                  a web worker and returns only aggregated results.
                </p>
              </div>

              <button
                className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20 transition-all hover:brightness-110 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isSimulating}
                type="button"
                onClick={handleRunSimulation}
              >
                {isSimulating ? "Running Simulation..." : "Run Full Simulation"}
              </button>
            </div>

            <p className="mt-3 text-xs font-bold uppercase tracking-[0.2em] text-white/30">
              Based on {formatTokens(SIMULATIONS_TODAY)} simulations run today
            </p>

            {simulation ? (
              <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                    Expected sell-back
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {formatTokens(simulation.expectedTokens)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                    Simulation target
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {simulationTargetRarity}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                    Iterations
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {formatTokens(DEFAULT_SIMULATION_ITERATIONS)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                    P90 worst case
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {formatTokens(simulation.p90WorstCase)}
                  </p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/30">
                    P10 best case
                  </p>
                  <p className="mt-2 text-lg font-black text-white">
                    {formatTokens(simulation.p10BestCase)}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
