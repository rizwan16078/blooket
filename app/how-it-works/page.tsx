"use client";

import { useState, type CSSProperties } from "react";

const STEPS = [
  {
    number: "01",
    title: "Choose Your Pack",
    description:
      "Select from any available Blooket pack. Each pack has its own independently verified drop rates loaded from our data layer.",
    detail:
      "The calculator loads pack-specific data including price, rarity distribution, and featured Blooks. When you switch packs, the entire probability engine recalculates instantly.",
    accent: "#67e8f9",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Set Your Token Budget",
    description:
      "Use the slider or type directly to set how many tokens you plan to spend. The engine supports budgets from 0 to 100,000 tokens.",
    detail:
      "Your budget is converted into a number of box opens using the pack price (or effective cost when dupe refund is on). This determines n in the binomial formula.",
    accent: "#60a5fa",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" x2="12" y1="2" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Toggle Dupe Refund",
    description:
      "Enable duplicate refund to factor in Blooket's sell-back mechanic. This uses a precomputed effective cost that lowers the price per box.",
    detail:
      "Rather than simulating every duplicate, we precompute the average sell-back value per pull using rarity weights × sell prices. This keeps the main calculator instant while still reflecting economic reality.",
    accent: "#8b5cf6",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
        <path d="M3 3v5h5" />
        <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
        <path d="M16 16h5v5" />
      </svg>
    ),
  },
  {
    number: "04",
    title: "Read Your Exact Odds",
    description:
      "The calculator returns three real-time probabilities: Epic+, Legendary, and Chroma. These are exact — not averages, not simulations.",
    detail:
      "We use P(at least 1) = 1 − (1 − p)^n for each rarity tier. The metric rings, percentages, and all displayed data update synchronously as you change any input.",
    accent: "#f59e0b",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    number: "05",
    title: "Run Full Simulation (Optional)",
    description:
      "For deep analysis, run a Monte Carlo simulation in a web worker. This runs thousands of iterations off the main thread.",
    detail:
      "The simulation returns expected sell-back, P90 worst case, P10 best case, and validated legendary/chroma hit rates — all computed without blocking the UI.",
    accent: "#f472b6",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
        <path d="M12 18v-6" />
        <path d="m9 15 3 3 3-3" />
      </svg>
    ),
  },
];

const FORMULA_STEPS = [
  {
    label: "Per-box drop rate",
    formula: "p = pack.dropRates[rarity]",
    description: "Each rarity tier has a known probability per single box open.",
  },
  {
    label: "Number of opens",
    formula: "n = tokens ÷ costPerBox",
    description:
      "Your token budget divided by the cost per box (face price or effective cost with dupe refund).",
  },
  {
    label: "At least one success",
    formula: "P = 1 − (1 − p)ⁿ",
    description:
      "The exact binomial probability of getting at least one pull of the target rarity.",
  },
];

export default function HowItWorksPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [expandedFormula, setExpandedFormula] = useState<number | null>(null);

  return (
    <main className="relative overflow-hidden">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-12 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[32rem] bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(139,92,246,0.12),transparent)]" />

        <div className="max-w-3xl space-y-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-500/10 border border-violet-500/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-violet-400">
            Under the hood
          </div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            How the Odds Engine Works
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-white/50">
            No black boxes. Every number you see is traceable to a single
            formula. Here&apos;s the complete breakdown.
          </p>
        </div>

        {/* Interactive Step Explorer */}
        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          {/* Step List */}
          <div className="space-y-3">
            {STEPS.map((step, index) => (
              <button
                key={step.number}
                type="button"
                onClick={() => setActiveStep(index)}
                className={`group w-full rounded-xl border p-5 text-left transition-all duration-300 ${
                  activeStep === index
                    ? "border-violet-500/25 bg-white/[0.04] shadow-lg shadow-violet-500/5"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1] hover:bg-white/[0.03]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
                      activeStep === index ? "scale-110" : "opacity-60"
                    }`}
                    style={{
                      background:
                        activeStep === index
                          ? `linear-gradient(135deg, ${step.accent}33, ${step.accent}11)`
                          : "rgba(255,255,255,0.05)",
                      color: activeStep === index ? step.accent : "#94a3b8",
                    }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p
                      className="text-[10px] font-semibold uppercase tracking-[0.24em] transition-colors"
                      style={{
                        color:
                          activeStep === index
                            ? step.accent
                            : "#64748b",
                      }}
                    >
                      Step {step.number}
                    </p>
                    <p
                      className={`mt-1 text-base font-semibold transition-colors ${
                        activeStep === index ? "text-white" : "text-white/60"
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-white/35">
                      {step.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Detail */}
          <div className="lg:sticky lg:top-28">
            <div
              className="glass-panel rounded-[2rem] p-8 transition-all duration-500"
              style={
                {
                  "--step-accent": STEPS[activeStep].accent,
                } as CSSProperties
              }
            >
              <div
                className="absolute inset-x-8 top-0 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${STEPS[activeStep].accent}66, transparent)`,
                }}
              />

              <div className="space-y-6">
                <div
                  className="inline-flex h-16 w-16 items-center justify-center rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${STEPS[activeStep].accent}22, ${STEPS[activeStep].accent}08)`,
                    color: STEPS[activeStep].accent,
                  }}
                >
                  {STEPS[activeStep].icon}
                </div>

                <div>
                  <p
                    className="text-xs font-semibold uppercase tracking-[0.24em]"
                    style={{ color: STEPS[activeStep].accent }}
                  >
                    Step {STEPS[activeStep].number}
                  </p>
                  <h2 className="mt-2 font-sans text-3xl font-black tracking-wide text-white">
                    {STEPS[activeStep].title}
                  </h2>
                </div>

                <p className="text-base leading-8 text-white/40">
                  {STEPS[activeStep].detail}
                </p>

                {/* Progress indicators */}
                <div className="flex gap-2 pt-4">
                  {STEPS.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveStep(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        activeStep === index
                          ? "w-8"
                          : "w-1.5 bg-white/10 hover:bg-white/20"
                      }`}
                      style={{
                        background:
                          activeStep === index
                            ? STEPS[activeStep].accent
                            : undefined,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Formula Section */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <article className="glass-panel rounded-[2rem] p-6 sm:p-8">
          <div className="space-y-2">
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-violet-400">
              The math
            </p>
            <h2 className="font-sans text-3xl font-black tracking-wide text-white sm:text-4xl">
              Binomial probability in three steps
            </h2>
            <p className="max-w-3xl text-base leading-8 text-white/40">
              Every probability in the calculator traces back to this exact
              formula. No approximations, no random sampling for the main
              display.
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FORMULA_STEPS.map((step, index) => (
              <button
                key={step.label}
                type="button"
                onClick={() =>
                  setExpandedFormula(expandedFormula === index ? null : index)
                }
                className={`group rounded-xl border p-6 text-left transition-all ${
                  expandedFormula === index
                    ? "border-violet-500/25 bg-violet-500/[0.06]"
                    : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
                }`}
              >
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/35">
                  {step.label}
                </p>
                <p className="mt-3 font-mono text-xl font-semibold text-violet-400">
                  {step.formula}
                </p>
                <p
                  className={`mt-3 text-sm leading-7 text-white/40 transition-all ${
                    expandedFormula === index
                      ? "max-h-40 opacity-100"
                      : "max-h-0 overflow-hidden opacity-0"
                  }`}
                >
                  {step.description}
                </p>
                <p className="mt-3 text-xs text-violet-400/50 transition group-hover:text-violet-400">
                  {expandedFormula === index ? "Click to collapse" : "Click to expand"}
                </p>
              </button>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
