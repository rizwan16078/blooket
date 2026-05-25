"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import Image from "next/image";
import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/types";

type Difficulty = "easy" | "medium" | "hard" | "expert";

const DIFFICULTY_BLUR: Record<Difficulty, number> = {
  easy: 4,
  medium: 8,
  hard: 14,
  expert: 22,
};

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "text-slate-300",
  Uncommon: "text-emerald-300",
  Rare: "text-sky-300",
  Epic: "text-violet-300",
  Legendary: "text-amber-300",
  Chroma: "text-teal-300",
};

const RARITY_BG: Record<Rarity, string> = {
  Common: "bg-slate-500/20",
  Uncommon: "bg-emerald-500/20",
  Rare: "bg-sky-500/20",
  Epic: "bg-violet-500/20",
  Legendary: "bg-amber-500/20",
  Chroma: "bg-teal-500/20",
};

// Filter to non-common, non-rotation blooks
const GAME_BLOOKS = BLOOKS.filter((b) => b.rarity !== "Common" && !b.rotationGroup);

function getRandomBlook(exclude?: string) {
  const pool = exclude ? GAME_BLOOKS.filter((b) => b.id !== exclude) : GAME_BLOOKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function GuessTheBlookGame() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentBlook, setCurrentBlook] = useState(() => getRandomBlook());
  const [guess, setGuess] = useState("");
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalCorrect, setTotalCorrect] = useState(0);
  const [missed, setMissed] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // Persist stats
  useEffect(() => {
    const saved = localStorage.getItem("guess-the-blook-stats");
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBestStreak(data.bestStreak ?? 0);
        setTotalCorrect(data.totalCorrect ?? 0);
        setMissed(data.missed ?? 0);
      } catch {}
    }
  }, []);

  const saveStats = useCallback(
    (updates: Partial<{ bestStreak: number; totalCorrect: number; missed: number }>) => {
      const data = {
        bestStreak: updates.bestStreak ?? bestStreak,
        totalCorrect: updates.totalCorrect ?? totalCorrect,
        missed: updates.missed ?? missed,
      };
      localStorage.setItem("guess-the-blook-stats", JSON.stringify(data));
    },
    [bestStreak, totalCorrect, missed],
  );

  const suggestions = useMemo(() => {
    if (!guess) return [];
    const q = guess.toLowerCase();
    return GAME_BLOOKS.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 6);
  }, [guess]);

  const handleGuess = useCallback(
    (name?: string) => {
      const answer = (name ?? guess).trim().toLowerCase();
      if (!answer) return;

      if (answer === currentBlook.name.toLowerCase()) {
        const newStreak = streak + 1;
        const newBest = Math.max(bestStreak, newStreak);
        const newTotal = totalCorrect + 1;
        setStreak(newStreak);
        setBestStreak(newBest);
        setTotalCorrect(newTotal);
        setFeedback("correct");
        setRevealed(true);
        saveStats({ bestStreak: newBest, totalCorrect: newTotal });

        setTimeout(() => {
          setCurrentBlook(getRandomBlook(currentBlook.id));
          setGuess("");
          setRevealed(false);
          setFeedback(null);
        }, 1500);
      } else {
        setStreak(0);
        setMissed(missed + 1);
        setFeedback("wrong");
        setRevealed(true);
        saveStats({ missed: missed + 1 });

        setTimeout(() => {
          setFeedback(null);
        }, 2000);
      }
    },
    [guess, currentBlook, streak, bestStreak, totalCorrect, missed, saveStats],
  );

  const handleSkip = useCallback(() => {
    setStreak(0);
    setMissed(missed + 1);
    setRevealed(true);
    saveStats({ missed: missed + 1 });

    setTimeout(() => {
      setCurrentBlook(getRandomBlook(currentBlook.id));
      setGuess("");
      setRevealed(false);
    }, 1500);
  }, [currentBlook, missed, saveStats]);

  const pack = PACK_MAP[currentBlook.packId];

  return (
    <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      <section className="space-y-4">
        <p className="text-xs font-bold uppercase tracking-[0.28em] text-teal-400">
          Mini Game
        </p>
        <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
          Guess the Blook!
        </h1>
        <p className="text-sm text-white/50">
          A blurred blook image is shown — type the name to guess. Harder
          difficulties = more blur.
        </p>
      </section>

      {/* Difficulty */}
      <div className="mt-6 flex items-center gap-2 flex-wrap">
        <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
          Difficulty:
        </span>
        {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => setDifficulty(d)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-semibold capitalize transition",
              difficulty === d
                ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
            )}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Image */}
      <div className="mt-8 flex justify-center">
        <div
          className={cn(
            "relative h-40 w-40 rounded-2xl border border-white/[0.08] bg-white/[0.02] overflow-hidden transition-all duration-500",
            revealed && "border-emerald-400/30",
          )}
        >
          <Image
            src={currentBlook.imageUrl}
            alt={revealed ? currentBlook.name : "Mystery blook"}
            fill
            className="object-contain p-4 transition-all duration-500"
            style={{
              filter: revealed
                ? "none"
                : `blur(${DIFFICULTY_BLUR[difficulty]}px) brightness(0.7)`,
            }}
            priority
          />
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "mt-4 text-center text-lg font-bold",
            feedback === "correct" ? "text-emerald-400" : "text-rose-400",
          )}
        >
          {feedback === "correct"
            ? "✓ Correct!"
            : `✗ It was ${currentBlook.name}`}
        </div>
      )}

      {/* Input */}
      {!revealed && (
        <div className="mt-6 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                placeholder="Enter blook name..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-white placeholder:text-white/30 focus:border-teal-400/40 focus:outline-none"
                autoFocus
              />
              {/* Autocomplete */}
              {suggestions.length > 0 && guess && !revealed && (
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
                      />
                      <span className="font-semibold">{b.name}</span>
                      <span className={cn("ml-auto text-xs", RARITY_COLORS[b.rarity])}>
                        {b.rarity}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleGuess()}
              className="rounded-xl bg-teal-500/20 border border-teal-400/30 px-5 py-3 text-sm font-bold text-teal-300 transition hover:bg-teal-500/30"
            >
              ✓
            </button>
          </div>

          <button
            onClick={handleSkip}
            className="mt-3 w-full rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2 text-sm text-white/50 transition hover:text-white/80"
          >
            Skip →
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Streak", value: streak, color: "text-teal-300" },
          { label: "Best", value: bestStreak, color: "text-amber-300" },
          { label: "Correct", value: totalCorrect, color: "text-emerald-300" },
          { label: "Missed", value: missed, color: "text-rose-300" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"
          >
            <p className="text-xs text-white/40 uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={cn("mt-1 text-2xl font-bold tabular-nums", stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Previous blook info */}
      {revealed && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-3">
            <Image
              src={currentBlook.imageUrl}
              alt={currentBlook.name}
              width={48}
              height={48}
              className="rounded-lg"
            />
            <div>
              <p className="font-bold text-white">{currentBlook.name}</p>
              <p className="text-xs text-white/50">
                <span className={RARITY_COLORS[currentBlook.rarity]}>
                  {currentBlook.rarity}
                </span>
                {" · "}
                {pack?.name} Pack {" · "}
                {(currentBlook.dropRate * 100).toFixed(2)}% drop rate
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
