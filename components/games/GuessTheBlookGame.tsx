"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { BLOOKS, PACK_MAP } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/types";

type Difficulty = "easy" | "medium" | "hard" | "expert";

const DIFFICULTY_BLUR: Record<Difficulty, number> = {
  easy: 3,
  medium: 8,
  hard: 16,
  expert: 26,
};

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "text-slate-300",
  Uncommon: "text-emerald-300",
  Rare: "text-sky-300",
  Epic: "text-violet-300",
  Legendary: "text-amber-300",
  Chroma: "text-teal-300",
};

const GAME_BLOOKS = BLOOKS.filter((b) => b.rarity !== "Common" && !b.rotationGroup);

function getRandomBlook(exclude?: string) {
  const pool = exclude ? GAME_BLOOKS.filter((b) => b.id !== exclude) : GAME_BLOOKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

function computeElo(current: number, won: boolean, difficulty: Difficulty): number {
  const k = 24;
  const diffMult: Record<Difficulty, number> = { easy: 0.6, medium: 1, hard: 1.5, expert: 2.2 };
  const expected = 1 / (1 + Math.pow(10, (1000 - current) / 400));
  const score = won ? 1 : 0;
  return Math.round(current + k * diffMult[difficulty] * (score - expected));
}

type Stats = {
  bestStreak: number;
  totalCorrect: number;
  missed: number;
  elo: number;
};

export default function GuessTheBlookGame() {
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [currentBlook, setCurrentBlook] = useState(() => getRandomBlook());
  const [guess, setGuess] = useState("");
  const [streak, setStreak] = useState(0);
  const [stats, setStats] = useState<Stats>({
    bestStreak: 0,
    totalCorrect: 0,
    missed: 0,
    elo: 1000,
  });
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentBlur, setCurrentBlur] = useState(DIFFICULTY_BLUR.medium);
  const inputRef = useRef<HTMLInputElement>(null);

  // Persist stats
  useEffect(() => {
    const saved = localStorage.getItem("guess-the-blook-stats-v2");
    if (saved) {
      try { setStats(JSON.parse(saved)); } catch {}
    }
  }, []);

  const saveStats = useCallback((s: Stats) => {
    setStats(s);
    localStorage.setItem("guess-the-blook-stats-v2", JSON.stringify(s));
  }, []);

  const suggestions = useMemo(() => {
    if (!guess) return [];
    const q = guess.toLowerCase();
    return GAME_BLOOKS.filter((b) => b.name.toLowerCase().includes(q)).slice(0, 6);
  }, [guess]);

  const handleGuess = useCallback(
    (name?: string) => {
      const answer = (name ?? guess).trim().toLowerCase();
      if (!answer || revealed) return;

      const won = answer === currentBlook.name.toLowerCase();
      const newElo = computeElo(stats.elo, won, difficulty);

      if (won) {
        const newStreak = streak + 1;
        const newBest = Math.max(stats.bestStreak, newStreak);
        setStreak(newStreak);
        setFeedback("correct");
        setRevealed(true);
        saveStats({ ...stats, bestStreak: newBest, totalCorrect: stats.totalCorrect + 1, elo: newElo });

        setTimeout(() => {
          setCurrentBlook(getRandomBlook(currentBlook.id));
          setGuess("");
          setRevealed(false);
          setFeedback(null);
          setHintsUsed(0);
          setCurrentBlur(DIFFICULTY_BLUR[difficulty]);
          inputRef.current?.focus();
        }, 1800);
      } else {
        setStreak(0);
        setFeedback("wrong");
        setRevealed(true);
        saveStats({ ...stats, missed: stats.missed + 1, elo: newElo });

        setTimeout(() => {
          setCurrentBlook(getRandomBlook(currentBlook.id));
          setGuess("");
          setRevealed(false);
          setFeedback(null);
          setHintsUsed(0);
          setCurrentBlur(DIFFICULTY_BLUR[difficulty]);
          inputRef.current?.focus();
        }, 2500);
      }
    },
    [guess, currentBlook, streak, stats, difficulty, revealed, saveStats],
  );

  const handleSkip = useCallback(() => {
    if (revealed) return;
    const newElo = computeElo(stats.elo, false, difficulty);
    setStreak(0);
    setRevealed(true);
    saveStats({ ...stats, missed: stats.missed + 1, elo: newElo });

    setTimeout(() => {
      setCurrentBlook(getRandomBlook(currentBlook.id));
      setGuess("");
      setRevealed(false);
      setHintsUsed(0);
      setCurrentBlur(DIFFICULTY_BLUR[difficulty]);
      inputRef.current?.focus();
    }, 2000);
  }, [currentBlook, stats, difficulty, revealed, saveStats]);

  const handleHint = useCallback(() => {
    if (revealed || hintsUsed >= 3) return;
    const newBlur = Math.max(1, currentBlur - 4);
    setHintsUsed(hintsUsed + 1);
    setCurrentBlur(newBlur);
  }, [revealed, hintsUsed, currentBlur]);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setCurrentBlur(DIFFICULTY_BLUR[d]);
  }, []);

  const pack = PACK_MAP[currentBlook.packId];

  // Start screen
  if (!started) {
    return (
      <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="text-6xl">🔍</div>
          <h1 className="font-sans text-5xl font-black tracking-wide text-white sm:text-6xl">
            Guess the Blook!
          </h1>
          <p className="max-w-md text-base leading-8 text-white/50">
            A blurred blook image is shown — type the name to guess.
            Harder difficulty = more blur. Use hints to unblur progressively.
          </p>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Difficulty:
            </span>
            {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((d) => (
              <button
                key={d}
                onClick={() => handleDifficultyChange(d)}
                className={cn(
                  "rounded-lg border px-4 py-2 text-sm font-semibold capitalize transition",
                  difficulty === d
                    ? "border-teal-400/40 bg-teal-400/10 text-teal-300"
                    : "border-white/[0.06] bg-white/[0.02] text-white/60 hover:text-white",
                )}
              >
                {d}
              </button>
            ))}
          </div>

          {stats.totalCorrect > 0 && (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-white/40 uppercase">Best Streak</p>
                <p className="text-2xl font-bold text-amber-300">{stats.bestStreak}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase">Correct</p>
                <p className="text-2xl font-bold text-emerald-300">{stats.totalCorrect}</p>
              </div>
              <div>
                <p className="text-xs text-white/40 uppercase">Elo</p>
                <p className="text-2xl font-bold text-violet-300">{stats.elo}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => { setStarted(true); setTimeout(() => inputRef.current?.focus(), 100); }}
            className="rounded-xl bg-gradient-to-r from-teal-500 to-violet-500 px-10 py-4 text-lg font-bold text-white shadow-lg shadow-teal-500/20 transition hover:brightness-110 active:scale-[0.97]"
          >
            Let&apos;s Go!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-6 sm:px-6">
      {/* Compact header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {(["easy", "medium", "hard", "expert"] as Difficulty[]).map((d) => (
            <button
              key={d}
              onClick={() => handleDifficultyChange(d)}
              className={cn(
                "rounded-md px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition",
                difficulty === d
                  ? "bg-teal-400/15 text-teal-300"
                  : "text-white/30 hover:text-white/60",
              )}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="text-white/40">
            Elo: <span className="font-bold text-violet-300">{stats.elo}</span>
          </span>
        </div>
      </div>

      {/* Image — larger */}
      <div className="mt-6 flex justify-center">
        <div
          className={cn(
            "relative h-48 w-48 sm:h-56 sm:w-56 rounded-3xl border-2 overflow-hidden transition-all duration-700",
            feedback === "correct" && "border-emerald-400/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]",
            feedback === "wrong" && "border-rose-400/50 shadow-[0_0_30px_rgba(244,63,94,0.3)]",
            !feedback && !revealed && "border-white/[0.08]",
            revealed && !feedback && "border-amber-400/30",
          )}
        >
          <Image
            src={currentBlook.imageUrl}
            alt={revealed ? currentBlook.name : "Mystery blook"}
            fill
            className="object-contain p-6 transition-all duration-700"
            style={{
              filter: revealed
                ? "none"
                : `blur(${currentBlur}px) brightness(${0.5 + (1 - currentBlur / 30) * 0.4})`,
            }}
            priority
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
          {/* Hint counter overlay */}
          {!revealed && hintsUsed > 0 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white/70 backdrop-blur-sm">
              {hintsUsed}/3 hints
            </div>
          )}
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div
          className={cn(
            "mt-4 text-center",
            feedback === "correct" ? "text-emerald-400" : "text-rose-400",
          )}
        >
          <p className="text-2xl font-black">
            {feedback === "correct" ? "✓ Correct!" : `✗ It was ${currentBlook.name}`}
          </p>
          {feedback === "correct" && (
            <p className="mt-1 text-xs text-white/40">
              +{computeElo(stats.elo, true, difficulty) - stats.elo} Elo
            </p>
          )}
        </div>
      )}

      {/* Input + Actions */}
      {!revealed && (
        <div className="mt-6 relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={inputRef}
                value={guess}
                onChange={(e) => setGuess(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGuess()}
                placeholder="Enter blook name..."
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3.5 text-lg text-white placeholder:text-white/30 focus:border-teal-400/40 focus:outline-none"
                autoFocus
              />
              {/* Autocomplete */}
              {suggestions.length > 0 && guess && (
                <div className="absolute left-0 right-0 top-full z-10 mt-1 rounded-xl border border-white/[0.08] bg-[#0a0e1a]/95 backdrop-blur-xl shadow-xl overflow-hidden">
                  {suggestions.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => handleGuess(b.name)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-white/80 hover:bg-white/[0.04] transition"
                    >
                      <Image src={b.imageUrl} alt={b.name} width={28} height={28} className="rounded" onError={(e) => { e.currentTarget.style.display = "none"; }} />
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
              className="rounded-xl bg-teal-500/20 border border-teal-400/30 px-6 py-3.5 text-lg font-bold text-teal-300 transition hover:bg-teal-500/30"
            >
              ✓
            </button>
          </div>

          {/* Hint + Skip */}
          <div className="mt-3 flex gap-2">
            <button
              onClick={handleHint}
              disabled={hintsUsed >= 3}
              className={cn(
                "flex-1 rounded-xl border px-4 py-2.5 text-sm font-semibold transition",
                hintsUsed >= 3
                  ? "border-white/[0.04] text-white/20 cursor-not-allowed"
                  : "border-amber-400/20 bg-amber-400/5 text-amber-300 hover:bg-amber-400/10",
              )}
            >
              💡 Hint ({3 - hintsUsed} left)
            </button>
            <button
              onClick={handleSkip}
              className="flex-1 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-2.5 text-sm font-semibold text-white/50 transition hover:text-white/80"
            >
              Skip →
            </button>
          </div>
        </div>
      )}

      {/* Stats bar */}
      <div className="mt-8 grid grid-cols-4 gap-2">
        {[
          { label: "Streak", value: streak, color: "text-teal-300" },
          { label: "Best", value: stats.bestStreak, color: "text-amber-300" },
          { label: "Correct", value: stats.totalCorrect, color: "text-emerald-300" },
          { label: "Missed", value: stats.missed, color: "text-rose-300" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3 text-center"
          >
            <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">
              {stat.label}
            </p>
            <p className={cn("mt-1 text-xl font-black tabular-nums", stat.color)}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Reveal card after wrong/skip */}
      {revealed && feedback !== "correct" && (
        <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
          <div className="flex items-center gap-4">
            <Image
              src={currentBlook.imageUrl}
              alt={currentBlook.name}
              width={56}
              height={56}
              className="rounded-xl"
              onError={(e) => { e.currentTarget.style.display = "none"; }}
            />
            <div>
              <p className="text-lg font-bold text-white">{currentBlook.name}</p>
              <p className="text-sm text-white/50">
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
