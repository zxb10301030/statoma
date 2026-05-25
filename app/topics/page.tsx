import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Statistics topics | Statoma",
  description:
    "Browse the planned Statoma topics index for practical guides to statistical tests, p-values, intervals, power, and categorical data.",
  path: "/topics/",
});

const topicGroups = [
  {
    title: "Hypothesis tests",
    body: "Guides in this group will explain null hypotheses, alternatives, test statistics, tail direction, degrees of freedom, and the difference between statistical evidence and practical importance.",
    links: [
      { label: "T-test calculator", href: "/calculators/t-test" },
      { label: "P-value calculator", href: "/calculators/p-value" },
      { label: "Chi-square calculator", href: "/calculators/chi-square" },
    ],
  },
  {
    title: "Estimation and uncertainty",
    body: "This group will focus on standard errors, margins of error, confidence levels, interval interpretation, and the difference between an estimate and a decision rule.",
    links: [
      {
        label: "Confidence interval calculator",
        href: "/calculators/confidence-interval",
      },
      { label: "Sample size calculator", href: "/calculators/sample-size" },
    ],
  },
  {
    title: "Study planning",
    body: "Planning guides will connect statistical power, detectable effects, precision targets, attrition, design effects, and the assumptions that should be settled before data collection starts.",
    links: [
      { label: "Sample size calculator", href: "/calculators/sample-size" },
      { label: "All calculators", href: "/calculators" },
    ],
  },
];

export default function TopicsPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-4xl space-y-10">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            Statistics topics
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Statoma topics will become the guide layer between statistical
            concepts and calculator workflows. The first topic pages are not
            published yet, but this index shows how the library will be
            organized.
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          {topicGroups.map((group) => (
            <div key={group.title} className="rounded-lg border bg-card p-5">
              <h2 className="text-lg font-semibold">{group.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {group.body}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={`${group.title}-${link.href}`}>
                    <Link
                      href={link.href}
                      className="font-medium text-foreground underline-offset-4 hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold">How Topics Will Work</h2>
          <p className="leading-7 text-muted-foreground">
            Calculator pages answer a focused question: enter the right summary
            values, get the statistic, and read the interpretation. Topic pages
            will answer the broader questions that often come before the
            calculator: what kind of question is this, what assumptions matter,
            what can the result say, and what should be reported with it.
          </p>
          <p className="leading-7 text-muted-foreground">
            The planned topics will link back to calculators with descriptive
            anchors rather than generic prompts. A guide to p-values should
            point to the p-value calculator when a user already has a test
            statistic. A guide to power should point to the sample size
            calculator when the user is planning a study. A guide to categorical
            data should point to the chi-square calculator when the question is
            about observed and expected counts.
          </p>
        </section>

        <section className="max-w-3xl space-y-4">
          <h2 className="text-2xl font-semibold">Planned Topic Areas</h2>
          <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              Understanding p-values without treating them as the probability
              that the null hypothesis is true.
            </li>
            <li>
              Choosing between one-sample, paired, independent, and Welch
              t-tests based on study design.
            </li>
            <li>
              Reading confidence intervals as estimation tools rather than
              yes-or-no significance tests.
            </li>
            <li>
              Planning sample size around precision, power, attrition, and
              realistic effect sizes.
            </li>
            <li>
              Checking categorical data with expected counts, contingency
              tables, and chi-square assumptions.
            </li>
          </ul>
          <p className="leading-7 text-muted-foreground">
            Until those guides are published, the{" "}
            <Link
              href="/calculators"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Statoma calculator index
            </Link>{" "}
            is the main route into the site.
          </p>
        </section>
      </article>
    </div>
  );
}
