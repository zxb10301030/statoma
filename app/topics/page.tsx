import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Statistics topics | Statoma",
  description:
    "Statoma topics will organize practical explanations of statistical tests, p-values, intervals, power, and related methods.",
  path: "/topics/",
});

export default function TopicsPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-4">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          Statistics topics
        </h1>
        <p className="text-base leading-7 text-muted-foreground">
          Coming soon. This section will collect plain-English guides that link
          statistics concepts to the calculators that use them.
        </p>
      </article>
    </div>
  );
}
