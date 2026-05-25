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
import {
  formatDegreesOfFreedom,
  formatNumber,
  formatPValue,
} from "@/lib/format/number";
import {
  independentTTest,
  oneSampleTTest,
  pairedTTest,
  type TTestAlternative,
  type TTestResult,
  welchTTest,
} from "@/lib/stats/t-test";

type TTestMode = "one-sample" | "paired" | "independent" | "welch";
type FieldValues = Record<string, string>;

const modeLabels: Record<TTestMode, string> = {
  "one-sample": "One-sample",
  paired: "Paired",
  independent: "Independent",
  welch: "Welch",
};

const emptyOneSample = {
  sampleMean: "",
  hypothesizedMean: "",
  sampleSd: "",
  sampleSize: "",
};

const emptyPaired = {
  meanDifference: "",
  sdDifference: "",
  pairCount: "",
};

const emptyTwoSample = {
  meanA: "",
  sdA: "",
  sizeA: "",
  meanB: "",
  sdB: "",
  sizeB: "",
};

export function TTestCalculator() {
  const [mode, setMode] = useState<TTestMode>("one-sample");
  const [alternative, setAlternative] = useState<TTestAlternative>("two-sided");
  const [oneSampleValues, setOneSampleValues] =
    useState<FieldValues>(emptyOneSample);
  const [pairedValues, setPairedValues] = useState<FieldValues>(emptyPaired);
  const [twoSampleValues, setTwoSampleValues] =
    useState<FieldValues>(emptyTwoSample);

  const calculation = useMemo(
    () =>
      calculateActiveResult(mode, alternative, {
        oneSampleValues,
        pairedValues,
        twoSampleValues,
      }),
    [alternative, mode, oneSampleValues, pairedValues, twoSampleValues],
  );

  function resetCurrentMode() {
    if (mode === "one-sample") {
      setOneSampleValues(emptyOneSample);
      return;
    }

    if (mode === "paired") {
      setPairedValues(emptyPaired);
      return;
    }

    setTwoSampleValues(emptyTwoSample);
  }

  return (
    <section
      aria-label="T-test calculator"
      className="rounded-lg border bg-card p-4 shadow-sm md:p-6"
    >
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as TTestMode)}
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
          <div className="grid gap-2 sm:max-w-72">
            <Label htmlFor="t-test-alternative">Alternative hypothesis</Label>
            <Select
              value={alternative}
              onValueChange={(value) =>
                setAlternative(value as TTestAlternative)
              }
            >
              <SelectTrigger id="t-test-alternative">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="two-sided">Difference is not 0</SelectItem>
                <SelectItem value="greater">
                  Difference is greater than 0
                </SelectItem>
                <SelectItem value="less">Difference is less than 0</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Separator />

        <TabsContent value="one-sample" className="mt-0">
          <div className="grid gap-4 md:grid-cols-2">
            <NumberField
              id="sampleMean"
              label="Sample mean"
              value={oneSampleValues.sampleMean}
              onChange={(value) =>
                setOneSampleValues((current) => ({
                  ...current,
                  sampleMean: value,
                }))
              }
            />
            <NumberField
              id="hypothesizedMean"
              label="Hypothesized mean"
              value={oneSampleValues.hypothesizedMean}
              onChange={(value) =>
                setOneSampleValues((current) => ({
                  ...current,
                  hypothesizedMean: value,
                }))
              }
            />
            <NumberField
              id="sampleSd"
              label="Sample standard deviation"
              value={oneSampleValues.sampleSd}
              onChange={(value) =>
                setOneSampleValues((current) => ({
                  ...current,
                  sampleSd: value,
                }))
              }
            />
            <NumberField
              id="sampleSize"
              label="Sample size"
              value={oneSampleValues.sampleSize}
              step="1"
              onChange={(value) =>
                setOneSampleValues((current) => ({
                  ...current,
                  sampleSize: value,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="paired" className="mt-0">
          <div className="grid gap-4 md:grid-cols-3">
            <NumberField
              id="meanDifference"
              label="Mean of paired differences"
              value={pairedValues.meanDifference}
              onChange={(value) =>
                setPairedValues((current) => ({
                  ...current,
                  meanDifference: value,
                }))
              }
            />
            <NumberField
              id="sdDifference"
              label="Standard deviation of differences"
              value={pairedValues.sdDifference}
              onChange={(value) =>
                setPairedValues((current) => ({
                  ...current,
                  sdDifference: value,
                }))
              }
            />
            <NumberField
              id="pairCount"
              label="Number of pairs"
              value={pairedValues.pairCount}
              step="1"
              onChange={(value) =>
                setPairedValues((current) => ({
                  ...current,
                  pairCount: value,
                }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="independent" className="mt-0">
          <TwoSampleFields
            values={twoSampleValues}
            setValues={setTwoSampleValues}
          />
        </TabsContent>

        <TabsContent value="welch" className="mt-0">
          <TwoSampleFields
            values={twoSampleValues}
            setValues={setTwoSampleValues}
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
            Reset current test
          </Button>
        </div>
      </Tabs>

      <ResultSummary calculation={calculation} />
    </section>
  );
}

function TwoSampleFields({
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
          id="meanA"
          label="Mean"
          value={values.meanA}
          onChange={(value) =>
            setValues((current) => ({ ...current, meanA: value }))
          }
        />
        <NumberField
          id="sdA"
          label="Standard deviation"
          value={values.sdA}
          onChange={(value) =>
            setValues((current) => ({ ...current, sdA: value }))
          }
        />
        <NumberField
          id="sizeA"
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
          id="meanB"
          label="Mean"
          value={values.meanB}
          onChange={(value) =>
            setValues((current) => ({ ...current, meanB: value }))
          }
        />
        <NumberField
          id="sdB"
          label="Standard deviation"
          value={values.sdB}
          onChange={(value) =>
            setValues((current) => ({ ...current, sdB: value }))
          }
        />
        <NumberField
          id="sizeB"
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
    | { status: "ready"; result: TTestResult };
}) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/35 p-4 md:p-5">
      {calculation.status === "empty" ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Enter summary statistics to calculate the t statistic, degrees of
          freedom, standard error, and p-value.
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
              label="t statistic"
              value={formatNumber(calculation.result.t)}
            />
            <Metric
              label="Degrees of freedom"
              value={formatDegreesOfFreedom(
                calculation.result.degreesOfFreedom,
                { welch: calculation.result.method === "Welch t-test" },
              )}
            />
            <Metric
              label="p-value"
              value={formatPValue(calculation.result.pValue)}
            />
            <Metric
              label="Estimate"
              value={formatNumber(calculation.result.estimate)}
            />
            <Metric
              label="Standard error"
              value={formatNumber(calculation.result.standardError)}
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
  mode: TTestMode,
  alternative: TTestAlternative,
  values: {
    oneSampleValues: FieldValues;
    pairedValues: FieldValues;
    twoSampleValues: FieldValues;
  },
):
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; result: TTestResult } {
  try {
    if (mode === "one-sample") {
      const parsed = parseFields(values.oneSampleValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: oneSampleTTest({
          sampleMean: parsed.sampleMean,
          hypothesizedMean: parsed.hypothesizedMean,
          sampleSd: parsed.sampleSd,
          sampleSize: parsed.sampleSize,
          alternative,
        }),
      };
    }

    if (mode === "paired") {
      const parsed = parseFields(values.pairedValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: pairedTTest({
          meanDifference: parsed.meanDifference,
          sdDifference: parsed.sdDifference,
          pairCount: parsed.pairCount,
          alternative,
        }),
      };
    }

    const parsed = parseFields(values.twoSampleValues);

    if (!parsed) {
      return { status: "empty" };
    }

    return {
      status: "ready",
      result:
        mode === "independent"
          ? independentTTest({
              meanA: parsed.meanA,
              sdA: parsed.sdA,
              sizeA: parsed.sizeA,
              meanB: parsed.meanB,
              sdB: parsed.sdB,
              sizeB: parsed.sizeB,
              alternative,
            })
          : welchTTest({
              meanA: parsed.meanA,
              sdA: parsed.sdA,
              sizeA: parsed.sizeA,
              meanB: parsed.meanB,
              sdB: parsed.sdB,
              sizeB: parsed.sizeB,
              alternative,
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

function interpretResult(result: TTestResult) {
  const direction =
    result.alternative === "two-sided"
      ? "a difference in either direction"
      : result.alternative === "greater"
        ? "a positive difference"
        : "a negative difference";
  const thresholdText = result.pValue < 0.05 ? "below" : "not below";

  return `For ${direction}, the p-value is ${formatPValue(result.pValue)}. It is ${thresholdText} 0.05, so interpret the result together with the study design, assumptions, and practical size of the estimated difference.`;
}
