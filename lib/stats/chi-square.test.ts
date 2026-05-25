import { describe, expect, it } from "vitest";
import {
  chiSquareGoodnessOfFit,
  chiSquareTestOfIndependence,
} from "@/lib/stats/chi-square";

describe("chi-square calculations", () => {
  it("calculates a goodness-of-fit statistic and right-tail p-value", () => {
    const result = chiSquareGoodnessOfFit({
      observed: [50, 30, 20],
      expected: [40, 40, 20],
    });

    expect(result.statistic).toBeCloseTo(5, 10);
    expect(result.degreesOfFreedom).toBe(2);
    expect(result.pValue).toBeCloseTo(0.082085, 6);
    expect(result.cells.map((cell) => cell.contribution)).toEqual([
      2.5, 2.5, 0,
    ]);
  });

  it("calculates an independence statistic and expected table", () => {
    const result = chiSquareTestOfIndependence({
      observed: [
        [20, 30],
        [30, 20],
      ],
    });

    expect(result.statistic).toBeCloseTo(4, 10);
    expect(result.degreesOfFreedom).toBe(1);
    expect(result.pValue).toBeCloseTo(0.0455, 4);
    expect(result.rowTotals).toEqual([50, 50]);
    expect(result.columnTotals).toEqual([50, 50]);
    expect(result.cells[0][0].expected).toBeCloseTo(25, 10);
    expect(result.cells[1][1].expected).toBeCloseTo(25, 10);
  });

  it("rejects expected counts that do not match the observed total", () => {
    expect(() =>
      chiSquareGoodnessOfFit({
        observed: [10, 20],
        expected: [10, 10],
      }),
    ).toThrow("Observed and expected counts must have the same total.");
  });

  it("rejects ragged contingency tables", () => {
    expect(() =>
      chiSquareTestOfIndependence({
        observed: [[10, 20], [30]],
      }),
    ).toThrow("Every row in the contingency table must have the same length.");
  });
});
