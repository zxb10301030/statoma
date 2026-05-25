import { describe, expect, it } from "vitest";
import {
  formatDegreesOfFreedom,
  formatInteger,
  formatNumber,
  formatPercent,
  formatProbability,
  formatPValue,
} from "@/lib/format/number";

describe("number formatting", () => {
  it("formats ordinary numbers with four significant figures", () => {
    expect(formatNumber(80.3699)).toBe("80.37");
    expect(formatNumber(2.0301)).toBe("2.03");
  });

  it("uses scientific notation for very small and very large numbers", () => {
    expect(formatNumber(0.000012345)).toBe("1.235E-5");
    expect(formatNumber(123456)).toBe("1.235E5");
  });

  it("formats p-values below 0.0001 as a threshold", () => {
    expect(formatPValue(0.000099)).toBe("< 0.0001");
    expect(formatPValue(0)).toBe("< 0.0001");
    expect(formatPValue(0.0820849986)).toBe("0.08208");
  });

  it("formats probabilities without applying the p-value threshold", () => {
    expect(formatProbability(0.000012345)).toBe("1.235E-5");
  });

  it("formats integer displays without decimal places", () => {
    expect(formatInteger(3068)).toBe("3,068");
  });

  it("formats Welch degrees of freedom with two decimals", () => {
    expect(formatDegreesOfFreedom(39.3956, { welch: true })).toBe("39.40");
    expect(formatDegreesOfFreedom(35)).toBe("35");
  });

  it("formats percentages with one optional decimal place", () => {
    expect(formatPercent(0.95)).toBe("95%");
    expect(formatPercent(0.995)).toBe("99.5%");
  });

  it("hides common IEEE 754 display noise", () => {
    expect(formatNumber(0.30000000000000004)).toBe("0.3");
  });
});
