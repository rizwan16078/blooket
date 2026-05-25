"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

type Gamemode = "study" | "factory" | "classic" | "gold-quest" | "battle-royale" | "racing";

interface GamemodeData {
  id: Gamemode;
  name: string;
  icon: string;
  tokensPerQuestion: number;
  maxQuestionsPerMin: number;
  description: string;
  tip: string;
}

const GAMEMODES: GamemodeData[] = [
  {
    id: "study",
    name: "Study",
    icon: "📖",
    tokensPerQuestion: 0.5,
    maxQuestionsPerMin: 7,
    description: "Flashcard-style — fastest answering",
    tip: "Use 'All Answers Correct' set + hold the 1 key to auto-answer",
  },
  {
    id: "factory",
    name: "Factory",
    icon: "🏭",
    tokensPerQuestion: 0.3,
    maxQuestionsPerMin: 5,
    description: "Passive income + question bonuses",
    tip: "Upgrade your factory first, then answer for bonus tokens",
  },
  {
    id: "classic",
    name: "Classic",
    icon: "🏆",
    tokensPerQuestion: 0.4,
    maxQuestionsPerMin: 4,
    description: "Standard quiz — moderate pace",
    tip: "Fast answering gives more tokens per minute",
  },
  {
    id: "gold-quest",
    name: "Gold Quest",
    icon: "💰",
    tokensPerQuestion: 0.35,
    maxQuestionsPerMin: 3,
    description: "Chest swapping — variable income",
    tip: "Swap quickly and avoid losing gold to other players",
  },
  {
    id: "battle-royale",
    name: "Battle Royale",
    icon: "⚔️",
    tokensPerQuestion: 0.3,
    maxQuestionsPerMin: 3,
    description: "Last-one-standing — slow but fun",
    tip: "Not ideal for grinding — use Study instead",
  },
  {
    id: "racing",
    name: "Racing",
    icon: "🏎️",
    tokensPerQuestion: 0.35,
    maxQuestionsPerMin: 4,
    description: "Speed quiz — moderate pace",
    tip: "Answer fast to stay ahead of the pack",
  },
];

const DAILY_TOKEN_CAP = 500;

