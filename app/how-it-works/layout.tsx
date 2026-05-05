import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "Learn exactly how the Blooket Calculator computes probabilities using binomial math, effective cost modeling, and Monte Carlo simulation.",
};

export default function HowItWorksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
