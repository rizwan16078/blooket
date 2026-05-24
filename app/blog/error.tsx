"use client";

import { AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function BlogError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#080c18] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-red-400/10 flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="w-8 h-8 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-slate-400 mb-6">
          We couldn&apos;t load the blog posts. This might be a temporary issue.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-5 py-2.5 bg-emerald-400 text-emerald-950 font-semibold rounded-lg hover:bg-emerald-300 transition-colors text-sm"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 border border-slate-700 text-slate-300 font-medium rounded-lg hover:text-white hover:border-slate-500 transition-colors text-sm"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
