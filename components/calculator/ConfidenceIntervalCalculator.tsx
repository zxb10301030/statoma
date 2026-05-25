"use client";

import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatPercent } from "@/lib/format/number";
import {
  differenceInMeansConfidenceInterval,
  differenceInProportionsConfidenceInterval,
  meanConfidenceInterval,
  proportionConfidenceInterval,
  type ConfidenceIntervalResult,
} from "@/lib/stats/confidence-interval";

type ConfidenceIntervalMode =
  | "mean"
  | "proportion"
  | "difference-means"
  | "difference-proportions";

type FieldValues = Record<string, string>;

const modeLabels: Record<ConfidenceIntervalMode, string> = {
  mean: "Mean",
  proportion: "Proportion",
  "difference-means": "Mean difference",
  "difference-proportions": "Proportion difference",
};

const confidenceLevels = [
  { label: "90%", value: "0.9" },
  { label: "95%", value: "0.95" },
  { label: "99%", value: "0.99" },
] as const;

const emptyMean = {
  sampleMean: "",
  sampleSd: "",
  sampleSize: "",
};

const emptyProportion = {
  successes: "",
  sampleSize: "",
};

const emptyDifferenceMeans = {
  meanA: "",
  sdA: "",
  sizeA: "",
  meanB: "",
  sdB: "",
  sizeB: "",
};

const emptyDifferenceProportions = {
  successesA: "",
  sizeA: "",
  successesB: "",
  sizeB: "",
};

