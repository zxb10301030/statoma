import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Page not found | Statoma",
  description:
    "The requested Statoma page could not be found. Return to the calculator index or browse statistics topics.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFoundPage() {
  return (
    <div className="container flex min-h-[70vh] items-center py-16">
      <section className="max-w-2xl space-y-6">
        <p className="text-sm font-medium uppercase tracking-wide text-primary">
          404
        </p>
        <h1 className="text-4xl font-semibold tracking-normal text-foreground md:text-5xl">
          This page is outside the sample space.
        </h1>
        <p className="text-lg leading-8 text-muted-foreground">
          The URL may have been typed incorrectly, or the page may no longer be
          part of the Statoma calculator suite. The calculator index and topic
          library are the best starting points for finding the right statistical
          tool.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/calculators">Browse calculators</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/topics">Browse topics</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
