import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Terms of use | Statoma",
  description:
    "Read the initial Statoma terms frame for using an educational statistics calculator website.",
  path: "/terms/",
});

export default function TermsPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          Terms of use
        </h1>
        <p className="leading-7 text-muted-foreground">
          Statoma is intended as an educational statistics resource. The site is
          designed to help users understand statistical procedures and should
          not replace professional judgment for high-stakes decisions.
        </p>
        <p className="leading-7 text-muted-foreground">
          Future calculators will be implemented with care, tests, and visible
          explanations. Users remain responsible for checking whether a method
          fits their data, assumptions, and context.
        </p>
        <p className="leading-7 text-muted-foreground">
          These terms are an initial content frame for the project skeleton.
          Final production terms should be reviewed before launch.
        </p>
      </article>
    </div>
  );
}
