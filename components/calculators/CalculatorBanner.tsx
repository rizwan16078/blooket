import Link from "next/link";
import { Sparkles } from "lucide-react";

export function CalculatorBanner() {
  return (
    <div className="mb-8 flex items-center justify-between gap-4 rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Sparkles className="h-5 w-5 shrink-0 text-violet-400" />
        <p className="text-sm text-white/80">
          <strong className="text-white">Want all calculators in one place?</strong>{" "}
          Try our main calculator with 7 powerful tools.
        </p>
      </div>
      <Link
        href="/"
        className="shrink-0 rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:scale-105"
      >
        Open →
      </Link>
    </div>
  );
}
