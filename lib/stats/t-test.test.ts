import { describe, expect, it } from "vitest";
import {
  independentTTest,
  oneSampleTTest,
  pairedTTest,
  welchTTest,
} from "@/lib/stats/t-test";

describe("t-test calculations", () => {
  it("calculates a one-sample t-test", () => {
    const result = oneSampleTTest({
      sampleMean: 5.4,
      hypothesizedMean: 5,
      sampleSd: 1.2,
      sampleSize: 36,
      alternative: "two-sided",
    });

    expect(result.t).toBeCloseTo(2, 10);
    expect(result.degreesOfFreedom).toBe(35);
    expect(result.pValue).toBeCloseTo(0.0533077, 6);
  });

  it("calculates a paired t-test from summary differences", () => {
    const result = pairedTTest({
      meanDifference: 1.5,
      sdDifference: 3,
      pairCount: 25,
      alternative: "greater",
    });

    expect(result.t).toBeCloseTo(2.5, 10);
    expect(result.degreesOfFreedom).toBe(24);
    expect(result.pValue).toBeCloseTo(0.0098271, 6);
  });

  it("calculates an independent equal-variance t-test", () => {
    const result = independentTTest({
      meanA: 10,
      sdA: 2,
      sizeA: 20,
      meanB: 8.5,
      sdB: 2.5,
      sizeB: 22,
      alternative: "two-sided",
    });

    expect(result.t).toBeCloseTo(2.1329, 4);
    expect(result.degreesOfFreedom).toBe(40);
    expect(result.pValue).toBeGreaterThan(0.03);
    expect(result.pValue).toBeLessThan(0.05);
  });

  it("calculates a Welch t-test with fractional degrees of freedom", () => {
    const result = welchTTest({
      meanA: 10,
      sdA: 2,
      sizeA: 20,
      meanB: 8.5,
      sdB: 2.5,
      sizeB: 22,
      alternative: "two-sided",
    });

    expect(result.t).toBeCloseTo(2.1559, 4);
    expect(result.degreesOfFreedom).toBeCloseTo(39.4, 2);
    expect(result.pValue).toBeGreaterThan(0.03);
    expect(result.pValue).toBeLessThan(0.05);
  });

  it("rejects invalid sample sizes", () => {
    expect(() =>
      oneSampleTTest({
        sampleMean: 5,
        hypothesizedMean: 5,
        sampleSd: 1,
        sampleSize: 1,
        alternative: "two-sided",
      }),
    ).toThrow("Sample size must be an integer of at least 2.");
  });
});
