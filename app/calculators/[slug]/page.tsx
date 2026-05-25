import type { Metadata } from "next";
import { BlockMath } from "react-katex";
import { notFound } from "next/navigation";
import { ConfidenceIntervalCalculator } from "@/components/calculator/ConfidenceIntervalCalculator";
import { CalculatorLayout } from "@/components/calculator/CalculatorLayout";
import { PValueCalculator } from "@/components/calculator/PValueCalculator";
import { RelatedCalculators } from "@/components/calculator/RelatedCalculators";
import { SampleSizeCalculator } from "@/components/calculator/SampleSizeCalculator";
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

const pValueFaqs = [
  {
    question: "What does a p-value measure?",
    answer:
      "A p-value measures how surprising the observed statistic would be if the null model and its assumptions were true.",
  },
  {
    question: "Is a p-value the probability that the null hypothesis is true?",
    answer:
      "No. It is a probability calculated under the null hypothesis, not the probability that the hypothesis itself is true.",
  },
  {
    question: "Which tail should I choose?",
    answer:
      "Choose the tail that matches the alternative hypothesis planned before looking at the data.",
  },
  {
    question: "Can chi-square and F statistics be two-sided?",
    answer:
      "Most common chi-square and F tests use right-tail p-values because larger statistics indicate stronger departure from the null model.",
  },
];

const confidenceIntervalFaqs = [
  {
    question: "What does a confidence interval show?",
    answer:
      "A confidence interval gives a range of plausible values for a population parameter based on the estimate, standard error, and confidence level.",
  },
  {
    question: "Does a 95% interval mean the parameter has a 95% chance of being inside?",
    answer:
      "No. In frequentist terms, the method would capture the true parameter in about 95% of repeated samples analyzed the same way.",
  },
  {
    question: "Why does a higher confidence level make the interval wider?",
    answer:
      "Higher confidence requires covering more of the reference distribution, so the critical value and margin of error increase.",
  },
  {
    question: "Can a proportion interval go below 0 or above 1?",
    answer:
      "The simple normal approximation can do that near 0 or 1. Treat such results as a warning that a different interval method may be better.",
  },
];

