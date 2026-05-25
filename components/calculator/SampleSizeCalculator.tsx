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
  meanMarginSampleSize,
  surveyProportionSampleSize,
  twoProportionSampleSize,
  twoSampleMeanSampleSize,
  type SampleSizeResult,
} from "@/lib/stats/sample-size";

type PlanningMode = "survey" | "power";
type SurveyTarget = "proportion" | "mean";
type PowerTarget = "two-proportion" | "two-mean";
type FieldValues = Record<string, string>;

const confidenceLevels = [
  { label: "90%", value: "0.9" },
  { label: "95%", value: "0.95" },
  { label: "99%", value: "0.99" },
] as const;

const powerLevels = [
  { label: "80%", value: "0.8" },
  { label: "90%", value: "0.9" },
] as const;

const alphaLevels = [
  { label: "0.05", value: "0.05" },
  { label: "0.01", value: "0.01" },
] as const;

const emptySurveyProportion = {
  estimatedProportion: "",
  marginOfError: "",
};

const emptySurveyMean = {
  estimatedSd: "",
  marginOfError: "",
};

const emptyTwoProportion = {
  baselineRate: "",
  minimumDetectableEffect: "",
};

const emptyTwoMean = {
  estimatedSd: "",
  minimumDetectableDifference: "",
};

