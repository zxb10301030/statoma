import { jStat } from "jstat";

export type SurveyProportionSampleSizeInput = {
  estimatedProportion: number;
  marginOfError: number;
  confidenceLevel: number;
};

export type MeanMarginSampleSizeInput = {
  estimatedSd: number;
  marginOfError: number;
  confidenceLevel: number;
};

export type TwoProportionSampleSizeInput = {
  baselineRate: number;
  minimumDetectableEffect: number;
  power: number;
  alpha: number;
};

export type TwoSampleMeanSampleSizeInput = {
  estimatedSd: number;
  minimumDetectableDifference: number;
  power: number;
  alpha: number;
};

export type SampleSizeResult = {
  method: string;
  totalSampleSize: number;
  criticalValue: number;
  assumptions: string[];
  requiredSampleSize?: number;
  requiredPerGroup?: number;
  powerCriticalValue?: number;
};

function assertPositive(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a positive number.`);
  }
}

function assertOpenUnitInterval(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0 || value >= 1) {
    throw new Error(`${label} must be between 0 and 1.`);
  }
}

function normalQuantile(probability: number) {
  return jStat.normal.inv(probability, 0, 1);
}

function confidenceCriticalValue(confidenceLevel: number) {
  assertOpenUnitInterval(confidenceLevel, "Confidence level");

  const alpha = 1 - confidenceLevel;
  return normalQuantile(1 - alpha / 2);
}

function alphaCriticalValue(alpha: number) {
  assertOpenUnitInterval(alpha, "Alpha");

  return normalQuantile(1 - alpha / 2);
}

function powerCriticalValue(power: number) {
  assertOpenUnitInterval(power, "Power");

  return normalQuantile(power);
}

export function surveyProportionSampleSize(
  input: SurveyProportionSampleSizeInput,
): SampleSizeResult {
  assertOpenUnitInterval(input.estimatedProportion, "Estimated proportion");
  assertPositive(input.marginOfError, "Margin of error");

  const criticalValue = confidenceCriticalValue(input.confidenceLevel);
  const requiredSampleSize = Math.ceil(
    (criticalValue ** 2 *
      input.estimatedProportion *
      (1 - input.estimatedProportion)) /
      input.marginOfError ** 2,
  );

  return {
    method: "Single proportion margin of error",
    requiredSampleSize,
    totalSampleSize: requiredSampleSize,
    criticalValue,
    assumptions: [
      "The planned sample is random or otherwise representative of the target population.",
      "The margin of error is measured on the proportion scale, not in percentage points typed as whole numbers.",
      "The estimate uses a normal approximation, so very small or boundary proportions need extra care.",
    ],
  };
}

export function meanMarginSampleSize(
  input: MeanMarginSampleSizeInput,
): SampleSizeResult {
  assertPositive(input.estimatedSd, "Estimated standard deviation");
  assertPositive(input.marginOfError, "Margin of error");

  const criticalValue = confidenceCriticalValue(input.confidenceLevel);
  const requiredSampleSize = Math.ceil(
    ((criticalValue * input.estimatedSd) / input.marginOfError) ** 2,
  );

  return {
    method: "Single mean margin of error",
    requiredSampleSize,
    totalSampleSize: requiredSampleSize,
    criticalValue,
    assumptions: [
      "The standard deviation is a planning estimate from pilot data, prior work, or a defensible subject-matter guess.",
      "The target margin of error is in the same unit as the outcome.",
      "The calculation treats the normal critical value as the planning approximation.",
    ],
  };
}

export function twoProportionSampleSize(
  input: TwoProportionSampleSizeInput,
): SampleSizeResult {
  assertOpenUnitInterval(input.baselineRate, "Baseline rate");
  assertPositive(input.minimumDetectableEffect, "Minimum detectable effect");

  const comparisonRate = input.baselineRate + input.minimumDetectableEffect;

  if (comparisonRate >= 1) {
    throw new Error(
      "Baseline rate plus minimum detectable effect must be less than 1.",
    );
  }

  const criticalValue = alphaCriticalValue(input.alpha);
  const powerValue = powerCriticalValue(input.power);
  const pooledRate = (input.baselineRate + comparisonRate) / 2;
  const numerator =
    criticalValue * Math.sqrt(2 * pooledRate * (1 - pooledRate)) +
    powerValue *
      Math.sqrt(
        input.baselineRate * (1 - input.baselineRate) +
          comparisonRate * (1 - comparisonRate),
      );
  const requiredPerGroup = Math.ceil(
    numerator ** 2 / input.minimumDetectableEffect ** 2,
  );

  return {
    method: "Two-proportion power analysis",
    requiredPerGroup,
    totalSampleSize: requiredPerGroup * 2,
    criticalValue,
    powerCriticalValue: powerValue,
    assumptions: [
      "Groups are allocated evenly and compared with a two-sided test.",
      "The minimum detectable effect is an absolute change on the proportion scale.",
      "The normal approximation is reasonable for the planned group sizes and rates.",
    ],
  };
}

export function twoSampleMeanSampleSize(
  input: TwoSampleMeanSampleSizeInput,
): SampleSizeResult {
  assertPositive(input.estimatedSd, "Estimated standard deviation");
  assertPositive(
    input.minimumDetectableDifference,
    "Minimum detectable difference",
  );

  const criticalValue = alphaCriticalValue(input.alpha);
  const powerValue = powerCriticalValue(input.power);
  const requiredPerGroup = Math.ceil(
    2 *
      (((criticalValue + powerValue) * input.estimatedSd) /
        input.minimumDetectableDifference) **
        2,
  );

  return {
    method: "Two-sample mean power analysis",
    requiredPerGroup,
    totalSampleSize: requiredPerGroup * 2,
    criticalValue,
    powerCriticalValue: powerValue,
    assumptions: [
      "Groups are allocated evenly and compared with a two-sided test.",
      "The standard deviation is the common planning standard deviation for the outcome.",
      "The minimum detectable difference is in the same unit as the outcome.",
    ],
  };
}
