"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Smoothly interpolates a numeric value when the target changes.
 *
 * Uses requestAnimationFrame for buttery animation and cancels in-flight
 * tweens when the target changes mid-flight. Snaps instantly when the
 * difference is below `epsilon` to avoid jitter.
 *
 *   const animated = useAnimatedNumber(probability, 600);
 *   // ...render `animated` instead of `probability`
 */
export function useAnimatedNumber(
  target: number,
  duration = 500,
  epsilon = 0.0005,
): number {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  valueRef.current = value;

  useEffect(() => {
    const startValue = valueRef.current;
    if (Math.abs(target - startValue) < epsilon) {
      setValue(target);
      return;
    }

    let raf = 0;
    let startTime = 0;

    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const t = Math.min(1, (now - startTime) / duration);
      // easeOutCubic — fast start, gentle landing
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(startValue + (target - startValue) * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, epsilon]);

  return value;
}
