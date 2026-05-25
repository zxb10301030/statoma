import { CalculatorGrid } from "@/components/calculator/CalculatorGrid";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "All calculators | Statoma",
  description:
    "Browse the first Statoma statistics calculator pages for tests, intervals, sample size, p-values, and chi-square workflows.",
  path: "/calculators/",
});

export default function CalculatorsPage() {
  return (
    <div className="container py-12 md:py-16">
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          All calculators
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Start with the calculator that matches your statistical question.
        </p>
      </div>
      <section className="mt-10" aria-label="All calculators">
        <CalculatorGrid />
      </section>
    </div>
  );
}
