import type { Metadata } from "next";

// Keep canonical URLs stable across previews. Change only after the public domain is verified.
const configured =
  process.env.NEXT_PUBLIC_SITE_URL || "https://startorav2.vercel.app";
export const SITE_URL = new URL(configured).origin;
export const DESCRIPTION =
  "Explore drawing-led workflows for construction teams, from project questions to source review.";
export function pageMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: `${title} | Stratora`,
      description,
      url: path,
      siteName: "Stratora",
      type: "website",
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: "Stratora construction intelligence",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Stratora`,
      description,
      images: ["/opengraph-image"],
    },
  };
}
