import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of use | Statoma",
  description:
    "Read the terms for using Statoma as an educational statistics calculator and interpretation resource.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            Terms of use
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Statoma is an educational statistics resource. The calculators and
            explanations are provided to help users understand statistical
            methods, not to replace professional judgment, subject-matter
            expertise, or formal review for high-stakes decisions.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Educational Use</h2>
          <p className="leading-7 text-muted-foreground">
            Statoma explains common statistical procedures such as t-tests,
            p-values, confidence intervals, sample size planning, and chi-square
            tests. These tools can support learning, checking calculations, and
            preparing clearer interpretations. They do not determine whether a
            study was designed well, whether a model is appropriate for every
            dataset, or whether a result should guide a medical, legal,
            financial, regulatory, or safety decision.
          </p>
          <p className="leading-7 text-muted-foreground">
            Users remain responsible for choosing methods that match their data,
            assumptions, study design, and reporting context. A calculator can
            make arithmetic more transparent, but it cannot verify the quality
            of sampling, measurement, randomization, coding, independence,
            missing-data handling, or domain-specific interpretation.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Accuracy And Limitations</h2>
          <p className="leading-7 text-muted-foreground">
            Statoma aims to provide careful formulas, tested calculation
            functions, and plain-English explanations. Still, no educational
            website can guarantee that every result is correct for every use
            case. Statistical methods often have conditions that are easy to
            overlook, and many real analyses require decisions that go beyond a
            summary-statistic calculator.
          </p>
          <p className="leading-7 text-muted-foreground">
            Before relying on a result, check the inputs, units, tails,
            hypotheses, degrees of freedom, confidence level, expected counts,
            and any assumptions named on the calculator page. For coursework,
            follow the requirements of the class. For research, follow the
            analysis plan and reporting standards in the field. For applied
            decisions, consult an appropriately qualified professional.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Acceptable Use</h2>
          <p className="leading-7 text-muted-foreground">
            Use Statoma in a way that respects the site, other users, and the
            limits of the tools. Do not attempt to interfere with the site,
            bypass security controls, overload hosting infrastructure, scrape in
            a disruptive way, or present Statoma results as a professional
            certification of an analysis. Do not enter confidential personal
            data when aggregate statistics would answer the question.
          </p>
          <p className="leading-7 text-muted-foreground">
            You may link to Statoma pages, cite them as learning resources, and
            use calculator output as part of your own work, provided you remain
            responsible for the interpretation and context. The{" "}
            <Link
              href="/calculators"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Statoma calculator index
            </Link>{" "}
            is the best entry point when sharing the tool set.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes To These Terms</h2>
          <p className="leading-7 text-muted-foreground">
            These terms should evolve with the product. If Statoma adds
            accounts, uploads, saved work, paid features, embedded content, or
            other capabilities, the terms should be reviewed and updated before
            those features are published. Questions about corrections or terms
            can be routed through the{" "}
            <Link
              href="/contact"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              Statoma contact page
            </Link>
            .
          </p>
        </section>
      </article>
    </div>
  );
}
