import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { describe, expect, it } from "vitest";
import sitemap from "@/app/sitemap";
import { metadata as aboutMetadata } from "@/app/(content)/about/page";
import { metadata as contactMetadata } from "@/app/(content)/contact/page";
import { metadata as privacyMetadata } from "@/app/(content)/privacy/page";
import { metadata as termsMetadata } from "@/app/(content)/terms/page";
import { generateMetadata as generateCalculatorMetadata } from "@/app/calculators/[slug]/page";
import { metadata as calculatorsMetadata } from "@/app/calculators/page";
import { metadata as homeMetadata } from "@/app/page";
import { metadata as topicsMetadata } from "@/app/topics/page";
import { calculators } from "@/lib/calculators";
import { absoluteUrl, normalizePath, siteUrl } from "@/lib/seo/metadata";
import { getAllRoutePaths } from "@/lib/seo/routes";

type MetadataEntry = {
  path: string;
  metadata: Metadata;
};

const staticMetadataEntries: MetadataEntry[] = [
  { path: "/", metadata: homeMetadata },
  { path: "/calculators/", metadata: calculatorsMetadata },
  { path: "/topics/", metadata: topicsMetadata },
  { path: "/about/", metadata: aboutMetadata },
  { path: "/privacy/", metadata: privacyMetadata },
  { path: "/terms/", metadata: termsMetadata },
  { path: "/contact/", metadata: contactMetadata },
];

function toComparableList(values: readonly string[]) {
  return [...values].sort((a, b) => a.localeCompare(b));
}

function getStringValue(value: unknown, label: string) {
  if (typeof value === "string") {
    return value;
  }

  if (value instanceof URL) {
    return value.toString();
  }

  if (value && typeof value === "object") {
    if ("absolute" in value && typeof value.absolute === "string") {
      return value.absolute;
    }

    if ("default" in value && typeof value.default === "string") {
      return value.default;
    }
  }

  throw new Error(`${label} must resolve to a string`);
}

function getOpenGraphImage(metadata: Metadata) {
  const images = metadata.openGraph?.images;
  expect(images, "Open Graph images should be present").toBeDefined();

  const firstImage = Array.isArray(images) ? images[0] : images;
  expect(firstImage, "Open Graph should include at least one image").toBeDefined();

  if (typeof firstImage === "string" || firstImage instanceof URL) {
    return {
      url: getStringValue(firstImage, "Open Graph image URL"),
      width: undefined,
      height: undefined,
      alt: undefined,
    };
  }

  const image = firstImage as {
    url?: string | URL;
    width?: number;
    height?: number;
    alt?: string;
  };

  return {
    url: getStringValue(image.url, "Open Graph image URL"),
    width: image.width,
    height: image.height,
    alt: image.alt,
  };
}

async function getMetadataEntries() {
  const calculatorMetadataEntries = await Promise.all(
    calculators.map(async (calculator) => ({
      path: `/calculators/${calculator.slug}/`,
      metadata: await generateCalculatorMetadata({
        params: Promise.resolve({ slug: calculator.slug }),
      }),
    })),
  );

  return [...staticMetadataEntries, ...calculatorMetadataEntries];
}

function walkPageFiles(directory: string): string[] {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      return walkPageFiles(entryPath);
    }

    return entry.name === "page.tsx" ? [entryPath] : [];
  });
}

function routePathsFromPageFiles() {
  const appDirectory = path.join(process.cwd(), "app");

  return walkPageFiles(appDirectory).flatMap((pageFile) => {
    const segments = path
      .relative(appDirectory, pageFile)
      .split(path.sep)
      .slice(0, -1)
      .filter((segment) => !segment.startsWith("("));

    if (segments.length === 0) {
      return ["/"];
    }

    const routePath = normalizePath(`/${segments.join("/")}/`);

    if (routePath === "/calculators/[slug]/") {
      return calculators.map((calculator) =>
        normalizePath(`/calculators/${calculator.slug}/`),
      );
    }

    return routePath.includes("[") ? [] : [routePath];
  });
}

describe("SEO metadata", () => {
  it("keeps public page titles unique", async () => {
    const entries = await getMetadataEntries();
    const titles = entries.map(({ metadata }) =>
      getStringValue(metadata.title, "metadata title"),
    );

    expect(new Set(titles).size).toBe(titles.length);
  });

  it("provides canonical, Open Graph, and Twitter metadata for each public page", async () => {
    const entries = await getMetadataEntries();

    for (const { path: routePath, metadata } of entries) {
      const expectedUrl = absoluteUrl(routePath);
      const title = getStringValue(metadata.title, "metadata title");
      const description = getStringValue(
        metadata.description,
        "metadata description",
      );
      const canonical = getStringValue(
        metadata.alternates?.canonical,
        "canonical URL",
      );
      const openGraphUrl = getStringValue(metadata.openGraph?.url, "Open Graph URL");
      const openGraphTitle = getStringValue(
        metadata.openGraph?.title,
        "Open Graph title",
      );
      const openGraphDescription = getStringValue(
        metadata.openGraph?.description,
        "Open Graph description",
      );
      const openGraphImage = getOpenGraphImage(metadata);
      const twitterImage = Array.isArray(metadata.twitter?.images)
        ? metadata.twitter?.images[0]
        : metadata.twitter?.images;

      expect(title.length).toBeGreaterThan(0);
      expect(description.length).toBeGreaterThan(0);
      expect(canonical).toBe(expectedUrl);
      expect(openGraphUrl).toBe(expectedUrl);
      expect(openGraphTitle).toBe(title);
      expect(openGraphDescription).toBe(description);
      expect(openGraphImage.url.startsWith(siteUrl)).toBe(true);
      expect(openGraphImage.width).toBe(1200);
      expect(openGraphImage.height).toBe(630);
      expect(openGraphImage.alt).toBeTruthy();
      expect(metadata.twitter?.card).toBe("summary_large_image");
      expect(getStringValue(twitterImage, "Twitter image URL").startsWith(siteUrl)).toBe(
        true,
      );
    }
  });

  it("keeps sitemap routes aligned with current App Router pages", () => {
    const sitemapUrls = sitemap().map((entry) => getStringValue(entry.url, "sitemap URL"));
    const routeUrls = getAllRoutePaths().map((routePath) => absoluteUrl(routePath));
    const pageFileUrls = routePathsFromPageFiles().map((routePath) =>
      absoluteUrl(routePath),
    );

    expect(toComparableList(sitemapUrls)).toEqual(toComparableList(routeUrls));
    expect(toComparableList(sitemapUrls)).toEqual(toComparableList(pageFileUrls));
  });
});
