import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact Statoma | Statoma",
  description:
    "Contact Statoma for statistics calculator feedback, corrections, content requests, and site questions.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            Contact Statoma
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Statoma welcomes practical feedback about calculator behavior,
            statistical explanations, page clarity, accessibility, and missing
            educational context.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How To Reach Statoma</h2>
          <p className="leading-7 text-muted-foreground">
            For general questions, corrections, and calculator suggestions,
            email{" "}
            <a
              href="mailto:contact@statoma.com"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              contact@statoma.com
            </a>
            . A plain email channel keeps the static site simple while still
            giving users a way to report issues that need review.
          </p>
          <p className="leading-7 text-muted-foreground">
            When reporting a calculator issue, include the page URL, the
            calculator mode, the inputs you entered, the result you expected,
            and why you think the result needs attention. For content issues,
            include the section heading and the sentence or formula that caused
            confusion. Clear reports make statistical corrections easier to
            verify.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Good Feedback To Send</h2>
          <ul className="list-disc space-y-3 pl-6 leading-7 text-muted-foreground">
            <li>
              A calculator result that appears inconsistent with a trusted
              reference, textbook, or statistical package.
            </li>
            <li>
              A sentence that could be misread, especially around p-values,
              confidence intervals, power, or assumptions.
            </li>
            <li>A missing warning about when a method should not be used.</li>
            <li>
              A mobile usability issue, keyboard navigation issue, or screen
              reader labeling problem.
            </li>
            <li>
              A request for a future topic guide that would help connect a
              concept to one of the calculators.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">What Not To Send</h2>
          <p className="leading-7 text-muted-foreground">
            Do not send private datasets, confidential records, passwords,
            health information, student records, customer lists, or other
            sensitive personal information. Statoma is a public educational
            website, and the safest way to discuss a statistical question is to
            use aggregate counts, summary statistics, or a simplified example
            that does not identify anyone.
          </p>
          <p className="leading-7 text-muted-foreground">
            Statoma cannot provide emergency help, legal advice, medical advice,
            financial advice, or formal statistical consulting through this
            contact page. For high-stakes work, use the calculators as an
            educational reference and consult a qualified professional who can
            review the full context.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Useful Starting Points</h2>
          <p className="leading-7 text-muted-foreground">
            Before writing, it may help to compare the issue against the current{" "}
            <Link
              href="/calculators"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              full calculator list
            </Link>{" "}
            or the planned{" "}
            <Link
              href="/topics"
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              statistics topics index
            </Link>
            . Those pages show the scope of the first release and the direction
            for future educational content.
          </p>
        </section>
      </article>
    </div>
  );
}
