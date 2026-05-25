import { jStat } from "jstat";

export type GoodnessOfFitInput = {
  observed: number[];
  expected: number[];
};

export type IndependenceInput = {
  observed: number[][];
};

export type ChiSquareCell = {
  observed: number;
  expected: number;
  contribution: number;
};

export type GoodnessOfFitResult = {
  kind: "goodness-of-fit";
  method: string;
  statistic: number;
  degreesOfFreedom: number;
  pValue: number;
  totalObserved: number;
  totalExpected: number;
  cells: ChiSquareCell[];
};

export type IndependenceResult = {
  kind: "independence";
  method: string;
  statistic: number;
  degreesOfFreedom: number;
  pValue: number;
  total: number;
  rowTotals: number[];
  columnTotals: number[];
  cells: ChiSquareCell[][];
};

export type ChiSquareResult = GoodnessOfFitResult | IndependenceResult;

function assertFinite(value: number, label: string) {
  if (!Number.isFinite(value)) {
    throw new Error(`${label} must be a finite number.`);
  }
}

function assertNonNegative(value: number, label: string) {
  assertFinite(value, label);

  if (value < 0) {
    throw new Error(`${label} must be non-negative.`);
  }
}

function assertPositive(value: number, label: string) {
  assertFinite(value, label);

  if (value <= 0) {
    throw new Error(`${label} must be positive.`);
  }
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function rightTailChiSquare(statistic: number, degreesOfFreedom: number) {
  return Math.max(
    0,
    Math.min(1, 1 - jStat.chisquare.cdf(statistic, degreesOfFreedom)),
  );
}

function contribution(observed: number, expected: number) {
  return (observed - expected) ** 2 / expected;
}

function assertSameTotal(totalObserved: number, totalExpected: number) {
  const tolerance =
    Number.EPSILON * Math.max(totalObserved, totalExpected, 1) * 100;

  if (Math.abs(totalObserved - totalExpected) > tolerance) {
    throw new Error("Observed and expected counts must have the same total.");
  }
}

export function chiSquareGoodnessOfFit(
  input: GoodnessOfFitInput,
): GoodnessOfFitResult {
  if (input.observed.length < 2 || input.expected.length < 2) {
    throw new Error("Goodness-of-fit tests need at least two categories.");
  }

  if (input.observed.length !== input.expected.length) {
    throw new Error("Observed and expected counts must have the same length.");
  }

  input.observed.forEach((value, index) => {
    assertNonNegative(value, `Observed count ${index + 1}`);
  });
  input.expected.forEach((value, index) => {
    assertPositive(value, `Expected count ${index + 1}`);
  });

  const totalObserved = sum(input.observed);
  const totalExpected = sum(input.expected);

  assertPositive(totalObserved, "Observed total");
  assertSameTotal(totalObserved, totalExpected);

  const cells = input.observed.map((observed, index) => ({
    observed,
    expected: input.expected[index],
    contribution: contribution(observed, input.expected[index]),
  }));
  const statistic = sum(cells.map((cell) => cell.contribution));
  const degreesOfFreedom = input.observed.length - 1;

  return {
    kind: "goodness-of-fit",
    method: "Chi-square goodness of fit",
    statistic,
    degreesOfFreedom,
    pValue: rightTailChiSquare(statistic, degreesOfFreedom),
    totalObserved,
    totalExpected,
    cells,
  };
}

export function chiSquareTestOfIndependence(
  input: IndependenceInput,
): IndependenceResult {
  if (input.observed.length < 2) {
    throw new Error("Independence tests need at least two rows.");
  }

  const columnCount = input.observed[0]?.length ?? 0;

  if (columnCount < 2) {
    throw new Error("Independence tests need at least two columns.");
  }

  input.observed.forEach((row, rowIndex) => {
    if (row.length !== columnCount) {
      throw new Error(
        "Every row in the contingency table must have the same length.",
      );
    }

    row.forEach((value, columnIndex) => {
      assertNonNegative(
        value,
        `Observed count at row ${rowIndex + 1}, column ${columnIndex + 1}`,
      );
    });
  });

  const rowTotals = input.observed.map((row) => sum(row));
  const columnTotals = Array.from({ length: columnCount }, (_, columnIndex) =>
    sum(input.observed.map((row) => row[columnIndex])),
  );
  const total = sum(rowTotals);

  assertPositive(total, "Table total");
  rowTotals.forEach((value, index) => {
    assertPositive(value, `Row ${index + 1} total`);
  });
  columnTotals.forEach((value, index) => {
    assertPositive(value, `Column ${index + 1} total`);
  });

  const cells = input.observed.map((row, rowIndex) =>
    row.map((observed, columnIndex) => {
      const expected =
        (rowTotals[rowIndex] * columnTotals[columnIndex]) / total;

      return {
        observed,
        expected,
        contribution: contribution(observed, expected),
      };
    }),
  );
  const statistic = sum(
    cells.flatMap((row) => row.map((cell) => cell.contribution)),
  );
  const degreesOfFreedom = (input.observed.length - 1) * (columnCount - 1);

  return {
    kind: "independence",
    method: "Chi-square test of independence",
    statistic,
    degreesOfFreedom,
    pValue: rightTailChiSquare(statistic, degreesOfFreedom),
    total,
    rowTotals,
    columnTotals,
    cells,
  };
}
