import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "About Statoma | Statoma",
  description:
    "Learn what Statoma is building and why its statistics calculators focus on explanation as much as answers.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          About Statoma
        </h1>
        <p className="leading-7 text-muted-foreground">
          Statoma is a statistics calculator suite for people who need the
          result and the reasoning behind it. The project is starting with core
          inferential statistics workflows used by students, researchers,
          journalists, and data practitioners.
        </p>
        <p className="leading-7 text-muted-foreground">
          The product goal is simple: every calculator should make the method
          visible. A user should understand what question the test answers,
          which assumptions matter, and how to interpret the result in plain
          English.
        </p>
        <p className="leading-7 text-muted-foreground">
          This initial release is only the site skeleton. Calculator logic,
          worked examples, formulas, and educational content will be added in
          later tasks without introducing a server runtime.
        </p>
      </article>
    </div>
  );
}
