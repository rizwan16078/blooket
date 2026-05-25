"use client";

import { useCallback, useRef, useState } from "react";
import { useLocalStorage } from "usehooks-ts";

import { DEFAULT_PACK_SLUG } from "@/lib/math";
import type { PackSlug } from "@/lib/packs";

import ChaseTab from "./ChaseTab";
import PerBlookProbabilities from "./PerBlookProbabilities";
import SimpleOddsView from "./SimpleOddsView";
import SimulateTab from "./SimulateTab";
import StubTab from "./StubTab";
import { GlassPanel } from "./parts";
import { getPackById } from "@/lib/packs";

const TABS = [
  {
    key: "odds",
    icon: "🎯",
    label: "Odds",
    subtitle: "My chances",
    description: "See your probability of pulling each rarity",
  },
  {
    key: "chase",
    icon: "👑",
    label: "Chase",
    subtitle: "Specific blook",
    description: "Calculate tokens needed for a target blook",
  },
  {
    key: "roi",
    icon: "💰",
    label: "ROI",
    subtitle: "Best value",
    description: "Find the most cost-efficient pack",
  },
  {
    key: "compare",
    icon: "⚖️",
    label: "Compare",
    subtitle: "Side-by-side",
    description: "Compare multiple packs at once",
  },
  {
    key: "simulate",
    icon: "🎲",
    label: "Simulate",
    subtitle: "Test pulls",
    description: "Monte Carlo simulation of pack opens",
  },
  {
    key: "collection",
    icon: "📦",
    label: "Collection",
    subtitle: "Complete set",
    description: "Plan to collect all blooks",
    isNew: true,
  },
  {
    key: "grind",
    icon: "⏰",
    label: "Grind",
    subtitle: "Daily plan",
    description: "Calculate days to your goal",
    isNew: true,
  },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const STUB_CONTENT: Record<
  Exclude<TabKey, "odds" | "chase">,
  { title: string; description: string; features: string[] }
> = {
  roi: {
    title: "ROI leaderboard",
    description:
      "Every pack ranked by net return after duplicate sell-backs. Find the best value for your strategy.",
    features: [
      "Ranked leaderboard of all 34 packs",
      "Economic waterfall: spend → dupes → refund → net",
      "Per-rarity expected pull breakdown",
      "Best-value verdict with reasoning",
    ],
  },
  compare: {
    title: "Pack-vs-pack comparison",
    description:
      "Pit up to 4 packs side-by-side across 16 metrics with overlaid chase curves.",
    features: [
      "4-slot pack selector",
      "16-row data matrix with best-cell highlighting",
      "Overlaid chase curves on one chart",
      "Automated verdict + cheapest target",
    ],
  },
  simulate: {
    title: "Monte Carlo simulator",
    description:
      "Run up to 100,000 alternate realities and watch the math play out in real time.",
    features: [
      "1K / 5K / 10K / 100K iteration selector",
      "Live 200-cell sample run visualization",
      "Distribution histogram with mean/P10/P90",
      "Live ticker of recent simulation outcomes",
    ],
  },
  collection: {
    title: "Collection completer",
    description:
      "Track your inventory and math the full cost to complete every pack. Account-aware.",
    features: [
      "Inventory grid: owned vs missing blooks",
      "Total completion cost at 50/90/99% confidence",
      "Multi-curve timeline for each missing blook",
      "Blook Score + badge tier projection",
    ],
  },
  grind: {
    title: "Token & XP grind planner",
    description:
      "Where your tokens actually come from — and how long the grind takes for any goal.",
    features: [
      "8-mode token earning rate matrix",
      "Personalized daily plan with playtime input",
      "XP & level progression projection",
      "Cumulative tokens chart over your grind window",
    ],
  },
};

export default function CalculatorHero() {
  const [activeTab, setActiveTab] = useState<TabKey>("odds");

  // ODDS tab state — persisted across reloads.
  // Default 0 tokens: user adds via + button. Mirrors iBlooket's UX.
  const [packSlug, setPackSlug] = useLocalStorage<PackSlug>(
    "blooket-v2-pack",
    DEFAULT_PACK_SLUG,
    { initializeWithValue: false },
  );
  const [tokens, setTokens] = useLocalStorage<number>("blooket-v2-tokens", 0, {
    initializeWithValue: false,
  });
  const dupesEnabled = false; // Default off — matches iBlooket's default.
  // Users can enable resell mode for a more optimistic (higher) probability.
  const [metric, setMetric] = useLocalStorage<
    "epicPlus" | "legendary" | "chroma"
  >("blooket-v2-metric", "legendary", { initializeWithValue: false });

  // Target blook for the Chase tab — null means picker view
  const [targetBlookId, setTargetBlookId] = useLocalStorage<string | null>(
    "blooket-v2-chase-blook",
    null,
    { initializeWithValue: false },
  );

  const handleChaseBlook = (blookId: string) => {
    setTargetBlookId(blookId);
    setActiveTab("chase");
  };

  // ─── Auto-scroll to the calculator on first interaction ────────────
  // First time the user touches the inputs (pack / tokens / rarity),
  // smooth-scroll the panel to the top of the viewport so they can
  // see the inputs, the live result, AND the per-blook list at once
  // without having to manually scroll.
  const panelRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledRef = useRef(false);
  const focusOnFirstInteraction = useCallback(() => {
    if (hasScrolledRef.current) return;
    hasScrolledRef.current = true;
    panelRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const handlePackChange = useCallback(
    (slug: PackSlug) => {
      focusOnFirstInteraction();
      setPackSlug(slug);
    },
    [focusOnFirstInteraction, setPackSlug],
  );
  const handleTokensChange = useCallback(
    (next: number) => {
      focusOnFirstInteraction();
      setTokens(next);
    },
    [focusOnFirstInteraction, setTokens],
  );
  const handleMetricChange = useCallback(
    (next: "epicPlus" | "legendary" | "chroma") => {
      focusOnFirstInteraction();
      setMetric(next);
    },
    [focusOnFirstInteraction, setMetric],
  );

  const activePack = getPackById(packSlug);

  // ─── Tab partition: 3 primary + the rest under a footer "More tools" row
  const PRIMARY_TAB_KEYS = ["odds", "chase", "simulate"] as const;
  const primaryTabs = TABS.filter((t) =>
    (PRIMARY_TAB_KEYS as readonly string[]).includes(t.key),
  );
  const advancedTabs = TABS.filter(
    (t) => !(PRIMARY_TAB_KEYS as readonly string[]).includes(t.key),
  );

  return (
    <section className="cyber-hero-bg relative isolate overflow-hidden">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        {/* ─── Headline ─────────────────────────────────────── */}
        <h1 className="cyber-display mx-auto mb-2 max-w-3xl text-center text-3xl text-white sm:text-4xl lg:text-5xl">
          Plan{" "}
          <span className="cyber-glow-cyan text-cyan-300">every token</span>{" "}
          before you spend it.
        </h1>
        <p className="mx-auto mb-6 max-w-2xl text-center text-sm text-slate-400 sm:text-base">
          See your chances for every blook before you spend.
        </p>

        {/* ─── Main panel ───────────────────────────────────── */}
        {/* `panelRef` is the scroll target for first-interaction; */}
        {/* `scroll-mt-4` keeps a 16px breathing gap above the panel. */}
        <div ref={panelRef} className="scroll-mt-4">
          <GlassPanel rim className="cyber-rim-glow p-5 sm:p-7 lg:p-8">
          {/* Primary tab bar — only 3 entries now */}
          <div className="mb-4 -mx-2 flex gap-1.5 overflow-x-auto px-2 pb-1">
            {primaryTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  aria-current={isActive ? "page" : undefined}
                  title={tab.description}
                  className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl border px-4 py-3 text-left transition ${
                    isActive
                      ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)]"
                      : "border-white/5 bg-white/[0.015] text-slate-400 hover:border-white/15 hover:text-white"
                  }`}
                >
                  <span aria-hidden className="text-lg leading-none">
                    {tab.icon}
                  </span>
                  <span className="flex flex-col items-start leading-none">
                    <span className="text-sm font-semibold uppercase tracking-wider">
                      {tab.label}
                    </span>
                    <span className="mt-1 hidden text-xs text-slate-500 sm:block">
                      {tab.subtitle}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Active tab */}
          {activeTab === "odds" ? (
            <div className="space-y-5">
              <SimpleOddsView
                packSlug={packSlug}
                tokens={tokens}
                metric={metric}
                dupesEnabled={dupesEnabled}
                onPackChange={handlePackChange}
                onTokensChange={handleTokensChange}
                onMetricChange={handleMetricChange}
              />
              {/* Per-blook chances are always visible now — no tab switch */}
              {tokens > 0 ? (
                <PerBlookProbabilities
                  pack={activePack}
                  tokens={tokens}
                  dupesEnabled={dupesEnabled}
                  onChaseBlook={handleChaseBlook}
                />
              ) : null}
            </div>
          ) : activeTab === "chase" ? (
            <ChaseTab
              blookId={targetBlookId}
              dailyCap={500}
              dupesEnabled={dupesEnabled}
              onSelectBlook={setTargetBlookId}
              onClear={() => setTargetBlookId(null)}
            />
          ) : activeTab === "simulate" ? (
            <SimulateTab
              packSlug={packSlug}
              tokens={tokens}
              dupesEnabled={dupesEnabled}
              metric={metric}
            />
          ) : (
            <StubTab
              title={STUB_CONTENT[activeTab].title}
              description={STUB_CONTENT[activeTab].description}
              features={STUB_CONTENT[activeTab].features}
              onSwitchToOdds={() => setActiveTab("odds")}
            />
          )}

          {/* ─── Advanced tools row ──────────────────────────────────── */}
          <div className="mt-5 border-t border-white/5 pt-4">
            <p className="cyber-mono mb-2 text-[10px] uppercase tracking-[0.24em] text-slate-500">
              Need advanced tools?
            </p>
            <div className="flex flex-wrap gap-1.5">
              {advancedTabs.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    title={tab.description}
                    className={`cyber-mono inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] uppercase tracking-wider transition ${
                      isActive
                        ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                        : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    <span aria-hidden>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
