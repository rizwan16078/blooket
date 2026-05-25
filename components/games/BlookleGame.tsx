"use client";

import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/types";

const RARITY_ORDER: Record<Rarity, number> = {
  Common: 0,
  Uncommon: 1,
  Rare: 2,
  Epic: 3,
  Legendary: 4,
  Chroma: 5,
};

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "bg-slate-500/30 text-slate-300",
  Uncommon: "bg-emerald-500/30 text-emerald-300",
  Rare: "bg-sky-500/30 text-sky-300",
  Epic: "bg-violet-500/30 text-violet-300",
  Legendary: "bg-amber-500/30 text-amber-300",
  Chroma: "bg-teal-500/30 text-teal-300",
};

const GAME_BLOOKS = BLOOKS.filter(
  (b) =>
    (b.rarity === "Epic" ||
      b.rarity === "Legendary" ||
      b.rarity === "Chroma") &&
    !b.rotationGroup,
);

function getRandomBlook() {
  return GAME_BLOOKS[Math.floor(Math.random() * GAME_BLOOKS.length)];
}

type Clue = {
  blookId: string;
  name: string;
  imageUrl: string;
  rarity: Rarity;
  packName: string;
  dropRate: number;
  sellValue: number;
};

type ClueResult = {
  clue: Clue;
  rarityMatch: "correct" | "higher" | "lower";
  packMatch: boolean;
  dropRateMatch: "correct" | "higher" | "lower";
  sellValueMatch: "correct" | "higher" | "lower";
};

