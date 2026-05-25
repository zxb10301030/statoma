import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculators } from "@/lib/calculators";

export function CalculatorGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {calculators.map((calculator) => (
        <Card key={calculator.slug} className="flex h-full flex-col rounded-lg">
          <CardHeader>
            <CardTitle className="text-xl">{calculator.name}</CardTitle>
            <CardDescription>{calculator.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1" />
          <CardFooter>
            <Button asChild variant="outline" className="w-full justify-between">
              <Link href={`/calculators/${calculator.slug}`}>
                Open calculator
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
