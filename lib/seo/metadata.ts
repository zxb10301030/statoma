import type { Metadata } from "next";

export const siteUrl = "https://statoma.com";
export const siteName = "Statoma";
export const defaultOpenGraphImage = {
  url: `${siteUrl}/opengraph-image`,
  width: 1200,
  height: 630,
  alt: "Statoma - Statistics calculators that show you how.",
};

type OpenGraphImage = typeof defaultOpenGraphImage;

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: OpenGraphImage;
};

export function normalizePath(path: string) {
  if (path === "/") {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
}

export function absoluteUrl(path: string) {
  return new URL(normalizePath(path), siteUrl).toString();
}

export function createMetadata({
  title,
  description,
  path,
  image = defaultOpenGraphImage,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image.url],
    },
  };
}