export default function BlookleGame() {
  const [target, setTarget] = useState(() => getRandomBlook());
  const [guesses, setGuesses] = useState<ClueResult[]>([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState<"win" | "lose" | null>(null);
  const maxGuesses = 6;

  const targetClue: Clue = useMemo(
    () => ({
      blookId: target.id,
      name: target.name,
      imageUrl: target.imageUrl,
      rarity: target.rarity,
      packName: PACK_MAP[target.packId]?.name ?? target.packId,
      dropRate: target.dropRate,
      sellValue: target.sellValue,
    }),
    [target],
  );

  const suggestions = useMemo(() => {
    if (!guess) return [];
    const q = guess.toLowerCase();
    return GAME_BLOOKS.filter(
      (b) =>
        b.name.toLowerCase().includes(q) &&
        !guesses.some((g) => g.clue.blookId === b.id),
    ).slice(0, 6);
  }, [guess, guesses]);

  const handleGuess = useCallback(
    (name?: string) => {
      if (gameOver) return;
      const guessName = (name ?? guess).trim();
      const guessed = GAME_BLOOKS.find(
        (b) => b.name.toLowerCase() === guessName.toLowerCase(),
      );
      if (!guessed) return;

      const clue: Clue = {
        blookId: guessed.id,
        name: guessed.name,
        imageUrl: guessed.imageUrl,
        rarity: guessed.rarity,
        packName: PACK_MAP[guessed.packId]?.name ?? guessed.packId,
        dropRate: guessed.dropRate,
        sellValue: guessed.sellValue,
      };

      const result: ClueResult = {
        clue,
        rarityMatch:
          guessed.rarity === target.rarity
            ? "correct"
            : RARITY_ORDER[guessed.rarity] > RARITY_ORDER[target.rarity]
              ? "higher"
              : "lower",
        packMatch: guessed.packId === target.packId,
        dropRateMatch:
          Math.abs(guessed.dropRate - target.dropRate) < 0.001
            ? "correct"
            : guessed.dropRate > target.dropRate
              ? "higher"
              : "lower",
        sellValueMatch:
          guessed.sellValue === target.sellValue
            ? "correct"
            : guessed.sellValue > target.sellValue
              ? "higher"
              : "lower",
      };

      const newGuesses = [...guesses, result];
      setGuesses(newGuesses);
      setGuess("");

      if (guessed.id === target.id) {
        setGameOver("win");
      } else if (newGuesses.length >= maxGuesses) {
        setGameOver("lose");
      }
    },
    [guess, guesses, target, gameOver],
  );

  const handleNewGame = useCallback(() => {
    setTarget(getRandomBlook());
    setGuesses([]);
    setGuess("");
    setGameOver(null);
  }, []);

  return (
    <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-amber-400">
          Mini Game
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Blookle
        </h1>
        <p className="text-sm text-white/50">
          Guess the blook in 6 tries! Each guess reveals clues about rarity,
          pack, drop rate, and sell value compared to the target.
        </p>
      </section>

      {/* Column Headers */}
      <div className="mt-8 grid grid-cols-5 gap-2 text-center text-[10px] font-bold uppercase tracking-wider text-white/30">
        <span>Blook</span>
        <span>Rarity</span>
        <span>Pack</span>
        <span>Drop Rate</span>
        <span>Sell</span>
      </div>

      {/* Guess History */}
      <div className="mt-2 space-y-2">
        {guesses.map((g, i) => (
          <div
            key={i}
            className="grid grid-cols-5 gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center text-sm"
          >
            {/* Blook */}
            <div className="flex items-center gap-2">
              <Image
                src={g.clue.imageUrl}
                alt={g.clue.name}
                width={32}
                height={32}
                className="rounded"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
              <span className="font-semibold text-white text-xs truncate">
                {g.clue.name}
              </span>
            </div>

            {/* Rarity */}
            <div
              className={cn(
                "flex items-center justify-center rounded-lg px-2 py-1 text-xs font-bold",
                RARITY_COLORS[g.clue.rarity],
                g.rarityMatch === "correct" && "ring-2 ring-emerald-400/50",
              )}
            >
              {g.clue.rarity}
              {g.rarityMatch !== "correct" && (
                <span className="ml-1 text-white/50">
                  {g.rarityMatch === "higher" ? "↓" : "↑"}
                </span>
              )}
            </div>

            {/* Pack */}
            <div
              className={cn(
                "flex items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold",
                g.packMatch
                  ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/50"
                  : "bg-white/[0.04] text-white/50",
              )}
            >
              {g.clue.packName}
            </div>

            {/* Drop Rate */}
            <div
              className={cn(
                "flex items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold",
                g.dropRateMatch === "correct"
                  ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/50"
                  : "bg-white/[0.04] text-white/60",
              )}
            >
              {(g.clue.dropRate * 100).toFixed(2)}%
              {g.dropRateMatch !== "correct" && (
                <span className="ml-1 text-white/40">
                  {g.dropRateMatch === "higher" ? "↓" : "↑"}
                </span>
              )}
            </div>

            {/* Sell Value */}
            <div
              className={cn(
                "flex items-center justify-center rounded-lg px-2 py-1 text-xs font-semibold",
                g.sellValueMatch === "correct"
                  ? "bg-emerald-500/20 text-emerald-300 ring-2 ring-emerald-400/50"
                  : "bg-white/[0.04] text-white/60",
              )}
            >
              {g.clue.sellValue} tkn
              {g.sellValueMatch !== "correct" && (
                <span className="ml-1 text-white/40">
                  {g.sellValueMatch === "higher" ? "↓" : "↑"}
                </span>
              )}
            </div>
          </div>
        ))}

        {/* Empty rows */}
        {Array.from({ length: Math.max(0, maxGuesses - guesses.length) }).map(
          (_, i) => (
            <div
              key={`empty-${i}`}
              className="grid grid-cols-5 gap-2 rounded-xl border border-dashed border-white/[0.08] p-3 text-center"
            >
              {[0, 1, 2, 3, 4].map((j) => (
                <div
                  key={j}
                  className="h-8 rounded-lg bg-white/[0.02]"
                />
              ))}
            </div>
          ),
        )}
      </div>

      {/* Input */}
      {!gameOver && (
        <div className="mt-6 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                placeholder="Guess a blook..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/30 focus:border-amber-400/40 focus:outline-none"
                autoFocus
              />
              {suggestions.length > 0 && guess && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-white/[0.08] bg-[#0a0e1a]/95 backdrop-blur-xl shadow-xl overflow-hidden">
                  {suggestions.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleGuess(b.name)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/[0.04] transition"
                    >
                      <Image
                        src={b.imageUrl}
                        alt={b.name}
                        width={24}
                        height={24}
                        className="rounded"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                      <span className="font-semibold">{b.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleGuess()}
              className="rounded-xl bg-amber-500/20 border border-amber-400/30 px-5 py-3 text-sm font-bold text-amber-300 transition hover:bg-amber-500/30"
            >
              ✓
            </button>
          </div>
        </div>
      )}

      {/* Game Over */}
      {gameOver && (
        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 text-center">
          {gameOver === "win" ? (
            <>
              <p className="text-2xl font-bold text-emerald-400">
                You got it in {guesses.length} {guesses.length === 1 ? "try" : "tries"}!
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Image
                  src={target.imageUrl}
                  alt={target.name}
                  width={64}
                  height={64}
                  className="rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="text-left">
                  <p className="text-lg font-bold text-white">{target.name}</p>
                  <p className="text-sm text-white/50">
                    {target.rarity} · {PACK_MAP[target.packId]?.name} Pack
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-rose-400">
                The blook was...
              </p>
              <div className="mt-4 flex items-center justify-center gap-3">
                <Image
                  src={target.imageUrl}
                  alt={target.name}
                  width={64}
                  height={64}
                  className="rounded-xl"
                  onError={(e) => { e.currentTarget.style.display = "none"; }}
                />
                <div className="text-left">
                  <p className="text-lg font-bold text-white">{target.name}</p>
                  <p className="text-sm text-white/50">
                    {target.rarity} · {PACK_MAP[target.packId]?.name} Pack
                  </p>
                </div>
              </div>
            </>
          )}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={() => {
                const emoji = guesses.map((g) => {
                  const r = g.rarityMatch === "correct" ? "🟩" : "🟥";
                  const p = g.packMatch ? "🟩" : "🟥";
                  const d = g.dropRateMatch === "correct" ? "🟩" : "🟨";
                  const s = g.sellValueMatch === "correct" ? "🟩" : "🟨";
                  return `${r}${p}${d}${s}`;
                }).join("\n");
                const text = `Blookle ${gameOver === "win" ? guesses.length : "X"}/6\n\n${emoji}`;
                navigator.clipboard.writeText(text);
              }}
              className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white/70 transition hover:text-white"
            >
              📋 Share
            </button>
            <button
              onClick={handleNewGame}
              className="rounded-xl bg-gradient-to-r from-amber-500 to-violet-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:brightness-110"
            >
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
