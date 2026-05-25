import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Contact Statoma | Statoma",
  description:
    "Contact frame for Statoma, a static statistics calculator suite in early development.",
  path: "/contact/",
});

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          Contact Statoma
        </h1>
        <p className="leading-7 text-muted-foreground">
          Statoma is in early development. This page will become the place for
          feedback, corrections, content requests, and calculator suggestions
          before the public launch.
        </p>
        <p className="leading-7 text-muted-foreground">
          For now, the project is focused on establishing a clean static
          foundation: pages, navigation, metadata, sitemap output, and testable
          component structure.
        </p>
        <p className="leading-7 text-muted-foreground">
          A production contact method should be added before launch, along with
          a process for reviewing statistical corrections and content issues.
        </p>
      </article>
    </div>
  );
}
