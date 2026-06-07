import { ImageResponse } from "next/og";

export const alt = "Blooket Calculator — Free Pack Odds & Drop Rate Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0e1a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #7c3aed 0%, #06b6d4 100%)",
          }}
        />

        {/* Tag line */}
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#a78bfa",
            marginBottom: 24,
          }}
        >
          Blooket Tools
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          Free Blooket Calculator
        </div>

        {/* Cyan subtitle */}
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: "#67e8f9",
            marginBottom: 36,
          }}
        >
          Pack Odds · Drop Rates · Token Budgets
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
            maxWidth: 780,
          }}
        >
          Exact probability math for every pack and blook. Plan every token before you spend it.
        </div>

        {/* Site domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            fontSize: 16,
            color: "rgba(255,255,255,0.25)",
            fontWeight: 500,
          }}
        >
          calculatorblooket.com
        </div>
      </div>
    ),
    { ...size },
  );
}
