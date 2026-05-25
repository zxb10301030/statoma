import { jStat } from "jstat";

export type PValueDistribution = "z" | "t" | "chi-square" | "f";
export type PValueTail = "two-sided" | "less" | "greater";

type BasePValueInput = {
  statistic: number;
  tail: PValueTail;
};

export type ZPValueInput = BasePValueInput & {
  distribution: "z";
};

export type TPValueInput = BasePValueInput & {
  distribution: "t";
  degreesOfFreedom: number;
};

export type ChiSquarePValueInput = BasePValueInput & {
  distribution: "chi-square";
  degreesOfFreedom: number;
};

export type FPValueInput = BasePValueInput & {
  distribution: "f";
  numeratorDf: number;
  denominatorDf: number;
};

export type PValueInput =
  | ZPValueInput
  | TPValueInput
  | ChiSquarePValueInput
  | FPValueInput;

export type PValueResult = {
  distribution: PValueDistribution;
  statistic: number;
  tail: PValueTail;
  pValue: number;
  cumulativeProbability: number;
  method: string;
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

function assertPositiveInteger(value: number, label: string) {
  if (!Number.isInteger(value) || value <= 0) {
    throw new Error(`${label} must be a positive integer.`);
  }
}

function clampProbability(value: number) {
  return Math.max(0, Math.min(1, value));
}

function tailProbability(cdf: number, tail: PValueTail) {
  if (tail === "less") {
    return clampProbability(cdf);
  }

  if (tail === "greater") {
    return clampProbability(1 - cdf);
  }

  return clampProbability(2 * Math.min(cdf, 1 - cdf));
}

function assertSymmetricTail(distribution: PValueDistribution, tail: PValueTail) {
  if ((distribution === "chi-square" || distribution === "f") && tail === "two-sided") {
    throw new Error(
      "Two-sided p-values are only available for z and t statistics.",
    );
  }
}

export function calculatePValue(input: PValueInput): PValueResult {
  assertFinite(input.statistic, "Test statistic");
  assertSymmetricTail(input.distribution, input.tail);

  if (input.distribution === "z") {
    const cdf = jStat.normal.cdf(input.statistic, 0, 1);

    return {
      distribution: input.distribution,
      statistic: input.statistic,
      tail: input.tail,
      cumulativeProbability: clampProbability(cdf),
      pValue: tailProbability(cdf, input.tail),
      method: "Standard normal z statistic",
    };
  }

  if (input.distribution === "t") {
    assertPositive(input.degreesOfFreedom, "Degrees of freedom");

    const cdf = jStat.studentt.cdf(input.statistic, input.degreesOfFreedom);

    return {
      distribution: input.distribution,
      statistic: input.statistic,
      tail: input.tail,
      cumulativeProbability: clampProbability(cdf),
      pValue: tailProbability(cdf, input.tail),
      method: "Student t statistic",
    };
  }

  if (input.distribution === "chi-square") {
    assertPositiveInteger(input.degreesOfFreedom, "Degrees of freedom");

    if (input.statistic < 0) {
      throw new Error("Chi-square statistics cannot be negative.");
    }

    const cdf = jStat.chisquare.cdf(input.statistic, input.degreesOfFreedom);

    return {
      distribution: input.distribution,
      statistic: input.statistic,
      tail: input.tail,
      cumulativeProbability: clampProbability(cdf),
      pValue: tailProbability(cdf, input.tail),
      method: "Chi-square statistic",
    };
  }

  assertPositiveInteger(input.numeratorDf, "Numerator degrees of freedom");
  assertPositiveInteger(input.denominatorDf, "Denominator degrees of freedom");

  if (input.statistic < 0) {
    throw new Error("F statistics cannot be negative.");
  }

  const cdf = jStat.centralF.cdf(
    input.statistic,
    input.numeratorDf,
    input.denominatorDf,
  );

  return {
    distribution: input.distribution,
    statistic: input.statistic,
    tail: input.tail,
    cumulativeProbability: clampProbability(cdf),
    pValue: tailProbability(cdf, input.tail),
    method: "F statistic",
  };
}
