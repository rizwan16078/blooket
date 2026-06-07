import { ImageResponse } from "next/og";
import { getPackBySlug, isPackSlug } from "@/lib/packs";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ packSlug: string }>;
}) {
  const { packSlug } = await params;
  const pack = isPackSlug(packSlug) ? getPackBySlug(packSlug) : null;
  const packName = pack ? pack.name : packSlug.replace(/-/g, " ");
  const themeColor = pack?.themeColor ?? "#7c3aed";
  const packDisplayName = packName.endsWith(" Pack") ? packName : `${packName} Pack`;

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
        {/* Top accent bar using pack theme color */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: `linear-gradient(90deg, ${themeColor} 0%, #06b6d4 100%)`,
          }}
        />

        {/* Tag */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "#a78bfa",
            marginBottom: 24,
          }}
        >
          Pack Odds Calculator
        </div>

        {/* Pack name headline */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            marginBottom: 20,
          }}
        >
          {packDisplayName}
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            color: "#67e8f9",
            marginBottom: 36,
          }}
        >
          Drop Rates · Pull Odds · Token Cost
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 20,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.6,
            maxWidth: 800,
          }}
        >
          Exact probability math for every blook in this pack. Plan your token budget before you open.
        </div>

        {/* Site domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 80,
            fontSize: 16,
            color: "rgba(255,255,255,0.25)",
          }}
        >
          calculatorblooket.com
        </div>
      </div>
    ),
    { ...size },
  );
}
