import { ImageResponse } from "next/og";
import { blogPosts } from "@/data/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? "Blooket Blog";
  const category = post?.category ?? "Guide";
  const readTime = post?.readTime ?? "";

  const titleFontSize = title.length > 60 ? 44 : title.length > 40 ? 52 : 60;

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

        {/* Category chip */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "#a78bfa",
            background: "rgba(124,58,237,0.15)",
            border: "1px solid rgba(124,58,237,0.3)",
            borderRadius: 8,
            padding: "6px 16px",
            marginBottom: 28,
          }}
        >
          {category}
        </div>

        {/* Post title */}
        <div
          style={{
            fontSize: titleFontSize,
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.1,
            marginBottom: 32,
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        {/* Read time */}
        {readTime ? (
          <div
            style={{
              fontSize: 18,
              color: "rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span>{readTime}</span>
            <span style={{ color: "rgba(255,255,255,0.2)", margin: "0 4px" }}>·</span>
            <span style={{ color: "#67e8f9" }}>Blooket Calculator Blog</span>
          </div>
        ) : null}

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
