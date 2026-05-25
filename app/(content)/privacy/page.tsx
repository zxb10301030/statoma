import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy policy | Statoma",
  description:
    "Read the initial Statoma privacy frame for a static statistics calculator site with no accounts or server-side calculator storage.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-5">
        <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
          Privacy policy
        </h1>
        <p className="leading-7 text-muted-foreground">
          Statoma is being built as a static site. The initial project skeleton
          does not include accounts, authentication, databases, API routes, or
          server-side calculator storage.
        </p>
        <p className="leading-7 text-muted-foreground">
          Calculator features are planned to run in the browser. That means
          entered values should be processed locally by the page rather than
          sent to a Statoma application server.
        </p>
        <p className="leading-7 text-muted-foreground">
          Analytics and production privacy language will be finalized before
          public launch. Any future analytics will be documented here in clear
          terms.
        </p>
      </article>
    </div>
  );
}
