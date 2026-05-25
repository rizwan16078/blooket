declare module "canvas-confetti" {
  type ConfettiOptions = {
    particleCount?: number;
    spread?: number;
    startVelocity?: number;
    scalar?: number;
    ticks?: number;
    gravity?: number;
    decay?: number;
    drift?: number;
    angle?: number;
    colors?: string[];
    shapes?: Array<"square" | "circle" | "star">;
    zIndex?: number;
    disableForReducedMotion?: boolean;
    origin?: {
      x?: number;
      y?: number;
    };
  };

  export default function confetti(options?: ConfettiOptions): Promise<null> | null;
}
