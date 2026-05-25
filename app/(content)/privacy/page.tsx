import Link from "next/link";
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "Privacy policy | Statoma",
  description:
    "Read how Statoma handles privacy for a static statistics calculator site with browser-based calculations and no accounts.",
  path: "/privacy/",
});

export default function PrivacyPage() {
  return (
    <div className="container py-12 md:py-16">
      <article className="max-w-3xl space-y-10">
        <div className="space-y-4">
          <h1 className="text-3xl font-semibold tracking-normal md:text-4xl">
            Privacy policy
          </h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Statoma is built as a static statistics calculator site. The current
            site does not include user accounts, authentication, databases, API
            routes, server actions, or server-side calculator storage.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Calculator Inputs</h2>
          <p className="leading-7 text-muted-foreground">
            Statoma calculators are designed to run in the browser. When you
            enter summary statistics, counts, margins of error, or other
            calculator values, those values are processed by client-side code on
            the page. They are not sent to a Statoma application server for the
            calculation, because the site is exported as static files.
          </p>
          <p className="leading-7 text-muted-foreground">
            Even with browser-based calculations, avoid entering sensitive
            personal information into calculator fields. Most Statoma tools are
            intended for summary statistics rather than raw identifiable data.
            If a statistical question involves health records, student records,
            customer records, personnel data, legal evidence, or confidential
            research data, reduce the information to appropriate aggregate
            values before using any public website.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Accounts And Storage</h2>
          <p className="leading-7 text-muted-foreground">
            Statoma does not currently provide accounts, saved projects,
            uploaded datasets, comments, or profile pages. Because those
            features do not exist, Statoma does not ask you to create a
            password, attach a dataset to an account, or store calculator
            sessions in a user database.
          </p>
          <p className="leading-7 text-muted-foreground">
            The site may still be delivered through ordinary web hosting
            infrastructure. Hosting providers can process standard technical
            information required to serve a page, such as request time,
            requested URL, IP address, user agent, and basic security logs. That
            type of infrastructure logging is separate from calculator logic and
            is common for static websites.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Analytics And Cookies</h2>
          <p className="leading-7 text-muted-foreground">
            The current project does not add analytics scripts. If analytics are
            added before public launch, this policy should describe what is
            collected, which provider is used, whether cookies are involved, and
            how the information helps maintain or improve the site.
          </p>
          <p className="leading-7 text-muted-foreground">
            Statoma should not use analytics to collect calculator inputs as
            event payloads. Aggregate page-level metrics can help understand
            which pages need maintenance, but calculator values are part of a
            user&apos;s statistical work and should stay out of tracking
            configuration.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Questions</h2>
          <p className="leading-7 text-muted-foreground">
            Privacy language should stay aligned with the site as it changes. If
            Statoma later adds forms, analytics, accounts, uploads, or
            saved-work features, this page should be updated before those
            features are published. For privacy questions or corrections, use
            the{" "}
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