export function SampleSizeCalculator() {
  const [planningMode, setPlanningMode] = useState<PlanningMode>("survey");
  const [surveyTarget, setSurveyTarget] = useState<SurveyTarget>("proportion");
  const [powerTarget, setPowerTarget] = useState<PowerTarget>("two-proportion");
  const [confidenceLevel, setConfidenceLevel] = useState("0.95");
  const [power, setPower] = useState("0.8");
  const [alpha, setAlpha] = useState("0.05");
  const [surveyProportionValues, setSurveyProportionValues] =
    useState<FieldValues>(emptySurveyProportion);
  const [surveyMeanValues, setSurveyMeanValues] =
    useState<FieldValues>(emptySurveyMean);
  const [twoProportionValues, setTwoProportionValues] =
    useState<FieldValues>(emptyTwoProportion);
  const [twoMeanValues, setTwoMeanValues] = useState<FieldValues>(emptyTwoMean);

  const calculation = useMemo(
    () =>
      calculateActiveResult(
        {
          planningMode,
          surveyTarget,
          powerTarget,
          confidenceLevel: Number(confidenceLevel),
          power: Number(power),
          alpha: Number(alpha),
        },
        {
          surveyProportionValues,
          surveyMeanValues,
          twoProportionValues,
          twoMeanValues,
        },
      ),
    [
      alpha,
      confidenceLevel,
      planningMode,
      power,
      powerTarget,
      surveyMeanValues,
      surveyProportionValues,
      surveyTarget,
      twoMeanValues,
      twoProportionValues,
    ],
  );

  function resetCurrentPlan() {
    if (planningMode === "survey" && surveyTarget === "proportion") {
      setSurveyProportionValues(emptySurveyProportion);
      return;
    }

    if (planningMode === "survey") {
      setSurveyMeanValues(emptySurveyMean);
      return;
    }

    if (powerTarget === "two-proportion") {
      setTwoProportionValues(emptyTwoProportion);
      return;
    }

    setTwoMeanValues(emptyTwoMean);
  }

  return (
    <section
      aria-label="Sample size calculator"
      className="rounded-lg border bg-card p-4 shadow-sm md:p-6"
    >
      <Tabs
        value={planningMode}
        onValueChange={(value) => setPlanningMode(value as PlanningMode)}
        className="space-y-6"
      >
        <TabsList className="grid h-auto w-full grid-cols-2 gap-1 sm:max-w-md">
          <TabsTrigger value="survey" className="min-h-10">
            Survey precision
          </TabsTrigger>
          <TabsTrigger value="power" className="min-h-10">
            Power analysis
          </TabsTrigger>
        </TabsList>

        <Separator />

        <TabsContent value="survey" className="mt-0 space-y-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_10rem]">
            <div className="grid gap-2">
              <Label htmlFor="sample-size-survey-target">Planning target</Label>
              <Select
                value={surveyTarget}
                onValueChange={(value) =>
                  setSurveyTarget(value as SurveyTarget)
                }
              >
                <SelectTrigger id="sample-size-survey-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="proportion">Proportion</SelectItem>
                  <SelectItem value="mean">Mean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LevelSelect
              id="sample-size-confidence"
              label="Confidence level"
              value={confidenceLevel}
              onChange={setConfidenceLevel}
              options={confidenceLevels}
            />
          </div>

          {surveyTarget === "proportion" ? (
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                id="sample-size-estimated-proportion"
                label="Estimated proportion"
                value={surveyProportionValues.estimatedProportion}
                onChange={(value) =>
                  setSurveyProportionValues((current) => ({
                    ...current,
                    estimatedProportion: value,
                  }))
                }
              />
              <NumberField
                id="sample-size-proportion-margin"
                label="Margin of error"
                value={surveyProportionValues.marginOfError}
                onChange={(value) =>
                  setSurveyProportionValues((current) => ({
                    ...current,
                    marginOfError: value,
                  }))
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <NumberField
                id="sample-size-mean-sd"
                label="Estimated standard deviation"
                value={surveyMeanValues.estimatedSd}
                onChange={(value) =>
                  setSurveyMeanValues((current) => ({
                    ...current,
                    estimatedSd: value,
                  }))
                }
              />
              <NumberField
                id="sample-size-mean-margin"
                label="Margin of error"
                value={surveyMeanValues.marginOfError}
                onChange={(value) =>
                  setSurveyMeanValues((current) => ({
                    ...current,
                    marginOfError: value,
                  }))
                }
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="power" className="mt-0 space-y-5">
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_8rem_8rem]">
            <div className="grid gap-2">
              <Label htmlFor="sample-size-power-target">Analysis target</Label>
              <Select
                value={powerTarget}
                onValueChange={(value) => setPowerTarget(value as PowerTarget)}
              >
                <SelectTrigger id="sample-size-power-target">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="two-proportion">
                    Two proportions
                  </SelectItem>
                  <SelectItem value="two-mean">Two means</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <LevelSelect
              id="sample-size-power"
              label="Power"
              value={power}
              onChange={setPower}
              options={powerLevels}
            />
            <LevelSelect
              id="sample-size-alpha"
              label="Alpha"
              value={alpha}
              onChange={setAlpha}
              options={alphaLevels}
            />
          </div>

          {powerTarget === "two-proportion" ? (
            <TwoProportionFields
              values={twoProportionValues}
              setValues={setTwoProportionValues}
            />
          ) : (
            <TwoMeanFields
              values={twoMeanValues}
              setValues={setTwoMeanValues}
            />
          )}
        </TabsContent>

        <div className="flex justify-end">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={resetCurrentPlan}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Reset current plan
          </Button>
        </div>
      </Tabs>

      <ResultSummary calculation={calculation} />
    </section>
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
    <div className="grid gap-4 md:grid-cols-2">
      <NumberField
        id="sample-size-baseline-rate"
        label="Baseline rate"
        value={values.baselineRate}
        onChange={(value) =>
          setValues((current) => ({ ...current, baselineRate: value }))
        }
      />
      <NumberField
        id="sample-size-mde-rate"
        label="Minimum detectable effect"
        value={values.minimumDetectableEffect}
        onChange={(value) =>
          setValues((current) => ({
            ...current,
            minimumDetectableEffect: value,
          }))
        }
      />
    </div>
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
    <div className="grid gap-4 md:grid-cols-2">
      <NumberField
        id="sample-size-power-mean-sd"
        label="Estimated standard deviation"
        value={values.estimatedSd}
        onChange={(value) =>
          setValues((current) => ({ ...current, estimatedSd: value }))
        }
      />
      <NumberField
        id="sample-size-mean-difference"
        label="Minimum detectable difference"
        value={values.minimumDetectableDifference}
        onChange={(value) =>
          setValues((current) => ({
            ...current,
            minimumDetectableDifference: value,
          }))
        }
      />
    </div>
  );
}

function NumberField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        step="any"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

function LevelSelect({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ReadonlyArray<{ label: string; value: string }>;
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id={id}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ResultSummary({
  calculation,
}: {
  calculation:
    | { status: "empty" }
    | { status: "error"; message: string }
    | { status: "ready"; result: SampleSizeResult };
}) {
  return (
    <div className="mt-6 rounded-lg border bg-muted/35 p-4 md:p-5">
      {calculation.status === "empty" ? (
        <p className="text-sm leading-6 text-muted-foreground">
          Enter planning assumptions to estimate the minimum sample size before
          data collection begins.
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
            {calculation.result.requiredPerGroup ? (
              <>
                <Metric
                  label="Required per group"
                  value={formatInteger(calculation.result.requiredPerGroup)}
                />
                <Metric
                  label="Total sample size"
                  value={formatInteger(calculation.result.totalSampleSize)}
                />
              </>
            ) : (
              <Metric
                label="Required sample size"
                value={formatInteger(calculation.result.totalSampleSize)}
              />
            )}
            <Metric
              label="Critical value"
              value={formatNumber(calculation.result.criticalValue)}
            />
            {calculation.result.powerCriticalValue ? (
              <Metric
                label="Power critical value"
                value={formatNumber(calculation.result.powerCriticalValue)}
              />
            ) : null}
          </dl>
          <div className="space-y-3 text-sm leading-6 text-muted-foreground">
            <p>{interpretResult(calculation.result)}</p>
            <ul className="list-disc space-y-1 pl-5">
              {calculation.result.assumptions.map((assumption) => (
                <li key={assumption}>{assumption}</li>
              ))}
            </ul>
          </div>
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
  settings: {
    planningMode: PlanningMode;
    surveyTarget: SurveyTarget;
    powerTarget: PowerTarget;
    confidenceLevel: number;
    power: number;
    alpha: number;
  },
  values: {
    surveyProportionValues: FieldValues;
    surveyMeanValues: FieldValues;
    twoProportionValues: FieldValues;
    twoMeanValues: FieldValues;
  },
):
  | { status: "empty" }
  | { status: "error"; message: string }
  | { status: "ready"; result: SampleSizeResult } {
  try {
    if (settings.planningMode === "survey") {
      if (settings.surveyTarget === "proportion") {
        const parsed = parseFields(values.surveyProportionValues);

        if (!parsed) {
          return { status: "empty" };
        }

        return {
          status: "ready",
          result: surveyProportionSampleSize({
            estimatedProportion: parsed.estimatedProportion,
            marginOfError: parsed.marginOfError,
            confidenceLevel: settings.confidenceLevel,
          }),
        };
      }

      const parsed = parseFields(values.surveyMeanValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: meanMarginSampleSize({
          estimatedSd: parsed.estimatedSd,
          marginOfError: parsed.marginOfError,
          confidenceLevel: settings.confidenceLevel,
        }),
      };
    }

    if (settings.powerTarget === "two-proportion") {
      const parsed = parseFields(values.twoProportionValues);

      if (!parsed) {
        return { status: "empty" };
      }

      return {
        status: "ready",
        result: twoProportionSampleSize({
          baselineRate: parsed.baselineRate,
          minimumDetectableEffect: parsed.minimumDetectableEffect,
          power: settings.power,
          alpha: settings.alpha,
        }),
      };
    }

    const parsed = parseFields(values.twoMeanValues);

    if (!parsed) {
      return { status: "empty" };
    }

    return {
      status: "ready",
      result: twoSampleMeanSampleSize({
        estimatedSd: parsed.estimatedSd,
        minimumDetectableDifference: parsed.minimumDetectableDifference,
        power: settings.power,
        alpha: settings.alpha,
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

function formatInteger(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 4,
  }).format(value);
}

function interpretResult(result: SampleSizeResult) {
  if (result.requiredPerGroup) {
    return `Plan for at least ${formatInteger(result.requiredPerGroup)} observations per group, or ${formatInteger(result.totalSampleSize)} total observations before attrition or exclusions.`;
  }

  return `Plan for at least ${formatInteger(result.totalSampleSize)} observations before attrition, exclusions, or design effects are added.`;
}
