import type { Metadata } from "next";
import { BlockMath } from "react-katex";
import { notFound } from "next/navigation";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { TTestCalculator } from "@/components/calculator/TTestCalculator";
import { FAQ } from "@/components/content/FAQ";
import { Formula } from "@/components/content/Formula";
import { StructuredData } from "@/components/content/StructuredData";
import {
  calculators,
  getCalculatorBySlug,
  type CalculatorSlug,
} from "@/lib/calculators";
import { createMetadata } from "@/lib/seo/metadata";
import {
  faqPageJsonLd,
  softwareApplicationJsonLd,
} from "@/lib/seo/json-ld";

const tTestFaqs = [
  {
    question: "What does a t-test compare?",
    answer:
      "A t-test compares an observed mean or mean difference with a reference value while accounting for sampling variation.",
  },
  {
    question: "When should I use Welch's t-test?",
    answer:
      "Welch's t-test is usually the safer two-sample choice when group standard deviations or sample sizes are noticeably different.",
  },
  {
    question: "Can I use a t-test with small samples?",
    answer:
      "Yes, but the result depends more heavily on the approximate normality of the data or paired differences when the sample is small.",
  },
  {
    question: "Is a small p-value the same as a large effect?",
    answer:
      "No. A p-value measures compatibility with the null hypothesis, while effect size describes the practical size of the difference.",
  },
];

type CalculatorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return calculators.map((calculator) => ({
    slug: calculator.slug,
  }));
}

export async function generateMetadata({
  params,
}: CalculatorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    return {};
  }

  return createMetadata({
    title: `${calculator.name} | Statoma`,
    description: calculator.description,
    path: `/calculators/${calculator.slug}/`,
  });
}

