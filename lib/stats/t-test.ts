import { jStat } from "jstat";

export type TTestAlternative = "two-sided" | "less" | "greater";

export type OneSampleTTestInput = {
  sampleMean: number;
  hypothesizedMean: number;
  sampleSd: number;
  sampleSize: number;
  alternative: TTestAlternative;
};

export type PairedTTestInput = {
  meanDifference: number;
  sdDifference: number;
  pairCount: number;
  alternative: TTestAlternative;
};

export type IndependentTTestInput = {
  meanA: number;
  sdA: number;
  sizeA: number;
  meanB: number;
  sdB: number;
  sizeB: number;
  alternative: TTestAlternative;
};

export type TTestResult = {
  t: number;
  degreesOfFreedom: number;
  pValue: number;
  estimate: number;
  standardError: number;
  alternative: TTestAlternative;
  method: string;
};

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
}

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertSampleSize(value: number, label: string) {
  if (!Number.isInteger(value) || value < 2) {
    throw new Error(`${label} must be an integer of at least 2.`);
  }
}

function pValueFromT(
  t: number,
  degreesOfFreedom: number,
  alternative: TTestAlternative,
) {
  const cdf = jStat.studentt.cdf(t, degreesOfFreedom);

  if (alternative === "less") {
    return clampProbability(cdf);
  }

  if (alternative === "greater") {
    return clampProbability(1 - cdf);
  }

  return clampProbability(2 * Math.min(cdf, 1 - cdf));
}

function clampProbability(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function oneSampleTTest(input: OneSampleTTestInput): TTestResult {
  assertFinite(input.sampleMean, "Sample mean");
  assertFinite(input.hypothesizedMean, "Hypothesized mean");
  assertSampleSize(input.sampleSize, "Sample size");
  assertPositive(input.sampleSd, "Sample standard deviation");

  const estimate = input.sampleMean - input.hypothesizedMean;
  const standardError = input.sampleSd / Math.sqrt(input.sampleSize);
  const t = estimate / standardError;
  const degreesOfFreedom = input.sampleSize - 1;

  return {
    t,
    degreesOfFreedom,
    pValue: pValueFromT(t, degreesOfFreedom, input.alternative),
    estimate,
    standardError,
    alternative: input.alternative,
    method: "One-sample t-test",
  };
}

export function pairedTTest(input: PairedTTestInput): TTestResult {
  assertFinite(input.meanDifference, "Mean difference");
  assertSampleSize(input.pairCount, "Pair count");
  assertPositive(input.sdDifference, "Standard deviation of differences");

  const estimate = input.meanDifference;
  const standardError = input.sdDifference / Math.sqrt(input.pairCount);
  const t = estimate / standardError;
  const degreesOfFreedom = input.pairCount - 1;

  return {
    t,
    degreesOfFreedom,
    pValue: pValueFromT(t, degreesOfFreedom, input.alternative),
    estimate,
    standardError,
    alternative: input.alternative,
    method: "Paired t-test",
  };
}

export function independentTTest(input: IndependentTTestInput): TTestResult {
  assertFinite(input.meanA, "Group A mean");
  assertFinite(input.meanB, "Group B mean");
  assertSampleSize(input.sizeA, "Group A size");
  assertSampleSize(input.sizeB, "Group B size");
  assertPositive(input.sdA, "Group A standard deviation");
  assertPositive(input.sdB, "Group B standard deviation");

  const pooledVariance =
    ((input.sizeA - 1) * input.sdA ** 2 +
      (input.sizeB - 1) * input.sdB ** 2) /
    (input.sizeA + input.sizeB - 2);
  const estimate = input.meanA - input.meanB;
  const standardError = Math.sqrt(
    pooledVariance * (1 / input.sizeA + 1 / input.sizeB),
  );
  const t = estimate / standardError;
  const degreesOfFreedom = input.sizeA + input.sizeB - 2;

  return {
    t,
    degreesOfFreedom,
    pValue: pValueFromT(t, degreesOfFreedom, input.alternative),
    estimate,
    standardError,
    alternative: input.alternative,
    method: "Independent two-sample t-test",
  };
}

export function welchTTest(input: IndependentTTestInput): TTestResult {
  assertFinite(input.meanA, "Group A mean");
  assertFinite(input.meanB, "Group B mean");
  assertSampleSize(input.sizeA, "Group A size");
  assertSampleSize(input.sizeB, "Group B size");
  assertPositive(input.sdA, "Group A standard deviation");
  assertPositive(input.sdB, "Group B standard deviation");

  const varianceA = input.sdA ** 2 / input.sizeA;
  const varianceB = input.sdB ** 2 / input.sizeB;
  const estimate = input.meanA - input.meanB;
  const standardError = Math.sqrt(varianceA + varianceB);
  const t = estimate / standardError;
  const degreesOfFreedom =
    (varianceA + varianceB) ** 2 /
    (varianceA ** 2 / (input.sizeA - 1) +
      varianceB ** 2 / (input.sizeB - 1));

  return {
    t,
    degreesOfFreedom,
    pValue: pValueFromT(t, degreesOfFreedom, input.alternative),
    estimate,
    standardError,
    alternative: input.alternative,
    method: "Welch t-test",
  };
}
