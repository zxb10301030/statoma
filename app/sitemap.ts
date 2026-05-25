import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo/metadata";
import { getAllRoutePaths } from "@/lib/seo/routes";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllRoutePaths().map((path) => ({
    url: absoluteUrl(path),
    lastModified: new Date("2026-05-25"),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path === "/calculators/" ? 0.9 : 0.7,
  }));
}