export default async function CalculatorStubPage({
  params,
}: CalculatorPageProps) {
  const { slug } = await params;
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) {
    notFound();
  }

  if (calculator.slug === "t-test") {
    return <TTestPage calculator={calculator} />;
  }

  const statusQuestion = `Is the ${calculator.name} available yet?`;
  const statusAnswer =
    "This calculator page is reserved for the first Statoma release and will be implemented without server-side calculation code.";

  const jsonLd = [
    softwareApplicationJsonLd({
      name: calculator.name,
      description: calculator.description,
      path: `/calculators/${calculator.slug as CalculatorSlug}/`,
    }),
    faqPageJsonLd([
      {
        question: statusQuestion,
        answer: statusAnswer,
      },
    ]),
  ];

  return (
    <div className="container py-12 md:py-16">
      {jsonLd.map((entry) => (
        <script
          key={entry["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <article className="max-w-3xl space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            {calculator.name}
          </h1>
          <p className="text-base leading-7 text-muted-foreground">
            Coming soon. {calculator.description}
          </p>
        </div>
        <section className="space-y-2 rounded-lg border bg-card p-5">
          <h2 className="text-lg font-semibold">{statusQuestion}</h2>
          <p className="text-sm leading-6 text-muted-foreground">
            {statusAnswer}
          </p>
        </section>
      </article>
    </div>
  );
}

function TTestPage({
  calculator,
}: {
  calculator: NonNullable<ReturnType<typeof getCalculatorBySlug>>;
}) {
  const jsonLd = [
    softwareApplicationJsonLd({
      name: calculator.name,
      description: calculator.description,
      path: "/calculators/t-test/",
    }),
    faqPageJsonLd(tTestFaqs),
  ];

  return (
    <div className="container py-10 md:py-14">
      {jsonLd.map((entry) => (
        <StructuredData key={entry["@type"]} data={entry} />
      ))}
      <article className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-normal text-primary">
            T-test calculator
          </p>
          <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
            T-test calculator
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Compare a sample mean, paired mean difference, or two independent
            group means and see the t statistic, degrees of freedom, standard
            error, and p-value.
          </p>
        </div>

        <CalculatorLayout>
          <div className="space-y-8">
            <TTestCalculator />
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Interpreting the result
              </h2>
              <p className="leading-7 text-muted-foreground">
                The calculator reports the observed t statistic and the
                probability of seeing a result at least this far from the null
                value under the selected alternative hypothesis. A smaller
                p-value means the data are less compatible with the null model,
                but it does not measure the size, importance, or certainty of
                the effect. Read it together with the estimated difference,
                study design, sample size, assumptions, and the context of the
                question.
              </p>
            </section>
          </div>
          <aside className="space-y-5 rounded-lg border bg-muted/30 p-5">
            <h2 className="text-lg font-semibold">Before you calculate</h2>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Use paired mode only when each observation has a natural match.</li>
              <li>Use Welch mode when two groups have unequal spreads.</li>
              <li>Check plots and study design before trusting a p-value.</li>
              <li>Report the estimate with the p-value whenever possible.</li>
            </ul>
          </aside>
        </CalculatorLayout>

        <TTestEducationalContent />
        <FAQ items={tTestFaqs} />
        <RelatedCalculators currentSlug="t-test" />
      </article>
    </div>
  );
}

function TTestEducationalContent() {
  return (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What is this test?</h2>
        <p className="leading-7 text-muted-foreground">
          A t-test is a family of procedures for comparing an observed mean or
          mean difference against a null hypothesis. The null hypothesis usually
          says that the relevant difference is zero. The test divides the
          estimated difference by its standard error, producing a t statistic.
          Large positive or negative t statistics are less expected when the
          null hypothesis and model assumptions are reasonable. Statoma supports
          four common versions: one-sample, paired, independent two-sample with
          equal variance, and Welch&apos;s two-sample test. The right version
          depends on how the data were collected, not on which result looks
          strongest.
        </p>
        <p className="leading-7 text-muted-foreground">
          The t distribution matters because the population standard deviation
          is usually unknown and must be estimated from the sample. That extra
          uncertainty is reflected through degrees of freedom. With small
          samples, the t distribution has heavier tails than a normal
          distribution. As sample size grows, the t distribution becomes closer
          to the normal curve. This is why the same t statistic can have
          different p-values under different degrees of freedom.
        </p>
        <p className="leading-7 text-muted-foreground">
          The test is most useful when the statistical question is already
          framed as a comparison of means. It is not a general-purpose test for
          every numeric outcome. If the outcome is highly skewed, dominated by a
          few extreme observations, censored, ordinal, or measured on a scale
          where the mean is not meaningful, another summary or model may be
          better. A t-test can be robust, especially with balanced moderate
          samples, but robustness is not a substitute for understanding how the
          data were produced.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">When to use it</h2>
        <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
          <li>
            Use a one-sample t-test when one sample mean is compared with a
            fixed reference value, target, benchmark, or historical mean.
          </li>
          <li>
            Use a paired t-test when measurements come in matched pairs, such as
            before-and-after observations on the same person or matched units in
            a study design.
          </li>
          <li>
            Use the independent equal-variance test only when the two groups are
            independent and it is reasonable to treat their population
            variances as equal.
          </li>
          <li>
            Use Welch&apos;s t-test for two independent groups when sample sizes
            or standard deviations differ. It is often a better default than
            the equal-variance version.
          </li>
          <li>
            Use a two-sided alternative when differences in either direction
            matter. Use a one-sided alternative only when the direction was
            specified before looking at the data.
          </li>
        </ul>
        <p className="leading-7 text-muted-foreground">
          The most important decision is the design decision. A paired test asks
          whether the average within-pair difference is zero, so it removes
          between-person or between-unit baseline variation from the comparison.
          An independent test compares two separate groups, so it must account
          for variation within each group. Welch&apos;s test keeps that structure
          but does not force both groups to share one pooled variance estimate.
          Choosing the mode after seeing the answer weakens the analysis because
          the test no longer matches the original question.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="leading-7 text-muted-foreground">
          All versions use the same basic structure: estimate a difference,
          divide by the standard error of that estimate, then compare the
          statistic with a t distribution. For a one-sample t-test, the
          difference is the sample mean minus the hypothesized mean.
        </p>
        <Formula>
          <BlockMath math={String.raw`t = \frac{\bar{x} - \mu_0}{s / \sqrt{n}`} />
        </Formula>
        <p className="leading-7 text-muted-foreground">
          In this formula, the sample mean is the observed average, the
          hypothesized mean is the null value, the sample standard deviation
          estimates spread, and the sample size controls the standard error. For
          a paired test, the same formula is applied to the list of paired
          differences. For two independent groups, the estimate is the
          difference between the two group means. Welch&apos;s version uses a
          standard error based on each group&apos;s own variance and a fractional
          degrees-of-freedom approximation.
        </p>
        <p className="leading-7 text-muted-foreground">
          The p-value is then calculated from the selected tail area of the t
          distribution. A two-sided test doubles the smaller tail area because
          evidence in either direction counts against the null hypothesis. A
          greater-than test uses the right tail, and a less-than test uses the
          left tail. The tail choice should follow from the research question
          before calculation. It is part of the test definition, not a formatting
          option for the final result.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Worked example</h2>
        <p className="leading-7 text-muted-foreground">
          Suppose a researcher measures whether a training program changes a
          score. The sample mean after training is 82.4, the reference mean is
          80, the sample standard deviation is 6, and the sample size is 36.
          The estimated difference is 2.4 points. The standard error is 6
          divided by the square root of 36, which equals 1. The t statistic is
          therefore 2.4. The degrees of freedom are 35. With a two-sided
          alternative, the p-value is the probability of seeing a t statistic at
          least 2.4 units from zero in either direction under a t distribution
          with 35 degrees of freedom.
        </p>
        <p className="leading-7 text-muted-foreground">
          The interpretation is not that the null hypothesis has a specific
          probability of being true. Instead, the result says that this sample
          would be relatively uncommon if the true mean equaled the reference
          value and the model assumptions were adequate. The estimated
          difference still needs practical interpretation. A 2.4 point
          difference may be important in one field and trivial in another. The
          method gives statistical evidence; the study context supplies meaning.
        </p>
        <p className="leading-7 text-muted-foreground">
          The same arithmetic would not justify the same conclusion in every
          study. If the 36 observations came from a convenience sample, a
          repeated-measures setup treated as independent, or a process with
          strong outliers, the numerical t-test result would be incomplete. A
          careful report would state the test version, the alternative
          hypothesis, the estimated difference, the t statistic, degrees of
          freedom, and the p-value, then explain whether the assumptions are
          plausible enough for the conclusion being drawn.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common mistakes</h2>
        <div className="grid gap-4">
          {[
            {
              title: "Choosing paired mode for unrelated groups",
              body: "A paired t-test is for matched observations. If group A and group B contain different people or units without a natural match, use an independent two-sample method instead.",
            },
            {
              title: "Using the equal-variance test by habit",
              body: "The pooled two-sample t-test assumes equal population variances. Welch's test avoids that assumption and is usually safer when spreads or sample sizes differ.",
            },
            {
              title: "Treating p-values as effect sizes",
              body: "A small p-value can occur with a small practical effect when the sample is large. Always inspect the estimated difference and, later, a confidence interval.",
            },
            {
              title: "Switching to a one-sided test after seeing direction",
              body: "A one-sided alternative should be chosen before analysis. Picking it after observing the sign makes the evidence look stronger than the design supports.",
            },
            {
              title: "Ignoring the shape of the data",
              body: "The t-test is fairly robust in many settings, but severe skew, outliers, or dependent observations can make the p-value misleading.",
            },
          ].map((mistake) => (
            <section key={mistake.title} className="rounded-lg border p-4">
              <h3 className="font-semibold">{mistake.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {mistake.body}
              </p>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
