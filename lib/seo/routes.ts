import { calculators } from "@/lib/calculators";

const staticRoutes = [
  "/",
  "/calculators/",
  "/topics/",
  "/about/",
  "/privacy/",
  "/terms/",
  "/contact/",
] as const;

export function getAllRoutePaths() {
  return [
    ...staticRoutes,
    ...calculators.map((calculator) => `/calculators/${calculator.slug}/`),
  ];
}
