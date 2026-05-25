"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { BLOOKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Rarity } from "@/types";

const RARITIES: Rarity[] = ["Common", "Uncommon", "Rare", "Epic", "Legendary", "Chroma"];

const RARITY_COLORS: Record<Rarity, string> = {
  Common: "border-slate-400/30 bg-slate-500/10 text-slate-300 hover:bg-slate-500/20",
  Uncommon: "border-emerald-400/30 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20",
  Rare: "border-sky-400/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20",
  Epic: "border-violet-400/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20",
  Legendary: "border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",
  Chroma: "border-teal-400/30 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20",
};

const RARITY_RING: Record<Rarity, string> = {
  Common: "ring-slate-400/50",
  Uncommon: "ring-emerald-400/50",
  Rare: "ring-sky-400/50",
  Epic: "ring-violet-400/50",
  Legendary: "ring-amber-400/50",
  Chroma: "ring-teal-400/50",
};

const ALL_BLOOKS = BLOOKS.filter((b) => !b.rotationGroup);

function getRandomBlook(exclude?: string) {
  const pool = exclude ? ALL_BLOOKS.filter((b) => b.id !== exclude) : ALL_BLOOKS;
  return pool[Math.floor(Math.random() * pool.length)];
}

const ROUND_TIME = 8; // seconds per question

export default function RarityQuizGame() {
  const [currentBlook, setCurrentBlook] = useState(() => getRandomBlook());
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalRounds = 15;

  // Load high score
  useEffect(() => {
    const saved = localStorage.getItem("rarity-quiz-high");
    if (saved) setHighScore(Number(saved) || 0);
  }, []);

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver || feedback) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          // Time's up — wrong answer
          setFeedback("wrong");
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameStarted, gameOver, feedback, round]);

  const handleAnswer = useCallback(
    (rarity: Rarity) => {
      if (feedback || gameOver) return;
      if (timerRef.current) clearInterval(timerRef.current);

      const correct = rarity === currentBlook.rarity;
      if (correct) {
        setScore((s) => s + 1);
      }
      setFeedback(correct ? "correct" : "wrong");

      setTimeout(() => {
        if (round >= totalRounds) {
          setGameOver(true);
          const finalScore = correct ? score + 1 : score;
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem("rarity-quiz-high", String(finalScore));
          }
        } else {
          setRound((r) => r + 1);
          setCurrentBlook(getRandomBlook(currentBlook.id));
          setTimeLeft(ROUND_TIME);
          setFeedback(null);
        }
      }, 1200);
    },
    [feedback, gameOver, currentBlook, round, score, highScore],
  );

  const startGame = useCallback(() => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setRound(1);
    setFeedback(null);
    setTimeLeft(ROUND_TIME);
    setCurrentBlook(getRandomBlook());
  }, []);

  // Pre-game screen
  if (!gameStarted) {
    return (
      <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <section className="space-y-4 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.28em] text-violet-400">
            Mini Game
          </p>
          <h1 className="font-sans text-4xl font-black tracking-wide text-white sm:text-5xl">
            Rarity Quiz
          </h1>
          <p className="text-sm text-white/50 max-w-md mx-auto">
            A blook image appears — pick the correct rarity as fast as you can!
            {totalRounds} rounds, {ROUND_TIME}s each.
          </p>

          {highScore > 0 && (
            <p className="text-sm text-amber-300">
              Your best: {highScore}/{totalRounds}
            </p>
          )}

          <button
            onClick={startGame}
            className="mt-6 rounded-xl bg-gradient-to-r from-violet-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-110 active:scale-[0.97]"
          >
            Start Quiz
          </button>
        </section>
      </div>
    );
  }

  // Game over screen
  if (gameOver) {
    const pct = Math.round((score / totalRounds) * 100);
    return (
      <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-white">Quiz Complete!</h2>
          <div className="text-7xl font-black text-white">{pct}%</div>
          <p className="text-lg text-white/60">
            {score}/{totalRounds} correct
          </p>
          {score === totalRounds && (
            <p className="text-amber-300 font-bold">🏆 Perfect Score!</p>
          )}
          {score >= highScore && score > 0 && (
            <p className="text-emerald-300 text-sm">New high score!</p>
          )}
          <button
            onClick={startGame}
            className="rounded-xl bg-gradient-to-r from-violet-500 to-teal-500 px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:brightness-110"
          >
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex-1 w-full max-w-3xl px-4 pb-24 pt-10 sm:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
            Round {round}/{totalRounds}
          </p>
          <p className="text-lg font-bold text-white">
            Score: <span className="text-emerald-300">{score}</span>
          </p>
        </div>

        {/* Timer */}
        <div
          className={cn(
            "relative flex h-14 w-14 items-center justify-center rounded-full border-2 text-lg font-bold tabular-nums transition-colors",
            timeLeft <= 3
              ? "border-rose-400/50 text-rose-300"
              : "border-white/20 text-white/70",
          )}
        >
          {timeLeft}
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeDasharray={`${(timeLeft / ROUND_TIME) * 150.8} 150.8`}
              className={cn(
                "transition-all duration-1000",
                timeLeft <= 3 ? "text-rose-400/40" : "text-teal-400/40",
              )}
            />
          </svg>
        </div>
      </div>

      {/* Blook Image */}
      <div className="mt-8 flex justify-center">
        <div
          className={cn(
            "relative h-36 w-36 rounded-2xl border-2 overflow-hidden transition-all duration-300",
            feedback === "correct"
              ? "border-emerald-400/50 ring-4 ring-emerald-400/20"
              : feedback === "wrong"
                ? `border-rose-400/50 ring-4 ring-rose-400/20`
                : "border-white/[0.08]",
          )}
        >
          <Image
            src={currentBlook.imageUrl}
            alt="What rarity is this blook?"
            fill
            className="object-contain p-6"
            priority
          />
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mt-3 text-center">
          <p
            className={cn(
              "text-lg font-bold",
              feedback === "correct" ? "text-emerald-400" : "text-rose-400",
            )}
          >
            {feedback === "correct"
              ? "✓ Correct!"
              : `✗ It was ${currentBlook.rarity}`}
          </p>
        </div>
      )}

      {/* Rarity Buttons */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {RARITIES.map((rarity) => (
          <button
            key={rarity}
            onClick={() => handleAnswer(rarity)}
            disabled={!!feedback}
            className={cn(
              "rounded-xl border px-4 py-3 text-sm font-bold transition-all",
              RARITY_COLORS[rarity],
              feedback && rarity === currentBlook.rarity && `ring-2 ${RARITY_RING[rarity]}`,
              feedback && rarity !== currentBlook.rarity && "opacity-40",
            )}
          >
            {rarity}
          </button>
        ))}
      </div>
    </div>
  );
}
