export const calculators = [
  {
    slug: "t-test",
    name: "T-test calculator",
    description:
      "Compare means and prepare to interpret one-sample, paired, independent, and Welch tests.",
  },
  {
    slug: "p-value",
    name: "P-value calculator",
    description:
      "Turn common test statistics into p-values with an explanation of tail direction and distribution choice.",
  },
  {
    slug: "confidence-interval",
    name: "Confidence interval calculator",
    description:
      "Estimate uncertainty around means, proportions, and differences with clear interval interpretation.",
  },
  {
    slug: "sample-size",
    name: "Sample size calculator",
    description:
      "Plan studies by connecting precision, power, and practical sample size decisions.",
  },
  {
    slug: "chi-square",
    name: "Chi-square calculator",
    description:
      "Check categorical data patterns for goodness of fit and independence questions.",
  },
] as const;

export type Calculator = (typeof calculators)[number];
export type CalculatorSlug = Calculator["slug"];

export function getCalculatorBySlug(slug: string) {
  return calculators.find((calculator) => calculator.slug === slug);
}
