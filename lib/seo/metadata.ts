import type { Metadata } from "next";

export const siteUrl = "https://statoma.com";
export const siteName = "Statoma";

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
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
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}
