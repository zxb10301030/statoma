import { CalculatorGrid } from "@/components/calculator/CalculatorGrid";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Statistics calculators that show you how | Statoma",
  description:
    "Statoma helps students and researchers choose a statistics calculator and understand the result step by step.",
  path: "/",
});

export default function HomePage() {
  return (
    <div className="container py-14 md:py-20">
      <section className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
          Statistics calculators that show you how.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Statoma is a free statistics calculator suite built to explain the
          method, not just return an answer.
        </p>
      </section>
      <section className="mt-12" aria-label="Featured calculators">
        <CalculatorGrid />
      </section>
    </div>
  );
}
