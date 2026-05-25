"use client";

import { HelpCircle } from "lucide-react";
import type { ReactNode } from "react";

/* ─── Tooltip ────────────────────────────────────────────────────── */

/**
 * Lightweight hover tooltip. Uses CSS group-hover so it works without
 * client JS state. Pair with `position: relative` on parent.
 */
export function Tooltip({
  children,
  content,
  side = "top",
  className = "",
}: {
  children: ReactNode;
  content: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}) {
  const positionClass = {
    top: "bottom-full mb-2 left-1/2 -translate-x-1/2",
    bottom: "top-full mt-2 left-1/2 -translate-x-1/2",
    left: "right-full mr-2 top-1/2 -translate-y-1/2",
    right: "left-full ml-2 top-1/2 -translate-y-1/2",
  }[side];

  return (
    <span className={`group/tip relative inline-flex ${className}`}>
      {children}
      <span
        role="tooltip"
        className={`pointer-events-none absolute z-50 w-max max-w-[220px] rounded-lg border border-cyan-400/30 bg-[#06080f]/95 px-2.5 py-1.5 text-[11px] leading-relaxed text-slate-200 opacity-0 shadow-[0_0_12px_rgba(34,211,238,0.12)] backdrop-blur-md transition group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${positionClass}`}
      >
        {content}
      </span>
    </span>
  );
}

/* ─── Mode Toggle ────────────────────────────────────────────────── */

export type CalculatorMode = "simple" | "pro";

const MODE_OPTIONS = [
  { key: "simple", icon: "⚡", label: "Simple", subtitle: "One answer" },
  { key: "pro", icon: "⚙️", label: "Pro", subtitle: "All controls" },
] as const;

