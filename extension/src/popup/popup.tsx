import { render } from "preact";
import { useState } from "preact/hooks";
import "./popup.css";
import { PackOddsCalc } from "../components/PackOddsCalc";
import { ChaseCalc } from "../components/ChaseCalc";
import { TokenGrinder } from "../components/TokenGrinder";
import { BlookValueGuide } from "../components/BlookValueGuide";
import { SimulateTab } from "../components/SimulateTab";

const TABS = [
  { id: "odds" as const, icon: "\u{1F3B2}", label: "Odds", desc: "Pack probability" },
  { id: "sim" as const, icon: "\u{1F3AE}", label: "Sim", desc: "Open packs live" },
  { id: "chase" as const, icon: "\u{1F451}", label: "Chase", desc: "Target a blook" },
  { id: "grind" as const, icon: "\u26A1", label: "Grind", desc: "Token strategy" },
  { id: "value" as const, icon: "\u{1F48E}", label: "Value", desc: "Blook prices" },
];

type TabId = (typeof TABS)[number]["id"];

function openFullCalculator(params?: string) {
  const base = "https://www.calculatorblooket.com/?utm_source=extension&utm_medium=popup&utm_campaign=v1";
  const url = params ? `${base}&${params}` : base;
  chrome.tabs.create({ url });
}

function Popup() {
  const [activeTab, setActiveTab] = useState<TabId>("odds");

  return (
    <div class="w-[400px] min-h-[520px] max-h-[600px] flex flex-col bg-[#0a0e1a] text-white font-sans">
      {/* Header — glass morphism with gradient accent */}
      <header class="glass-panel-rim relative overflow-hidden px-4 py-3">
        {/* Subtle gradient glow behind header */}
        <div class="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 h-16 w-48 rounded-full bg-violet-500/20 blur-2xl" />
        <div class="relative flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-[0_0_12px_rgba(139,92,246,0.5)]">
              <span class="text-sm font-black tracking-tight">B</span>
            </div>
            <div>
              <h1 class="text-sm font-bold leading-none">Blooket Calculator</h1>
              <p class="text-[10px] text-white/40 mt-0.5">by calculatorblooket.com</p>
            </div>
          </div>
          <button
            onClick={() => openFullCalculator()}
            class="rounded-lg p-1.5 text-white/40 hover:bg-white/[0.04] hover:text-white/80 transition-colors"
            title="Open full calculator on web"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </button>
        </div>
      </header>

      {/* Tab bar — pill-style with animated indicator */}
      <nav class="flex gap-1 px-3 pt-3 pb-2">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              class={`group relative flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1 py-2 transition-all duration-200 ${
                isActive
                  ? "bg-white/[0.06] shadow-[0_0_12px_rgba(139,92,246,0.08)]"
                  : "hover:bg-white/[0.03]"
              }`}
            >
              {/* Active indicator dot */}
              {isActive && (
                <span class="absolute -top-0.5 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-violet-400 shadow-[0_0_6px_rgba(139,92,246,0.6)]" />
              )}
              <span class={`text-base transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                {tab.icon}
              </span>
              <span class={`text-[10px] font-semibold leading-none transition-colors ${
                isActive ? "text-white" : "text-white/40 group-hover:text-white/60"
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Content — scrollable area */}
      <main class="flex-1 overflow-y-auto px-4 pb-3">
        <div class="animate-in" key={activeTab}>
          {activeTab === "odds" && <PackOddsCalc />}
          {activeTab === "sim" && <SimulateTab />}
          {activeTab === "chase" && <ChaseCalc />}
          {activeTab === "grind" && <TokenGrinder />}
          {activeTab === "value" && <BlookValueGuide />}
        </div>
      </main>

      {/* Footer — slim CTA */}
      <footer class="border-t border-white/[0.04] px-4 py-2.5">
        <button
          onClick={() => openFullCalculator()}
          class="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_0_12px_rgba(139,92,246,0.25)] hover:shadow-[0_0_18px_rgba(139,92,246,0.4)] active:scale-[0.98] transition-all"
        >
          Open Full Calculator &rarr;
        </button>
      </footer>
    </div>
  );
}

render(<Popup />, document.getElementById("app")!);
