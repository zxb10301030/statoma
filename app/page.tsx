import Link from "next/link";
import { CalculatorGrid } from "@/components/calculator/CalculatorGrid";
import { StructuredData } from "@/components/content/StructuredData";
import { websiteJsonLd } from "@/lib/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Statistics calculators that show you how | Statoma",
  description:
    "Use Statoma to calculate t-tests, p-values, confidence intervals, sample sizes, and chi-square tests with plain-English interpretation.",
  path: "/",
});

export default function HomePage() {
  const jsonLd = websiteJsonLd();

  return (
    <div className="container py-12 md:py-16">
      <StructuredData data={jsonLd} />
      <section className="max-w-3xl space-y-4">
        <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
          Statistics calculators that show you how.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          Statoma helps you run common statistics calculations and read the
          result in context: what the method asks, what the numbers mean, and
          which assumptions deserve attention before you report the answer.
        </p>
      </section>

      <section className="mt-12" aria-label="Featured calculators">
        <CalculatorGrid />
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">How Statoma Works</h2>
          <p className="leading-7 text-muted-foreground">
            Each Statoma calculator starts with a focused statistical question.
            Instead of asking you to choose from a long menu of unrelated
            options, the page explains what the calculator is for, which inputs
            matter, how the formula is built, and how to interpret the result
            without overstating it. The calculation happens in your browser, and
            the educational text stays close to the tool so the reasoning does
            not get separated from the number.
          </p>
          <p className="leading-7 text-muted-foreground">
            The first release covers the workflows students and applied
            researchers most often need at the beginning of an analysis: tests
            for means, p-values from common test statistics, confidence
            intervals, sample size planning, and chi-square tests for
            categorical counts. Every calculator page includes a worked example
            and common mistakes because the same arithmetic can be misleading
            when the design or assumptions do not fit.
          </p>
        </div>
        <aside className="space-y-4 rounded-lg border bg-muted/30 p-5">
          <h2 className="text-lg font-semibold">Start With The Question</h2>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            <li>Comparing means points toward a t-test.</li>
            <li>Interpreting a test statistic points toward a p-value.</li>
            <li>Estimating uncertainty points toward a confidence interval.</li>
            <li>Planning before data collection points toward sample size.</li>
            <li>Categorical counts point toward a chi-square test.</li>
          </ul>
        </aside>
      </section>

      <section className="mt-16 max-w-3xl space-y-5">
        <h2 className="text-2xl font-semibold">What The Calculators Cover</h2>
        <p className="leading-7 text-muted-foreground">
          Use the{" "}
          <Link
            href="/calculators/t-test"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            t-test calculator for one-sample, paired, independent, and Welch
            comparisons
          </Link>{" "}
          when your question is about means. Use the{" "}
          <Link
            href="/calculators/p-value"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            p-value calculator for z, t, chi-square, and F statistics
          </Link>{" "}
          when a test statistic has already been computed and you need the
          matching tail probability.
        </p>
        <p className="leading-7 text-muted-foreground">
          When the goal is estimation rather than a yes-or-no test, the{" "}
          <Link
            href="/calculators/confidence-interval"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            confidence interval calculator for means, proportions, and
            differences
          </Link>{" "}
          shows the estimate, standard error, margin of error, and bounds. When
          the study is still being planned, the{" "}
          <Link
            href="/calculators/sample-size"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            sample size calculator for precision and power
          </Link>{" "}
          connects assumptions to the number of analyzable observations needed.
          For categorical counts, the{" "}
          <Link
            href="/calculators/chi-square"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            chi-square calculator for goodness of fit and independence
          </Link>{" "}
          compares observed counts with expected counts.
        </p>
      </section>

      <section className="mt-16 max-w-3xl space-y-5">
        <h2 className="text-2xl font-semibold">How To Choose A Calculator</h2>
        <p className="leading-7 text-muted-foreground">
          Start with the form of the data and the claim you want to make. If the
          outcome is numeric and the claim is about an average, a t-test or
          confidence interval may fit. If the outcome is categorical and the
          data are counts in categories, a chi-square workflow may fit. If the
          question is about planning, sample size belongs before data
          collection, not after a result looks inconvenient.
        </p>
        <p className="leading-7 text-muted-foreground">
          If you are unsure, open the{" "}
          <Link
            href="/calculators"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            full Statoma calculator index
          </Link>
          . It explains each tool by the statistical question it answers, so
          the first decision is the method rather than a formula hunt.
        </p>
      </section>
    </div>
  );
}
