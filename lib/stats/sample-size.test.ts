import { describe, expect, it } from "vitest";
import {
  meanMarginSampleSize,
  surveyProportionSampleSize,
  twoProportionSampleSize,
  twoSampleMeanSampleSize,
} from "@/lib/stats/sample-size";

describe("sample size calculations", () => {
  it("calculates a survey proportion sample size from margin of error", () => {
    const result = surveyProportionSampleSize({
      estimatedProportion: 0.5,
      marginOfError: 0.05,
      confidenceLevel: 0.95,
    });

    expect(result.requiredSampleSize).toBe(385);
    expect(result.totalSampleSize).toBe(385);
    expect(result.criticalValue).toBeCloseTo(1.95996, 5);
  });

  it("calculates a single mean sample size from margin of error", () => {
    const result = meanMarginSampleSize({
      estimatedSd: 6,
      marginOfError: 1.5,
      confidenceLevel: 0.95,
    });

    expect(result.requiredSampleSize).toBe(62);
    expect(result.totalSampleSize).toBe(62);
    expect(result.criticalValue).toBeCloseTo(1.95996, 5);
  });

  it("calculates an equal-allocation two-proportion power sample size", () => {
    const result = twoProportionSampleSize({
      baselineRate: 0.4,
      minimumDetectableEffect: 0.05,
      power: 0.8,
      alpha: 0.05,
    });

    expect(result.requiredPerGroup).toBe(1534);
    expect(result.totalSampleSize).toBe(3068);
    expect(result.criticalValue).toBeCloseTo(1.95996, 5);
    expect(result.powerCriticalValue).toBeCloseTo(0.84162, 5);
  });

  it("calculates an equal-allocation two-sample mean power sample size", () => {
    const result = twoSampleMeanSampleSize({
      estimatedSd: 6,
      minimumDetectableDifference: 2,
      power: 0.8,
      alpha: 0.05,
    });

    expect(result.requiredPerGroup).toBe(142);
    expect(result.totalSampleSize).toBe(284);
    expect(result.powerCriticalValue).toBeCloseTo(0.84162, 5);
  });

  it("rejects proportion power plans that exceed a possible rate", () => {
    expect(() =>
      twoProportionSampleSize({
        baselineRate: 0.98,
        minimumDetectableEffect: 0.05,
        power: 0.8,
        alpha: 0.05,
      }),
    ).toThrow(
      "Baseline rate plus minimum detectable effect must be less than 1.",
    );
  });
});
