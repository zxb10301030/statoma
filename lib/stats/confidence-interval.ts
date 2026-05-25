import { jStat } from "jstat";

export type ConfidenceIntervalResult = {
  method: string;
  estimate: number;
  standardError: number;
  criticalValue: number;
  marginOfError: number;
  lower: number;
  upper: number;
  confidenceLevel: number;
  degreesOfFreedom?: number;
};

export type MeanIntervalInput = {
  sampleMean: number;
  sampleSd: number;
  sampleSize: number;
  confidenceLevel: number;
};

export type ProportionIntervalInput = {
  successes: number;
  sampleSize: number;
  confidenceLevel: number;
};

export type DifferenceInMeansIntervalInput = {
  meanA: number;
  sdA: number;
  sizeA: number;
  meanB: number;
  sdB: number;
  sizeB: number;
  confidenceLevel: number;
};

export type DifferenceInProportionsIntervalInput = {
  successesA: number;
  sizeA: number;
  successesB: number;
  sizeB: number;
  confidenceLevel: number;
};

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
}

function assertSampleSize(value: number, label: string, minimum = 1) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${label} must be an integer of at least ${minimum}.`);
  }
}

function assertConfidenceLevel(value: number) {
  if (!Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new Error("Confidence level must be between 0 and 1.");
  }
}

function assertSuccessCount(successes: number, sampleSize: number, label: string) {
  if (!Number.isInteger(successes) || successes < 0 || successes > sampleSize) {
    throw new Error(`${label} must be an integer between 0 and sample size.`);
  }
}

function intervalFromEstimate(input: {
  method: string;
  estimate: number;
  standardError: number;
  criticalValue: number;
  confidenceLevel: number;
  degreesOfFreedom?: number;
}): ConfidenceIntervalResult {
  const marginOfError = input.criticalValue * input.standardError;

  return {
    method: input.method,
    estimate: input.estimate,
    standardError: input.standardError,
    criticalValue: input.criticalValue,
    marginOfError,
    lower: input.estimate - marginOfError,
    upper: input.estimate + marginOfError,
    confidenceLevel: input.confidenceLevel,
    degreesOfFreedom: input.degreesOfFreedom,
  };
}

function normalCriticalValue(confidenceLevel: number) {
  const alpha = 1 - confidenceLevel;
  return jStat.normal.inv(1 - alpha / 2, 0, 1);
}

function tCriticalValue(confidenceLevel: number, degreesOfFreedom: number) {
  const alpha = 1 - confidenceLevel;
  return jStat.studentt.inv(1 - alpha / 2, degreesOfFreedom);
}

function welchDegreesOfFreedom(
  varianceAOverN: number,
  varianceBOverN: number,
  sizeA: number,
  sizeB: number,
) {
  return (
    (varianceAOverN + varianceBOverN) ** 2 /
    (varianceAOverN ** 2 / (sizeA - 1) +
      varianceBOverN ** 2 / (sizeB - 1))
  );
}

export function meanConfidenceInterval(
  input: MeanIntervalInput,
): ConfidenceIntervalResult {
  assertFinite(input.sampleMean, "Sample mean");
  assertPositive(input.sampleSd, "Sample standard deviation");
  assertSampleSize(input.sampleSize, "Sample size", 2);
  assertConfidenceLevel(input.confidenceLevel);

  const degreesOfFreedom = input.sampleSize - 1;
  const standardError = input.sampleSd / Math.sqrt(input.sampleSize);

  return intervalFromEstimate({
    method: "Mean confidence interval",
    estimate: input.sampleMean,
    standardError,
    criticalValue: tCriticalValue(input.confidenceLevel, degreesOfFreedom),
    confidenceLevel: input.confidenceLevel,
    degreesOfFreedom,
  });
}

export function proportionConfidenceInterval(
  input: ProportionIntervalInput,
): ConfidenceIntervalResult {
  assertSampleSize(input.sampleSize, "Sample size");
  assertSuccessCount(input.successes, input.sampleSize, "Success count");
  assertConfidenceLevel(input.confidenceLevel);

  const estimate = input.successes / input.sampleSize;
  const standardError = Math.sqrt(
    (estimate * (1 - estimate)) / input.sampleSize,
  );

  return intervalFromEstimate({
    method: "Proportion confidence interval",
    estimate,
    standardError,
    criticalValue: normalCriticalValue(input.confidenceLevel),
    confidenceLevel: input.confidenceLevel,
  });
}

export function differenceInMeansConfidenceInterval(
  input: DifferenceInMeansIntervalInput,
): ConfidenceIntervalResult {
  assertFinite(input.meanA, "Group A mean");
  assertFinite(input.meanB, "Group B mean");
  assertPositive(input.sdA, "Group A standard deviation");
  assertPositive(input.sdB, "Group B standard deviation");
  assertSampleSize(input.sizeA, "Group A size", 2);
  assertSampleSize(input.sizeB, "Group B size", 2);
  assertConfidenceLevel(input.confidenceLevel);

  const varianceAOverN = input.sdA ** 2 / input.sizeA;
  const varianceBOverN = input.sdB ** 2 / input.sizeB;
  const degreesOfFreedom = welchDegreesOfFreedom(
    varianceAOverN,
    varianceBOverN,
    input.sizeA,
    input.sizeB,
  );

  return intervalFromEstimate({
    method: "Difference in means confidence interval",
    estimate: input.meanA - input.meanB,
    standardError: Math.sqrt(varianceAOverN + varianceBOverN),
    criticalValue: tCriticalValue(input.confidenceLevel, degreesOfFreedom),
    confidenceLevel: input.confidenceLevel,
    degreesOfFreedom,
  });
}

export function differenceInProportionsConfidenceInterval(
  input: DifferenceInProportionsIntervalInput,
): ConfidenceIntervalResult {
  assertSampleSize(input.sizeA, "Group A size");
  assertSampleSize(input.sizeB, "Group B size");
  assertSuccessCount(input.successesA, input.sizeA, "Group A success count");
  assertSuccessCount(input.successesB, input.sizeB, "Group B success count");
  assertConfidenceLevel(input.confidenceLevel);

  const proportionA = input.successesA / input.sizeA;
  const proportionB = input.successesB / input.sizeB;
  const standardError = Math.sqrt(
    (proportionA * (1 - proportionA)) / input.sizeA +
      (proportionB * (1 - proportionB)) / input.sizeB,
  );

  return intervalFromEstimate({
    method: "Difference in proportions confidence interval",
    estimate: proportionA - proportionB,
    standardError,
    criticalValue: normalCriticalValue(input.confidenceLevel),
    confidenceLevel: input.confidenceLevel,
  });
}
