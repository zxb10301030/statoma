import Link from "next/link";
import { calculators, type CalculatorSlug } from "@/lib/calculators";

type RelatedCalculatorsProps = {
  currentSlug?: CalculatorSlug;
};

export function RelatedCalculators({ currentSlug }: RelatedCalculatorsProps) {
  const related = calculators.filter((calculator) => calculator.slug !== currentSlug);

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Related calculators</h2>
      <ul className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
        {related.map((calculator) => (
          <li key={calculator.slug}>
            <Link
              href={`/calculators/${calculator.slug}`}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {calculator.name}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