export function ConfidenceIntervalCalculator() {
  const [mode, setMode] = useState<ConfidenceIntervalMode>("mean");
  const [confidenceLevel, setConfidenceLevel] = useState("0.95");
  const [meanValues, setMeanValues] = useState<FieldValues>(emptyMean);
  const [proportionValues, setProportionValues] =
    useState<FieldValues>(emptyProportion);
  const [differenceMeansValues, setDifferenceMeansValues] =
    useState<FieldValues>(emptyDifferenceMeans);
  const [differenceProportionsValues, setDifferenceProportionsValues] =
    useState<FieldValues>(emptyDifferenceProportions);

  const calculation = useMemo(
    () =>
      calculateActiveResult(mode, Number(confidenceLevel), {
        meanValues,
        proportionValues,
        differenceMeansValues,
        differenceProportionsValues,
      }),
    [
      confidenceLevel,
      differenceMeansValues,
      differenceProportionsValues,
      meanValues,
      mode,
      proportionValues,
    ],
  );

  function resetCurrentMode() {
    if (mode === "mean") {
      setMeanValues(emptyMean);
      return;
    }

    if (mode === "proportion") {
      setProportionValues(emptyProportion);
      return;
    }

    if (mode === "difference-means") {
      setDifferenceMeansValues(emptyDifferenceMeans);
      return;
    }

    setDifferenceProportionsValues(emptyDifferenceProportions);
  }

  return (
    <section
      aria-label="Confidence interval calculator"
      className="rounded-lg border bg-card p-4 shadow-sm md:p-6"
    >
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as ConfidenceIntervalMode)}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1 lg:w-auto lg:grid-cols-4">
            {Object.entries(modeLabels).map(([value, label]) => (
              <TabsTrigger key={value} value={value} className="min-h-10">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="grid gap-2 sm:max-w-40">
            <Label htmlFor="confidence-level">Confidence level</Label>
            <Select value={confidenceLevel} onValueChange={setConfidenceLevel}>
              <SelectTrigger id="confidence-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {confidenceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <TabsContent value="mean" className="mt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <NumberField
              id="ci-sample-mean"
              label="Sample mean"
              value={meanValues.sampleMean}
              onChange={(value) =>
                setMeanValues((current) => ({
                  ...current,
                  sampleMean: value,
                }))
              }
            />
            <NumberField
              id="ci-sample-sd"
              label="Sample standard deviation"
              value={meanValues.sampleSd}
              onChange={(value) =>
                setMeanValues((current) => ({ ...current, sampleSd: value }))
              }
            />
            <NumberField
              id="ci-sample-size"
              label="Sample size"
              value={meanValues.sampleSize}
              step="1"
              onChange={(value) =>
                setMeanValues((current) => ({
                  ...current,
                  sampleSize: value,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="proportion" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <NumberField
              id="ci-successes"
              label="Success count"
              value={proportionValues.successes}
              step="1"
              onChange={(value) =>
                setProportionValues((current) => ({
                  ...current,
                  successes: value,
                }))
              }
            />
            <NumberField
              id="ci-proportion-size"
              label="Sample size"
              value={proportionValues.sampleSize}
              step="1"
              onChange={(value) =>
                setProportionValues((current) => ({
                  ...current,
                  sampleSize: value,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="difference-means" className="mt-0">
          <TwoMeanFields
            values={differenceMeansValues}
            setValues={setDifferenceMeansValues}
          />
        </TabsContent>

        <TabsContent value="difference-proportions" className="mt-0">
          <TwoProportionFields
            values={differenceProportionsValues}
            setValues={setDifferenceProportionsValues}
          />
        </TabsContent>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetCurrentMode}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset current interval
          </Button>
        </div>
      </Tabs>

      <ResultSummary calculation={calculation} />
    </section>
  );
}

function TwoMeanFields({
  values,
  setValues,
}: {
  values: FieldValues;
  setValues: Dispatch<SetStateAction<FieldValues>>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Group A</legend>
        <NumberField
          id="ci-mean-a"
          label="Mean"
          value={values.meanA}
          onChange={(value) =>
            setValues((current) => ({ ...current, meanA: value }))
          }
        />
        <NumberField
          id="ci-sd-a"
          label="Standard deviation"
          value={values.sdA}
          onChange={(value) =>
            setValues((current) => ({ ...current, sdA: value }))
          }
        />
        <NumberField
          id="ci-size-a"
          label="Sample size"
          value={values.sizeA}
          step="1"
          onChange={(value) =>
            setValues((current) => ({ ...current, sizeA: value }))
          }
        />
      </fieldset>
      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Group B</legend>
        <NumberField
          id="ci-mean-b"
          label="Mean"
          value={values.meanB}
          onChange={(value) =>
            setValues((current) => ({ ...current, meanB: value }))
          }
        />
        <NumberField
          id="ci-sd-b"
          label="Standard deviation"
          value={values.sdB}
          onChange={(value) =>
            setValues((current) => ({ ...current, sdB: value }))
          }
        />
        <NumberField
          id="ci-size-b"
          label="Sample size"
          value={values.sizeB}
          step="1"
          onChange={(value) =>
            setValues((current) => ({ ...current, sizeB: value }))
          }
        />
      </fieldset>
    </div>
  );
}

function TwoProportionFields({
  values,
  setValues,
}: {
  values: FieldValues;
  setValues: Dispatch<SetStateAction<FieldValues>>;
}) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Group A</legend>
        <NumberField
          id="ci-successes-a"
          label="Success count"
          value={values.successesA}
          step="1"
          onChange={(value) =>
            setValues((current) => ({ ...current, successesA: value }))
          }
        />
        <NumberField
          id="ci-proportion-size-a"
          label="Sample size"
          value={values.sizeA}
          step="1"
          onChange={(value) =>
            setValues((current) => ({ ...current, sizeA: value }))
          }
        />
      </fieldset>
      <fieldset className="grid gap-4 rounded-lg border p-4">
        <legend className="px-1 text-sm font-semibold">Group B</legend>
        <NumberField
          id="ci-successes-b"
          label="Success count"
          value={values.successesB}
          step="1"
          onChange={(value) =>
            setValues((current) => ({ ...current, successesB: value }))
          }
        />
        <NumberField
          id="ci-proportion-size-b"
          label="Sample size"
          value={values.sizeB}
          step="1"
          onChange={(value) =>
            setValues((current) => ({ ...current, sizeB: value }))
          }
        />
      </fieldset>
    </div>
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
    | { status: "ready"; result: ConfidenceIntervalResult };
}) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/35 p-4 md:p-5">
      {calculation.status === "empty" ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Enter summary statistics to calculate the estimate, standard error,
          margin of error, and interval bounds.
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
              label="Estimate"
              value={formatNumber(calculation.result.estimate)}
            />
            <Metric
              label="Standard error"
              value={formatNumber(calculation.result.standardError)}
            />
            <Metric
              label="Margin of error"
              value={formatNumber(calculation.result.marginOfError)}
            />
            <Metric
              label="Lower bound"
              value={formatNumber(calculation.result.lower)}
            />
            <Metric
              label="Upper bound"
              value={formatNumber(calculation.result.upper)}
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
      <dd className="mt-1 break-words font-semibold text-foreground">
        {value}
      </dd>
    </div>
  );
}

function calculateActiveResult(
  mode: ConfidenceIntervalMode,
  confidenceLevel: number,
  values: {
    meanValues: FieldValues;
    proportionValues: FieldValues;
    differenceMeansValues: FieldValues;
    differenceProportionsValues: FieldValues;
  },
):
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; result: ConfidenceIntervalResult } {
  try {
    if (mode === "mean") {
      const parsed = parseFields(values.meanValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: meanConfidenceInterval({
          sampleMean: parsed.sampleMean,
          sampleSd: parsed.sampleSd,
          sampleSize: parsed.sampleSize,
          confidenceLevel,
        }),
      };
    }

    if (mode === "proportion") {
      const parsed = parseFields(values.proportionValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: proportionConfidenceInterval({
          successes: parsed.successes,
          sampleSize: parsed.sampleSize,
          confidenceLevel,
        }),
      };
    }

    if (mode === "difference-means") {
      const parsed = parseFields(values.differenceMeansValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: differenceInMeansConfidenceInterval({
          meanA: parsed.meanA,
          sdA: parsed.sdA,
          sizeA: parsed.sizeA,
          meanB: parsed.meanB,
          sdB: parsed.sdB,
          sizeB: parsed.sizeB,
          confidenceLevel,
        }),
      };
    }

    const parsed = parseFields(values.differenceProportionsValues);

    if (!parsed) {
      return { status: "empty" };
    }

    return {
      status: "ready",
      result: differenceInProportionsConfidenceInterval({
        successesA: parsed.successesA,
        sizeA: parsed.sizeA,
        successesB: parsed.successesB,
        sizeB: parsed.sizeB,
        confidenceLevel,
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

function parseFields(values: FieldValues) {
  const entries = Object.entries(values);

  if (entries.some(([, value]) => value.trim() === "")) {
    return null;
  }

  const parsedEntries: Array<[string, number]> = entries.map(([key, value]) => [
    key,
    Number(value),
  ]);

  if (parsedEntries.some(([, value]) => !Number.isFinite(value))) {
    throw new Error("Every field must contain a finite number.");
  }

  return Object.fromEntries(parsedEntries) as Record<string, number>;
}

function interpretResult(result: ConfidenceIntervalResult) {
  const percentage = formatPercent(result.confidenceLevel);

  return `The ${percentage} interval runs from ${formatNumber(result.lower)} to ${formatNumber(result.upper)}. In repeated samples analyzed the same way, this method would capture the target parameter about ${percentage} of the time.`;
}
