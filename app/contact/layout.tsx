import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Report a data correction, request a feature, or send feedback about the Blooket Calculator.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