export function ModeToggle({
  value,
  onChange,
}: {
  value: CalculatorMode;
  onChange: (mode: CalculatorMode) => void;
}) {
  return (
    <div className="inline-flex items-center gap-1.5" role="tablist" aria-label="Calculator mode">
      {MODE_OPTIONS.map((option) => {
        const isActive = value === option.key;
        return (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(option.key)}
            className={`group relative flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition ${
              isActive
                ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)]"
                : "border-white/5 bg-white/[0.015] text-slate-400 hover:border-white/15 hover:text-white"
            }`}
          >
            <span aria-hidden className="text-base leading-none">
              {option.icon}
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="text-xs font-semibold uppercase tracking-wider">
                {option.label}
              </span>
              <span className="mt-1 hidden text-[10px] text-slate-500 sm:block">
                {option.subtitle}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Layout primitives ──────────────────────────────────────────── */

export function GlassPanel({
  children,
  className = "",
  rim = false,
}: {
  children: ReactNode;
  className?: string;
  rim?: boolean;
}) {
  return (
    <div
      className={`cyber-glass ${rim ? "cyber-rim-glow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function SubPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`cyber-glass-sub p-5 sm:p-6 ${className}`}>{children}</div>
  );
}

/* ─── Typography ─────────────────────────────────────────────────── */

export function MonoLabel({
  children,
  className = "",
  tooltip,
}: {
  children: ReactNode;
  className?: string;
  tooltip?: ReactNode;
}) {
  return (
    <p
      className={`cyber-mono inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.18em] text-slate-300 ${className}`}
    >
      {children}
      {tooltip ? (
        <Tooltip content={tooltip}>
          <span
            tabIndex={0}
            aria-label="More info"
            className="inline-flex h-3.5 w-3.5 cursor-help items-center justify-center rounded-full text-cyan-400/60 hover:text-cyan-400 focus:text-cyan-400 focus:outline-none"
          >
            <HelpCircle className="h-3 w-3" />
          </span>
        </Tooltip>
      ) : null}
    </p>
  );
}

export function MonoStat({
  label,
  value,
  accent = "cyan",
  className = "",
  tooltip,
}: {
  label: string;
  value: ReactNode;
  accent?: "cyan" | "violet" | "emerald" | "orange" | "white";
  className?: string;
  tooltip?: ReactNode;
}) {
  const colorClass = {
    cyan: "text-cyan-300",
    violet: "text-violet-300",
    emerald: "text-emerald-300",
    orange: "text-orange-300",
    white: "text-white",
  }[accent];
  return (
    <div className={className}>
      <MonoLabel tooltip={tooltip}>{label}</MonoLabel>
      <p className={`cyber-mono mt-1.5 text-xl font-semibold ${colorClass}`}>
        {value}
      </p>
    </div>
  );
}

/* ─── Buttons ────────────────────────────────────────────────────── */

export function CyberCTA({
  children,
  onClick,
  disabled,
  type = "button",
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`cyber-cta px-6 py-3 text-sm uppercase tracking-wider disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export function CyberGhost({
  children,
  onClick,
  className = "",
  active,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cyber-ghost px-4 py-2 text-xs uppercase tracking-wider transition ${
        active ? "ring-1 ring-cyan-400/50 bg-cyan-400/10" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
}

/* ─── Confidence Pills ───────────────────────────────────────────── */

export function ConfidencePill({
  confidence,
  packs,
  tokens,
  days,
  highlighted = false,
}: {
  confidence: number;
  packs: number;
  tokens: number;
  days: number;
  highlighted?: boolean;
}) {
  return (
    <div
      className={`cyber-mono flex flex-col gap-1 rounded-xl border px-3 py-2.5 text-[11px] transition ${
        highlighted
          ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-200 shadow-[0_0_12px_rgba(34,211,238,0.12)]"
          : "border-white/10 bg-white/[0.02] text-slate-300"
      }`}
    >
      <div className="text-xs font-semibold tracking-wider text-white">
        {Math.round(confidence * 100)}%
      </div>
      <div className="text-[11px] text-slate-400">
        {Number.isFinite(packs) ? packs.toLocaleString() : "∞"} packs
      </div>
      <div className="text-[11px] text-slate-400">
        {Number.isFinite(tokens) ? tokens.toLocaleString() : "—"} tkn ·{" "}
        {Number.isFinite(days) ? `${days}d` : "—"}
      </div>
    </div>
  );
}

/* ─── Chase Curve SVG chart ──────────────────────────────────────── */

export function ChaseCurve({
  points,
  height = 160,
  marker,
  className = "",
}: {
  points: Array<{ packs: number; probability: number }>;
  height?: number;
  marker?: { packs: number; label?: string };
  className?: string;
}) {
  if (points.length < 2) {
    return (
      <div
        className={`cyber-mono flex items-center justify-center text-xs text-slate-400 ${className}`}
        style={{ height }}
      >
        Insufficient data
      </div>
    );
  }

  const width = 1000;
  const maxX = points[points.length - 1].packs;
  const padX = 24;
  const padY = 12;

  const sx = (x: number) =>
    padX + ((width - 2 * padX) * x) / Math.max(1, maxX);
  const sy = (y: number) => height - padY - (height - 2 * padY) * y;

  const pathLine = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${sx(point.packs).toFixed(1)} ${sy(point.probability).toFixed(1)}`,
    )
    .join(" ");

  const pathFill =
    `M ${sx(0).toFixed(1)} ${sy(0).toFixed(1)} ` +
    points
      .map((p) => `L ${sx(p.packs).toFixed(1)} ${sy(p.probability).toFixed(1)}`)
      .join(" ") +
    ` L ${sx(maxX).toFixed(1)} ${sy(0).toFixed(1)} Z`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`block h-auto w-full ${className}`}
      style={{ maxHeight: height }}
    >
      <defs>
        <linearGradient id="curveFill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((y) => (
        <line
          key={y}
          x1={padX}
          x2={width - padX}
          y1={sy(y)}
          y2={sy(y)}
          stroke="rgba(34,211,238,0.06)"
          strokeWidth={1}
        />
      ))}
      <path d={pathFill} fill="url(#curveFill)" />
      <path
        d={pathLine}
        fill="none"
        stroke="#22d3ee"
        strokeWidth={2}
        style={{ filter: "drop-shadow(0 0 6px rgba(34,211,238,0.6))" }}
      />
      {marker && Number.isFinite(marker.packs) ? (
        <g>
          <line
            x1={sx(marker.packs)}
            x2={sx(marker.packs)}
            y1={padY}
            y2={height - padY}
            stroke="rgba(34,211,238,0.5)"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          <circle
            cx={sx(marker.packs)}
            cy={sy(
              points.find((p) => p.packs >= marker.packs)?.probability ?? 0,
            )}
            r={4}
            fill="#22d3ee"
            style={{ filter: "drop-shadow(0 0 8px rgba(34,211,238,0.9))" }}
          />
        </g>
      ) : null}
    </svg>
  );
}

/* ─── Rarity Donut ───────────────────────────────────────────────── */

export function RarityDonut({
  data,
  centerLabel,
  size = 140,
}: {
  data: Array<{ key: string; value: number; color: string }>;
  centerLabel?: ReactNode;
  size?: number;
}) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0);
  if (total <= 0) return null;
  const radius = size / 2;
  const stroke = size * 0.18;
  const innerR = radius - stroke / 2;
  const circumference = 2 * Math.PI * innerR;

  let offset = 0;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={radius}
          cy={radius}
          r={innerR}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={stroke}
        />
        {data.map((slice) => {
          const dash = (slice.value / total) * circumference;
          const dashArray = `${dash} ${circumference - dash}`;
          const dashOffset = -offset;
          offset += dash;
          return (
            <circle
              key={slice.key}
              cx={radius}
              cy={radius}
              r={innerR}
              fill="none"
              stroke={slice.color}
              strokeWidth={stroke}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${radius} ${radius})`}
              style={{
                filter: `drop-shadow(0 0 4px ${slice.color}80)`,
              }}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {centerLabel}
      </div>
    </div>
  );
}
