import { describe, expect, it } from "vitest";
import {
  differenceInMeansConfidenceInterval,
  differenceInProportionsConfidenceInterval,
  meanConfidenceInterval,
  proportionConfidenceInterval,
} from "@/lib/stats/confidence-interval";

describe("confidence interval calculations", () => {
  it("calculates a t interval for a mean", () => {
    const result = meanConfidenceInterval({
      sampleMean: 82.4,
      sampleSd: 6,
      sampleSize: 36,
      confidenceLevel: 0.95,
    });

    expect(result.estimate).toBe(82.4);
    expect(result.standardError).toBeCloseTo(1, 10);
    expect(result.marginOfError).toBeCloseTo(2.0301, 4);
    expect(result.lower).toBeCloseTo(80.3699, 4);
    expect(result.upper).toBeCloseTo(84.4301, 4);
  });

  it("calculates a normal interval for a proportion", () => {
    const result = proportionConfidenceInterval({
      successes: 52,
      sampleSize: 100,
      confidenceLevel: 0.95,
    });

    expect(result.estimate).toBeCloseTo(0.52, 10);
    expect(result.standardError).toBeCloseTo(0.04996, 5);
    expect(result.marginOfError).toBeCloseTo(0.09792, 5);
    expect(result.lower).toBeCloseTo(0.42208, 5);
    expect(result.upper).toBeCloseTo(0.61792, 5);
  });

  it("calculates a Welch interval for a difference in means", () => {
    const result = differenceInMeansConfidenceInterval({
      meanA: 10,
      sdA: 2,
      sizeA: 20,
      meanB: 8.5,
      sdB: 2.5,
      sizeB: 22,
      confidenceLevel: 0.95,
    });

    expect(result.estimate).toBeCloseTo(1.5, 10);
    expect(result.standardError).toBeCloseTo(0.69577, 5);
    expect(result.degreesOfFreedom).toBeCloseTo(39.3956, 4);
    expect(result.marginOfError).toBeCloseTo(1.4069, 4);
    expect(result.lower).toBeCloseTo(0.0931, 4);
    expect(result.upper).toBeCloseTo(2.9069, 4);
  });

  it("calculates a normal interval for a difference in proportions", () => {
    const result = differenceInProportionsConfidenceInterval({
      successesA: 60,
      sizeA: 120,
      successesB: 45,
      sizeB: 110,
      confidenceLevel: 0.95,
    });

    expect(result.estimate).toBeCloseTo(0.09091, 5);
    expect(result.standardError).toBeCloseTo(0.06543, 5);
    expect(result.marginOfError).toBeCloseTo(0.12824, 5);
    expect(result.lower).toBeCloseTo(-0.03733, 5);
    expect(result.upper).toBeCloseTo(0.21915, 5);
  });

  it("rejects confidence levels outside the open unit interval", () => {
    expect(() =>
      meanConfidenceInterval({
        sampleMean: 1,
        sampleSd: 1,
        sampleSize: 10,
        confidenceLevel: 1,
      }),
    ).toThrow("Confidence level must be between 0 and 1.");
  });
});
