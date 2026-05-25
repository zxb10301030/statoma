import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About Statoma | Statoma",
  description:
    "Learn why Statoma builds statistics calculators that explain methods, assumptions, and interpretation alongside the answer.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            About Statoma
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Statoma is a statistics calculator suite for people who need more
            than a final number. Each calculator is designed to connect the
            result with the question being asked, the assumptions behind the
            method, and the limits of interpretation.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Why Statoma Exists</h2>
          <p className="leading-7 text-muted-foreground">
            Many statistics tools are fast but silent. They return a p-value,
            confidence interval, or sample size without showing how the method
            fits the data. That can be enough for someone who already knows the
            procedure, but it is frustrating for students, researchers,
            journalists, and analysts who are still checking whether they chose
            the right method. Statoma is built for that moment: the place where
            calculation and explanation need to sit together.
          </p>
          <p className="leading-7 text-muted-foreground">
            The first release focuses on common inferential statistics: t-tests,
            p-values, confidence intervals, sample size planning, and chi-square
            tests. These are familiar methods, but they are also easy to misuse.
            A t-test can answer the wrong question if paired data are treated as
            independent. A p-value can be misread as the probability that a
            hypothesis is true. A chi-square result can look decisive even when
            expected counts are too small for the approximation to be
            trustworthy.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">
            How The Calculators Are Built
          </h2>
          <p className="leading-7 text-muted-foreground">
            Statoma keeps calculations in testable TypeScript functions and runs
            them in the browser. The site is exported as static files, so there
            is no server-side calculator storage, no API route required for a
            result, and no database behind the calculator pages. That
            architecture keeps the early product simple and makes each method
            easier to inspect.
          </p>
          <p className="leading-7 text-muted-foreground">
            Each calculator page follows a consistent pattern. The tool appears
            first, followed by plain-English interpretation, a description of
            the method, guidance on when to use it, formulas, a worked example,
            common mistakes, frequently asked questions, and related internal
            links. The goal is not to hide statistical complexity. The goal is
            to make the complexity legible enough that users can make better
            decisions about their data.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Who It Is For</h2>
          <p className="leading-7 text-muted-foreground">
            Statoma is written for people doing real work with limited time:
            students checking homework, graduate researchers planning studies,
            journalists reading reported statistics, and data practitioners
            translating summary numbers into decisions. It is also designed to
            stay useful as the site grows into topic guides and applied
            workflows.
          </p>
          <p className="leading-7 text-muted-foreground">
            If you are starting from a statistical question, begin with the{" "}
            <Link
              href="/calculators"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              full list of Statoma calculators
            </Link>
            . If you are starting from a concept, the{" "}
            <Link
              href="/topics"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              statistics topics index
            </Link>{" "}
            will become the guide layer that connects ideas to the tools that
            use them.
          </p>
        </section>
      </article>
    </div>
  );
}
