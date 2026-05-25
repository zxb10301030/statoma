import Link from "next/link";
import { CalculatorGrid } from "@/components/calculator/CalculatorGrid";
import { StructuredData } from "@/components/content/StructuredData";
import { calculators } from "@/lib/calculators";
import { calculatorItemListJsonLd } from "@/lib/seo/json-ld";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "All calculators | Statoma",
  description:
    "Browse Statoma calculators for t-tests, p-values, confidence intervals, sample size planning, and chi-square tests.",
  path: "/calculators/",
});

const choosingGuides = [
  {
    title: "Compare Means",
    question:
      "Is a sample mean or mean difference different from a reference value?",
    calculator: "T-test calculator",
    href: "/calculators/t-test",
    detail:
      "Use this when the outcome is numeric and the question is about a mean, paired mean difference, or two independent group means.",
  },
  {
    title: "Convert A Test Statistic",
    question: "Do you already have a z, t, chi-square, or F statistic?",
    calculator: "P-value calculator",
    href: "/calculators/p-value",
    detail:
      "Use this when the statistic and degrees of freedom are known and the main task is choosing the correct distribution and tail.",
  },
  {
    title: "Estimate Uncertainty",
    question: "Do you need a range of plausible values around an estimate?",
    calculator: "Confidence interval calculator",
    href: "/calculators/confidence-interval",
    detail:
      "Use this for means, proportions, differences in means, and differences in proportions when uncertainty matters more than a single threshold.",
  },
  {
    title: "Plan Data Collection",
    question: "How many observations should be collected before analysis?",
    calculator: "Sample size calculator",
    href: "/calculators/sample-size",
    detail:
      "Use this before collecting data to connect precision, power, detectable effects, and planning assumptions.",
  },
  {
    title: "Check Categorical Counts",
    question:
      "Do observed category counts differ from expected counts or table independence?",
    calculator: "Chi-square calculator",
    href: "/calculators/chi-square",
    detail:
      "Use this for goodness-of-fit questions and two-way contingency tables built from categorical counts.",
  },
];

export default function CalculatorsPage() {
  const jsonLd = calculatorItemListJsonLd(calculators);

  return (
    <div className="container py-12 md:py-16">
      <StructuredData data={jsonLd} />
      <div className="max-w-3xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          All calculators
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Start with the calculator that matches your statistical question. Each
          Statoma page pairs the calculation with interpretation, formulas,
          worked examples, and common mistakes.
        </p>
      </div>

      <section className="mt-10" aria-label="All calculators">
        <CalculatorGrid />
      </section>

      <section className="mt-16 max-w-4xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <h2 className="text-2xl font-semibold">Choose By Question</h2>
          <p className="leading-7 text-muted-foreground">
            A calculator should be chosen from the design of the question, not
            from the result you hope to see. Use the guide below to match the
            data structure and reporting goal to the right Statoma workflow.
          </p>
        </div>

        <div className="divide-y rounded-lg border bg-card">
          {choosingGuides.map((guide) => (
            <section
              key={guide.href}
              className="grid gap-3 p-5 md:grid-cols-[12rem_minmax(0,1fr)]"
            >
              <div>
                <h3 className="font-semibold">{guide.title}</h3>
              </div>
              <div className="space-y-2">
                <p className="font-medium leading-6">{guide.question}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {guide.detail}
                </p>
                <Link
                  href={guide.href}
                  className="inline-flex font-medium text-foreground underline-offset-4 hover:underline"
                >
                  Open the {guide.calculator.toLowerCase()}
                </Link>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5">
          <h2 className="text-2xl font-semibold">
            What To Check Before You Calculate
          </h2>
          <p className="leading-7 text-muted-foreground">
            Before entering numbers, identify the observational unit, the
            outcome type, the comparison being made, and the assumptions the
            method requires. A t-test assumes a question about means. A
            confidence interval assumes the estimate and standard error are
            meaningful for the sampling design. A chi-square test assumes
            categorical counts with appropriate expected counts. Those design
            checks matter as much as the final arithmetic.
          </p>
          <p className="leading-7 text-muted-foreground">
            Statoma calculators currently use summary statistics rather than
            uploaded datasets. That keeps the tools focused and transparent: you
            bring the relevant sample means, standard deviations, counts,
            margins, or test statistics, and the page shows how the result is
            built from those values. If your analysis needs modeling choices,
            transformations, clustering, survey weights, missing-data handling,
            or multiple comparisons, treat these calculators as a teaching
            reference rather than the whole analysis.
          </p>
        </div>
        <aside className="space-y-4 rounded-lg border bg-muted/30 p-5">
          <h2 className="text-lg font-semibold">Common Starting Points</h2>
          <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
            <li>Use counts for categorical tools, not percentages alone.</li>
            <li>Pick one-sided or two-sided tests before seeing direction.</li>
            <li>Report estimates and intervals with p-values when possible.</li>
            <li>Plan sample size before collecting or filtering data.</li>
          </ul>
        </aside>
      </section>

      <section className="mt-16 max-w-3xl space-y-5">
        <h2 className="text-2xl font-semibold">What Comes Next</h2>
        <p className="leading-7 text-muted-foreground">
          The calculator set is the foundation. The{" "}
          <Link
            href="/topics"
            className="font-medium text-foreground underline-offset-4 hover:underline"
          >
            Statoma statistics topics index
          </Link>{" "}
          will add longer guides that explain ideas like p-values, statistical
          power, confidence intervals, and categorical tests before users choose
          a specific calculator. Those guides will link back into this index so
          conceptual learning and calculation stay connected.
        </p>
      </section>
    </div>
  );
}
