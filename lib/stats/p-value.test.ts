import { describe, expect, it } from "vitest";
import { calculatePValue } from "@/lib/stats/p-value";

describe("p-value calculations", () => {
  it("calculates a two-sided z p-value", () => {
    const result = calculatePValue({
      distribution: "z",
      statistic: 1.96,
      tail: "two-sided",
    });

    expect(result.pValue).toBeCloseTo(0.0499958, 6);
  });

  it("calculates a greater-than t p-value", () => {
    const result = calculatePValue({
      distribution: "t",
      statistic: 2,
      degreesOfFreedom: 10,
      tail: "greater",
    });

    expect(result.pValue).toBeCloseTo(0.036694, 5);
  });

  it("calculates a left-tail z p-value", () => {
    const result = calculatePValue({
      distribution: "z",
      statistic: -1.5,
      tail: "less",
    });

    expect(result.pValue).toBeCloseTo(0.0668072, 6);
  });

  it("calculates a chi-square right-tail p-value", () => {
    const result = calculatePValue({
      distribution: "chi-square",
      statistic: 10,
      degreesOfFreedom: 4,
      tail: "greater",
    });

    expect(result.pValue).toBeCloseTo(0.0404277, 6);
  });

  it("calculates an F right-tail p-value", () => {
    const result = calculatePValue({
      distribution: "f",
      statistic: 3,
      numeratorDf: 2,
      denominatorDf: 20,
      tail: "greater",
    });

    expect(result.pValue).toBeCloseTo(0.0725382, 6);
  });

  it("rejects two-sided p-values for chi-square statistics", () => {
    expect(() =>
      calculatePValue({
        distribution: "chi-square",
        statistic: 10,
        degreesOfFreedom: 4,
        tail: "two-sided",
      }),
    ).toThrow("Two-sided p-values are only available for z and t statistics.");
  });
});