export default function TokenGrinderInteractive() {
  const [selectedMode, setSelectedMode] = useState<Gamemode>("study");
  const [questionsPerMin, setQuestionsPerMin] = useState(7);
  const [targetTokens, setTargetTokens] = useState(500);

  const mode = GAMEMODES.find((m) => m.id === selectedMode)!;

  const result = useMemo(() => {
    const tokensPerMin = mode.tokensPerQuestion * questionsPerMin;
    const minutesNeeded = tokensPerMin > 0 ? Math.ceil(targetTokens / tokensPerMin) : Infinity;
    const questionsNeeded = Math.ceil(targetTokens / mode.tokensPerQuestion);

    return {
      tokensPerMin: tokensPerMin.toFixed(1),
      minutesNeeded,
      questionsNeeded,
      canReachDailyCap: tokensPerMin > 0 && targetTokens <= DAILY_TOKEN_CAP,
    };
  }, [mode, questionsPerMin, targetTokens]);

  const rankedModes = useMemo(() => {
    return [...GAMEMODES]
      .map((m) => ({
        ...m,
        tpm: m.tokensPerQuestion * m.maxQuestionsPerMin,
      }))
      .sort((a, b) => b.tpm - a.tpm);
  }, []);

  return (
    <div className="mx-auto flex-1 w-full max-w-4xl px-4 pb-24 pt-10 sm:px-6">
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
          Calculator
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Token Grinder Calculator
          <span className="mt-2 block text-xl font-medium text-emerald-300">
            Fastest way to earn daily tokens
          </span>
        </h1>
        <p className="max-w-3xl text-base leading-8 text-white/50">
          Estimate the fastest strategy to reach the daily {DAILY_TOKEN_CAP} token cap.
          Pick a gamemode, adjust your answering speed, and see how long it takes.
        </p>
      </section>

      {/* Gamemode Selection */}
      <div className="mt-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
          Select Gamemode
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GAMEMODES.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setSelectedMode(m.id);
                setQuestionsPerMin(m.maxQuestionsPerMin);
              }}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-3 text-left transition",
                selectedMode === m.id
                  ? "border-emerald-400/30 bg-emerald-400/10"
                  : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]",
              )}
            >
              <span className="text-2xl">{m.icon}</span>
              <div>
                <p className={cn(
                  "text-sm font-bold",
                  selectedMode === m.id ? "text-emerald-300" : "text-white",
                )}>
                  {m.name}
                </p>
                <p className="text-[11px] text-white/40">{m.tokensPerQuestion} tkn/q</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Mode Detail */}
      <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
        <div className="flex items-start gap-3">
          <span className="text-3xl">{mode.icon}</span>
          <div className="flex-1">
            <p className="font-bold text-white">{mode.name}</p>
            <p className="text-sm text-white/50">{mode.description}</p>
            <p className="mt-2 text-xs text-emerald-300/80">💡 {mode.tip}</p>
          </div>
        </div>
      </div>

      {/* Sliders */}
      <div className="mt-8 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-white/70">
              Questions per minute
            </label>
            <span className="text-sm font-bold text-emerald-300 tabular-nums">
              {questionsPerMin} q/min
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={mode.maxQuestionsPerMin}
            step={1}
            value={questionsPerMin}
            onChange={(e) => setQuestionsPerMin(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-white/30 mt-1">
            <span>Slow (1)</span>
            <span>Max ({mode.maxQuestionsPerMin})</span>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-white/70">
              Target tokens
            </label>
            <span className="text-sm font-bold text-emerald-300 tabular-nums">
              {targetTokens} tokens
            </span>
          </div>
          <input
            type="range"
            min={50}
            max={500}
            step={50}
            value={targetTokens}
            onChange={(e) => setTargetTokens(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] text-white/30 mt-1">
            <span>50</span>
            <span>Daily cap (500)</span>
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-8 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Tokens/min
          </p>
          <p className="mt-1 text-2xl font-black text-emerald-300 tabular-nums">
            {result.tokensPerMin}
          </p>
        </div>
        <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Time needed
          </p>
          <p className="mt-1 text-2xl font-black text-amber-300 tabular-nums">
            {result.minutesNeeded === Infinity ? "—" : `${result.minutesNeeded}m`}
          </p>
        </div>
        <div className="rounded-xl border border-violet-400/20 bg-violet-400/5 p-4 text-center">
          <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Questions
          </p>
          <p className="mt-1 text-2xl font-black text-violet-300 tabular-nums">
            {result.questionsNeeded === Infinity ? "—" : result.questionsNeeded}
          </p>
        </div>
      </div>

      {/* Mode Ranking */}
      <div className="mt-10">
        <h2 className="text-lg font-bold text-white">Gamemode Speed Ranking</h2>
        <p className="text-sm text-white/40 mt-1">Ranked by max tokens per minute at optimal speed</p>
        <div className="mt-4 space-y-2">
          {rankedModes.map((m, i) => {
            const isTop = i === 0;
            const pct = (m.tpm / rankedModes[0].tpm) * 100;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMode(m.id);
                  setQuestionsPerMin(m.maxQuestionsPerMin);
                }}
                className={cn(
                  "w-full flex items-center gap-3 rounded-xl border p-3 text-left transition",
                  selectedMode === m.id
                    ? "border-emerald-400/30 bg-emerald-400/10"
                    : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]",
                )}
              >
                <span className="text-lg font-black text-white/30 w-6 text-center">
                  {i + 1}
                </span>
                <span className="text-xl">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-white">{m.name}</p>
                    {isTop && (
                      <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                        Fastest
                      </span>
                    )}
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        isTop ? "bg-emerald-400" : "bg-white/20",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-white/60 tabular-nums">
                  {m.tpm.toFixed(1)} tkn/m
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Pro Tips */}
      <div className="mt-10 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
        <h2 className="text-lg font-bold text-white">Pro Tips for Token Grinding</h2>
        <ol className="mt-4 space-y-3 text-sm text-white/60">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">1</span>
            <span>Use an <strong className="text-white/80">All Answers are Correct</strong> question set — you can just spam the answer button without reading.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">2</span>
            <span>Play <strong className="text-white/80">Study</strong> gamemode — it has the fastest question-to-answer loop with no animations between questions.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">3</span>
            <span>On desktop, <strong className="text-white/80">press and hold the &quot;1&quot; key</strong> to auto-answer as fast as the game allows.</span>
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">4</span>
            <span>Using these strategies, many players reach the <strong className="text-white/80">500 daily token cap in under 5 minutes</strong>.</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