const sampleSizeFaqs = [
  {
    question: "What does a sample size calculator estimate?",
    answer:
      "It estimates the minimum number of observations needed to reach a target margin of error or power under stated planning assumptions.",
  },
  {
    question: "Why does a smaller margin of error need a larger sample?",
    answer:
      "Margin of error shrinks with the square root of sample size, so cutting the margin in half usually needs about four times as many observations.",
  },
  {
    question: "What does statistical power mean?",
    answer:
      "Power is the probability that a planned test detects an effect of a specified size when that effect is really present.",
  },
  {
    question: "Should I add extra sample for attrition?",
    answer:
      "Yes. The calculator gives the analyzable sample size before dropouts, unusable responses, exclusions, or design effects are added.",
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

  if (calculator.slug === "p-value") {
    return <PValuePage calculator={calculator} />;
  }

  if (calculator.slug === "confidence-interval") {
    return <ConfidenceIntervalPage calculator={calculator} />;
  }

  if (calculator.slug === "sample-size") {
    return <SampleSizePage calculator={calculator} />;
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

function PValuePage({
  calculator,
}: {
  calculator: NonNullable<ReturnType<typeof getCalculatorBySlug>>;
}) {
  const jsonLd = [
    softwareApplicationJsonLd({
      name: calculator.name,
      description: calculator.description,
      path: "/calculators/p-value/",
    }),
    faqPageJsonLd(pValueFaqs),
  ];

  return (
    <div className="container py-10 md:py-14">
      {jsonLd.map((entry) => (
        <StructuredData key={entry["@type"]} data={entry} />
      ))}
      <article className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-normal text-primary">
            P-value calculator
          </p>
          <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
            P-value calculator
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Convert z, t, chi-square, and F statistics into p-values using the
            distribution and tail area that match your statistical test.
          </p>
        </div>

        <CalculatorLayout>
          <div className="space-y-8">
            <PValueCalculator />
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Interpreting the result
              </h2>
              <p className="leading-7 text-muted-foreground">
                The p-value is the probability, under the selected null model,
                of observing a statistic in the chosen tail area that is at
                least as extreme as the statistic you entered. It is not the
                probability that the null hypothesis is true, and it is not the
                probability that the result happened by chance. A small p-value
                means the observed statistic is relatively unusual under the
                null model and assumptions.
              </p>
            </section>
          </div>
          <aside className="space-y-5 rounded-lg border bg-muted/30 p-5">
            <h2 className="text-lg font-semibold">Before you calculate</h2>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Use the statistic from the test you already planned.</li>
              <li>Choose the tail before looking at the observed direction.</li>
              <li>Use right-tail areas for most chi-square and F tests.</li>
              <li>Report the test statistic and degrees of freedom too.</li>
            </ul>
          </aside>
        </CalculatorLayout>

        <PValueEducationalContent />
        <FAQ items={pValueFaqs} />
        <RelatedCalculators currentSlug="p-value" />
      </article>
    </div>
  );
}

function PValueEducationalContent() {
  return (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What is this test?</h2>
        <p className="leading-7 text-muted-foreground">
          This calculator does not create a test statistic from raw data.
          Instead, it takes a statistic that was already calculated by a
          statistical test and converts it into a tail probability. That tail
          probability is the p-value. The input can be a z statistic from a
          standard normal model, a t statistic with degrees of freedom, a
          chi-square statistic with degrees of freedom, or an F statistic with
          numerator and denominator degrees of freedom.
        </p>
        <p className="leading-7 text-muted-foreground">
          The distribution choice is not interchangeable. A statistic of 2 can
          mean different things under a normal distribution, a t distribution
          with few degrees of freedom, a chi-square distribution, or an F
          distribution. Degrees of freedom change the shape of the reference
          distribution, which changes the tail area. A p-value calculator is
          therefore only as trustworthy as the test statistic, degrees of
          freedom, and tail choice entered into it.
        </p>
        <p className="leading-7 text-muted-foreground">
          The p-value is a statement about the statistic under the null model.
          It is not a direct measure of effect size, scientific importance,
          practical value, or replication probability. It should be reported
          alongside the estimate that produced the statistic, the test
          definition, the sample size, and the assumptions that make the
          reference distribution reasonable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">When to use it</h2>
        <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
          <li>
            Use the z option when your test statistic follows a standard normal
            reference distribution, such as large-sample z tests or normal
            approximations.
          </li>
          <li>
            Use the t option when your statistic follows a t distribution and
            you know the relevant degrees of freedom.
          </li>
          <li>
            Use the chi-square option for tests where larger chi-square values
            indicate greater departure from the null model, such as many
            goodness-of-fit and independence tests.
          </li>
          <li>
            Use the F option for variance-ratio tests and model comparison
            settings where the statistic follows an F distribution.
          </li>
          <li>
            Use a two-sided tail only for symmetric z and t statistics when
            departures in either direction count as evidence against the null.
          </li>
        </ul>
        <p className="leading-7 text-muted-foreground">
          If you are unsure which distribution generated the statistic, step
          back to the original test rather than trying several options. The
          same number can produce several different p-values, and only one of
          them answers the statistical question implied by the model.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="leading-7 text-muted-foreground">
          A p-value is a tail area. For a right-tail test, the calculator finds
          the probability that the reference distribution would produce a value
          greater than or equal to the observed statistic. For a left-tail test,
          it finds the probability of a value less than or equal to the observed
          statistic. For a two-sided z or t test, it doubles the smaller tail
          area because values equally extreme in either direction count against
          the null hypothesis.
        </p>
        <Formula>
          <BlockMath math={String.raw`p = 2 \min\{F(x), 1 - F(x)\}`} />
        </Formula>
        <p className="leading-7 text-muted-foreground">
          In the formula, F is the cumulative distribution function for the
          selected reference distribution, and x is the observed statistic. For
          chi-square and F tests, the common evidence direction is usually the
          right tail because larger statistics represent larger departures from
          the null model. Left-tail areas can still be useful in specialized
          settings, but they should be chosen because the test calls for them.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Worked example</h2>
        <p className="leading-7 text-muted-foreground">
          Suppose a regression model comparison reports an F statistic of 3
          with 2 numerator degrees of freedom and 20 denominator degrees of
          freedom. Because larger F statistics indicate stronger evidence
          against the null model in this setting, the correct p-value is a
          right-tail area. The calculator evaluates the F distribution with
          those two degrees-of-freedom values and returns the probability of
          seeing a statistic of 3 or larger if the null model were adequate.
        </p>
        <p className="leading-7 text-muted-foreground">
          That probability is not the probability that the bigger model is
          correct. It also does not say whether the extra predictors are
          practically useful. It tells you how unusual the observed F statistic
          would be under the null comparison. A complete interpretation would
          include the models being compared, the observed statistic, both
          degrees of freedom, the p-value, and the practical reason the model
          comparison matters.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common mistakes</h2>
        <div className="grid gap-4">
          {[
            {
              title: "Using the wrong reference distribution",
              body: "A z statistic, t statistic, chi-square statistic, and F statistic do not share the same tail areas. Choose the distribution from the original test definition.",
            },
            {
              title: "Forgetting degrees of freedom",
              body: "Degrees of freedom change the shape of t, chi-square, and F distributions. A statistic without its degrees of freedom is usually not enough to recover the correct p-value.",
            },
            {
              title: "Choosing the tail after seeing the statistic",
              body: "The tail direction belongs to the planned alternative hypothesis. Choosing it after observing the result makes the evidence look cleaner than the analysis plan supports.",
            },
            {
              title: "Treating p < 0.05 as the whole conclusion",
              body: "A threshold can be useful, but it cannot replace the estimate, assumptions, design quality, uncertainty, and practical size of the effect.",
            },
            {
              title: "Calling a p-value the chance of randomness",
              body: "A p-value is calculated under a model. It is not a general probability that the result is random, false, or meaningless.",
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

function ConfidenceIntervalPage({
  calculator,
}: {
  calculator: NonNullable<ReturnType<typeof getCalculatorBySlug>>;
}) {
  const jsonLd = [
    softwareApplicationJsonLd({
      name: calculator.name,
      description: calculator.description,
      path: "/calculators/confidence-interval/",
    }),
    faqPageJsonLd(confidenceIntervalFaqs),
  ];

  return (
    <div className="container py-10 md:py-14">
      {jsonLd.map((entry) => (
        <StructuredData key={entry["@type"]} data={entry} />
      ))}
      <article className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-normal text-primary">
            Confidence interval calculator
          </p>
          <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
            Confidence interval calculator
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Estimate uncertainty around a mean, proportion, difference in
            means, or difference in proportions from summary statistics.
          </p>
        </div>

        <CalculatorLayout>
          <div className="space-y-8">
            <ConfidenceIntervalCalculator />
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Interpreting the result
              </h2>
              <p className="leading-7 text-muted-foreground">
                A confidence interval combines the point estimate with a margin
                of error. The lower and upper bounds show a range of values that
                are reasonably compatible with the data under the selected
                method. The interval does not prove that every value inside is
                equally likely, and it does not make values outside impossible.
                It is a disciplined way to show estimation uncertainty.
              </p>
            </section>
          </div>
          <aside className="space-y-5 rounded-lg border bg-muted/30 p-5">
            <h2 className="text-lg font-semibold">Before you calculate</h2>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Use summary statistics from the same sample or comparison.</li>
              <li>Pick the confidence level before reading the interval.</li>
              <li>Check whether a normal approximation is reasonable.</li>
              <li>Report the estimate and margin of error with the bounds.</li>
            </ul>
          </aside>
        </CalculatorLayout>

        <ConfidenceIntervalEducationalContent />
        <FAQ items={confidenceIntervalFaqs} />
        <RelatedCalculators currentSlug="confidence-interval" />
      </article>
    </div>
  );
}

function ConfidenceIntervalEducationalContent() {
  return (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What is this test?</h2>
        <p className="leading-7 text-muted-foreground">
          A confidence interval is an estimation tool, not a hypothesis test by
          itself. It starts with a point estimate, such as a sample mean, sample
          proportion, or difference between two groups. It then adds and
          subtracts a margin of error based on the standard error and confidence
          level. The result is an interval that communicates both the estimate
          and the uncertainty around it.
        </p>
        <p className="leading-7 text-muted-foreground">
          Statoma currently supports four common summary-statistic intervals:
          a mean interval using a t critical value, a proportion interval using
          a normal approximation, a difference in means interval using Welch
          degrees of freedom, and a difference in proportions interval using a
          normal approximation. These are standard teaching and reporting forms,
          but they still rely on sampling assumptions and sensible input data.
        </p>
        <p className="leading-7 text-muted-foreground">
          The frequentist interpretation is about the method, not a fixed
          parameter moving around. If a 95% confidence interval method were
          repeated across many comparable samples, about 95% of the intervals
          would contain the true population parameter. For one completed study,
          the interval is better read as a range of plausible values generated
          by that method and dataset.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">When to use it</h2>
        <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
          <li>
            Use a mean interval when the target is a population average and you
            have a sample mean, sample standard deviation, and sample size.
          </li>
          <li>
            Use a proportion interval when the target is a population share or
            rate based on a count of successes out of a sample.
          </li>
          <li>
            Use a difference in means interval when comparing two independent
            group averages from summary statistics.
          </li>
          <li>
            Use a difference in proportions interval when comparing two
            independent rates, shares, or conversion proportions.
          </li>
          <li>
            Use a wider confidence level, such as 99%, when you need a more
            conservative interval and can tolerate less precision.
          </li>
        </ul>
        <p className="leading-7 text-muted-foreground">
          Confidence intervals are especially useful when practical size matters
          more than a yes-or-no threshold. A p-value can say whether a null
          value looks surprising, but an interval shows the range of effect
          sizes still compatible with the data. That range is often what makes
          a result actionable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="leading-7 text-muted-foreground">
          Most introductory confidence intervals share the same structure. The
          estimate is the center. The standard error measures sampling
          variability. The critical value comes from a reference distribution
          and expands or contracts with the confidence level. The margin of
          error is the critical value multiplied by the standard error.
        </p>
        <Formula>
          <BlockMath math={String.raw`\text{estimate} \pm \text{critical value} \times \text{standard error}`} />
        </Formula>
        <p className="leading-7 text-muted-foreground">
          Mean intervals use a t critical value because the population standard
          deviation is unknown and estimated by the sample standard deviation.
          Proportion intervals in this calculator use the normal approximation.
          Difference in means intervals use a Welch-style standard error and
          degrees-of-freedom approximation, which avoids assuming equal
          population variances. Difference in proportions intervals combine the
          sampling variance from both groups.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Worked example</h2>
        <p className="leading-7 text-muted-foreground">
          Suppose a class has a sample mean score of 82.4, a sample standard
          deviation of 6, and a sample size of 36. For a 95% mean interval, the
          standard error is 6 divided by the square root of 36, which equals 1.
          The t critical value with 35 degrees of freedom is about 2.03, so the
          margin of error is about 2.03 points. The interval runs from about
          80.37 to 84.43.
        </p>
        <p className="leading-7 text-muted-foreground">
          The interval should not be described as saying there is a 95% chance
          that the true mean lies between those two numbers. The true mean is
          treated as fixed in this framework. The 95% describes the long-run
          performance of the interval method. In a report, the better phrasing
          is that the 95% confidence interval for the population mean score is
          80.37 to 84.43, assuming the sampling design and model conditions are
          reasonable.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common mistakes</h2>
        <div className="grid gap-4">
          {[
            {
              title: "Calling the interval a probability statement",
              body: "A 95% confidence interval does not mean the fixed parameter has a 95% probability of being inside this particular interval.",
            },
            {
              title: "Ignoring sample design",
              body: "The formula assumes the summary statistics came from a sampling process that supports the standard error calculation.",
            },
            {
              title: "Using a proportion approximation near the boundaries",
              body: "The simple normal proportion interval can behave poorly when the observed proportion is close to 0 or 1, or when sample size is small.",
            },
            {
              title: "Reporting only the margin of error",
              body: "The margin of error needs the point estimate and confidence level to be meaningful.",
            },
            {
              title: "Treating overlap as a formal test",
              body: "Two intervals overlapping or not overlapping is not the same as a planned hypothesis test for a difference.",
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

function SampleSizePage({
  calculator,
}: {
  calculator: NonNullable<ReturnType<typeof getCalculatorBySlug>>;
}) {
  const jsonLd = [
    softwareApplicationJsonLd({
      name: calculator.name,
      description: calculator.description,
      path: "/calculators/sample-size/",
    }),
    faqPageJsonLd(sampleSizeFaqs),
  ];

  return (
    <div className="container py-10 md:py-14">
      {jsonLd.map((entry) => (
        <StructuredData key={entry["@type"]} data={entry} />
      ))}
      <article className="space-y-12">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm font-medium uppercase tracking-normal text-primary">
            Sample size calculator
          </p>
          <h1 className="text-3xl font-semibold tracking-normal md:text-5xl">
            Sample size calculator
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Plan survey precision or two-group power before collecting data,
            with assumptions shown alongside the required sample size.
          </p>
        </div>

        <CalculatorLayout>
          <div className="space-y-8">
            <SampleSizeCalculator />
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">
                Interpreting the result
              </h2>
              <p className="leading-7 text-muted-foreground">
                The result is a planning estimate, not a guarantee. It tells
                you how many analyzable observations are needed if the entered
                assumptions are reasonable and the eventual analysis matches
                the planned design. If the study will lose participants,
                remove incomplete surveys, cluster observations, or apply
                complex weighting, treat the calculator result as the base
                analyzable number and add a design-specific allowance.
              </p>
            </section>
          </div>
          <aside className="space-y-5 rounded-lg border bg-muted/30 p-5">
            <h2 className="text-lg font-semibold">Before you calculate</h2>
            <ul className="space-y-3 text-sm leading-6 text-muted-foreground">
              <li>Enter proportions as decimals between 0 and 1.</li>
              <li>Use absolute effects, not relative percent lifts.</li>
              <li>Choose power and alpha before seeing study results.</li>
              <li>Add attrition, exclusions, or design effects afterward.</li>
            </ul>
          </aside>
        </CalculatorLayout>

        <SampleSizeEducationalContent />
        <FAQ items={sampleSizeFaqs} />
        <RelatedCalculators currentSlug="sample-size" />
      </article>
    </div>
  );
}

function SampleSizeEducationalContent() {
  return (
    <div className="max-w-3xl space-y-10">
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">What is this calculator?</h2>
        <p className="leading-7 text-muted-foreground">
          A sample size calculation turns a study goal into a minimum number of
          analyzable observations. The goal can be precision, such as estimating
          a survey proportion within a chosen margin of error, or power, such
          as detecting a difference between two groups if that difference is
          truly present. Statoma separates those two planning questions because
          they answer different practical problems. A margin-of-error plan asks
          how narrow an estimate should be. A power plan asks how likely a
          planned hypothesis test is to detect an effect of a specified size.
        </p>
        <p className="leading-7 text-muted-foreground">
          The calculator uses standard introductory planning formulas for one
          proportion, one mean, two proportions, and two means. These formulas
          are intentionally transparent: they rely on normal critical values,
          equal allocation for two-group comparisons, and summary assumptions
          that can be reviewed before data collection begins. That transparency
          is useful in teaching, grant planning, survey design, and early study
          scoping, but it also means the result should be checked against the
          actual sampling design.
        </p>
        <p className="leading-7 text-muted-foreground">
          A required sample size is not the same as the number of people to
          invite, records to request, or responses to start. It is the number
          needed after missing data, exclusions, nonresponse, and eligibility
          screening have been handled. If a survey expects incomplete responses
          or a study expects dropouts, the recruitment target must be larger
          than the analyzable sample returned here. The more fragile the data
          collection process, the more important that allowance becomes.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">When to use it</h2>
        <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
          <li>
            Use survey proportion mode when the target is a population share,
            rate, or percentage and the planning question is a margin of error.
          </li>
          <li>
            Use survey mean mode when the target is an average and you have a
            planning estimate of the outcome standard deviation.
          </li>
          <li>
            Use two-proportion power mode when two independent groups will be
            compared on a binary outcome such as a response, success, or
            conversion rate.
          </li>
          <li>
            Use two-mean power mode when two independent groups will be
            compared on a numeric outcome and a common planning standard
            deviation is reasonable.
          </li>
          <li>
            Use a separate specialist design calculation when observations are
            clustered, paired, repeated over time, heavily weighted, or assigned
            in unequal group sizes.
          </li>
        </ul>
        <p className="leading-7 text-muted-foreground">
          The best mode follows the design, not the result you hope to see. If
          the final report will estimate a single population value, use a
          precision mode. If the final report will compare two groups with a
          hypothesis test, use a power mode. Mixing those goals can produce a
          number that looks precise but does not protect the study from being
          underpowered for its actual question.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">How it works</h2>
        <p className="leading-7 text-muted-foreground">
          For a single proportion, the calculator starts from the familiar
          normal-approximation margin of error formula. The planned proportion
          controls the variance term, the confidence level controls the
          critical value, and the target margin of error controls how much
          uncertainty is acceptable. Smaller margins and higher confidence
          levels require larger samples.
        </p>
        <Formula>
          <BlockMath math={String.raw`n = \frac{z_{1-\alpha/2}^{2}p(1-p)}{e^2}`} />
        </Formula>
        <p className="leading-7 text-muted-foreground">
          In this formula, p is the planning proportion, e is the target margin
          of error on the proportion scale, and z is the standard normal
          critical value for the chosen confidence level. For a mean, the same
          structure uses the planning standard deviation instead of the
          proportion variance. The margin of error must be in the same unit as
          the outcome.
        </p>
        <Formula>
          <BlockMath math={String.raw`n = \left(\frac{z_{1-\alpha/2}\sigma}{e}\right)^2`} />
        </Formula>
        <p className="leading-7 text-muted-foreground">
          Power calculations add a second critical value. Alpha controls how
          often the test is allowed to signal an effect when the null model is
          true. Power controls how often the test should detect the specified
          effect when that effect is real. For equal-size two-sample mean
          comparisons, the planning approximation is based on the combined
          alpha and power critical values, the standard deviation, and the
          minimum detectable difference.
        </p>
        <Formula>
          <BlockMath math={String.raw`n_{\text{per group}} = 2\left(\frac{(z_{1-\alpha/2}+z_{1-\beta})\sigma}{\Delta}\right)^2`} />
        </Formula>
        <p className="leading-7 text-muted-foreground">
          Two-proportion power calculations use the same idea but replace the
          standard deviation with binomial variance terms for the baseline rate
          and comparison rate. Statoma treats the minimum detectable effect as
          an absolute change. For example, moving from 0.40 to 0.45 is an
          absolute change of 0.05. A relative lift would need to be converted to
          the resulting absolute change before entering it.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Worked example</h2>
        <p className="leading-7 text-muted-foreground">
          Suppose a researcher wants to estimate a population proportion with a
          95% confidence level and a margin of error of 0.05. If there is no
          reliable prior estimate, using 0.50 for the planning proportion is a
          conservative choice because p(1-p) is largest at 0.50. The calculator
          uses the 95% normal critical value and returns 385 analyzable
          responses for the simple random-sample approximation.
        </p>
        <p className="leading-7 text-muted-foreground">
          That does not mean 385 invitations are enough. If the survey team
          expects only half of invited people to complete the survey, the
          invitation count would need to be much larger. If the survey uses a
          complex design, the design effect may also inflate the required
          number. The calculator result is the clean statistical core; the
          operations plan still has to account for how data are actually
          collected.
        </p>
        <p className="leading-7 text-muted-foreground">
          For a power example, suppose an experiment compares two independent
          groups and wants to detect an absolute rate change from 0.40 to 0.45
          with 80% power at alpha 0.05. The resulting per-group sample is large
          because a five-point absolute difference is modest relative to the
          variability of a binary outcome. If that sample is unrealistic, the
          honest next step is to revisit the effect size, allocation, outcome
          definition, or study design rather than reporting a small study as if
          it had the desired power.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Common mistakes</h2>
        <div className="grid gap-4">
          {[
            {
              title: "Entering percentages as whole numbers",
              body: "Use 0.05 for a five percentage-point margin of error, not 5. The formulas work on the proportion scale.",
            },
            {
              title: "Treating the result as a recruitment count",
              body: "The output is the analyzable sample size. Recruitment targets usually need to be larger after nonresponse, attrition, and exclusions are considered.",
            },
            {
              title: "Using an optimistic standard deviation",
              body: "A too-small planning standard deviation makes a study look easier than it is. Use pilot data, prior literature, or a conservative sensitivity check.",
            },
            {
              title: "Confusing absolute and relative effects",
              body: "The power modes use absolute differences. A relative lift must be translated into the resulting difference on the original outcome scale.",
            },
            {
              title: "Changing power assumptions after seeing feasibility",
              body: "Lowering power or raising alpha can make the required sample smaller, but it also changes the error behavior of the planned test.",
            },
            {
              title: "Ignoring clustering or repeated measurements",
              body: "Simple formulas assume independent observations. Clustered classrooms, clinics, households, or repeated measures often need a design effect or a different model.",
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
