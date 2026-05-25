"use client";

import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  calculatePValue,
  type PValueDistribution,
  type PValueResult,
  type PValueTail,
} from "@/lib/stats/p-value";

type FieldValues = {
  statistic: string;
  degreesOfFreedom: string;
  numeratorDf: string;
  denominatorDf: string;
};

const emptyValues: FieldValues = {
  statistic: "",
  degreesOfFreedom: "",
  numeratorDf: "",
  denominatorDf: "",
};

const distributionLabels: Record<PValueDistribution, string> = {
  z: "z statistic",
  t: "t statistic",
  "chi-square": "chi-square statistic",
  f: "F statistic",
};

export function PValueCalculator() {
  const [distribution, setDistribution] = useState<PValueDistribution>("z");
  const [tail, setTail] = useState<PValueTail>("two-sided");
  const [values, setValues] = useState<FieldValues>(emptyValues);

  const supportsTwoSided = distribution === "z" || distribution === "t";

  const calculation = useMemo(
    () => calculateActiveResult(distribution, tail, values),
    [distribution, tail, values],
  );

  function handleDistributionChange(value: string) {
    const nextDistribution = value as PValueDistribution;
    setDistribution(nextDistribution);

    if (
      (nextDistribution === "chi-square" || nextDistribution === "f") &&
      tail === "two-sided"
    ) {
      setTail("greater");
    }
  }

  function reset() {
    setValues(emptyValues);
    setDistribution("z");
    setTail("two-sided");
  }

  return (
    <section
      aria-label="P-value calculator"
      className="rounded-lg border bg-card p-4 shadow-sm md:p-6"
    >
      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="grid gap-2">
          <Label htmlFor="p-value-distribution">Statistic type</Label>
          <Select value={distribution} onValueChange={handleDistributionChange}>
            <SelectTrigger id="p-value-distribution">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(distributionLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="p-value-tail">Tail area</Label>
          <Select
            value={tail}
            onValueChange={(value) => setTail(value as PValueTail)}
          >
            <SelectTrigger id="p-value-tail">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {supportsTwoSided ? (
                <SelectItem value="two-sided">Two-sided</SelectItem>
              ) : null}
              <SelectItem value="greater">Right tail</SelectItem>
              <SelectItem value="less">Left tail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator className="my-6" />

      <div className="grid gap-4 md:grid-cols-2">
        <NumberField
          id="p-value-statistic"
          label="Observed test statistic"
          value={values.statistic}
          onChange={(value) =>
            setValues((current) => ({ ...current, statistic: value }))
          }
        />

        {distribution === "t" || distribution === "chi-square" ? (
          <NumberField
            id="p-value-df"
            label="Degrees of freedom"
            value={values.degreesOfFreedom}
            step={distribution === "chi-square" ? "1" : "any"}
            onChange={(value) =>
              setValues((current) => ({
                ...current,
                degreesOfFreedom: value,
              }))
            }
          />
        ) : null}

        {distribution === "f" ? (
          <>
            <NumberField
              id="p-value-numerator-df"
              label="Numerator degrees of freedom"
              value={values.numeratorDf}
              step="1"
              onChange={(value) =>
                setValues((current) => ({ ...current, numeratorDf: value }))
              }
            />
            <NumberField
              id="p-value-denominator-df"
              label="Denominator degrees of freedom"
              value={values.denominatorDf}
              step="1"
              onChange={(value) =>
                setValues((current) => ({ ...current, denominatorDf: value }))
              }
            />
          </>
        ) : null}
      </div>

      <div className="mt-5 flex justify-end">
        <Button type="button" variant="ghost" size="sm" onClick={reset}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset calculator
        </Button>
      </div>

      <ResultSummary calculation={calculation} />
    </section>
  );
}

function NumberField({
  id,
  label,
  value,
  step = "any",
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  step?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function ResultSummary({
  calculation,
}: {
  calculation:
    | { status: "empty" }
    | { status: "error"; message: string }
    | { status: "ready"; result: PValueResult };
}) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/35 p-4 md:p-5">
      {calculation.status === "empty" ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Enter the observed statistic and the required degrees of freedom to
          calculate the p-value.
        </p>
      ) : null}
      {calculation.status === "error" ? (
        <p className="text-sm leading-6 text-destructive">
          {calculation.message}
        </p>
      ) : null}
      {calculation.status === "ready" ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Metric label="Method" value={calculation.result.method} />
            <Metric
              label="Statistic"
              value={formatNumber(calculation.result.statistic)}
            />
            <Metric
              label="Cumulative probability"
              value={formatNumber(calculation.result.cumulativeProbability)}
            />
            <Metric
              label="p-value"
              value={formatPValue(calculation.result.pValue)}
            />
          </dl>
          <p className="text-sm leading-6 text-muted-foreground">
            {interpretResult(calculation.result)}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-1 break-words font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function calculateActiveResult(
  distribution: PValueDistribution,
  tail: PValueTail,
  values: FieldValues,
):
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; result: PValueResult } {
  try {
    const statistic = parseOptionalNumber(values.statistic);

    if (statistic === null) {
      return { status: "empty" };
    }

    if (distribution === "z") {
      return {
        status: "ready",
        result: calculatePValue({
          distribution,
          statistic,
          tail,
        }),
      };
    }

    if (distribution === "t" || distribution === "chi-square") {
      const degreesOfFreedom = parseOptionalNumber(values.degreesOfFreedom);

      if (degreesOfFreedom === null) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: calculatePValue({
          distribution,
          statistic,
          degreesOfFreedom,
          tail,
        }),
      };
    }

    const numeratorDf = parseOptionalNumber(values.numeratorDf);
    const denominatorDf = parseOptionalNumber(values.denominatorDf);

    if (numeratorDf === null || denominatorDf === null) {
      return { status: "empty" };
    }

    return {
      status: "ready",
      result: calculatePValue({
        distribution,
        statistic,
        numeratorDf,
        denominatorDf,
        tail,
      }),
    };
  } catch (error) {
    return {
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Check each input and try again.",
    };
  }
}

function parseOptionalNumber(value: string) {
  if (value.trim() === "") {
    return null;
  }

  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    throw new Error("Every field must contain a finite number.");
  }

  return parsed;
}

function formatNumber(value: number) {
  if (Math.abs(value) >= 1000 || (Math.abs(value) > 0 && Math.abs(value) < 0.001)) {
    return value.toExponential(3);
  }

  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}

function formatPValue(value: number) {
  if (value < 0.0001) {
    return "< 0.0001";
  }

  return formatNumber(value);
}

function interpretResult(result: PValueResult) {
  const tailDescription =
    result.tail === "two-sided"
      ? "values at least this far from zero in either direction"
      : result.tail === "greater"
        ? "values at least this large in the right tail"
        : "values this small or smaller in the left tail";

  const thresholdText = result.pValue < 0.05 ? "below" : "not below";

  return `For ${tailDescription}, the p-value is ${formatPValue(result.pValue)}. It is ${thresholdText} 0.05, so interpret it with the test design, distribution choice, and the effect estimate that produced the statistic.`;
}
