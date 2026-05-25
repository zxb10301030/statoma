import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
