"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type Gamemode = "study" | "factory" | "classic" | "gold-quest" | "battle-royale" | "racing";

interface GamemodeData {
  id: Gamemode;
  name: string;
  icon: string;
  tokensPerMin: number;
  timeToCap: string;
  questionsToCap: number;
  best: boolean;
}

const GAMEMODES: GamemodeData[] = [
  { id: "study", name: "Study", icon: "📖", tokensPerMin: 220, timeToCap: "~3 min", questionsToCap: 100, best: true },
  { id: "factory", name: "Factory", icon: "🏭", tokensPerMin: 60, timeToCap: "~9 min", questionsToCap: 167, best: false },
  { id: "classic", name: "Classic", icon: "🏆", tokensPerMin: 60, timeToCap: "~9 min", questionsToCap: 125, best: false },
  { id: "racing", name: "Racing", icon: "🏎️", tokensPerMin: 42, timeToCap: "~12 min", questionsToCap: 167, best: false },
  { id: "gold-quest", name: "Gold Quest", icon: "💰", tokensPerMin: 36, timeToCap: "~14 min", questionsToCap: 167, best: false },
  { id: "battle-royale", name: "Battle Royale", icon: "⚔️", tokensPerMin: 30, timeToCap: "~17 min", questionsToCap: 167, best: false },
];

export default function TokenGrinderInteractive() {
  const [selectedMode, setSelectedMode] = useState<Gamemode>("study");
  const mode = GAMEMODES.find((m) => m.id === selectedMode)!;

  return (
    <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      {/* Header */}
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-emerald-400">
          Calculator
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Token Grinder
        </h1>
        <p className="text-base leading-8 text-white/50">
          The fastest way to earn <strong className="text-white">500 daily tokens</strong>.
          Pick a gamemode below to see how long it takes.
        </p>
        <p className="text-base leading-8 text-white/40">
          This calculator estimates the fastest strategy based on tokens per question,
          questions per minute, and gamemode difficulty. By comparing these values, you can
          find the optimal mode to reach the daily 500 token cap as quickly as possible.
        </p>
      </section>

      {/* Best method callout */}
      <div className="mt-8 rounded-2xl border-2 border-emerald-400/30 bg-emerald-400/10 p-5">
        <div className="flex items-center gap-3">
          <span className="text-4xl">📖</span>
          <div>
            <p className="text-lg font-black text-emerald-300">Study Mode = Fastest</p>
            <p className="text-sm text-white/60">
              ~220 tokens/min · Reach the 500 cap in about 3 minutes!
            </p>
          </div>
        </div>
      </div>

      {/* Gamemode cards */}
      <div className="mt-6 space-y-2">
        {GAMEMODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedMode(m.id)}
            className={cn(
              "w-full flex items-center gap-4 rounded-xl border p-4 text-left transition",
              selectedMode === m.id
                ? "border-emerald-400/30 bg-emerald-400/10"
                : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]",
            )}
          >
            <span className="text-3xl">{m.icon}</span>
            <div className="flex-1">
              <p className={cn(
                "font-bold",
                selectedMode === m.id ? "text-emerald-300" : "text-white",
              )}>
                {m.name}
                {m.best && (
                  <span className="ml-2 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                    Best
                  </span>
                )}
              </p>
              <p className="text-sm text-white/50">{m.tokensPerMin} tokens per minute</p>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-lg font-black tabular-nums",
                selectedMode === m.id ? "text-emerald-300" : "text-white/70",
              )}>
                {m.timeToCap}
              </p>
              <p className="text-xs text-white/40">to 500 cap</p>
            </div>
          </button>
        ))}
      </div>

      {/* Selected mode detail */}
      <div className="mt-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <p className="text-sm font-bold text-white">
          {mode.icon} {mode.name} — {mode.questionsToCap} questions to reach 500 tokens
        </p>
      </div>

      {/* How to grind fast */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white">How to Grind Tokens Fast</h2>
        <p className="mt-2 text-base leading-8 text-white/50">
          The fastest way to earn daily Blooket tokens is by playing gamemodes that let you
          answer questions quickly. Study mode and Factory mode are the most efficient because
          there are no long animations between questions.
        </p>
        <p className="mt-3 text-base leading-8 text-white/50">
          Using optimized strategies, many players reach the maximum daily token limit
          in under 5 minutes.
        </p>
      </div>

      {/* Steps */}
      <div className="mt-8 space-y-4">
        <div className="flex gap-4 items-start">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">1</span>
          <div>
            <p className="font-bold text-white">
              Use &quot;All Answers are Correct&quot;{" "}
              <a
                href="https://play.blooket.com/solo?id=69b0b5b8958376ccb0139dd2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300"
              >
                → Play now
              </a>
            </p>
            <p className="text-sm text-white/50">Use an All Answers are Correct question set so you don&apos;t have to read the answers — just click!</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">2</span>
          <div>
            <p className="font-bold text-white">
              Play the &quot;Study&quot; Gamemode{" "}
              <a
                href="https://play.blooket.com/solo?id=69b0b5b8958376ccb0139dd2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300"
              >
                → Play now
              </a>
            </p>
            <p className="text-sm text-white/50">Study mode lets you answer questions the fastest — about 220 tokens per minute!</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-sm font-bold text-emerald-300">3</span>
          <div>
            <p className="font-bold text-white">Press &amp; Hold the &quot;1&quot; Key</p>
            <p className="text-sm text-white/50">On computer, press and hold the 1 key to auto-answer as fast as possible. No need to spam click!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
